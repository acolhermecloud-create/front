import { Avatar, AvatarGroup, Box, Button, Card, CardActions, CardContent, Container, Divider, Grid, IconButton, Link, Paper, Skeleton, Stack, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { ProgressBarWithLabel } from "./progressbar-with-label";
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from "react";
import { CardGiftcard, RocketLaunch, Share, Telegram } from "@mui/icons-material";
import { currentDateFormatedDDMMYYYHH, formatCurrency, getCachedFileUrl, getTimeElapsed, getTotalDonations, stringAvatar } from "@/utils/functions";
import AboutHomeSection from "./about-section";
import Carousel from "react-material-ui-carousel";
import { useDefineValueOfDonation } from "@/context/DefineValueOfDonationContext";
import { useCampaign } from "@/context/CampaignContext";
import ReportModal from "./modal/ReportModal";
import { MakeSmallDonationMoal } from "./modal/MakeSmallDonationMoal";
import MessageList from "./campaign/message-list";
import DescriptionBox from "./campaign/description";
import SupportersList from "./campaign/supporters";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useLoginWarning } from "@/context/LoginWarningContext";
import { useLoading } from "@/context/LoadingContext";

export default function DonationDetails({ loading, donation }) {

  const theme = useTheme();

  const [tab, setTab] = useState(0);

  const isMounted = useRef(true);
  const { handleOpenDefineValueOfDonation } = useDefineValueOfDonation();
  const { getToken } = useAuth();

  const { handleLoginWarning } = useLoginWarning();
  const { handleLoading, handleCloseLoading } = useLoading();

  const [user, setUser] = useState();

  // DADOS DA CAMPAINHA
  const [totalOfDonationsInBRL, setTotalOfDonationsInBRL] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [totalOfSupporters, setTotalOfSupporters] = useState(0);
  const [supporters, setSupporters] = useState();
  const [campaignComments, setCampaignComments] = useState([]);
  const [campaignLogs, setCampaignLogs] = useState([]);
  const [totalDigitalStickers, setTotalDigitalStickers] = useState(0);

  const initialComment = "Digite seu comentário...";
  const [comment, setComment] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const { getLogs, handleAddComment, handleRemoveComment } = useCampaign();

  const [openReportModal, setOpenReportModal] = useState(false);
  const handleOpenReportModal = () => setOpenReportModal(true);
  const handleCloseReportModal = () => setOpenReportModal(false);

  const [openMakeSmallDonationModal, setOpenMakeSmallDonationModal] = useState(false);
  const handleOpenMakeSmallDonationModal = () => setOpenMakeSmallDonationModal(true);
  const handleCloseMakeSmallDonationModal = () => setOpenMakeSmallDonationModal(false);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };
  const [images, setImages] = useState([]);

  const handleGetFileUrl = async (medias) => {
    const imageUrls = await Promise.all(medias.map(getCachedFileUrl));
    setImages(imageUrls);
  }

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: donation.title, // Título da página
          text: donation.description, // Descrição opcional
          url: `${window.location.origin}/vaquinha/${donation.slug}`, // URL da página atual
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Caso o navegador não suporte o compartilhamento
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/vaquinha/${slug}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleOpenMakeDonation = (campaign) => {
    if (campaign.creatorId === user?.id) {
      toast.error("Você não pode doar para si mesmo");
      return;
    }

    handleOpenDefineValueOfDonation(campaign, images);
  }

  const handleGetLogs = async (campaignId) => {

    const response = await getLogs(campaignId);
    if (response.status) {
      setCampaignLogs(response.data.logs)
    }
  }

  const updateSmallDonation = (amount) => {
    setTotalDigitalStickers(totalDigitalStickers + amount)
  }

  const onFocusComment = () => {
    if (!user) {
      handleLoginWarning(`/vaquinha/${donation.slug}`);
      return;
    }
    setIsEditing(true);
  }

  const handleBlur = (event) => {
    setComment(event.target.innerText);
    setIsEditing(false);
  };

  const addComment = async () => {

    if (!comment || comment === '') {
      toast.error('Informe o comentário corretamente');
      return;
    }

    handleLoading();
    const response = await handleAddComment(donation.id, comment);

    if (response.status) {
      const payload = {
        userName: user.name,
        comment: comment,
        createAt: new Date().toISOString()
      }

      console.log('payload', payload)

      let commentsCopy = [...campaignComments];
      commentsCopy.unshift(payload);
      setCampaignComments(commentsCopy);

    } else {
      toast.error('Não foi possível adicionar o comentário, tente novamente mais tarde');
    }

    handleCloseLoading();
  }

  const deleteComment = async (commentId) => {
    handleLoading();
    const response = await handleRemoveComment(commentId);

    if (response.status) {
      let commentsCopy = campaignComments.filter(comment => comment.id !== commentId);
      setCampaignComments(commentsCopy);
    } else {
      toast.error('Não foi possível remover o comentário, tente novamente mais tarde');
    }

    handleCloseLoading();
  }

  useEffect(() => {
    if (donation) {
      handleGetLogs(donation.id);
      setCampaignComments(donation.comments)
    }
  }, [donation])

  useEffect(() => {
    if (donation && donation.media) {
      handleGetFileUrl(donation.media);

      const financialGoalInCents = donation.financialGoal;
      const { totalInCents, totalSupporters, supporters } = getTotalDonations(donation.donations);

      setTotalOfSupporters(totalSupporters);
      setSupporters(supporters);
      setTotalOfDonationsInBRL(formatCurrency(`${totalInCents}`));

      const progress = (totalInCents / financialGoalInCents) * 100;
      setProgressPercent(progress.toFixed(2));

      const smallDonations = donation.donations.filter(x => x.status === 1 && x.type === 1);
      const sumTotalSmallDonations = smallDonations.reduce((acc, donation) => acc + donation.amount, 0);
      setTotalDigitalStickers(sumTotalSmallDonations);

    }
  }, [donation])

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      const token = getToken();
      if (token) {
        setUser(token);
      }
    }
  }, [getToken])

  if (loading) {
    return (
      <Box>
        <Container maxWidth="lg" sx={{ pt: 4, mb: 4 }}>
          <Stack direction={'row'} textAlign={'center'} justifyContent={'center'}>
            <Skeleton variant="text" width="80%" height={40} />
          </Stack>
          <Grid container sx={{ pt: 4, display: 'flex', justifyContent: 'center' }} spacing={4}>
            <Grid item xs={12} sm={7}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <Stack pt={1} direction={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="40%" height={20} />
              </Stack>
              <Stack pt={1}>
                <Divider />
              </Stack>
              <Skeleton variant="text" width="60%" height={20} />
              <Stack pt={2}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="História" {...a11yProps(0)} />
                    <Tab label={`Novidades ${0}`} {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={tab} index={0}>
                  <Skeleton variant="text" width="100%" height={20} />
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={1}>
                  <Skeleton variant="text" width="100%" height={20} />
                </CustomTabPanel>
              </Stack>
              <Divider />
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={20} />
            </Grid>

            {/* GRID ACTION DESKTOP */}
            <Grid item xs={12} sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ pt: 4 }}>
                  <Skeleton variant="rectangular" width="100%" height={40} />
                  <Stack>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="80%" height={40} />
                  </Stack>
                  <Stack>
                    <Skeleton variant="text" width="60%" height={20} />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Stack direction={'column'} sx={{ width: '100%' }}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                    <Skeleton variant="rectangular" width="100%" height={40} />
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          {/* GRID ACTION MOBILE */}
          <Box
            sx={{
              display: { xs: 'block', sm: 'none' },
              position: 'fixed',
              bottom: 0,
              width: '100%',
              m: 0,
              p: 0,
              left: 0,
              zIndex: 999
            }}>
            <Paper elevation={3} sx={{ px: 2, py: 2, m: 0, height: 150 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="rectangular" width="100%" height={30} />
              <Grid container justifyContent={'space-evenly'}>
                <Grid item xs={2}>
                  <Skeleton variant="rectangular" width="100%" height={40} />
                </Grid>
                <Grid item xs={9}>
                  <Skeleton variant="rectangular" width="100%" height={40} />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxWidth="lg" sx={{ pt: 4, mb: 4 }}>
        <Stack direction={'row'} textAlign={'center'} justifyContent={'center'}>
          <Typography variant="h4" sx={{ pt: 2 }} fontSize={{ xs: '1.2rem', sm: '2.4rem' }} color="secondary" fontWeight={600}>
            {donation.title}
          </Typography>
        </Stack>
        <Grid container sx={{ pt: 4, display: 'flex', justifyContent: 'center' }} spacing={4}>
          <Grid item xs={12} sm={7}>
            {images && images.length > 0 && (
              <Carousel
                indicators={false}
                swipe={true}
                sx={{ height: 300, overflow: 'hidden' }}
                animation={'none'}
              >
                {(images.length === 0 ? ['/assets/images/img_loading.png'] : images).map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`Campaign image ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      maxHeight: 300,
                      '@media (max-width:600px)': {
                        height: '100vh' // ou outra altura fixa proporcional
                      },
                      borderRadius: 1
                    }}
                  />
                ))}
              </Carousel>
            )}
            <Stack pt={1} direction={'row'}
              justifyContent={'space-between'} alignItems={'center'} spacing={2}>
              <AvatarGroup max={4}>
                {supporters && supporters.map((supporter, index) =>
                  <Avatar key={index} {...stringAvatar(supporter.name)} />
                )}
              </AvatarGroup>
              <Tooltip title="Número de kaixinhas recebidas">
                <IconButton onClick={handleOpenMakeSmallDonationModal}>
                  <Typography variant="body2" color="initial" display={'flex'} textAlign={'center'}>
                    <CardGiftcard color="primary" fontSize="small" />&nbsp;{totalDigitalStickers} kaixinha{totalDigitalStickers > 1 && (<>s</>)}
                  </Typography>
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack py={1}>
              <Divider />
            </Stack>
            <Stack pt={1} direction={'row'}>
              <Typography variant="h6" fontSize={{ xs: '0.8rem' }} color="initial">Criada em {currentDateFormatedDDMMYYYHH(donation.createdAt)}</Typography>
            </Stack>
            <Stack pt={2}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                  <Tab label="História" {...a11yProps(0)} />
                  <Tab label={`Novidades ${campaignLogs.length}`} {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={tab} index={0}>
                <DescriptionBox
                  description={donation.description} />
              </CustomTabPanel>
              <CustomTabPanel value={tab} index={1}>
                <Box style={{ overflowY: 'auto' }}>
                  <Stack py={1}>
                    {campaignLogs && campaignLogs.map((log, index) =>

                      <Card key={index} sx={{ my: 1 }} style={{ border: 'solid 1px #ccc' }}>
                        <CardContent>
                          <Typography gutterBottom>
                            {log.campaignLogType === 0 && ("Recebeu uma doação")}
                            {log.campaignLogType === 1 && ("Alterou a meta")}
                            {log.campaignLogType === 2 && ("Alterou a descrição")}
                            {log.campaignLogType === 2 && ("Alterou o status")}
                            {log.campaignLogType === 2 && ("Alterou as imagens")}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{log.description}</Typography>
                        </CardContent>
                      </Card>
                    )}
                    {campaignLogs && campaignLogs.length === 0 && (
                      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Nenhuma novidade!</Typography>
                    )}
                  </Stack>
                </Box>
              </CustomTabPanel>
            </Stack>

            <Stack mt={1} alignContent={'center'}>
              <Typography variant="h6" color="initial">
                Quem ajudou&nbsp;&nbsp;
                <span style={{ fontSize: '1.5rem', color: theme.palette.primary.main }}>{totalOfSupporters}</span>
              </Typography>
              {totalOfSupporters === 0 && (
                <Typography sx={{ my: 1 }} variant="subtitle1" color="initial" style={{ lineHeight: 1 }} fontWeight={400}>Seja o primeiro a fazer uma boa ação ;)</Typography>
              )}
              {totalOfSupporters !== 0 && (
                <SupportersList
                  donation={donation} />
              )}

            </Stack>

            <Stack mt={4} direction={'column'} spacing={2}>
              <Typography variant="h6" color="initial">
                Mensagens de Apoio <span style={{ color: theme.palette.primary.main }}>{campaignComments.length}</span>
              </Typography>
              {campaignComments.length === 0 && (
                <Typography variant="body2" color="initial">
                  Seja o primeiro a motivar essa campanha 😀
                </Typography>
              )}
              <Stack direction="row" spacing={2}>
                <Avatar src="/static/images/avatar/1.jpg" />
                <Typography variant="subtitle1"
                  style={{ width: '80%' }}
                  color="initial"
                  onBlur={(event) => handleBlur(event)}
                  onFocus={onFocusComment}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  p={1}
                >
                  {isEditing || comment ? comment : initialComment}
                </Typography>
                <IconButton color="secondary" aria-label="add" onClick={addComment}>
                  <Telegram />
                </IconButton>
              </Stack>
              <MessageList
                user={user}
                campaignComments={campaignComments}
                deleteComment={deleteComment} />
            </Stack>

            <Stack pt={2}>
              <Link href="#"
                onClick={handleOpenReportModal}
                style={{ textDecoration: 'none' }}>
                <Typography variant="subtitle2" color="error">
                  Denunciar essa campanha
                </Typography>
              </Link>
            </Stack>
            <Stack pt={2}>
              <Typography variant="body2" fontSize={{ xs: '0.6rem', sm: '0.7rem' }} color="initial">
                <b>ATENÇÃO</b>: Todo o conteúdo, incluindo textos e imagens, apresentado nesta página é de
                responsabilidade exclusiva do criador da vaquinha. A plataforma Kaixinha não se responsabiliza,
                endossa ou reflete necessariamente as opiniões expressas pelo organizador da campanha.
              </Typography>
            </Stack>
          </Grid>

          {/** GRID ACTION DESKTOP */}
          <Grid item xs={12} sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Card sx={{ width: '100%' }}>
              <CardContent sx={{ pt: 4 }}>
                <ProgressBarWithLabel
                  progress={progressPercent}
                />
                <Stack>
                  <Typography sx={{ pt: 2, lineHeight: 2, color: 'text.secondary' }}>
                    Arrecadado
                  </Typography>
                  <Typography variant="subtitle1" sx={{ lineHeight: 1, fontWeight: 500 }}
                    fontSize={{ xs: '1rem', sm: '2rem' }} color="primary">
                    R$ {totalOfDonationsInBRL}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Meta de R$ {formatCurrency(`${donation?.financialGoal}`)}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography
                    sx={{ pt: 1, lineHeight: 1, color: 'text.secondary' }}>
                    {totalOfSupporters} - Apoiadores
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions>
                <Stack direction={'column'} sx={{ width: '100%' }}>
                  <Link href='#'>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 1,
                        my: 1,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                      onClick={
                        () => {
                          if (donation.creatorId !== user?.id) {
                            handleOpenMakeDonation(donation)
                          } else {
                            location.href = `/vaquinha/destacar?id=${donation.id}`;
                          }
                        }
                      }
                      startIcon={donation?.creatorId === user?.id ? <RocketLaunch /> : null}
                    >
                      {donation.creatorId !== user?.id && (<>Doar</>)}
                      {donation.creatorId === user?.id && (<>Impulsionar</>)}
                    </Button>
                  </Link>
                  <Link href='#'>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        py: 1,
                        my: 1,
                        backgroundColor: theme.palette.light.main,
                        color: theme.palette.dark.main,
                        borderColor: theme.palette.dark.text,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: theme.palette.dark.text,
                          color: theme.palette.light.main
                        },
                      }}
                      onClick={handleShareLink}
                    >
                      Compartilhar
                    </Button>
                  </Link>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/** GRID ACTION MOBILE */}
        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            position: 'fixed',
            bottom: 0,
            width: '100%',
            m: 0,
            p: 0,
            left: 0,
            zIndex: 999
          }}>
          <Paper
            elevation={3}
            sx={{ px: 2, py: 2, m: 0, height: 150 }}>
            <Typography variant="overline" color="initial"
              sx={{ lineHeight: 2 }}>Arrecadado</Typography>
            <ProgressBarWithLabel
              progress={progressPercent}
            />
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant="subtitle1" sx={{ lineHeight: 2, fontWeight: 500 }}
                fontSize={{ xs: '1.5rem', sm: '2rem' }} color="primary">
                R$ {formatCurrency(`${totalOfDonationsInBRL}`)}
              </Typography>
              <Typography variant="subtitle1" sx={{ lineHeight: 2, fontWeight: 500 }}
                fontSize={{ xs: '1.5rem', sm: '2rem' }} color="primary">
                de {formatCurrency(`${donation?.financialGoal}`)}
              </Typography>
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant="overline" color="initial"
                sx={{ lineHeight: 1 }}>{totalOfSupporters} - Apoiadores</Typography>
            </Stack>
            <Divider sx={{ pt: 1 }} />
            <Grid container justifyContent={'space-evenly'}>
              <Grid item xs={2}>
                <Link href='#'>
                  <Button
                    variant="contained"
                    color="inherit"
                    sx={{
                      color: 'white',
                      py: 1,
                      my: 1,
                      fontSize: '1rem',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: theme.palette.dark.text,
                      },
                    }}
                    onClick={handleShareLink}
                  >
                    <Share fontSize="medium" />
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={9}>
                <Link href='#'>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      py: 1,
                      my: 1,
                      fontSize: '0.88rem',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                    onClick={
                      () => {
                        if (donation.creatorId !== user?.id) {
                          handleOpenMakeDonation(donation)
                        } else {
                          location.href = `/vaquinha/destacar?id=${donation.id}`;
                        }
                      }
                    }
                    startIcon={donation.creatorId === user?.id ? <RocketLaunch /> : null}
                  >
                    {donation.creatorId !== user?.id && (<>Doar</>)}
                    {donation.creatorId === user?.id && (<>Impulsionar</>)}
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <AboutHomeSection />

        <MakeSmallDonationMoal
          campaignId={donation.id}
          open={openMakeSmallDonationModal}
          onClose={handleCloseMakeSmallDonationModal}
          updateSmallDonation={updateSmallDonation} />

        <ReportModal
          campaignId={donation.id} open={openReportModal} onClose={handleCloseReportModal} />

      </Container>
    </Box>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 0, pb: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}