import {
  Avatar, Box, Container, Divider,
  Grid,
  Link, List, ListItem, ListItemText, Popover, Stack,
  Tab, Tabs, Typography, useMediaQuery
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { DeleteForeverOutlined, InsertPhotoOutlined, PhotoCameraOutlined } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { UserBalanceInfo } from "@/components/user-balance-info";
import styled from "@emotion/styled";
import { useLoading } from "@/context/LoadingContext";
import MyAccountBalance from "@/components/myAccount/MyAccountBalance";
import PersonalInfoForm from "@/components/myAccount/PersonalInfoForm";
import MyDonations from "@/components/myAccount/MyDonations";
import { useCampaign } from "@/context/CampaignContext";
import { formatCurrency, getTotalDonations } from "@/utils/functions";
import { EditCampaign } from "@/components/campaign/form-edit-campaign";
import { useStore } from "@/context/StoreContext";
import { useBank } from "@/context/BankContext";
import SecuritySettings from "@/components/myAccount/SecuritySettings";

const pageSize = 5;

export default function MyAccount() {

  const isMounted = useRef(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se é mobile

  const [value, setValue] = useState(0);

  const { getToken, handleSetToken, validateToken } = useAuth();
  const {
    updateAvatar,
    removeAvatar,
    balanceAwaitingRelease,
    balanceReleasedForWithdraw,
    balanceAwaitRelease,
    balanceReleasedWithdraw,
  } = useUser();
  const { getBalance } = useBank();

  const [loggedUser, setLoggedUser] = useState();

  const extensions = ['jpg', 'jpeg', 'png']
  const { handleLoading, handleCloseLoading } = useLoading();
  const { handleGetCampaignsByUser, handleDesactiveCampaign } = useCampaign();
  const { userDigitalStickersState, userDigitalStickersUsageState } = useStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [campaings, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState();

  const [balance, setBalance] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  // Função para abrir o popover
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Função para fechar o popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Verifica se o popover está aberto
  const open = Boolean(anchorEl);

  const handleUpdateAvatar = async (e) => {
    handlePopoverClose();
    const isAllowedDocument = (url) => {
      return /\.(jpg|jpeg|png)$/i.test(url);
    }

    const file = e.target.files[0]
    if (!file) {
      return
    }
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();

    if (isAllowedDocument(fileExtension)) {
      toast.error('Selecione somente arquivos com as extensões suportadas')
      return
    }

    let formData = new FormData();
    formData.append('file', file);

    handleLoading();

    const response = await updateAvatar(loggedUser.id, formData);
    if (response.status) {
      let updatedUser = loggedUser;
      updatedUser.avatar = response.data;
      handleSetToken(updatedUser);
      toast.success('Foto atualizada');
    } else {
      toast.error('Erro ao atualizar foto, tente novamente mais tarde');
    }
    handleCloseLoading();
  }

  const handleRemoveAvatar = async () => {
    if (loggedUser && loggedUser.avatar !== '') {
      handleLoading();
      handlePopoverClose();
      await removeAvatar();

      let updatedUser = loggedUser;
      updatedUser.avatar = '';
      handleSetToken(updatedUser);
      toast.success('Foto removida');
      handleCloseLoading();
    }
  }

  const handleGetDonations = async (page, pageSize) => {
    handleLoading();

    const response = await handleGetCampaignsByUser(page, pageSize);

    if (response.status) {
      const cps = response.data.campaigns;

      setCampaigns(cps);

      let cpsTotalInCents = 0;

      cps.forEach(campaign => {
        const { totalInCents, totalSupporters, supporters } = getTotalDonations(campaign.donations);
        cpsTotalInCents += totalInCents;
      });
    }

    handleCloseLoading();
  }

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    handleChange("", 4);
  }

  const handleUpdateImagesOfCampaign = (campaignId, newImages) => {

    setCampaigns(prevCampaigns =>
      prevCampaigns.map(campaign =>
        campaign.id === campaignId ? { ...campaign, media: newImages } : campaign
      )
    );
  };

  const desactiveCampaign = async (campaignId) => {

    handleLoading();

    const response = await handleDesactiveCampaign(campaignId);
    if (response.status) {
      toast.success('Campanha desativada');
    } else {
      toast.error('Erro ao desativar campanha');
    }

    handleCloseLoading();
  }

  const handleGetBalanceAwaitingRelease = async () => {

    await balanceAwaitingRelease();
  }

  const handleGetBalanceReleasedForWithdraw = async () => {

    await balanceReleasedForWithdraw();
  }

  const handleGetBalance = async () => {
    const response = await getBalance();
    if (response.status) {
      setBalance(response.data.balance)
    }
  }

  const setNewUserDataAuth = (data) => {
    setLoggedUser(data);
  };

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      validateToken();

      const loggedData = getToken();
      setLoggedUser(loggedData);

      handleLoading(); // Ativa o loading antes das requisições

      Promise.all([
        handleGetBalanceAwaitingRelease(),
        handleGetBalanceReleasedForWithdraw(),
        handleGetBalance(),
        handleGetDonations(currentPage, pageSize)
      ]).finally(() => {
        handleCloseLoading(); // Fecha o loading após todas as requisições
      });
    }
  }, [getToken]);

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: 1 }}>
      <Typography variant="h5" fontWeight={600} color="initial">Perfil</Typography>

      <Stack
        direction={isMobile ? 'column' : 'row'} // Altera a direção do layout
        sx={{ mt: 2, flexGrow: 1, bgcolor: 'background.paper', height: 'auto' }}
      >
        {/* Stack principal para organizar o Avatar e as Tabs em coluna */}
        <Stack direction="column" alignItems="center" spacing={2} sx={{ minWidth: 320, width: isMobile ? '100%' : 200 }}> {/* Largura ajustada no mobile */}
          {/* Avatar e nome */}
          <Stack sx={{ position: 'relative' }} p={1} direction="column" alignItems="center" spacing={1}>
            <Avatar
              alt={loggedUser && loggedUser.name ? loggedUser.name : ''}
              src={loggedUser && loggedUser.avatar !== '' ? loggedUser.avatar : '/assets/images/avatar.png'}
              sx={{ width: 102, height: 102 }}
            />
            <Link href="#" >
              <Box sx={{ position: 'absolute', bottom: 45, right: 20 }}>
                <PhotoCameraOutlined
                  onClick={handlePopoverOpen}
                  color="primary"
                  sx={{
                    p: 0.5,
                    width: 24, height: 24,
                    borderRadius: 5,
                    bgcolor: theme.palette.light.main
                  }} />
              </Box>
            </Link>
            {loggedUser && (
              <Typography textAlign={'center'} variant="body2" fontWeight={500} color="initial">{loggedUser.name}</Typography>
            )}
          </Stack>
          <Stack sx={{ position: 'relative' }} p={1} direction="column" alignItems="center" spacing={1}>
            {<UserBalanceInfo
              balance={balance}
              balanceAwaitRelease={balanceAwaitRelease}
              balanceReleasedWithdraw={balanceReleasedWithdraw}
              userDigitalStickersState={userDigitalStickersState}
              userDigitalStickersUsageState={userDigitalStickersUsageState}
              setLoggedUser={setLoggedUser} />}
          </Stack>

          {/* Tabs com orientação alternada */}
          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"} // Alterna orientação
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Tabs Perfil"
            sx={{ borderRight: isMobile ? 0 : 1, borderBottom: isMobile ? 1 : 0, borderColor: 'divider', width: '100%' }}
          >
            <Tab label="Dados pessoais" {...a11yProps(0)} sx={{ textTransform: 'none', alignItems: 'flex-start' }} />
            <Tab label="Saldo" {...a11yProps(1)} sx={{ textTransform: 'none', alignItems: 'flex-start' }} />
            <Tab label="Minhas vaquinhas" {...a11yProps(2)} sx={{ textTransform: 'none', alignItems: 'flex-start' }} />
            <Tab label="Segurança" {...a11yProps(3)} sx={{ textTransform: 'none', alignItems: 'flex-start' }} />
          </Tabs>
        </Stack>

        {/* Painéis de conteúdo para cada Tab */}
        <Box sx={{ flexGrow: 1, ml: 2 }}> {/* Este Box permite que o conteúdo ocupe o restante do espaço */}
          <TabPanel value={value} index={0}>
            <PersonalInfoForm />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Typography variant="h5" color="initial">Meu saldo</Typography>
            <Divider sx={{ my: 2 }} />
            <MyAccountBalance
              balance={balance}
              campaigns={campaings}
              userDigitalStickersState={userDigitalStickersState}
              userDigitalStickersUsageState={userDigitalStickersUsageState}
              balanceAwaitRelease={balanceAwaitRelease}
              balanceReleasedWithdraw={balanceReleasedWithdraw} />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Typography variant="h5" color="initial">Minhas vaquinhas</Typography>
            <Divider sx={{ my: 2 }} />
            <MyDonations
              handleDesactiveCampaign={desactiveCampaign}
              handleEditCampaign={handleEditCampaign}
              campaings={campaings} />
          </TabPanel>

          <TabPanel value={value} index={3}>
            <Typography variant="h5" color="initial">Segurança da conta</Typography>
            <Divider sx={{ my: 2 }} />
            <SecuritySettings
              setNewUserDataAuth={setNewUserDataAuth}
              userEmail={loggedUser?.email}
              otpEnabled={loggedUser?.twoFactorActive ?? false}/>
          </TabPanel>

          <TabPanel value={value} index={4}>
            <Typography variant="h5" color="initial">Editar campanha</Typography>
            <Divider sx={{ my: 2 }} />
            <EditCampaign
              handleUpdateImagesOfCampaign={handleUpdateImagesOfCampaign}
              campaign={selectedCampaign} />
          </TabPanel>

        </Box>
      </Stack>

      {/* Popover com as opções */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List sx={{ minWidth: 180 }}>
          <ListItem button onClick={() => console.log('Adicionar Foto')}>
            <ListItemText
              primary={
                <Box
                  sx={{ cursor: 'pointer', width: '100%' }}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <VisuallyHiddenInput
                    id="file-input"
                    type="file"
                    accept={extensions}
                    onChange={(e) => handleUpdateAvatar(e)}
                    style={{ display: 'none' }} // Oculta o input
                  />
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <InsertPhotoOutlined color="primary" />
                    <Typography variant="body2" color="initial">
                      Trocar foto
                    </Typography>
                  </Stack>
                </Box>
              }
            />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleRemoveAvatar}>
            <ListItemText primary={
              <Box
                sx={{ cursor: 'pointer', width: '100%' }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DeleteForeverOutlined color="primary" />
                  <Typography variant="body2" color="initial">
                    Excluir
                  </Typography>
                </Stack>
              </Box>
            } />
          </ListItem>
        </List>
      </Popover>
    </Container >
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, position, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3, width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});