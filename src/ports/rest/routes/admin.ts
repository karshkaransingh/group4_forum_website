import express from "express";
import dependencies from "../../../infrastructure/dependencies";
import { getSiteStats } from "../../../controllers/admin";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/authentication";

const router = express.Router();

// route to get site stats (accessed by admin only)
router.get(
  "/stats",
  authenticateToken,
  authorizeAdmin,
  async (_req: any, res: any) => {
    try {
      const result = await getSiteStats(dependencies)();
      res.status(200).json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  },
);

export default router;
