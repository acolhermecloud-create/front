import { Box, Button, Container, Grid, Link, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import BtnCreateCampaing from "./btn-create-campaign";
import BtnDonateNow from "./btn-donate";
import { InstitucionalVideo } from "./video";

export default function BannerV2() {

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));


  return (
    <Container maxWidth="lg" sx={{ pt: 6}}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={6} spacing={2}>
          <Typography variant="h2" color="initial"
            fontSize={{ xs: '1.8rem', sm: '4rem' }}
            sx={{ fontWeight: 600 }}>
            Sua ajuda, uma nova chance.
          </Typography>
          <Typography variant="subtitle1" color="initial" pt={2}
            fontSize={{ xs: '0.8rem', sm: '1.2rem' }}>
            A Acolher conecta sua solidariedade a quem mais precisa, mudando vidas com cada gesto.
          </Typography>

          <Stack direction={{ xs: 'row', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} pt={{ xs: 1, sm: 4 }}>
            <BtnCreateCampaing />
            <BtnDonateNow />
          </Stack>
          <Stack pt={2}>
            <Link href="/sobre-nos" style={{ textDecorationColor: theme.palette.dark.main }}>
              <Typography variant="subtitle2" color="initial">Saiba como funcionamos</Typography>
            </Link>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} lg={6} display="flex" alignItems="center">
          <InstitucionalVideo height={isDesktop ? 315 : 220}/>
        </Grid>
      </Grid>
    </Container>
  );
}