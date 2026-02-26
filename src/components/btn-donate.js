import { Button, Link } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function BtnDonateNow() {
  const theme = useTheme();

  return (
    <Link href="/criar-campanha">
      <Button
        variant="outlined"
        sx={{
          py: 1.6,
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 700,
          fontSize: 15,
          backgroundColor: theme.palette.light.main,
          color: theme.palette.dark.main,
          borderColor: theme.palette.dark.text,
          textTransform: 'none',
          '&:hover': {
            bgcolor: theme.palette.dark.text,
            color: theme.palette.light.main
          },
        }}
      >
        Criar campanha
      </Button>
    </Link>
  );
}