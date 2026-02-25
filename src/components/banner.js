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
  {
    imgSrc: "https://picsum.photos/1920/460?random=2",
    title: "Título do Banner 2",
    description: "Esta é uma descrição para o banner 2, informando mais sobre o conteúdo.",
    buttonText: "Ação do botão 2",
  },
  {
    imgSrc: "https://picsum.photos/1920/460?random=3",
    title: "Título do Banner 3",
    description: "Esta é uma descrição para o banner 3, informando mais sobre o conteúdo.",
    buttonText: "Ação do botão 3",
  },
];

export default function Banner() {
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
              style={{ width: "100%", height: "460px", objectFit: "cover" }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column', // Permite que o conteúdo se ajuste em coluna
                justifyContent: { xs: 'center', md: 'center' }, // Centraliza verticalmente
                alignItems: { xs: 'center', md: 'flex-start' }, // Centraliza horizontalmente no mobile e alinha à esquerda no desktop
                background: 'rgba(0, 0, 0, 0.8)', // Fundo semitransparente
                padding: { xs: '0px', md: '0' }, // Padding para mobile
              }}
            >
              <Container
                maxWidth="lg"
                sx={{
                  color: '#fff',
                  textAlign: { xs: 'center', md: 'left' }, // Centraliza texto no mobile e alinha à esquerda no desktop
                }}
              >
                <Typography variant="h3">{slide.title}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {slide.description}
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    p: 1.5, 
                    mt: 4, 
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.light.main 
                  }}
                >
                  {slide.buttonText}
                </Button>
              </Container>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
