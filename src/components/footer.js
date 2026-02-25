import Link from "next/link";
import { Container, Grid, Typography, Divider, IconButton, Box } from "@mui/material";
import { Instagram, Facebook, Twitter, YouTube } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';

import logo from './../assets/images/logo3.png';

export default function Footer() {
  const theme = useTheme();

  return (
    <footer style={{ backgroundColor: theme.palette.primary.secondary, color: "white", padding: "32px 0" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>

          {/* Logo e CNPJ */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <img src={logo.src} alt="logo" width={180} />
            <Typography variant="body2">CNPJ 57.707.122/0001-30</Typography>
          </Grid>

          {/* Endereço */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" gutterBottom>Nosso endereço</Typography>
            <Typography variant="body2">
              Av. Paulista<br />
              São Paulo, Bela Vista/SP, CEP 01.311-927
            </Typography>
          </Grid>

          {/* Redes Sociais */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" gutterBottom>Nossas redes</Typography>
            <div>
              <IconButton color="inherit" component={Link} href="http://instagram.com/Acolheroficial" target="_blank" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" component={Link} href="#" aria-label="Facebook">
                <Facebook />
              </IconButton>
              {/*<IconButton color="inherit" component={Link} href="#" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" component={Link} href="#" aria-label="YouTube">
                <YouTube />
              </IconButton>
              */}
            </div>
          </Grid>
        </Grid>

        <Divider sx={{ height: "0.1px", margin: "32px 0", backgroundColor: theme.palette.light.secondary }} />

        {/* Links Inferiores */}
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          direction={{ xs: "column", md: "row" }}
          spacing={2} // Adicionei um espaçamento entre os itens
        >
          <Grid item xs={12} md="auto">
            <Typography variant="body2" textAlign={{ xs: "center", md: "left" }}>
              ©2024 - {new Date().getFullYear()} Acolher
            </Typography>

          </Grid>
          <Grid
            item
            container
            xs={12}
            md="auto"
            spacing={2} // Adicionando espaçamento entre os links
            justifyContent={{ xs: "center", md: "flex-start" }} // Centraliza em mobile e alinha à esquerda no desktop
          >
            <Grid item>
              <Link href="/politica-privacidade" passHref legacyBehavior>
                <Box component="a" style={{ color: theme.palette.light.main, textDecoration: "none" }}>
                  <Typography component="span" variant="subtitle2" color="inherit">Política de Privacidade</Typography>
                </Box>
              </Link>
            </Grid>

            <Grid item>
              <Link href="/termos-de-uso" passHref legacyBehavior>
                <Box component="a" style={{ color: theme.palette.light.main, textDecoration: "none" }}>
                  <Typography component="span" variant="subtitle2" color="inherit">Termos de uso</Typography>
                </Box>
              </Link>
            </Grid>

            {/*<Grid item>
              <Link href="#" passHref legacyBehavior>
                <Box component="a" style={{ color: theme.palette.light.main, textDecoration: "none" }}>
                  <Typography component="span" variant="subtitle2" color="inherit">Preferências de Cookies</Typography>
                </Box>
              </Link>
            </Grid>*/}

            <Grid item>
              <Link
                target="_blank"
                href="https://api.whatsapp.com/send/?phone=5562995774022&text=Ol%C3%A1%2C+estou+com+d%C3%BAvida&type=phone_number&app_absent=0" passHref legacyBehavior>
                <Box component="a" style={{ color: theme.palette.light.main, textDecoration: "none" }}>
                  <Typography component="span" variant="subtitle2" color="inherit">Fale com o DPO</Typography>
                </Box>
              </Link>
            </Grid>
          </Grid>
        </Grid>

      </Container>
    </footer>
  );
}
