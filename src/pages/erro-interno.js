import { Container, Typography, Button } from "@mui/material";
import PowerOffIcon from "@mui/icons-material/PowerOff";

export default function InternalError() {
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
      <PowerOffIcon color="primary" style={{ fontSize: 100, marginBottom: 16 }} />
      <Typography variant="h4" color="textPrimary">
        Oops, problemas técnicos...
      </Typography>
      <Typography variant="body1" color="textSecondary" style={{ marginTop: 8 }}>
        Estamos com problemas técnicos no momento. <br/>Tente novamente mais tarde.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        style={{ color: '#fff', marginTop: 24 }}
        onClick={() => (window.location.href = "/")}
      >
        Ir para o inicio
      </Button>
    </Container>
  );
}
