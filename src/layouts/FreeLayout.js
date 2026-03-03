import { Box, Container, ThemeProvider } from "@mui/material";
import theme from "../theme";
import Head from "next/head";
import 'react-toastify/dist/ReactToastify.css';

const FreeLayout = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Head>
          <title>Acolher</title>
          <meta name="description" content="Descrição da sua aplicação" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1
          }}
        >
          <Container maxWidth="lg" sx={{ px: 1 }}>
            {children}
          </Container>

        </Box>
      </ThemeProvider>
    </>
  );
};

export default FreeLayout;
