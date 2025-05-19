import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined
} from "@mui/icons-material";
import {
  Box, Divider, IconButton, Typography, useTheme, Button,
  TextField, Stack
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [commentContent, setCommentContent] = useState("");

  //console.log("post:" + postId);
  //console.log("user:" + loggedInUserId);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchReport = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/report`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const postComment = async (event) => {
    event.preventDefault();

    const commentInput = event.target.elements.comment;
    const content = commentInput.value;

    if (!content.trim()) return;

    console.log(content);
    

    const response = await fetch("http://localhost:3001/comments/postComment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: loggedInUserId,
        postId,
        content,
      }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setCommentContent("");
  };


  return (
    <WidgetWrapper m="2rem 0" sx={{ boxShadow: 4 }}>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <Button color="error" onClick={() => patchReport()}>
              REPORT
            </Button>
          </FlexBetween>

        </FlexBetween>





        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>



      {isComments && (




        <Box mt="0.5rem">


          <Box mb={2}>
            <form onSubmit={postComment}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  label="Comment"
                  name="comment"
                  id="comment"
                  variant="standard"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  Post
                </Button>
              </Stack>
            </form>
          </Box>


          <Divider />

          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
        </Box>

      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
