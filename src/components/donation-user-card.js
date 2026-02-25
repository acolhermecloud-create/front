import { descriptionStatusCampaign, formatCurrency, getCachedFileUrl, getTimeElapsed, getTotalDonations, truncateText } from "@/utils/functions";
import { Alert, Box, Button, Divider, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Popover, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { ProgressBarWithLabel } from "./progressbar-with-label";
import { Create, KeyboardArrowDown, Newspaper, PowerSettingsNew, Redeem, RocketLaunch, Visibility, VolunteerActivism } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";

export default function DonationUserCard({
  handleDesactiveCampaign, handleEditCampaign,
  id, title, description, status, slug, date, medias, goalAmount, donations, leverageRequest, reason }) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se é mobile

  const [anchorEl, setAnchorEl] = useState(null);

  const [images, setImages] = useState([]);

  const [totalOfDonationsInBRL, setTotalOfDonationsInBRL] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [totalOfSupporters, setTotalOfSupporters] = useState(0);
  const [supporters, setSupporters] = useState();
  const [totalSmallDonation, setTotalSmallDonation] = useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  const [openDesactiveCampaign, setOpenDesactiveCampaign] = useState(false);
  const handleOpenDesactiveCampaign = () => {
    setOpenDesactiveCampaign(true);
  }
  const handleCloseDesactiveCampaign = () => setOpenDesactiveCampaign(false);

  const handleGetFileUrl = async () => {
    const imageUrls = await Promise.all(medias.map(getCachedFileUrl));
    setImages(imageUrls);
  }

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title, // Título da página
          text: description, // Descrição opcional
          url: `${window.location.origin}/vaquinha/${slug}`, // URL da página atual
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

  useEffect(() => {
    if (donations) {

      const smallDonations = donations.filter(x => x.status === 1 && x.type === 1);
      const sumTotalSmallDonations = smallDonations.reduce((acc, donation) => acc + donation.amount, 0);
      setTotalSmallDonation(sumTotalSmallDonations);

      const financialGoalInCents = Math.round(goalAmount * 100);

      const { totalInCents, totalSupporters, supporters } = getTotalDonations(donations);
      setTotalOfSupporters(totalSupporters);
      setSupporters(supporters);
      setTotalOfDonationsInBRL(formatCurrency(`${totalInCents}`));

      const progress = (totalInCents / financialGoalInCents) * 100;
      setProgressPercent(progress.toFixed(2));
    }
  }, [donations])

  useEffect(() => {
    if (medias) {
      handleGetFileUrl();
    }
  }, [medias])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxWidth: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box
      sx={{
        borderWidth: 1,
        borderColor: theme.palette.light.secondary,
        borderRadius: 1,
        borderStyle: 'solid',
        padding: 2,
        my: 1
      }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
        <Carousel
          indicators={images.length > 0}
          sx={{ flex: 1, height: 160, overflow: 'hidden' }}
        >
          {(images.length === 0 ? ['/assets/images/img_loading.png'] : images).map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image}
              alt={`Campaign image ${index + 1}`}
              sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 3 }}
            />
          ))}
        </Carousel>
        <Stack mt={3} flex={2} spacing={1}>
          <Typography variant="body2" color="initial">{truncateText(title, 64)}</Typography>
          {status === 0 && (
            <Typography variant="body2" fontSize={{ sm: '0.65rem' }} fontWeight={200} color="initial">{totalSmallDonation} Kaixinhas</Typography>
          )}
          {status === 0 && (
            <Typography variant="body2" fontSize={{ sm: '0.6rem' }} fontWeight={200} color="initial">Criada {getTimeElapsed(date)}</Typography>
          )}
          <Typography variant="body2" fontWeight={600}
            style={{
              color:
                status === 0
                  ? theme.palette.success.main
                  : status === 1
                    ? theme.palette.error.main
                    : status === 5 ? theme.palette.error.main : theme.palette.warning.main,
            }}
          >
            {descriptionStatusCampaign(status)}
          </Typography>
          {reason && (
            <Typography variant="body2" fontWeight={400}>
              <span style={{ color: 'red' }}>Motivo do status:</span> {reason}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack spacing={4} direction={'row'} alignItems={'center'}>
        <ProgressBarWithLabel
          progress={progressPercent}
        />
      </Stack>
      {(status === 0 || status === 2 || status === 4) && (
        <Stack mt={2} spacing={1}>
          <Button
            variant="contained"
            sx={{
              bgcolor: !leverageRequest ? 'primary.main' : leverageRequest.leverageStatus === 1 ? 'error.main' : leverageRequest.leverageStatus === 2 ? 'success.main' : '',
              color: 'white',
              py: 1,
              fontSize: '0.875rem',
              textTransform: 'none',
              '&:hover': {
                bgcolor: !leverageRequest ? 'primary.dark' : leverageRequest.leverageStatus === 1 ? 'error.main' : leverageRequest.leverageStatus === 2 ? 'success.main' : '',
              },
            }}
            onClick={() => {
              if (!leverageRequest) {
                location.href = `/vaquinha/destacar?id=${id}`;
              }
            }}
            startIcon={!leverageRequest ? <RocketLaunch /> : null}
          >
            {!leverageRequest && (<>Destacar</>)}
            {leverageRequest && leverageRequest.leverageStatus === 0 && (<>Destaque em análise</>)}
            {leverageRequest && leverageRequest.leverageStatus === 1 && (<>Destaque rejeitado</>)}
            {leverageRequest && leverageRequest.leverageStatus === 2 && (<>Destaque aprovado</>)}
          </Button>
        </Stack>
      )}
      {status === 0 && (
        <Stack mt={2} spacing={1} direction={'row'} justifyContent={'space-between'}>
          <Button
            variant="outlined"
            sx={{
              py: 1,
              fontSize: '0.875rem',
              textTransform: 'none',
            }}
            onClick={handleShareLink}
          >
            Compartilhar
          </Button>
          <Button
            id={popoverId}
            variant="outlined"
            endIcon={<KeyboardArrowDown />}
            sx={{
              py: 1,
              fontSize: '0.875rem',
              textTransform: 'none'
            }}
            onClick={handleClick}
          >
            Gerenciar
          </Button>
          <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <List dense={true}>
              <ListItem disablePadding>
                <ListItemButton onClick={handleEditCampaign}>
                  <ListItemIcon>
                    <Create color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Editar" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => location.href = `/vaquinha/${slug}`}>
                  <ListItemIcon>
                    <Visibility color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Ver vaquinha" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleOpenDesactiveCampaign}>
                  <ListItemIcon>
                    <PowerSettingsNew color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Desativar" />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
        </Stack>
      )}

      {/** MODAL CONFIRM DESACTIVE CAMPAIGN */}
      <Modal
        open={openDesactiveCampaign}
        onClose={handleCloseDesactiveCampaign}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Tem certeza que deseja desativar sua campanha?
          </Typography>
          <Alert severity="warning">
            <Typography variant="subtitle2" color="initial">Ao desativar sua campanha as seguintes ações acontecerão:</Typography>
            <ul>
              <li><Typography mt={2} variant="body2" color="initial">Você não receberá mais doações</Typography></li>
              <li><Typography mt={2} variant="body2" color="initial">Não será possível ativa-la novamente</Typography></li>
            </ul>
          </Alert>
          <Stack mt={2} direction={'row'} display={'flex'} justifyContent={'space-between'}>
            <Button
              onClick={handleCloseDesactiveCampaign}
              style={{ color: '#000' }}
            >Não</Button>
            <Button
              onClick={() => {
                handleDesactiveCampaign(id);
                handleCloseDesactiveCampaign();
              }}
              variant="contained"
              color="error"
            >Sim</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}