import User from "../models/User.js";
import Post from "../models/Post.js";


export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);



    res.status(200).json(user);

  } catch (err) {
    res.status(404).json({ message: err.message });
    
  }
};


export const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    const numPosts = await Post.countDocuments({ userId: id });

    const userPosts = await Post.find({ userId: id }).select("likes");

    const totalLikes = userPosts.reduce((sum, post) => {
      const likesCount = post.likes ? post.likes.size : 0;
      return sum + likesCount;
    }, 0);

    res.status(200).json({
      numPosts,
      totalLikes,
    });

  } catch (err) {
    res.status(404).json({ message: err.message });

  }
};




export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);



    const friends = await Promise.all(


      user.friends.map((id) => User.findById(id))

    );
    const formattedFriends = friends.map(

      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };



      }
    );
    res.status(200).json(formattedFriends);


  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};




export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);



    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);



      friend.friends = friend.friends.filter((id) => id !== id);




    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();



    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );



    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {


        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
