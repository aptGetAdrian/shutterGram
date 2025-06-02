import express from "express";
import { postComment, getPostComments, getCommentCount } from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/postComment", verifyToken, postComment);
router.get("/:postId/comments", getPostComments);
router.get("/:postId/count", getCommentCount);

export default router;