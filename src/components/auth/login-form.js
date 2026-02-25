import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { validateEmail, validateStrongPassword } from "@/utils/functions";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button, Checkbox, Divider,
  FormControl, FormControlLabel,
  IconButton, InputAdornment,
  InputLabel, Link, OutlinedInput,
  Stack, TextField, Typography
} from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ForgotPasswordModal from "../modal/ForgotPasswordModal";
import { motion } from "framer-motion";
import logo from './../../assets/images/logo0.png';

export default function LoginForm({ handleMode }) {

  const router = useRouter();
  const { returnUrl } = router.query;

  const [returnParam, setReturnParam] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { setUser } = useUser();
  const { login, finalizeAuthWithOtp, handleSetToken } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otp, setOtp] = useState();

  const [stayConnected, setStayConnected] = useState(false);

  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const handleOpenForgotPasswordModal = () => setOpenForgotPasswordModal(true);
  const handleCloseForgotPasswordModal = () => setOpenForgotPasswordModal(false);

  const [error, setError] = useState();

  // Verifica se o usuário optou por continuar conectado no carregamento do componente
  useEffect(() => {
    const stayConnectedValue = localStorage.getItem(`STAY_CONNECTED_${process.env.NEXT_PUBLIC_APP_NAME}`);
    if (stayConnectedValue) {
      setStayConnected(JSON.parse(stayConnectedValue));  // Converte de string para boolean
    }
  }, []);

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {

    if (!email || email === '' || !validateEmail(email)) {
      setError('Informe um e-mail válido');
      setTimeout(() => setError(undefined), 3000);
      return;
    }

    if (!password || password === '') {
      setError('Informe uma senha válida');
      setTimeout(() => setError(undefined), 3000);
      return;
    }

    if (!validateStrongPassword(password)) {
      setError('A senha deve conter ao menos uma letra maiúscula');
      setTimeout(() => setError(undefined), 3000);
      return;
    }

    setIsLoading(true);
    const response = await login(email, password);
    if (response.status) {

      // Veirifica se o OTP está habilitada
      if (response.data.twoFactorActive) {
        setRequiresOtp(true);
        setIsLoading(false);
        return;
      } else {
        setRequiresOtp(false);
        toast.success('Login bem sucedido!');
        const userAuthData = response.data;

        setUser(userAuthData);
        handleSetToken(userAuthData);
        clearFields();

        if (returnParam) {
          window.location.href = returnParam;
        } else {
          window.location.href = '/minha-conta';
        }
      }
    } else {
      setIsLoading(false);
      setError(response.data.Message);
      setTimeout(() => setError(undefined), 3000);
    }
    setIsLoading(false);
  }

  const handleFinalizeAuth = async () => {
    if (!otp || otp === '') {
      toast.error("Informe o código OTP corretamente");
      return;
    }
    const response = await finalizeAuthWithOtp(email, otp);

    if (response.status) {
      toast.success('Login bem sucedido!');
      const userAuthData = response.data;

      setUser(userAuthData);
      handleSetToken(userAuthData);
      clearFields();

      if (returnParam) {
        window.location.href = returnParam;
      } else {
        window.location.href = '/minha-conta';
      }
    } else {
      setError(response.data.Message);
      setTimeout(() => setError(undefined), 3000);
    }
  }

  const handleStayConnected = (e) => {
    const stayConnectedValue = e.target.checked;
    setStayConnected(stayConnectedValue);  // Atualiza o estado local
    localStorage.setItem(`STAY_CONNECTED_${process.env.NEXT_PUBLIC_APP_NAME}`, JSON.stringify(stayConnectedValue));
  }

  const clearFields = () => {
    setEmail('');
    setPassword('');
  }

  useEffect(() => {
    console.log(returnUrl)
    setReturnParam(returnUrl);
  }, [returnUrl])

  return (
    <Stack>
      <Stack sx={{ display: "flex", flexGrow: 1 }} my={2} alignItems={'center'}>
        <Link href="/" passHref>
          <img src={logo.src} alt="logo" width={210} />
        </Link>
      </Stack>
      <Typography textAlign={'center'} fontSize={{ xs: '1.5rem', sm: '2rem' }} color="initial">Seja Bem-vindo(a)!</Typography>
      <Typography variant="subtitle2" color="initial"></Typography>
      <Stack direction={'row'} py={2} spacing={1} alignItems={'center'} justifyContent={'center'}>
        <Typography variant="body2" color="initial">Ainda não tem uma conta?</Typography>
        <Link href="#"
          onClick={handleMode}><Typography variant="body2" color="primary">Faça seu cadastro</Typography></Link>
      </Stack>
      <Divider sx={{ mt: 1 }}>
        <Typography variant="body2" color="initial">
          ou acesse
        </Typography>
      </Divider>
      <Stack pt={4} spacing={3}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
          <OutlinedInput
            placeholder="Digite sua senha aqui"
            disabled={isLoading}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'ocultar senha' : 'exibir senha'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Senha"
          />
        </FormControl>
      </Stack>
      <Stack direction={'row'} py={2} spacing={2} alignItems={'center'}>
        <FormControlLabel
          control={<Checkbox
            onChange={handleStayConnected}
            size="small"
            sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
            checked={stayConnected} // Usa o valor de `stayConnected` armazenado no estado
          />}
          label={<Typography variant="body2">Continuar conectado</Typography>}
        />
        <Link href="#"
          onClick={handleOpenForgotPasswordModal}><Typography variant="body2" color="primary">Esqueci minha senha</Typography></Link>
      </Stack>
      {error && (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, -5, 5, -5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          <Stack py={2} display={'flex'} textAlign={'center'} justifyContent={'center'}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Stack>
        </motion.div>
      )}
      {requiresOtp && (
        <Stack spacing={2} mt={2}>
          <TextField
            label="Código OTP"
            variant="outlined"
            size="small"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <LoadingButton
            onClick={handleFinalizeAuth}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              py: 1,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'primary.dark' },
            }}  
          >
            Confirmar Código
          </LoadingButton>
        </Stack>
      )}

      {!requiresOtp && (
        <Stack pt={1}>
          <LoadingButton
            loading={isLoading}
            onClick={handleLogin}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              py: 1,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Entrar
          </LoadingButton>
        </Stack>
      )}

      <ForgotPasswordModal open={openForgotPasswordModal} handleClose={handleCloseForgotPasswordModal} />
    </Stack>
  );
}
