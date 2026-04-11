import jwt from "jsonwebtoken";
import config from "../../../../config/config";
import {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  authorizeAdmin,
} from "../authentication";

describe("authentication middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAccessToken", () => {
    it("should generate a valid access token", () => {
      const user = {
        userName: "krn",
        _id: "123",
        isAdmin: true,
        role: "admin",
      };

      const token = generateAccessToken(user);
      const decoded = jwt.verify(token, config.jwtSecret) as any;

      expect(decoded.userName).toBe("krn");
      expect(decoded.userId).toBe("123");
      expect(decoded.isAdmin).toBe(true);
      expect(decoded.role).toBe("admin");
    });

    it("should use default values when isAdmin and role are missing", () => {
      const user = {
        userName: "krn",
        _id: "123",
      };

      const token = generateAccessToken(user as any);
      const decoded = jwt.verify(token, config.jwtSecret) as any;

      expect(decoded.userName).toBe("krn");
      expect(decoded.userId).toBe("123");
      expect(decoded.isAdmin).toBe(false);
      expect(decoded.role).toBe("user");
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const user = {
        _id: "123",
      };

      const token = generateRefreshToken(user);
      const decoded = jwt.verify(token, config.jwtSecret) as any;

      expect(decoded.userId).toBe("123");
    });
  });

  describe("authenticateToken", () => {
    it("should return 401 when no token is provided", () => {
      const req: any = {
        headers: {},
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "No token provided",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when token is invalid", () => {
      const req: any = {
        headers: {
          authorization: "Bearer invalid-token",
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid token",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should set req.user and call next when token is valid", () => {
      const token = jwt.sign(
        {
          userName: "krn",
          userId: "123",
          isAdmin: false,
          role: "user",
        },
        config.jwtSecret,
      );

      const req: any = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(req.user.userName).toBe("krn");
      expect(req.user.userId).toBe("123");
      expect(req.user.isAdmin).toBe(false);
      expect(req.user.role).toBe("user");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("authorizeAdmin", () => {
    it("should return 403 when req.user does not exist", () => {
      const req: any = {};

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      authorizeAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Admin access only",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when user is not admin", () => {
      const req: any = {
        user: {
          isAdmin: false,
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      authorizeAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Admin access only",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when user is admin", () => {
      const req: any = {
        user: {
          isAdmin: true,
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      authorizeAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
