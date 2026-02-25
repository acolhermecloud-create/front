import { Receipt, VolunteerActivism, WorkspacePremium } from "@mui/icons-material";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function AboutHomeSection() {

  const theme = useTheme();

  return (
    <Box sx={{
      mt: 4,
      p: 4
    }}>
      <Container maxWidth="lg" >
        <Grid container spacing={2} >
          <Grid item xs={12} sm={12} md={4} textAlign={'center'}>
            <VolunteerActivism sx={{ fontSize: 68 }} color={'primary'} />
            <Typography variant="h6" color={theme.palette.dark.text}>Relacionamento</Typography>
            <Typography variant="body2" color="initial">
              Construímos uma relação sólida entre beneficiários e doadores, assegurando que cada valor arrecadado chegue ao destino certo.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4} textAlign={'center'}>
            <Receipt sx={{ fontSize: 68 }} color={'primary'} />
            <Typography variant="h6" color={theme.palette.dark.text}>Transparência</Typography>
            <Typography variant="body2" color="initial">
              O trabalho continua após o fim das doações, com atualizações e prestação de contas até o desfecho da história.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4} textAlign={'center'}>
            <WorkspacePremium sx={{ fontSize: 68 }} color={'primary'} />
            <Typography variant="h6" color={theme.palette.dark.text}>Garantia</Typography>
            <Typography variant="body2" color="initial">
              Todas as campanhas passam por curadoria e verificação antes da publicação, garantindo doações seguras e confiáveis.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
