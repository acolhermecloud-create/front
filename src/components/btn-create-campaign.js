import { Button, Link } from "@mui/material";
import { useTheme } from '@mui/material/styles';
export default function BtnCreateCampaing() {
  const theme = useTheme();

  return (
    <Link href="/criar-campanha">
      <Button
        variant="contained"
        sx={{
          flex: 1,
          p: 1.5,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.light.main,
          fontSize: { xs: '1rem', sm: '1.2rem' },
          '&:hover': {
            bgcolor: theme.palette.primary.secondary,
            color: theme.palette.light.main
          },
        }}
      >
        CRIAR VAQUINHA
      </Button>
    </Link>
  );
}