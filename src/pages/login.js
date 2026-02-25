import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Box, Container } from "@mui/material";
import { useState } from "react";

export default function Login() {

  const [mode, setMode] = useState('login');

  const handleMode = () => {
    if(mode === 'login') setMode('register');
    else setMode('login');
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: 10,
          display: 'flex',
          justifyContent: 'center'
        }}>
        {mode === 'login' && (<LoginForm handleMode={handleMode} />)}
        {mode === 'register' && (<RegisterForm handleMode={handleMode}/>)}
      </Box>
    </Container>
  );
}