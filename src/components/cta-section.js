import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Link from "next/link";

export default function CtaSection() {

  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: 4,
        p: 2,
        backgroundColor: theme.palette.primary.main
      }}
    >
      <Container maxWidth="lg" >
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Stack direction={'column'}>
            <Typography
              fontSize={{ xs: '1rem', sm: '1.4rem' }}
              variant="h5" sx={{ fontWeight: 600 }} color={theme.palette.light.main}>
              Peça ajuda
            </Typography>
            <Typography
              fontSize={{ xs: '0.6rem', sm: '1.0rem' }}
              variant="subtitle1" sx={{ fontWeight: 500 }} color={theme.palette.light.main}>
              Ela pode virar uma vaquinha
            </Typography>
          </Stack>
          <Link href="/criar-campanha">
            <Button variant="contained"
              sx={{
                p: 1.5,
                backgroundColor: theme.palette.light.main,
                color: theme.palette.dark.main,
              }}>
              Envie sua história
            </Button>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}