import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import PostsWidget from "./NoAuthPostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";

const NoAuthHomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          mx={isNonMobileScreens ? "auto" : undefined}
        >
          <PostsWidget />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NoAuthHomePage;