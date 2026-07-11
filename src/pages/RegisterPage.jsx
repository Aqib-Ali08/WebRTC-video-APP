// src/pages/RegisterPage.jsx
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
import register from "../assets/Register.json";
import Lottie from "lottie-react";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyPress = (e) => {
    if (e.target.value === "Enter") {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box display="flex" height="100vh" sx={{ overflow: "hidden" }}>
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
            backgroundColor: "background.default",
          }}
        >
          {/* <img
            src={registerSVG}
            alt="Register Illustration"
            style={{ width: "80%", maxWidth: "500px" }}
          /> */}
          <Lottie animationData={register} loop={true} />
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
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                background: "linear-gradient(90deg, #115e59, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create Account
            </Typography>
            <Typography>Sign up to get started</Typography>

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
                    label="Username"
                    name="username"
                    placeholder="John Doe"
                    margin="normal"
                    onKeyDown={handleKeyPress}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    label="Email"
                    placeholder="john@example.com"
                    name="email"
                    margin="normal"
                    onKeyDown={handleKeyPress}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    label="Password"
                    // type="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    margin="normal"
                    onKeyDown={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                    // type="password"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    margin="normal"
                    onKeyDown={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    style={{ color: "red", fontSize: "12px", mb: "10px" }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={isSubmitting}
                      onKeyDown={handleKeyPress}
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
