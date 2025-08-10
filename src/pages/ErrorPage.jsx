import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import errorSVG from "../assets/error.svg"; // Place your svg here
import Lottie from "lottie-react";
import pageNotFound from "../assets/404-page.json";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      p={2}
    >
      {/* <img src={errorSVG} alt="Error Illustration" style={{ maxWidth: '400px', width: '100%', marginBottom: '2rem' }} /> */}

      {/* <Typography variant="h3" fontWeight={700} fontFamily="Questrial" mb={1}>
        Oops!
      </Typography> */}
      <Lottie
        animationData={pageNotFound}
        loop={true}
        style={{ width: "350px", height: "350px" }}
      />

      <Typography
        variant="body1"
        color="text.secondary"
        // mb={3}
        sx={{ mt: 2, mb: 2 }}
        textAlign="center"
      >
        We couldn't find the page you’re looking for.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ textTransform: "none" }}
        size="small"
        startIcon={<ArrowBackIosIcon />}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ErrorPage;
