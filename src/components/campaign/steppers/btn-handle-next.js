import { Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';


export default function ButtonHandleNextStepper({ handleNext }) {

  const theme = useTheme();

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        flex: 1,
        p: 1,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.light.main,
        fontSize: { xs: '1rem', sm: '1.2rem' },
        '&:hover': {
          bgcolor: theme.palette.primary.secondary,
          color: theme.palette.light.main
        },
      }}
      onClick={handleNext}
    >
      Continuar
    </Button>
  );
}