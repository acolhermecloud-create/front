import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Stack, TextField, Divider } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "react-toastify";

export default function SecuritySettings({ userEmail, otpEnabled, setNewUserDataAuth }) {

  const isMounted = useRef(true);

  const { handleSetToken, createUrlToTwoFactor, saveTwoFa, deleteTwoFa } = useAuth();
  const { handleLoading, handleCloseLoading } = useLoading();

  const [qrCodeBase64, setQrCodeBase64] = useState();
  const [otp, setOtp] = useState();

  const handleCreateUrlTo2fa = async () => {

    handleLoading();
    const response = await createUrlToTwoFactor();

    if (response.status) {
      setQrCodeBase64(response.data.qrCode);
    } else {
      toast.error("Não foi possível gerar o QR Code");
    }
    handleCloseLoading();
  };

  const handleActive2fa = async () => {

    if (!otp || otp === '') {
      toast.error("Informe o código corretamente")
      return;
    }

    const payload = {
      email: userEmail,
      otp
    }
    handleLoading();
    const response = await saveTwoFa(payload);

    if (response.status) {
      const userAuthData = response.data;
      handleSetToken(userAuthData);
      setNewUserDataAuth(userAuthData);
    } else {
      toast.error(response.data.message);
    }
    handleCloseLoading();
  }

  const handleDelete2fa = async () => {
    handleLoading();

    const response = await deleteTwoFa();

    if (response.status) {
      handleCreateUrlTo2fa();
      const userAuthData = response.data;
      handleSetToken(userAuthData);
      setNewUserDataAuth(userAuthData);
    } else {
      toast.error(response.data.message);
    }

    handleCloseLoading();
  }

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      if (!otpEnabled) {
        handleCreateUrlTo2fa();
      }
    }
  }, [])

  return (
    <Box>
      <Typography variant="h6">Autenticação em Dois Fatores</Typography>

      {!otpEnabled && (
        <>
          <Typography variant="body2" gutterBottom>
            Escaneie o QR Code no seu app de autenticação e informe o código OTP para adicionar uma proteção
            extra para sua conta.
          </Typography>
          {qrCodeBase64 && (
            <Stack display={'flex'} alignItems={'center'} spacing={2}>
              <img src={qrCodeBase64} style={{ maxWidth: 180 }} />
              <TextField size="small" label="Código OTP" variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)} />
              <Button
                sx={{ color: '#FFF' }}
                variant="contained" color="primary" onClick={handleActive2fa}>
                Ativar OTP
              </Button>
            </Stack>
          )}

        </>
      )}
      {otpEnabled && (
        <Stack spacing={2}>
          <Typography variant="body2" color="initial">
            Atualmente habilitada, para desativar (o que não é recomendado), clique no botão abaixo.
          </Typography>
          <Stack direction={'row'}>
            <Button
              onClick={handleDelete2fa}
              variant="contained" color="error">
              Desativar OTP
            </Button>
          </Stack>
        </Stack>
      )}
      <Divider sx={{my: 2}}/>
    </Box>
  );
}