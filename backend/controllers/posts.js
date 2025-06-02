import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      reports: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    const visiblePosts = posts.filter(post => {
      const reportCount = post.reports ? post.reports.size : 0;
      return reportCount <= 3;
    });

    const halfLifeHours = 24;                 
    const lambda = Math.log(2) / halfLifeHours;
    const now = Date.now();

    const result = visiblePosts.map((postDoc) => {
      const post = postDoc.toObject({ getters: true, versionKey: false });
      post.likes = post.likes ? Object.fromEntries(post.likes) : {};
      post.reports = post.reports ? Object.fromEntries(post.reports) : {};

      const voteCount = Object.keys(post.likes).length;
      const ageHours = (now - new Date(post.createdAt).getTime()) / 36e5;

      post.score = voteCount * Math.exp(-lambda * ageHours);

      return post;
    });

    result.sort((a, b) => b.score - a.score);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getFeedPosts:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const reportPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    
    if (!post.reports) {
      post.reports = new Map();
    }

    post.reports.set(userId, true);

    await post.save();

    const updatedPost = post.toObject({ getters: true });
    updatedPost.likes = updatedPost.likes ? Object.fromEntries(updatedPost.likes) : {};
    updatedPost.reports = updatedPost.reports ? Object.fromEntries(updatedPost.reports) : {};

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
