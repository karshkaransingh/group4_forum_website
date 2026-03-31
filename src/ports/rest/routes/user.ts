import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import dependencies from "../../../infrastructure/dependencies";
import userQueries from "../../../infrastructure/mongodb/queries/user";
import {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/authentication";
import config from "../../../config/config";
import jwt from "jsonwebtoken";

const router = express.Router();

// route to create new user
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { userName, userPassword, role } = req.body;

    // if username or password are not provided
    if (!userName || !userPassword) {
      return res.status(400).json({
        message: "userName and userPassword are required",
      });
    }

    // checking if username already exists
    const { mongoDbClient } = dependencies;
    const mongoDbUser = mongoDbClient.User;

    const existingUser = await userQueries.getUserByUserName(
      mongoDbUser,
      userName,
    );

    // if username exists
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // creating a salt and hashing the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // creating the user
    const createdUser = await userQueries.createUser(mongoDbUser, {
      userName,
      userPassword: hashedPassword,
      role: role || "user",
    });

    return res.status(200).json(createdUser);
  } catch (error: any) {
    console.error("Error creating user:", error.message);

    return res.status(500).json({
      message: "Internal server error while creating user",
    });
  }
});

// route to login
router.post("/loginJwt", async (req: Request, res: Response) => {
  try {
    const { userName, userPassword } = req.body;

    // if username or password are not provided
    if (!userName || !userPassword) {
      return res.status(400).json({
        message: "userName and userPassword are required",
      });
    }

    // ADMIN LOGIN CHECK
    if (
      userName === config.adminUserName &&
      userPassword === config.adminPassword
    ) {
      // generating access token for admin
      const accessToken = generateAccessToken({
        userName: config.adminUserName,
        _id: "admin",
        isAdmin: true,
      });

      return res.json({
        accessToken,
        role: "admin",
      });
    }

    // NORMAL USER LOGIN
    const { mongoDbClient } = dependencies;
    const mongoDbUser = mongoDbClient.User;

    // finding the user inside database
    const user: any = await userQueries.getUserByUserName(
      mongoDbUser,
      userName,
    );

    // if user not found don't login
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // if user is blocked don't login
    if (user.isBlocked) {
      return res.status(403).json({
        message: "User is blocked after 3 wrong password attempts",
      });
    }

    // comparing the passwords
    const compareResult = await bcrypt.compare(userPassword, user.userPassword);

    // if password is wrong, increase the count of wrong attempts
    if (!compareResult) {
      await userQueries.increaseWrongAttempts(mongoDbUser, user);

      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // if password is correct, reset the count of wrong attempts to 0
    await userQueries.resetWrongAttempts(mongoDbUser, user);

    // now, generating access token for user
    const accessToken = generateAccessToken({
      userName: user.userName,
      _id: user._id.toString(),
      isAdmin: false,
      role: user.role || "user",
    });

    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);

    await user.save();

    return res.json({
      accessToken,
      refreshToken,
      role: user.role,
    });
  } catch (error: any) {
    console.error("Error logging in:", error.message);

    return res.status(500).json({
      message: "Internal server error while logging in",
    });
  }
});

// route to check if user authenticated (accessed by authenticated users)
router.post(
  "/checkUserAuthenticated",
  authenticateToken,
  async (req: any, res: any) => {
    return res.json({
      message: "user has access",
      user: req.user,
    });
  },
);

router.post("/refreshToken", async (req: any, res: any) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token required",
    });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, config.jwtSecret);

    const { mongoDbClient } = dependencies;
    const mongoDbUser = mongoDbClient.User;

    const user: any = await mongoDbUser.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken({
      userName: user.userName,
      _id: user._id.toString(),
      isAdmin: false,
      role: user.role,
    });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }
});


router.delete("/logout", authenticateToken, async (req: any, res: any) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required",
      });
    }

    const { mongoDbClient } = dependencies;
    const mongoDbUser = mongoDbClient.User;

    const user: any = await mongoDbUser.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.refreshTokens = user.refreshTokens.filter(
      (token: string) => token !== refreshToken,
    );

    await user.save();

    return res.sendStatus(204);
  } catch (error) {
    return res.status(400).json({
      message: "Logout failed",
    });
  }
});

export default router;
