import { useCampaign } from "@/context/CampaignContext";
import { useDefineValueOfDonation } from "@/context/DefineValueOfDonationContext";
import { useLoading } from "@/context/LoadingContext";
import { formatCurrency } from "@/utils/functions";
import { CardGiftcard, CheckCircle } from "@mui/icons-material";
import { Box, Button, InputAdornment, Modal, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MakeSmallDonationMoal = ({ campaignId, open, onClose, updateSmallDonation }) => {

  const { makeSmallDonation } = useCampaign();
  const { handleLoading, handleCloseLoading } = useLoading();

  const [amount, setAmount] = useState(0);
  const [donationSuccessfull, setDonationSuccessfull] = useState(false);

  const handleMakeSmallDonation = async () => {

    handleLoading();
    const response = await makeSmallDonation(campaignId, amount);

    if (response.status) {
      setDonationSuccessfull(true);
      updateSmallDonation(amount);
    } else {
      toast.error("Erro ao fazer a contribuição, verifique se tem Campanhas suficientes");
    }

    handleCloseLoading();
  }

  const handleOnClose = () => {
    setDonationSuccessfull(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {!donationSuccessfull && (
          <>
            <Typography textAlign={'center'} variant="h5" fontWeight={400} component="h2">
              Contribuir com Campanhas
            </Typography>
            <Typography textAlign={'center'}>
              Você está perto de fazer uma boa ação
            </Typography>
            <Typography variant="body2" textAlign={'center'} mt={3}>
              Informe a quantidade de Campanhas que você quer doar
            </Typography>
            <Stack direction={'row'} display={'flex'} justifyContent={'center'}>
              <TextField
                size="small"
                sx={{ mt: 2 }}
                id="outlined-basic"
                label="Quantidade"
                variant="outlined"
                value={amount} // Exibição formatada
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    setAmount(parseInt(e.target.value))
                  }
                }}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <CardGiftcard color="primary" fontSize="small" />
                  </InputAdornment>,
                }}
              />
            </Stack>
            <Typography mt={1} variant="body2" color="initial">Como isso ajuda as campanhas?</Typography>
            <Typography mt={1} variant="body2" fontSize={12} color="initial">As Campanhas garantem alimentação e cuidados médicos.</Typography>
            <Typography variant="body2" fontSize={12} color="initial">Ajudam a manter o abrigo e o bem-estar das vaquinhas.</Typography>
            <Typography variant="body2" fontSize={12} color="initial">Contribuem para projetos de preservação e sustentabilidade.</Typography>
            <Stack mt={1} direction={'row'} display={'flex'} justifyContent={'space-between'}>
              <Button
                variant="text"
                color="text"
                sx={{
                  py: 1,
                  my: 1,
                  fontSize: '1rem',
                }}
                onClick={onClose}
              >
                Cancelar
              </Button>
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
                onClick={handleMakeSmallDonation}
              >
                Continuar
              </Button>
            </Stack>
          </>
        )}
        {donationSuccessfull && (
          <Stack alignItems={'center'} spacing={1}>
            <Stack direction={'column'} display={'flex'} alignItems={'center'}>
              <CheckCircle fontSize="large" color="success" />
            </Stack>
            <Typography textAlign={'center'} variant="h5" fontWeight={400} component="h2">
              Parabéns
            </Typography>
            <Typography mt={1} variant="body2" color="initial">Você acaba de contribuir com {amount} Campanha {amount > 1 && (<>s</>)}</Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                color: 'white',
                my: 1,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
              onClick={handleOnClose}
            >
              Fechar
            </Button>
          </Stack>
        )}
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