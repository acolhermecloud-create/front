import React, { useEffect, useRef, useState } from 'react';
import { Typography, Divider, Grid, TextField, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { validateCNPJ, validateCPF, validateEmail } from '@/utils/functions';

const PersonalInfoForm = () => {

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');


  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  const [loggedUser, setLoggedUser] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useRef(true);
  const { getToken, handleSetToken } = useAuth();
  const { update, updateAddress } = useUser();


  const makeValidation = () => {
    if (!name || name === '') {
      toast.error('Informe o nome corretamente');
      return false;
    }

    if (!email || email === '' || !validateEmail(email)) {
      toast.error('Informe um e-mail válido');
      return false;
    }

    if (!documentId || documentId === '') {
      toast.error('Informe um CPF/CNPJ válido');
      return false;
    }

    if (documentId.length === 11) {
      if (!validateCPF(documentId)) {
        toast.error('Informe um CPF válido');
        return false;
      }
    } else if (documentId.length === 14) {
      if (!validateCNPJ(documentId)) {
        toast.error('Informe um CNPJ válido');
        return false;
      }
    }

    if (!phone || phone === '') {
      toast.error('Informe um Telefone válido');
      return false;
    }

    if (!zipCode || zipCode === '') {
      toast.error('Informe um CEP válido');
      return false;
    }

    if (!street || street === '') {
      toast.error('Informe um Rua válida');
      return false;
    }

    if (!city || city === '') {
      toast.error('Informe um Rua válida');
      return false;
    }

    if (!state || state === '') {
      toast.error('Informe um Estado válida');
      return false;
    }

    if (!country || country === '') {
      toast.error('Informe um País válida');
      return false;
    }

    return true;
  }

  const handleUpdate = async () => {

    const validation = makeValidation();
    if (!validation) return;
    setIsLoading(true);

    const resUpdateUser = update(id, name, email, documentId, phone);
    const resUpdateAddress = updateAddress(id, street, city, state, zipCode, country);

    const response = await Promise.all([resUpdateUser, resUpdateAddress]);

    if (response[0].status && response[1].status) {
      let updatedUser = loggedUser;
      updatedUser.name = name;
      updatedUser.email = email;
      updatedUser.phone = phone;
      updatedUser.address = { street, city, state, zipCode, country };
      handleSetToken(updatedUser);
      toast.success('Atualizado com sucesso');
    }
    setIsLoading(false);
  }

  const consultarCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.error) return null;
      else return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const zipCodeNumbersOnly = zipCode.replace(/\D/g, "")
    if (zipCodeNumbersOnly && zipCodeNumbersOnly.length === 8) {
      consultarCep(zipCodeNumbersOnly).then(cepData => {
        if (cepData) {
          setStreet(cepData.logradouro);
          setCity(cepData.localidade);
          setState(cepData.estado);
          setCountry('Brasil');
        }
      });
    }
  }, [zipCode])


  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      const loggedData = getToken();

      if(!loggedData) return;

      setId(loggedData.id);
      setName(loggedData.name);
      setDocumentId(loggedData.documentId);
      setEmail(loggedData.email);
      setPhone(loggedData.phone);
      if (loggedData.address) {
        setZipCode(loggedData.address.zipCode);
        setStreet(loggedData.address.street);
        setCity(loggedData.address.city);
        setState(loggedData.address.state);
        setCountry(loggedData.address.country);
      }
      setLoggedUser(loggedData);
    }
  }, [getToken]);

  return (
    <div>
      <Typography variant="h5" color="initial">Minhas informações</Typography>

      <Divider sx={{ mt: 2, mb: 2 }} textAlign="left">
        <Typography variant="subtitle2" fontWeight={300} color="primary">Dados pessoais</Typography>
      </Divider>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            required
            id="txt-name"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            id="txt-documentid"
            label="CPF/CNPJ"
            value={documentId}
            disabled
            onChange={(e) => setDocumentId(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6} mt={2}>
          <TextField
            fullWidth
            size="small"
            required
            id="txt-email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6} mt={2}>
          <TextField
            fullWidth
            size="small"
            required
            id="txt-phone"
            label="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} mt={1}>
          <Divider textAlign="left">
            <Typography variant="body2" color="primary">Endereço</Typography>
          </Divider>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            id="txt-cep"
            label="CEP"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            fullWidth
            size="small"
            required
            id="txt-street"
            label="Rua"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6} mt={2}>
          <TextField
            fullWidth
            size="small"
            required
            id="txt-city"
            label="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6} mt={2}>
          <TextField
            fullWidth
            size="small"
            required
            id="txt-state"
            label="Estado"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6} mt={2}>
          <TextField
            fullWidth
            size="small"
            required
            id="txt-country"
            label="País"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Grid>
      </Grid>

      <Stack mt={2} direction={'row'} justifyContent={'end'}>
        <LoadingButton onClick={handleUpdate} loading={isLoading} variant="outlined">
          Salvar
        </LoadingButton>
      </Stack>
    </div>
  );
};

export default PersonalInfoForm;
