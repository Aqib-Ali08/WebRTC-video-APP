// src/pages/RegisterPage.jsx

import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import registerSVG from "../assets/register.svg";
import { useNavigate } from "react-router-dom";
import { handleRegister } from "../services";

const RegisterPage = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { name, username, password } = values;
      const result = await handleRegister(name, username, password);
      console.log("Registration successful:", result);
      navigate("/login"); // Navigate after successful registration
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      // Optionally show a user-friendly error toast/message here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box display="flex" height="100vh">
        {/* Left Side - SVG */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          <img
            src={registerSVG}
            alt="Register Illustration"
            style={{ width: "80%", maxWidth: "500px" }}
          />
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <Box width="100%" maxWidth="400px">
            <Typography variant="h4" fontWeight={600} mb={2}>
              Create Account
            </Typography>
            <Typography mb={3}>Sign up to get started</Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Full Name"
                    name="name"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    label="Username"
                    name="username"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        sx={{
                          padding: 0,
                          "& .MuiSvgIcon-root": {
                            fontSize: 18,
                          },
                        }}
                      />
                    }
                    label="I agree to the Terms & Conditions"
                    sx={{
                      marginLeft: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "12px",
                      },
                      gap: "4px",
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{
                        mt: 2,
                        borderRadius: "999px",
                        background:
                          "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                        textTransform: "none",
                      }}
                      disabled={isSubmitting}
                    >
                      Register
                    </Button>
                  </motion.div>

                  <Typography variant="body2" textAlign="center" mt={2}>
                    Already have an account?{" "}
                    <Box
                      component="span"
                      onClick={() => navigate("/login")}
                      sx={{
                        color: "#667eea",
                        cursor: "pointer",
                        fontWeight: 500,
                        display: "inline",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#5a67d8",
                        },
                      }}
                    >
                      Login
                    </Box>
                  </Typography>
                </Form>
              )}
            </Formik>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default RegisterPage;
