import React from 'react';
import { firebaseClient, googleAuthProvider } from '../client/firebaseClient';
import { Box, Container, Divider, IconButton, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import GoogleIcon from '@mui/icons-material/Google';
import { LoginForm } from '../client/components/LoginForm';
import { ANIMATION_VERTICAL_FADE } from '../client/config/animations';

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

const Login = () => {
  const googleSignIn = async () => {
    await firebaseClient.auth().signInWithPopup(googleAuthProvider);
    window.location.href = '/';
  };

  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle component={motion.div} {...ANIMATION_VERTICAL_FADE}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 5 }}>
              Welcome at World Wide Weed!
            </Typography>
          </HeadingStyle>

          <Typography variant="h6" sx={{ color: "text.secondary", mb: 5 }}>
            Login to your account
          </Typography>

          <LoginForm />

          <Divider sx={{ mb: 3 }} component={motion.div} {...ANIMATION_VERTICAL_FADE}>
            OR
          </Divider>

          <Box component={motion.div} {...ANIMATION_VERTICAL_FADE}>
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
