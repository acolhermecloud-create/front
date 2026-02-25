import { Box } from "@mui/material";
import { useState } from "react";

export const InstitucionalVideo = ({ height }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div style={{ position: "relative", width: "100%", height, borderRadius: 20, overflow: "hidden" }}>
      <Box
        component="iframe"
        src="https://player-vz-e8a0c8b2-8b3.tv.pandavideo.com.br/embed/?v=fff09f6b-33e5-4828-9ea3-54be114815f8"
        width="100%"
        height={height}
        sx={{ border: "none" }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="eager"
      />
    </div>
  );
};
