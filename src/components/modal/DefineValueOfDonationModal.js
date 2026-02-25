import { useDefineValueOfDonation } from "@/context/DefineValueOfDonationContext";
import { centsToDecimal, formatCurrency } from "@/utils/functions";
import { Box, Button, InputAdornment, Modal, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const DefineValueOfDonationModal = () => {

  const router = useRouter();
  const { open, campaign, imagesOfCampaign, handleCloseDefineValueOfDonation } = useDefineValueOfDonation();

  const [value, setValue] = useState('0');

  const handleChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    setValue(inputValue); // Atualiza o estado apenas com números
  };

  const handleGoToCheckout = () => {
    const sanitizedValue = value ? parseInt(value, 10) : 0;
    const minValue = parseInt(process.env.NEXT_PUBLIC_MIN_VALUE_OF_DONATION_IN_CENTS, 10);

    if (isNaN(sanitizedValue) || isNaN(minValue)) {
      toast.error("Erro ao validar os valores. Por favor, tente novamente.");
      return;
    }

    if (sanitizedValue < minValue) {
      toast.error(`Defina um valor acima de R$ ${centsToDecimal(minValue)}`);
      return;
    }

    handleCloseDefineValueOfDonation();

    // Coleta os parâmetros UTM da URL atual
    const payload = {
      ...router.query, // Inclui todos os parâmetros da query atual
      id: campaign.id,
      slug: campaign.slug,
      image: imagesOfCampaign[0],
      value: sanitizedValue.toString(),
    };

    console.log("Redirecionando para checkout com payload:", payload);

    router.push({
      pathname: `/vaquinha/checkout/${campaign.slug}`,
      query: payload,
    });
  };



  return (
    <Modal
      open={open}
      onClose={handleCloseDefineValueOfDonation}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography textAlign={'center'} variant="h5" fontWeight={400} component="h2">
          Quero Doar
        </Typography>
        <Typography textAlign={'center'}>
          Você está perto de fazer uma boa ação
        </Typography>
        <Typography variant="body2" textAlign={'center'} mt={3}>
          Informe o valor da doação abaixo:
        </Typography>
        <Stack>
          <TextField
            size="small"
            sx={{ mt: 2 }}
            id="outlined-basic"
            label="Valor"
            variant="outlined"
            value={formatCurrency(value)} // Exibição formatada
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>, // R$ fixo aqui
            }}
          />
        </Stack>
        <Typography mt={1} variant="body2" color="initial">Valores mínimos para doação:</Typography>
        <Typography mt={1} variant="body2" fontSize={12} color="initial">Pix - doe a partir de {centsToDecimal(parseInt(process.env.NEXT_PUBLIC_MIN_VALUE_OF_DONATION_IN_CENTS))}</Typography>
        <Typography variant="body2" fontSize={12} color="initial">Cartão de crédito, Boleto, PayPal - {centsToDecimal(parseInt(process.env.NEXT_PUBLIC_MIN_VALUE_OF_DONATION_IN_CENTS))}</Typography>
        <Typography variant="body2" fontSize={12} color="initial">Carteira - doe qualquer valor (utilize seus créditos)</Typography>
        <Stack mt={1} direction={'row'} display={'flex'} justifyContent={'end'}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              color: 'white',
              py: 1,
              my: 1,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            onClick={handleGoToCheckout}
          >
            Continuar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  px: 4,
  py: 2,
  borderRadius: 2,
};