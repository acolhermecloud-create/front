import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CtaSection from "@/components/cta-section";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";

export default function Contato() {
  const theme = useTheme();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="primary" fontSize={{ xs: '0.8rem', sm: '1rem' }}>
              Fale com a gente
            </Typography>
            <Typography variant="h2" fontSize={{ xs: '1.5rem', sm: '2.8rem' }} fontWeight={600}>
              Entre em contato com a equipe Acolher
            </Typography>
            <Typography variant="subtitle1" pt={2} fontSize={{ xs: '0.8rem', sm: '1rem' }}>
              Caso tenha qualquer dúvida, sugestão ou precise de ajuda com sua campanha, estamos disponíveis para conversar. 
              Nosso atendimento é feito diretamente via WhatsApp para maior agilidade. 
              Também recomendamos visitar a seção <Link href="/sobre-nos" passHref legacyBehavior><a style={{ textDecoration: 'underline', color: theme.palette.primary.main }}>Sobre nós</a></Link> para conhecer melhor nossa missão e como podemos te ajudar.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={4}>
              <Button
                variant="contained"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsAppIcon style={{color: '#FFF'}} />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1rem",
                  bgcolor: theme.palette.success.main,
                  color: '#FFF',
                }}
              >
                Fale conosco no WhatsApp
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <img
              src="https://integras-public.s3.sa-east-1.amazonaws.com/IMG4.png"
              alt="Contato Acolher"
              style={{ borderRadius: 15, maxWidth: "100%" }}
            />
          </Grid>
        </Grid>
      </Container>

      <CtaSection />
    </div>
  );
}
