import { Box, Button, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

export const StartPage: FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: "2em",
        }}
      >
        Построение CAD-моделей по чертежам с использованием искусственного
        интеллекта
      </Typography>
      <Button
        sx={{
          width: "30%",
          height: "30%",
          fontSize: "3em",
        }}
        onClick={() => {
          navigate("/createModelPage");
        }}
      >
        Старт
      </Button>
    </Box>
  );
};
