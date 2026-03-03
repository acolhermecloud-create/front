import { Box } from "@mui/material";

export const InstitucionalVideo = ({ height = 300 }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src="https://i.ibb.co/NghQJqQZ/depositphotos-139023516-stock-photo-african-boy-in-shirt-smiling.webp"
        alt="Institucional"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // 🔑 impede scroll e mantém proporção
          display: "block",
        }}
      />
    </Box>
  );
};