import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined
} from "@mui/icons-material";
import {
  Box, Divider, IconButton, Typography, useTheme, Button,
  TextField, Stack, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useNavigate } from "react-router-dom";

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
  reports,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [postComments, setPostComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const isReported = Boolean(reports?.[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const reportCount = reports ? Object.keys(reports).length : 0;
  const [commentContent, setCommentContent] = useState("");

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const getCommentCount = async () => {
    const response = await fetch(
      `http://localhost:3001/comments/${postId}/count`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setCommentCount(data.count);
  };

  useEffect(() => {
    getCommentCount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getComments = async () => {
    const response = await fetch(
      `http://localhost:3001/comments/${postId}/comments`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setPostComments(data);
  };

  useEffect(() => {
    if (isComments) {
      getComments();
    }
  }, [isComments]); // eslint-disable-line react-hooks/exhaustive-deps

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
    getComments(); // Refresh comments after posting
    getCommentCount(); // Refresh comment count after posting
  };

  const handleReportClick = () => {
    setOpenReportDialog(true);
  };

  const handleReportConfirm = async () => {
    await patchReport();
    setOpenReportDialog(false);
  };

  const handleReportCancel = () => {
    setOpenReportDialog(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Check for invalid date
    
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <WidgetWrapper m="2rem 0" sx={{ boxShadow: 4 }}>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "0.5rem" }}>
        <Typography color={main} sx={{ flex: 1 }}>
          {description}
        </Typography>
        {createdAt && (
          <Typography 
            color={palette.neutral.medium} 
            fontSize="0.75rem"
            sx={{ ml: "1rem" }}
          >
            {formatDate(createdAt)}
          </Typography>
        )}
      </Box>
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
            <Typography>{commentCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <Button 
              color="error" 
              onClick={handleReportClick}
              disabled={isReported}
              sx={{
                opacity: isReported ? 0.5 : 1,
                '&.Mui-disabled': {
                  color: 'error.main',
                }
              }}
            >
              {isReported ? "REPORTED" : "REPORT"}
            </Button>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {/* Report Confirmation Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={handleReportCancel}
      >
        <DialogTitle>Report Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to report this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReportConfirm} color="error" variant="contained">
            Report
          </Button>
        </DialogActions>
      </Dialog>

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

          {postComments.map((comment) => (
            <Box 
              key={comment._id} 
              sx={{
                backgroundColor: palette.background.alt,
                borderRadius: "0.5rem",
                padding: "1rem",
                mb: "1rem"
              }}
            >
              <FlexBetween gap="1rem" alignItems="flex-start">
                <Box sx={{ display: "flex", gap: "1rem", flex: 1 }}>
                  <Box>
                    <img
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                      }}
                      alt="user"
                      src={`http://localhost:3001/assets/${comment.userPicturePath || "default.png"}`}
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      onClick={() => navigate(`/profile/${comment.userId}`)}
                      sx={{ 
                        color: main,
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        "&:hover": {
                          color: palette.primary.main,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {comment.firstName} {comment.lastName}
                    </Typography>
                    
                    <Typography
                      sx={{
                        color: palette.neutral.medium,
                        fontSize: "0.75rem",
                      }}
                    >
                      {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>

                <Typography 
                  sx={{ 
                    color: main,
                    fontSize: "0.9rem",
                    whiteSpace: "pre-wrap",
                    flex: 2,
                  }}
                >
                  {comment.content}
                </Typography>
              </FlexBetween>
            </Box>
          ))}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
