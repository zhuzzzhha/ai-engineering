import { Box, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface IMainLayoutProps {
  children: ReactNode;
}
export const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "10vh",
          backgroundColor: "#1976d2",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "#fff", marginLeft: "2em" }}>
          Команда "АБАМА"
        </Typography>
        <Typography sx={{ color: "#fff", marginRight: "2em" }}>
          AI ENGINEERING HACKATON{" "}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};
