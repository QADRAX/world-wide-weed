import React from 'react';
import { firebaseClient, googleAuthProvider } from '../client/firebaseClient';
import { Box, Container, Divider, IconButton, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import GoogleIcon from '@mui/icons-material/Google';

const RootStyle = styled("div")({
  background: "rgb(228 249 239)",
  height: "100vh",
  display: "grid",
  placeItems: "center",
});

const HeadingStyle = styled(Box)({
  textAlign: "center",
});

const ContentStyle = styled("div")({
  maxWidth: 480,
  padding: 25,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  background: "#fff",
});

let easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const Login = () => {
  const googleSignIn = async () => {
    await firebaseClient.auth().signInWithPopup(googleAuthProvider);
    window.location.href = '/';
  };

  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle component={motion.div} {...fadeInUp}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 5 }}>
              Login at World Wide Weed!
            </Typography>

          </HeadingStyle>

          <Divider sx={{ mb: 3 }} component={motion.div} {...fadeInUp}>
          </Divider>

          <Box component={motion.div} {...fadeInUp}>
            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{
                  border: "2px solid #ccc",
                  borderRadius: "5px",
                  padding: "0.5675rem",
                  flex: 1,
                }}
                color="primary"
                onClick={googleSignIn}>
                <GoogleIcon />
              </IconButton>
            </Stack >
          </Box>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
};

export default Login;
