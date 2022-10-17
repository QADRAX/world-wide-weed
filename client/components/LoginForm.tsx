import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Form, FormikProvider, useFormik } from 'formik';
import { Box, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { firebaseClient } from '../firebaseClient';

const easing = [0.6, -0.05, 0.01, 0.99];
const animate = {
    opacity: 1,
    y: 0,
    transition: {
        duration: 0.6,
        ease: easing,
        delay: 0.16,
    },
};

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Provide a valid email address")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            await firebaseClient.auth().signInWithEmailAndPassword(values.email, values.password);
            setSubmitting(false);
            window.location.href = '/';
        },
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } =
        formik;
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Box
                    component={motion.div}
                    animate={{
                        transition: {
                            staggerChildren: 0.55,
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            mb: 3
                        }}
                        component={motion.div}
                        initial={{ opacity: 0, y: 40 }}
                        animate={animate}
                    >
                        <TextField
                            fullWidth
                            autoComplete="username"
                            type="email"
                            size='small'
                            label="Email Address"
                            {...getFieldProps("email")}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                        />

                        <TextField
                            fullWidth
                            size='small'
                            autoComplete="current-password"
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            {...getFieldProps("password")}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? (
                                                <RemoveRedEyeIcon />
                                            ) : (
                                                <RemoveRedEyeOutlinedIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={animate}
                        sx={{ mb: 3 }}
                    >
                        <Stack direction="row" spacing={2}>
                            <LoadingButton
                                fullWidth
                                size="small"
                                type="submit"
                                color="primary"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                {isSubmitting ? "loading..." : "Login"}
                            </LoadingButton>
                        </Stack >
                    </Box>
                </Box>
            </Form>
        </FormikProvider>
    );
}