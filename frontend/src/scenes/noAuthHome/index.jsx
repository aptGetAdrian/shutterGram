import Navbar from "scenes/navbar";

import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

const NoAuthHome = () => {
    const isNonMobileScreeen = useMediaQuery("(min-width:1000px)");


    return (
        <Box>
            <Navbar />
            <Box width="100%" padding="2rem 6%" display={isNonMobileScreeen ? "flex" : "block"} gap="0.5rem" justifyContent="space-between" >
                <Box flexBasis={isNonMobileScreeen ? "26%" : undefined}>
                    nonLoggedin lol
                </Box>
                <Box flexBasis={isNonMobileScreeen ? "42%" : undefined}
                    mt={isNonMobileScreeen ? undefined : "2rem"}>
                        
                </Box>
                {isNonMobileScreeen && <Box flexBasis="26%"></Box>}
            </Box>
        </Box>
    )
}

export default NoAuthHome;