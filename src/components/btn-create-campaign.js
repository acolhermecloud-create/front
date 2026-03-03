import { Button, Link } from "@mui/material";
import { useTheme } from '@mui/material/styles';
export default function BtnCreateCampaing() {
  const theme = useTheme();

  return (
    <Link href="#wannadonate">
      <Button
        variant="contained"
        sx={{
          py: 1.6,
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 700,
          fontSize: 15,
          background: "linear-gradient(135deg, #F43F5E, #E11D48)",
          boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #F43F5E, #BE123C)",
          },
        }}
        
      >
        Fazer Doação
      </Button>
    </Link>
  );
}