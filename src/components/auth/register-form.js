import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { validateCNPJ, validateCPF, validateEmail, validateStrongPassword } from "@/utils/functions";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Divider,
  FormControl,
  FormHelperText,
  IconButton, InputAdornment,
  InputLabel, Link, OutlinedInput,
  Stack, TextField, Typography
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import logo from './../../assets/images/logo0.png';

export default function RegisterForm({ handleMode }) {
  // Definindo os estados para os campos de entrada
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { register, setUser } = useUser();
  const { handleSetToken } = useAuth();

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleMakeRegistration = async () => {

    if (!name || name === '') {
      toast.error('Informe o nome corretamente');
      return;
    }

    if (!email || email === '' || !validateEmail(email)) {
      toast.error('Informe um e-mail válido');
      return;
    }

    if (!documentId || documentId === '') {
      toast.error('Informe um CPF/CNPJ válido');
      return;
    }

    if (documentId.length === 11) {
      if (!validateCPF(documentId)) {
        toast.error('Informe um CPF válido');
        return;
      }
    } else if (documentId.length === 14) {
      if (!validateCNPJ(documentId)) {
        toast.error('Informe um CNPJ válido');
        return;
      }
    }

    if (!password || password === '') {
      toast.error('Informe uma senha válida');
      return;
    }

    if (!validateStrongPassword(password)) {
      toast.error('A senha deve conter ao menos uma letra maiúscula');
      return;
    }

    setIsLoading(true);
    const response = await register(name, email, documentId, password);
    if (response.status) {
      toast.success('Usuário registrado com sucesso');
      const userAuthData = response.data;
      handleMode();
      setUser(userAuthData);
      handleSetToken(userAuthData);
      clearFields();
    } else {
      setError(response.data);
      setTimeout(() => setError(undefined), 3000);
    }
    setIsLoading(false);
  }

  const clearFields = () => {
    setName('');
    setEmail('');
    setDocumentId('');
    setPassword('');
  }

  return (
    <Stack>
      <Stack sx={{ display: "flex", flexGrow: 1 }} my={2} alignItems={'center'}>
        <Link href="/" passHref>
          <img src={logo.src} alt="logo" width={210} />
        </Link>
      </Stack>
      <Typography textAlign={'center'} fontSize={{ xs: '1.5rem', sm: '2rem' }} color="initial">Faça seu cadastro</Typography>
      <Stack direction={'row'} py={2} spacing={1} alignItems={'center'} justifyContent={'center'}>
        <Typography variant="body2" color="initial">Já tem uma conta?</Typography>
        <Link href="#"
          onClick={handleMode}><Typography variant="body2" color="primary">Faça login</Typography></Link>
      </Stack>
      <Divider sx={{ mt: 1 }}>
        <Typography variant="body2" color="initial">
          ou continue
        </Typography>
      </Divider>
      <Stack direction={'column'} pt={4} spacing={3}>
        <TextField
          disabled={isLoading}
          size="small"
          label="Nome completo"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          disabled={isLoading}
          size="small"
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          disabled={isLoading}
          size="small"
          label="CPF ou CNPJ"
          variant="outlined"
          type="number"
          value={documentId}
          helperText="Não coloque pontuação"
          onChange={(e) => setDocumentId(e.target.value)}
        />
      </Stack>
      <Stack direction={'row'} mt={2} spacing={2}>
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password"
            sx={{ transform: 'translate(14px, -6px) scale(0.75)' }}>Senha</InputLabel>
          <OutlinedInput
            placeholder="Digite sua senha aqui"
            id="outlined-adornment-password"
            disabled={isLoading}
            size="small"
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
          <FormHelperText>Deve conter letra maiúscula e minúsculas e 8 caracteres</FormHelperText>
        </FormControl>
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
      <Stack pt={1}>
        <LoadingButton
          loading={isLoading}
          onClick={handleMakeRegistration}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 1,
            fontSize: '1rem',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Entrar
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
