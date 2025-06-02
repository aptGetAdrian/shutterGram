import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const postComment = async (req, res) => {
  try {
    const { userId, postId, content } = req.body;

    const user = await User.findById(userId);
    
    const newComment = new Comment({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      postId,
      content,
      userPicturePath: user.picturePath,
    });

    await newComment.save();

    const commentData = {
      _id: newComment._id,
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      content,
      createdAt: newComment.createdAt,
      userPicturePath: user.picturePath,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: commentData } },
      { new: true }
    );

    res.status(201).json(updatedPost);

  } catch (err) {
    console.error("Error in postComment:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCommentCount = async (req, res) => {
  try {
    const { postId } = req.params;
    const count = await Comment.countDocuments({ postId });
    res.status(200).json({ count });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};