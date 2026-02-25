import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Divider, Stack, IconButton } from '@mui/material';
import { useLeverageRequest } from '@/context/LeverageRequestContext';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { CheckCircle, Close, Delete } from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  px: 2,
  py: 2,
  borderRadius: 2,
  maxHeight: '80%',
  overflow: 'auto'
};

const LeverageRequestModal = () => {

const theme = useTheme();

  const { openModal, handleCloseLeverageRequestModal, onSubmitForm, sented } = useLeverageRequest();

  const [formData, setFormData] = useState({
    phone: '',
    hasSharedCampaign: false,
    evidenceLinks: '',
    files: [],
    wantsToBoost: false,
    preferredContactMethod: ''
  });

  const handleChange = (e) => {
    if (typeof e === 'string') {

      if(!isValidPhoneNumber(e)){
        return;
      }

      // Handle PhoneInput changes
      setFormData({
        ...formData,
        phone: e,
      });
    } else {
      if (typeof e === 'undefined')
        return;

      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: name === 'hasSharedCampaign' || name === 'wantsToBoost' ? value === 'true' : value,
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData({
        ...formData,
        files: [...formData.files, ...files],
      });
    }
  };

  const handleRemoveFile = (index) => {
    const updatedevidenceLinks = formData.files.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      files: updatedevidenceLinks,
    });
  };

  const handleSubmit = () => {
    onSubmitForm(formData);
  };

  const handleGoToMyCampaings = () => {
    window.location.href = '/minha-conta';
    handleCloseLeverageRequestModal();
  }

  return (
    <Modal open={openModal}>
      <Box sx={modalStyle}>
        {!sented && (
          <>
            <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography fontSize={{ xs: '1.25rem', sm: '1.5rem' }} component="h2">
                Preencha o formulário
              </Typography>
              <IconButton aria-label="delete" onClick={handleCloseLeverageRequestModal}>
                <Close color='error' />
              </IconButton>
            </Stack>
            <Typography fontSize={{ xs: '0.785rem', sm: '0.875em' }} component="h2" gutterBottom>
              Ao preencher esse formulário nós analisaremos todas as informações e iremos entrar em contato
              sobre o pedido de alavancagem da sua Kaixinha.
            </Typography>
            <Divider sx={{ mt: 1, mb: 1 }} />

            <Stack sx={{ width: '100%' }} direction={'row'} display={'flex'} justifyContent={'center'}>
              <PhoneInput
                defaultCountry="BR"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%', // Faz o input ocupar toda a largura do container
                  maxWidth: '30ch', // Define um limite máximo
                  padding: '4px 8px', // Aumenta o espaço interno
                  fontSize: '1rem', // Tamanho da fonte
                  border: '1px solid #0d0d0d', // Define bordas
                  borderRadius: '4px', // Bordas arredondadas
                  boxSizing: 'border-box', // Inclui padding no cálculo da largura
                }} />
            </Stack>

            <FormControl component="fieldset" fullWidth margin="normal">
              <Typography component="legend" fontSize={{ xs: '0.885rem', sm: '1rem' }}>Você já compartilhou a campanha?</Typography>
              <RadioGroup
                row
                name="hasSharedCampaign"
                value={formData.hasSharedCampaign}
                onChange={handleChange}
              >
                <FormControlLabel value={true} control={<Radio size="small" />} label="Sim" />
                <FormControlLabel value={false} control={<Radio size="small" />} label="Não" />
              </RadioGroup>
            </FormControl>

            {formData.hasSharedCampaign && (
              <>
                <TextField
                  label="Links ou prints como evidência (opcional)"
                  name="evidenceLinks"
                  value={formData.evidenceLinks}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mt: 1, color: '#FFF' }}
                >
                  Adicionar Imagens
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
                <Stack spacing={1} mt={2}>
                  {formData.files.map((file, index) => (
                    <Box key={index} display="flex" alignItems="center" justifyContent="space-between" border="1px solid #ddd" p={1} borderRadius={1}>
                      <Typography variant="body2" noWrap>{file.name}</Typography>
                      <IconButton onClick={() => handleRemoveFile(index)} size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </>
            )}

            <FormControl component="fieldset" fullWidth margin="normal">
              <Typography component="legend" fontSize={{ xs: '0.885rem', sm: '1rem' }}>Gostaria de acelerar a arrecadação?</Typography>
              <RadioGroup
                row
                name="wantsToBoost"
                value={formData.wantsToBoost}
                onChange={handleChange}
              >
                <FormControlLabel value={true} control={<Radio size="small" />} label="Sim" />
                <FormControlLabel value={false} control={<Radio size="small" />} label="Não" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal">
              <Typography component="legend" fontSize={{ xs: '0.885rem', sm: '1rem' }}>Como podemos entrar em contato com você?</Typography>
              <RadioGroup
                row
                name="preferredContactMethod"
                value={formData.preferredContactMethod}
                onChange={handleChange}
              >
                <FormControlLabel value="call" control={<Radio size="small" />} label="Ligação" />
                <FormControlLabel value="whatsapp" control={<Radio size="small" />} label="Whatsapp" />
                <FormControlLabel value="email" control={<Radio size="small" />} label="Email" />
              </RadioGroup>
            </FormControl>

            <Button variant="contained" color="primary" fullWidth sx={{ color: '#FFF' }}
              onClick={handleSubmit}>
              Enviar
            </Button>
          </>
        )}
        {sented && (
          <>
            <Stack spacing={2} alignItems={'center'}>
              <CheckCircle color='success' sx={{ width: 48, height: 48 }} />
              <Typography variant="h6" color="initial">
                Sua caixinha foi enviada para análise!
              </Typography>
            </Stack>
            <Stack mt={2} direction={'row'} display={'flex'} justifyContent={'center'}>
                <Button
                  variant="outlined"
                  sx={{
                    py: 1,
                    my: 1,
                    mr: 1,
                    backgroundColor: theme.palette.light.main,
                    color: theme.palette.dark.main,
                    borderColor: theme.palette.dark.text,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: theme.palette.dark.text,
                      color: theme.palette.light.main
                    },
                  }}
                  onClick={handleGoToMyCampaings}
                >
                  Ver minhas kaixinhas
                </Button>
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default LeverageRequestModal;
