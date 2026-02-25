import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useLoginWarning } from "@/context/LoginWarningContext";

const LoginWarningModal = () => {

  const { LoginWarning, returnUrl } = useLoginWarning();

  return (
    <Dialog open={LoginWarning} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight={700} align="center">
          Oops 🙁
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" align="center">
          Você precisa estar logado para utilizar essa função.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", gap: 1, paddingBottom: 2 }}>
        <Button variant="contained" color="primary"
          onClick={() => {
            location.href = `/login?returnUrl=${returnUrl}`;
          }}
          style={{color: '#fff'}}>
          Entrar agora
        </Button>
        <Typography variant="body2">
          Ainda não tem uma conta? <Button color="error" size="small"
            onClick={() => {
              location.href = `/login?returnUrl=${returnUrl}`;
            }}>Faça seu cadastro</Button>
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default LoginWarningModal;
