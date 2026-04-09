import { AssignmentInd, CalendarToday, CardGiftcard, ContactMail, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import ButtonHandleNextStepper from "./btn-handle-next";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { validateCNPJ, validateCPF, validateEmail, validateStrongPassword } from "@/utils/functions";

import InputMask from 'react-input-mask';
import CpfCnpjDocumentIdCompoenent from "@/components/inputs/cpfCnpj";

export default function CampaignStepperOne({
  title, goalRaw, deadLine, name, documentId, email, password,
  handleSetTitle,
  handleSetGoal,
  handleSetDeadLine,
  handleSetName,
  handleSetDocumentId,
  handleSetEmail,
  handleSetPassword,
  handleNext
}) {

  const isMounted = useRef(true);
  const [isLogged, setIsLogged] = useState(true);
  const { getToken, validateTokenWithOutRedirect } = useAuth();

  const [createHow, setCreateHow] = useState('cpf');

  const handleChangeCreateHow = (event) => {
    setCreateHow(event.target.value);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const formatCurrency = (value) => {
    // Remove caracteres não numéricos
    const cleanedValue = value.replace(/\D/g, "") || "0";
    const number = parseFloat(cleanedValue) / 100; // Converte para centavos
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }); // Retorna apenas o valor formatado, sem o prefixo de moeda
  };

  const handleChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    handleSetGoal(inputValue); // Atualiza o estado apenas com números
  };

  const handleValidateNext = () => {

    const goal = parseFloat(goalRaw.replace(/\D/g, "")) / 100;

    if (isNaN(goal) || goal < 1500) {
      toast.error('Defina uma meta com ao menos R$ 1.500,00 reais');
      return;
    }

    if (!title && title === '' || title.length < 10) {
      toast.error('Fornceça um título válido com ao menos 10 caracteres');
      return;
    }

    if (!isLogged) {
      if (name === '') {
        toast.error('Fornceça seu nome completo');
        return;
      }

      if (!documentId || documentId === '' && (documentId !== 11 || documentId !== 14)) {
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

      if (email === '' || !validateEmail(email)) {
        toast.error('Forneça um email válido');
        return;
      }

      if (!password || password === '') {
        toast.error('Informe uma senha válida');
        return;
      }

      if (!validateStrongPassword(password)) {
        toast.error('A senha deve conter ao menos uma letra maiúscula');
        return;
      }
    }

    handleNext();
  }

  useEffect(() => {

    const verifyUserToken = async () => {
      var result = await validateTokenWithOutRedirect();
      if (!result) {
        setIsLogged(false);
      }
    }

    if (isMounted.current) {
      isMounted.current = false;
      verifyUserToken();
    }
  }, [getToken]);

  return (
    <Box>
      <Stack mt={1} sx={{ maxWidth: 380 }} display={"flex"} alignItems={"center"}>
        <Typography variant="h4" color="initial">Vamos criar sua Campanha</Typography>
        <Typography mt={1} variant="body2" color="initial">
          Estamos aqui para apoiar você durante essa jornada.
        </Typography>
      </Stack>
      <Stack my={3} sx={{ maxWidth: 380 }}>
        <Typography variant="h5" color="primary">Quanto é preciso arrecadar?</Typography>
        <Typography mt={1} variant="body2" color="initial">
          Defina sua meta para que doadores possam saber quanto falta para você chegar lá.
          Você pode editar esse valor quando quiser.
        </Typography>
        <TextField
          size="small"
          sx={{ mt: 2 }}
          id="outlined-basic"
          label="Meta"
          variant="outlined"
          value={formatCurrency(goalRaw)} // Exibição formatada
          onChange={handleChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>, // R$ fixo aqui
          }}
        />
      </Stack>
      <Stack my={3} sx={{ maxWidth: 380 }}>
        <Typography variant="h5" color="primary">Defina um nome para sua Campanha</Typography>
        <TextField
          size="small"
          sx={{ mt: 2 }}
          id="outlined-basic"
          label="Titulo da sua Campanha"
          variant="outlined"
          value={title}
          onChange={(e) => handleSetTitle(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><CardGiftcard /></InputAdornment>, // R$ fixo aqui
          }}
        />
        <Typography mt={3} variant="body2" fontSize={{ xs: '0.675rem', sm: '0.675rem' }} color="initial">
          Ao clicar no botão abaixo você declara que é maior de 18 anos,
          leu e está de acordo com os <Link href="#">Termos, Taxas, Prazos e Regulamentos</Link>.
        </Typography>
      </Stack>
      <Stack my={3} sx={{ maxWidth: 380 }}>
        <Typography variant="h5" color="primary">Defina um prazo (minímo 7 dias)</Typography>
        <TextField
          size="small"
          sx={{ mt: 2 }}
          id="outlined-basic"
          label="Prazo (em dias)"
          variant="outlined"
          type="number"
          value={deadLine}
          onChange={(e) => handleSetDeadLine(parseInt(e.target.value))} // Garante que o valor esteja entre 7 e 120
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday />
              </InputAdornment>
            ),
          }}
          inputProps={{
            min: 7, // Define o valor mínimo permitido
            max: 120, // Define o valor máximo permitido
          }}
        />
        <Typography mt={3} variant="body2" fontSize={{ xs: '0.675rem', sm: '0.675rem' }} color="initial">
          Ao clicar no botão abaixo você declara que é maior de 18 anos,
          leu e está de acordo com os <Link href="#">Termos, Taxas, Prazos e Regulamentos</Link>.
        </Typography>
      </Stack>
      {!isLogged && (
        <>
          <Stack my={3} sx={{ maxWidth: 380 }}>
            <Typography variant="h5" color="primary">Qual o seu nome completo?</Typography>
            <TextField
              size="small"
              sx={{ mt: 2 }}
              id="outlined-basic"
              label="Seu nome completo"
              variant="outlined"
              value={name}
              onChange={(e) => handleSetName(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Person /></InputAdornment>, // R$ fixo aqui
              }}
            />
          </Stack>
          <Stack my={3} sx={{ maxWidth: 380 }}>
            <FormGroup>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Criar como</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={createHow}
                  onChange={handleChangeCreateHow}
                >
                  <FormControlLabel value="cpf" control={<Radio />} label="Pessoa Física" />
                  <FormControlLabel value="cnpj" control={<Radio />} label="Pessoa Jurídica" />
                </RadioGroup>
              </FormControl>
            </FormGroup>
          </Stack>
          <Stack my={3} sx={{ maxWidth: 380 }}>
            <Typography variant="h6" color="primary">Qual seu número do {createHow === 'cpf' ? 'CPF' : 'CNPJ'}?</Typography>
            <CpfCnpjDocumentIdCompoenent
              documentId={documentId}
              setDocumentId={handleSetDocumentId}
              mask={createHow === 'cpf' ? '999.999.999-99' : '99.999.999/9999-99'}
            />
          </Stack>
          <Stack my={3} sx={{ maxWidth: 380 }}>
            <Typography variant="h6" color="primary">Qual o seu e-mail?</Typography>
            <TextField
              sx={{ mt: 2 }}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => handleSetEmail(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><ContactMail /></InputAdornment>, // R$ fixo aqui
              }}
            />
          </Stack>
          <Stack my={3} sx={{ maxWidth: 380 }}>
            <Typography variant="h6" color="primary">Crie uma senha</Typography>
            <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
              <OutlinedInput
                placeholder="Digite sua senha aqui"
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleSetPassword(e.target.value)}
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
        </>
      )}
      <Stack sx={{ maxWidth: 380 }}>
        <ButtonHandleNextStepper handleNext={handleValidateNext} />
      </Stack>
    </Box>
  );
}
