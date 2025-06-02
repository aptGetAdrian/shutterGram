import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
} from "@mui/icons-material";
import {
  Box, Typography, useTheme, Divider
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NoAuthPostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [postComments, setPostComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const likeCount = Object.keys(likes).length;

  const getCommentCount = async () => {
    const response = await fetch(
      `http://localhost:3001/comments/${postId}/count`,
      {
        method: "GET",
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Check for invalid date
    
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <WidgetWrapper 
      m="2rem 0"
      sx={{ 
        boxShadow: 3,
        maxWidth: "100%",
        margin: "0 auto",
        mt: "2rem"
      }}
    >
      {/* USER INFO */}
      <FlexBetween
        gap="0.5rem"
        pb="0.5rem"
        onClick={() => navigate(`/login`)}
        sx={{
          "&:hover": {
            cursor: "pointer",
            color: palette.primary.light,
          },
        }}
      >
        <FlexBetween gap="0.5rem">
          <img
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
            }}
            alt="user"
            src={`http://localhost:3001/assets/${userPicturePath}`}
          />
          <Box>
            <Typography
              variant="h6"
              color={main}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={main} fontSize="0.7rem">
              {location}
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "0.5rem" }}>
        <Typography color={main} sx={{ flex: 1, fontSize: "0.9rem" }}>
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
            <FavoriteBorderOutlined />
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem" onClick={() => setIsComments(!isComments)} sx={{ "&:hover": { cursor: "pointer" } }}>
            <ChatBubbleOutlineOutlined />
            <Typography>{commentCount}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          <Divider />
          <Typography
            color={main}
            sx={{ 
              mt: "1rem",
              mb: "1rem",
              pl: "1rem",
              fontStyle: "italic",
              fontSize: "0.85rem"
            }}
          >
            Sign in to join the conversation
          </Typography>

          {postComments.map((comment) => (
            <Box 
              key={comment._id} 
              sx={{
                backgroundColor: palette.background.alt,
                borderRadius: "0.5rem",
                padding: "0.75rem",
                mb: "0.75rem"
              }}
            >
              <FlexBetween gap="1rem" alignItems="flex-start">
                <Box sx={{ display: "flex", gap: "0.75rem", flex: 1 }}>
                  <Box>
                    <img
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        width: "35px",
                        height: "35px",
                      }}
                      alt="user"
                      src={`http://localhost:3001/assets/${comment.userPicturePath || "default.png"}`}
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      onClick={() => navigate(`/login`)}
                      sx={{ 
                        color: main,
                        fontWeight: "500",
                        fontSize: "0.85rem",
                        "&:hover": {
                          color: palette.primary.light,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {comment.firstName} {comment.lastName}
                    </Typography>
                    
                    <Typography
                      sx={{
                        color: palette.neutral.medium,
                        fontSize: "0.7rem",
                      }}
                    >
                      {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>

                    <Typography 
                      sx={{ 
                        color: main,
                        fontSize: "0.85rem",
                        whiteSpace: "pre-wrap",
                        mt: "0.25rem"
                      }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              </FlexBetween>
            </Box>
          ))}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default NoAuthPostWidget; 