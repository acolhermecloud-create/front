import { Button, Link } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function BtnDonateNow() {
  const theme = useTheme();

  return (
    <Link href="#wannadonate">
      <Button
        variant="outlined"
        sx={{
          flex: 1,
          p: 1.5,
          backgroundColor: theme.palette.light.main,
          color: theme.palette.dark.main,
          borderColor: theme.palette.dark.main,
          fontSize: { xs: '1rem', sm: '1.2rem' },
          '&:hover': {
            bgcolor: theme.palette.dark.main,
            color: theme.palette.light.main
          },
        }}
      >
        Quero doar
      </Button>
    </Link>
  );
}