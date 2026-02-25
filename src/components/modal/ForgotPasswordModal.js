import { useState } from "react";
import { Modal, Box, Typography, TextField, Stack, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { validateEmail, validateStrongPassword } from "@/utils/functions";
import { useTheme } from '@mui/material/styles';
import { useLoading } from "@/context/LoadingContext";
import { useUser } from "@/context/UserContext";

export default function ForgotPasswordModal({ open, handleClose }) {

  const theme = useTheme();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { handleLoading, handleCloseLoading } = useLoading();
  const { requestChallenge, changePasswordWithChallenge } = useUser();

  const handleSendEmail = async () => {
    if (!validateEmail(email)) {
      toast.error("Informe um e-mail válido");
      return;
    }

    handleLoading();
    const response = await requestChallenge(email);

    if (response.status) {
      setStep(2);
    } else {
      toast.error('Não foi possível enviar o código, verifique o email digitado');
    }

    handleCloseLoading();
  };

  const handleResetPassword = async () => {
    if (!code) {
      toast.error("Informe o código enviado por e-mail");
      return;
    }

    if (!validateStrongPassword(newPassword)) {
      toast.error("A senha deve conter ao menos uma letra maiúscula");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    handleLoading();

    const response = await changePasswordWithChallenge(email, code, newPassword);

    if (response.status) {
      setStep(3)
    } else {
      toast.error(response?.statusText || 'Verifique a senha informada');
    }

    handleCloseLoading();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, mx: "auto", my: "20%", maxWidth: 320 }}>
        <Typography variant="h6" gutterBottom>
          {step === 1 ? "Recuperar Senha" : step === 2 ? "Digite o Código" : "Sucesso!"}
        </Typography>
        <Stack spacing={2}>
          {step === 1 ? (
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
            />
          ) : step === 2 ? (
            <>
              <TextField
                label="Código"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                size="small"
              />
              <TextField
                label="Nova Senha"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                size="small"
              />
              <TextField
                label="Repita a Nova Senha"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="small"
              />
            </>
          ) : (
            <Typography variant="body1" textAlign="center">Sua senha foi alterada com sucesso!</Typography>
          )}
        </Stack>
        <Stack direction="row" justifyContent="space-between" mt={2}>
          {step !== 3 && <Button onClick={handleClose} color="secondary">Cancelar</Button>}
          {step === 1 ? (
            <LoadingButton sx={{ color: theme.palette.light.main }} loading={isLoading} onClick={handleSendEmail} variant="contained">Enviar Código</LoadingButton>
          ) : step === 2 ? (
            <LoadingButton sx={{ color: theme.palette.light.main }} loading={isLoading} onClick={handleResetPassword} variant="contained">Redefinir Senha</LoadingButton>
          ) : (
            <Button sx={{ color: theme.palette.light.main }} onClick={handleClose} variant="contained">Fechar</Button>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}