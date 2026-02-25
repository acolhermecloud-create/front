import { useEffect, useRef, useState } from "react";
import { Container, Typography, Box, Button, Card, CardContent, Grid, IconButton, Stack, TextField, useMediaQuery, Link, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { formatCurrency } from "@/utils/functions";
import { useStore } from "@/context/StoreContext";
import { useLoading } from "@/context/LoadingContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { CardGiftcard, CheckCircle, ContentCopy, PhoneAndroid, Pix, QrCode, Receipt, WhatsApp } from "@mui/icons-material";

export default function BuyKaixinhas({ campaignId }) {

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { validateTokenWithOutRedirect } = useAuth();
  const { getDigitalStickers, handleBuyDigitalSticker, checkDigitalStickers } = useStore();
  const { handleLoading, handleCloseLoading } = useLoading();

  const isMounted = useRef(true);

  const [plans, setPlans] = useState([]); // Dados vindos do backend
  const [planSelected, setPlanSelected] = useState(null); // ID do plano selecionado
  const [qtd, setQtd] = useState({}); // Quantidades de cada plano

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [transactionId, setTransactionId] = useState();
  const [qrCodeImage, setQrCodeImage] = useState();
  const [qrCode, setQrCode] = useState();

  const [showPayment, setShowPayment] = useState(false);

  const handleCardClick = (id) => {
    setPlanSelected(id);
    if (!qtd[id]) {
      setQtd((prevState) => ({ ...prevState, [id]: 1 })); // Inicializa a quantidade do plano clicado
    }
  };

  const handleQtdChange = (id, delta) => {
    setQtd((prevState) => ({
      ...prevState,
      [id]: Math.max(1, (prevState[id] || 1) + delta), // Garante que a quantidade nunca seja menor que 1
    }));
  };

  const handleBuy = async () => {

    handleLoading();
    const userIsLogged = await validateTokenWithOutRedirect();
    if (!userIsLogged) {
      toast.error("Faça o login para comprar kaixinhas");
      location.href = "/login";
      return;
    }

    if (planSelected) {

      const quantity = qtd[planSelected] || 1;

      const response = await handleBuyDigitalSticker(planSelected, quantity, campaignId ?? null);

      if (!response.status) {
        toast.error("Não foi possivel gerar PIX, tente novamente!");
        handleCloseLoading();
        return;
      }

      setQrCodeImage(response.data.transactionData.qRCode);
      setQrCode(response.data.transactionData.code);
      setTransactionId(response.data.transactionData.id);
      setShowPayment(true);

    }
    handleCloseLoading();
  };

  const handleGetDigitalStickers = async () => {
    handleLoading();
    try {
      const response = await getDigitalStickers();
      setPlans(response.data.digitalStickers); // Atualiza os planos com os dados do backend
    } catch (error) {
      console.error("Erro ao buscar os planos:", error);
    } finally {
      handleCloseLoading();
    }
  };

  const handleCheckPayment = async () => {
    if (!transactionId) return;

    const response = await checkDigitalStickers(transactionId);

    if (response.status) {
      if (response.data.payed) {
        setShowPayment(false);
        setPaymentConfirmed(true);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("QR Code copiado com sucesso!");
      })
      .catch((error) => {
        toast.error("Erro ao copiar o texto:", error);
      });
  };

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      handleGetDigitalStickers();
    }
  }, []);

  useEffect(() => {
    // Só executa o intervalo se transactionId estiver definido
    if (transactionId) {
      const interval = setInterval(async () => {
        if (!paymentConfirmed) {
          try {
            await handleCheckPayment(); // Aguarda a execução da função
          } catch (error) {
            console.error("Erro ao verificar o pagamento:", error);
          }
        }
      }, 2000);

      // Limpa o intervalo ao desmontar ou quando o pagamento for confirmado
      return () => clearInterval(interval);
    }
  }, [transactionId, paymentConfirmed]); // Dependências importantes  

  return (
    <>
      {!showPayment && !paymentConfirmed && (
        <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
          <Typography variant="body2" color="initial">
            Adquirir kaixinhas
          </Typography>
          <Typography variant="h6" color="initial">
            Turbine sua kaixinha agora mesmo e arrecade mais ainda!
          </Typography>
          <Typography mt={2} variant="subtitle1" color="initial">
            Escolha um pacote de kaixinhas e amplie as chances da sua campanha se destacar entre as mais queridas.
          </Typography>
          <Typography mt={4} variant="body2" fontWeight={800} color="initial">
            As vaquinhas mais populares ganham destaque especial no site, redes sociais e comunicações da nossa plataforma.
            Comece agora selecionando uma das opções abaixo e dê um boost na sua vaquinha:
          </Typography>

          <Grid container spacing={3} mt={1}>
            {plans && plans.map((plano) => (
              <Grid display={'flex'} justifyContent={'center'} item xs={12} sm={12} md={12} key={plano.id}>
                <Card
                  onClick={() => handleCardClick(plano.id)}
                  sx={{
                    maxWidth: 600,
                    minWidth: isMobile ? '100%' : 500,
                    cursor: "pointer",
                    border:
                      plano.id === planSelected
                        ? `3px solid ${theme.palette.primary.main}`
                        : "1px solid #ddd",
                    boxShadow:
                      plano.id === planSelected
                        ? "0 4px 12px rgba(25, 118, 210, 0.5)"
                        : "none",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Stack direction={'row'} display="flex" alignItems="center" justifyContent="space-between">
                        <CardGiftcard color="primary" />
                        <Typography color="primary" alignItems="center" variant="h6" fontWeight={600}>
                          {plano.qtd} Kaixinha{plano.qtd > 1 && "s"}
                        </Typography>
                      </Stack>
                      <Stack>
                        <Typography variant="body2" color="textSecondary">
                          por R$ {formatCurrency(`${(qtd[plano.id] || 1) * plano.price}`)}
                        </Typography>
                        {plano.cashBack > 0 && (
                          <Typography variant="body2"
                            fontSize={{ xs: '0.675rem', sm: '0.675rem' }} color="primary">
                            com cashback de R$ {formatCurrency(`${plano.cashBack}`)}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                    <Typography mt={2} variant="body2" color="initial">
                      {plano.description}
                    </Typography>
                    {plano.highlight && (
                      <Stack pt={1} direction={'row'}>
                        <Chip size="small" label={
                          <Typography variant="body2" fontSize={{ xs: '0.675rem', sm: '0.775rem' }} color="light">
                            Melhor oferta
                          </Typography>
                        } color="primary" />
                      </Stack>
                    )}

                    {/* Adiciona o contador quando o card está ativo */}
                    {plano.id === planSelected && (
                      <Box mt={2} display="flex" alignItems="center" justifyContent="center">
                        <IconButton
                          onClick={() => handleQtdChange(plano.id, -1)}
                          color="primary"
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1" mx={2}>
                          {qtd[plano.id] || 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQtdChange(plano.id, 1)}
                          color="primary"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </CardContent>
                  {plano.id === planSelected && (
                    <Box p={2}>
                      <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        style={{ color: "#fff" }}
                        onClick={handleBuy}
                      >
                        Destacar
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography mt={4} variant="body2" color="initial">
            Escolha seu pacote de kaixinhas e dê visibilidade à sua causa agora mesmo!
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'column' }} mt={2} spacing={2}>
            <Typography variant="subtitle2" fontWeight={700} color="initial">
              Está com dúvidas? Entre em contato conosco agora mesmo clicando no botão abaixo!
            </Typography>
            <Box sx={{display: 'flex', justifyContent: {xs: 'center', sm: 'start'}}}>
              <Button
                variant="contained"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsApp style={{ color: '#FFF' }} />}
                sx={{
                  px: 1,
                  py: 1,
                  fontSize: "0.875rem",
                  bgcolor: theme.palette.success.main,
                  color: '#FFF'
                }}
              >
                Fale conosco no WhatsApp
              </Button>
            </Box>
          </Stack>

          <Typography mt={2} variant="body2" fontWeight={500} color="initial">
            Ou, <Link href="/minha-conta">clique aqui </Link>para ir para sua conta
          </Typography>
        </Container>
      )}
      {showPayment && !paymentConfirmed &&
        (
          <>
            <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography id="modal-modal-title" variant="subtitle1" component="h2"
                  fontSize={{ xs: '0.875rem', sm: '1rem' }}>
                  Quase lá! Efetue o pagamento para terminar a transação ou <Link href="#" onClick={
                    () => {
                      setShowPayment(false);
                    }
                  }>Escolher outra opção</Link>
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 2 }} fontSize={{ xs: '0.675rem', sm: '1rem' }}>
                Agora escolha uma das opções abaixo para finalizar o pagamento:
              </Typography>
              <Grid container mt={2}>
                <Grid p={1} item xs={12} sm={6}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" color="initial">PIX Copia e Cola</Typography>
                    <Stack direction={'row'} spacing={2}>
                      <ContentCopy color="primary" />
                      <Typography variant="subtitle2" color="initial">
                        1. Copie o código abaixo
                      </Typography>
                    </Stack>
                    <Stack direction={'column'} spacing={2}>
                      <TextField size="small" fullWidth value={qrCode} disabled variant="outlined" />
                      <Button
                        style={{ color: "#FFF" }}
                        onClick={() => copyToClipboard(qrCode)} endIcon={<ContentCopy />} size="small" variant="contained">COPIAR CÓDIGO</Button>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                      <QrCode color="primary" />
                      <Typography variant="subtitle2" color="initial">
                        2. Abra o aplicativo do seu banco usando o seu celular;
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                      <Pix color="primary" />
                      <Typography variant="subtitle2" color="initial">
                        3. Entre na área PIX e escolha a opção PIX Copia e Cola;
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                      <Receipt color="primary" />
                      <Typography variant="subtitle2" color="initial">
                        4. Ao fazer o pagamento por PIX, aparecerá na tela da transação o nome Push in Pay como banco destinatário.
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid p={1} item xs={12} sm={6}
                  style={{ borderLeftWidth: !isMobile ? 2 : 0, borderLeftColor: '#D7D7D7', borderLeftStyle: 'solid' }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" color="initial">QR CODE</Typography>
                    <Stack direction={'row'} spacing={2}>
                      <PhoneAndroid color="primary" />
                      <Typography variant="subtitle2" color="initial">
                        1. Abra o aplicativo do seu banco usando o seu celular;
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                      <QrCode color="primary" />
                      <Typography variant="subtitle2" color="initial">
                        2. Entre na área PIX e selecione a opção de pagar com QR CODE;
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                      <Pix color="primary" />
                      <Typography variant="subtitle2" color="initial">
                        3. Escaneie o QR Code abaixo e confirme o pagamento. O nome que vai aparecer para você é Cash Time e em alguns casos Iugu Pagamentos
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} display={'flex'} justifyContent={'center'}>
                      <img src={qrCodeImage} style={{ maxWidth: 180 }} />
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Container>
          </>
        )}
      {paymentConfirmed && (
        <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
          <Stack direction={'column'} display={'flex'} alignItems={'center'}>
            <CheckCircle fontSize="large" color="success" />
            <Typography variant="h5" color="initial">Pagamento confirmado</Typography>
          </Stack>
          <Stack direction={'column'} display={'flex'} alignItems={'center'}>
            <Box p={2}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                style={{ color: "#fff" }}
                onClick={() => {
                  location.href = "/minha-conta";
                }}
              >
                Ir para meu perfil
              </Button>
            </Box>
          </Stack>
        </Container>
      )}
    </>
  );
}
