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
import loginSVG from "../assets/login.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { handleLogin } from "../services";
import { loginSuccess } from "../redux/slices/authSlice";

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const data = await handleLogin(values.username, values.password);
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          rememberMe,
        })
      );
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ password: "Invalid credentials" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box display="flex" height="100vh">
        {/* Left Side - Form */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box width="100%" maxWidth="400px" p={4}>
            <Typography variant="h4" fontWeight={600} mb={2}>
              Welcome back
            </Typography>
            <Typography mb={3}>Please enter your details</Typography>

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

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          sx={{
                            padding: 0,
                            "& .MuiSvgIcon-root": {
                              fontSize: 18,
                            },
                          }}
                        />
                      }
                      label="Remember me"
                      sx={{
                        marginLeft: 0,
                        "& .MuiFormControlLabel-label": {
                          fontSize: "12px",
                        },
                        gap: "4px",
                      }}
                    />

                    <Typography sx={{ fontSize: "12px", color: "blue" }}>
                      forget password?
                    </Typography>
                  </Box>

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
                    >
                      Login
                    </Button>
                  </motion.div>

                  <Typography variant="body2" textAlign="center" mt={2}>
                    Don't have an account?{" "}
                    <Box
                      component="span"
                      onClick={() => navigate("/register")}
                      sx={{
                        color: "#667eea",
                        cursor: "pointer",
                        fontWeight: 500,
                        display: "inline",
                      }}
                    >
                      Register
                    </Box>
                  </Typography>
                </Form>
              )}
            </Formik>
          </Box>
        </motion.div>

        {/* Right Side - SVG */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#eee",
          }}
        >
          <img
            src={loginSVG}
            alt="Login Illustration"
            style={{ width: "80%", maxWidth: "500px" }}
          />
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default LoginPage;
