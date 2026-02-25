import { useCampaign } from "@/context/CampaignContext";
import { useLeverageRequest } from "@/context/LeverageRequestContext";
import { useLoading } from "@/context/LoadingContext";
import { Circle } from "@mui/icons-material";
import { Box, Button, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function UpSellByPlan() {

  const theme = useTheme();

  const router = useRouter();
  const { id } = router.query;

  const isMounted = useRef(true);

  const { handleOpenLeverageRequestModal,
    handleAddLeverageRequest, leverageRequest,
    setSented,
    planId } = useLeverageRequest();
  const { handleLoading, handleCloseLoading } = useLoading();
  const { handleGetPlans } = useCampaign();

  const [campaignId, setcampaignId] = useState(id);
  const [plans, setPlans] = useState();

  const handleLeverageRequestForm = async (data) => {

    if (!data || !planId) return;

    // Certifique-se de que formdata é um objeto
    const formDataInstance = new FormData();
    formDataInstance.append('CampaignId', campaignId);
    formDataInstance.append('PlanId', planId);

    // Converte os campos do objeto data para FormData
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Se o campo for 'files', adiciona os arquivos individualmente
        if (key === 'files' && Array.isArray(data[key])) {
          data[key].forEach(file => {
            formDataInstance.append('files', file); // Adiciona cada arquivo ao FormData
          });
        } else {
          formDataInstance.append(key, data[key]); // Para outros campos, apenas adiciona normalmente
        }
      }
    }


    handleLoading();
    const response = await handleAddLeverageRequest(formDataInstance);

    if (response.status) {
      setSented(true);
    } else {
      toast.error('Não foi possível enviar sua Kaixinha foi enviada para analise');
    }

    handleCloseLoading();
    setSented(true);
  }

  const listOfResourcePlans = (resource, listOfBenefits) => {
    return (
      <>
        <Stack direction={'row'} spacing={1} alignItems={'start'}>
          <Typography variant="subtitle2" textAlign={'justify'} fontWeight={400} color="initial">{resource}</Typography>
        </Stack>
        <Divider><Typography variant="body2" sx={{ my: 1 }} color="initial">Benefícios</Typography></Divider>
        <Stack direction={'column'} spacing={1} alignItems={'start'}>
          {listOfBenefits && listOfBenefits.map((benefit, index) =>
            <Stack direction={'row'} spacing={1} alignItems={'center'} key={index}>
              <Circle color="primary" sx={{ width: 8, height: 8 }} />
              <Typography variant="subtitle2" fontWeight={400} color="initial">{benefit}</Typography>
            </Stack>
          )}
        </Stack>
      </>
    );
  }

  const getPlans = async () => {
    handleLoading();
    const response = await handleGetPlans();

    if (response.status) {
      setPlans(response.data.plans);
    }

    handleCloseLoading();
  }

  useEffect(() => {
    handleLeverageRequestForm(leverageRequest);
  }, [leverageRequest]);

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      getPlans();
    }
  }, []);

  useEffect(() => {
    if (id) {
      setcampaignId(id);
    }
  }, [id]);

  return (
    <Container maxWidth="md"
      sx={{
        mt: 2,
        mb: 4,
      }}
    >
      <Stack direction={'row'} alignItems={'center'} spacing={1}>
        <Typography variant="h4" fontWeight={600} color="initial">Pra cima!!</Typography>
        <img src="/assets/emojis/rocket.png" width={50} />
      </Stack>
      <Stack>
        <Typography variant="subtitle1" color="initial">Você está prestes a destacar ao máximo sua vaquinha</Typography>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack>
        <Typography variant="h5" color="initial" textAlign={'center'}>Vamos alanvar sua
          <span style={{ color: theme.palette.primary.main }}>&nbsp;Kaixinha</span></Typography>

        <Grid container spacing={2} mt={2}>
          <Grid container item xs={12} justifyContent="center" spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: 'solid 1px #d4d4d4', borderRadius: 1 }}>
                {plans && (
                  <>
                    <Typography variant="subtitle1" color="initial">{plans[0].title}</Typography>
                  </>
                )}

                <Divider sx={{ my: 1 }} />
                {plans && (
                  <>
                    {listOfResourcePlans(plans[0].description, plans[0].benefits)}
                  </>
                )}

                <Divider sx={{ my: 1 }} />
                <Stack direction={'row'} justifyContent={'center'}>
                  <Link href='#'>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 1,
                        my: 1,
                        mr: 1,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                      onClick={() => handleOpenLeverageRequestModal(plans[0].id)}
                    >
                      Quero alavancar
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: 'solid 1px #d4d4d4', borderRadius: 1 }}>
                {plans && (
                  <>
                    <Typography variant="subtitle1" color="initial">{plans[1].title}</Typography>
                  </>
                )}
                <Divider sx={{ my: 1 }} />
                {plans && (
                  <>
                    {listOfResourcePlans(plans[1].description, plans[1].benefits)}
                  </>
                )}
                <Divider sx={{ my: 1 }} />
                <Stack direction={'row'} justifyContent={'center'}>
                  <Link href='#'>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 1,
                        my: 1,
                        mr: 1,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                      onClick={() => handleOpenLeverageRequestModal(plans[1].id)}
                    >
                      Quero alavancar
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Box sx={{ p: 2, border: 'solid 1px #d4d4d4', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="initial">Padrão</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="initial">
                  Pode deixar, eu mesmo divulgo minha kaixinha 😉
                </Typography>
                <Stack mt={2} direction={'row'} display={'flex'} justifyContent={'end'}>
                  <Link href="/minha-conta">
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
                    >
                      Voltar para meu perfil
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Grid container item xs={12} justifyContent="center">

          </Grid>
        </Grid>

      </Stack>
    </Container>
  );
}