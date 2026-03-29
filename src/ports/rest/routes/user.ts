import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import dependencies from "../../../infrastructure/dependencies";
import userQueries from "../../../infrastructure/mongodb/queries/user";
import {
  authenticateToken,
  generateAccessToken,
} from "../middleware/authentication";
import config from "../../../config/config";

const router = express.Router();

// route to create new user
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { userName, userPassword, role } = req.body;

    if (!userName || !userPassword) {
      return res.status(400).json({
        message: "userName and userPassword are required",
      });
    }

    const { mongoDbClient } = dependencies;
    const mongoDbUser = mongoDbClient.User;

    const existingUser = await userQueries.getUserByUserName(
      mongoDbUser,
      userName,
    );

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    const createdUser = await userQueries.createUser(mongoDbUser, {
      userName,
      userPassword: hashedPassword,
      role: role || "user",
    });

    return res.status(200).json(createdUser);
  } catch (error: any) {
    return res.status(500).json({
      message: `Error creating user: ${error.message}`,
    });
  }
});

// route to login
router.post("/loginJwt", async (req: Request, res: Response) => {
  try {
    const { userName, userPassword } = req.body;

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

    const user: any = await userQueries.getUserByUserName(
      mongoDbUser,
      userName,
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "User is blocked after 3 wrong password attempts",
      });
    }

    const compareResult = await bcrypt.compare(userPassword, user.userPassword);

    if (!compareResult) {
      await userQueries.increaseWrongAttempts(mongoDbUser, user);

      return res.status(400).json({
        message: "Invalid password",
      });
    }

    await userQueries.resetWrongAttempts(mongoDbUser, user);

    const accessToken = generateAccessToken({
      userName: user.userName,
      _id: user._id.toString(),
      isAdmin: false,
      role: user.role || "user"
    });

    return res.json({
      accessToken,
      role: "user",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: `Error logging in: ${error.message}`,
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

export default router;
