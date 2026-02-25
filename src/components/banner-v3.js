import { Box, Button, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTheme } from '@mui/material/styles';

// Lista de slides
const slides = [
  {
    imgSrc: "https://picsum.photos/1920/460?random=1",
    title: "Título do Banner 1",
    description: "Esta é uma descrição para o banner 1, informando mais sobre o conteúdo.",
    buttonText: "Ação do botão 1",
  },
];

export default function BannerV3() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        p: 0,
        m: 0,
      }}
    >
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        pagination={{
          clickable: true,
          renderBullet: (_, className) => {
            return `<span class="${className}" style="background-color:${theme.palette.primary.main};"></span>`;
          },
        }}
        modules={[Pagination]}
        style={{
          width: "100%",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} style={{ position: 'relative' }}>
            <img
              src={slide.imgSrc}
              alt={slide.title}
              style={{ width: "100%", height: "280px", objectFit: "cover" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
