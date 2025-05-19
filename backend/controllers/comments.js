import Comment from "../models/Comment.js";
import User from "../models/User.js";


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
    });

    
    await newComment.save();

    const commentData = {
      _id: newComment._id,
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      content,
      createdAt: newComment.createdAt,
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