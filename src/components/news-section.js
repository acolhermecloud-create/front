import { CurrencyExchange, Language, LocalAtm } from "@mui/icons-material";
import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function NewsSection() {

  const theme = useTheme();

  return (
    <Box sx={{
      mt: 4,
      width: '100%',
      p: 0,
      backgroundImage: `url(https://fastly.picsum.photos/id/139/1920/460.jpg?hmac=YpbJXkATvgjCGtsOyucgYjVZnFaHRwQ86ljVPILIyb8)`
    }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(270deg, ${theme.palette.primary.opaque} 0%, ${theme.palette.primary.opaque} 0.01%, ${theme.palette.primary.opaque} 100%)`,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            color: '#fff',
            p: 4
          }}
        >
          <Grid container spacing={2} justifyContent="center" alignItems={'center'}>
            <Grid item xs={12} sm={6} md={4}>
              <Chip
                label={'Novidade'}
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.light.main,
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Ajuste a fonte
                  px: 1,
                  borderRadius: 20,
                }}
              />
              <Typography
                sx={{ fontWeight: 500 }}
                pt={3}
                variant="h3"
                color={theme.palette.light.main}
                fontSize={{ xs: '1.5rem', sm: '2rem' }} // Ajuste a fonte
              >
                Faça parte da mudança com sua doação mensal.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography 
                variant="h6" 
                color={theme.palette.light.main}
                fontSize={{ xs: '0.875rem', sm: '1rem' }} // Ajuste a fonte
              >
                Escolha um valor fixo, doe mensalmente e apoie vaquinhas à sua escolha com 100% de transparência.
              </Typography>
              {/*<Button 
                variant="contained"
                sx={{
                  p: 1.5, 
                  mt: 4,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.light.main
                }}
              >
                Saiba mais
              </Button>*/}
              <Stack direction={'row'} mt={4} spacing={5}>
                <Stack direction={'column'} spacing={2} display={'flex'} alignItems={'center'}>
                  <Language sx={{ fontSize: 64 }} />
                  <Typography variant="subtitle1" color={theme.palette.light.main} fontSize={{ xs: '0.75rem', sm: '1rem' }}>100% seguro</Typography>
                </Stack>
                <Stack direction={'column'} spacing={2} display={'flex'} alignItems={'center'}>
                  <CurrencyExchange sx={{ fontSize: 64 }} />
                  <Typography variant="subtitle1" color={theme.palette.light.main} fontSize={{ xs: '0.75rem', sm: '1rem' }}>Cabe no bolso</Typography>
                </Stack>
                <Stack direction={'column'} spacing={2} display={'flex'} alignItems={'center'}>
                  <LocalAtm sx={{ fontSize: 64 }} />
                  <Typography variant="subtitle1" color={theme.palette.light.main} fontSize={{ xs: '0.75rem', sm: '1rem' }}>100% seguro</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
