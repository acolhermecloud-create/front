import { Container, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
  return (
    <Container
      maxWidth="sm"
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <ErrorOutlineIcon style={{ fontSize: 100, color: "#ff6701", marginBottom: 16 }} />
      <Typography variant="h4" color="textPrimary">
        404 - Página não encontrada
      </Typography>
      <Typography variant="body1" color="textSecondary" style={{ marginTop: 8 }}>
        Oops! A página que você está procurando não existe ou foi movida.
      </Typography>
      <Button
        variant="contained"
        color="error"
        size="large"
        style={{ backgroundColor: "#ff6701", marginTop: 24 }}
        onClick={() => (window.location.href = "/")}
      >
        Voltar para o inicio
      </Button>
    </Container>
  );
}
