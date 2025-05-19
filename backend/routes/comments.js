import express from "express";
import { postComment } from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/postComment", verifyToken, postComment);

export default router;