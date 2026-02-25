import { useAuth } from "@/context/AuthContext";
import { useBank } from "@/context/BankContext";
import { useLoading } from "@/context/LoadingContext";
import { useUser } from "@/context/UserContext";
import { formatCurrency, validateStrongPassword } from "@/utils/functions";
import { ArrowRight, CardGiftcard, ChangeCircle, CheckCircle, Close, Login, MonetizationOn, Password } from "@mui/icons-material";
import { Alert, Box, Button, Divider, Grid, Grid2, InputAdornment, Link, Modal, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const UserBalanceInfo = ({ balance,
  balanceAwaitRelease,
  balanceReleasedWithdraw,
  userDigitalStickersState,
  userDigitalStickersUsageState,
  setLoggedUser }) => {

  const pathname = usePathname();
  const theme = useTheme();

  const { changePassword } = useUser();

  const [userStickersCount, setUserStickerCount] = useState(0);

  const { logout } = useAuth();
  const { handleLoading, handleCloseLoading } = useLoading();
  const { requestWithdraw } = useBank();

  const [valueOfWithdraw, setValueOfWithdraw] = useState('0');
  const [requestWithdrawStatus, setRequestWithdraw] = useState(false);

  const [openRequestWithdraw, setOpenRequestWithdraw] = useState(false);
  const handleOpenRequestWithdraw = () => {
    if (balance <= 0) {
      toast.error('Saldo insuficiente');
      return;
    }
    setOpenRequestWithdraw(true);
  }
  const handleCloseRequestWithdraw = () => {
    setValueOfWithdraw('0');
    setOpenRequestWithdraw(false)
  }

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const handleOpenChangePassword = () => setOpenChangePassword(true);
  const handleCloseChangePassword = () => setOpenChangePassword(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');

  const [error, setError] = useState('');

  const handleChangeValueOfWithdraw = (event) => {
    const inputValue = event.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    setValueOfWithdraw(inputValue); // Atualiza o estado apenas com números
  };

  const handleLogout = () => {
    logout();
    setLoggedUser(null);
    window.location.href = '/';
  }

  const handleWithdraw = async () => {

    if (valueOfWithdraw < 1) {
      toast.error('Informe um valor acima de R$ 1,00');
      return;
    }

    const sanitizedValue = valueOfWithdraw ? parseInt(valueOfWithdraw, 10) : 0;
    if (isNaN(sanitizedValue)) {
      toast.error("Erro ao validar os valores. Por favor, tente novamente.");
      return;
    }

    handleLoading();

    const response = await requestWithdraw(sanitizedValue);
    if (response.status) {
      setRequestWithdraw(response.status);
    } else {
      toast.error(response?.data?.message ?? "Não foi possível solicitar o saque, contate o suporte");
    }

    handleCloseLoading();
  }

  const handleChangePassword = async () => {

    if (!oldPassword || oldPassword === '') {
      setError('Infome a senha antiga');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!newPassword || newPassword === '') {
      setError('Infome a nova senha');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!reNewPassword || reNewPassword === '') {
      setError('Infome a confirmação da nova senha');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (newPassword !== reNewPassword) {
      setError('As senhas não conferem');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (newPassword === oldPassword) {
      setError('A nova senha não pode ser igual a atual');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!validateStrongPassword(newPassword)) {
      setError('A senha deve conter ao menos uma letra maiúscula');
      setTimeout(() => setError(''), 3000);
      return;
    }

    handleLoading();

    const response = await changePassword(oldPassword, newPassword);

    if (response.status) {
      toast.success('Senha alterada');
      handleCloseChangePassword();
    } else {
      setError(response?.statusText || 'Verifique a senha informada');
      setTimeout(() => setError(''), 3000);
    }

    handleCloseLoading();
  }

  const handleGoToMyAccount = () => {
    window.location.href = '/minha-conta';
  }

  useEffect(() => {
    if (userDigitalStickersState && userDigitalStickersUsageState) {
      const kaixinhas = userDigitalStickersState.digitalStickers;
      let stickersQtdTotal = 0;
      kaixinhas.forEach(kaixinha => {
        if (kaixinha.status === 1) {
          stickersQtdTotal += kaixinha.quantity;
        }
      });

      const kaixinhasUsage = userDigitalStickersUsageState.digitalStickers;
      kaixinhasUsage.forEach(kaixinha => {
        stickersQtdTotal -= kaixinha.quantity;
      });
      setUserStickerCount(stickersQtdTotal);
    }
  }, [userDigitalStickersState, userDigitalStickersUsageState])

  return (
    <Stack direction={'column'} width={'100%'}>
      <Stack pb={1} direction="row" justifyContent="center" alignItems="center" spacing={2}> {/* Adicionando spacing */}
        <Tooltip title="a liberar">
          <Stack direction="row" alignItems="center" spacing={1}> {/* Removendo flex: 1 */}
            <MonetizationOn sx={{ width: 26, height: 26 }} color="success" fontSize="small" />
            <Stack>
              <Typography variant="body2" fontSize={{ sm: '0.875rem', xs: '1rem' }} color="initial">
                R$ {formatCurrency(`${balance}`)}
              </Typography>
              <Link href="#">
                <Typography fontSize={{ xs: '0.6rem', sm: '0.675rem' }} color="initial">
                  a liberar R$ {formatCurrency(`${balanceAwaitRelease?.liquid}`)}
                </Typography>
              </Link>
            </Stack>
            <Divider orientation="vertical" flexItem /> {/* flexItem para ajustar altura do Divider */}
          </Stack>
        </Tooltip>
        <Tooltip title="Suas kaixinhas">
          <Stack direction="row" alignItems="center" spacing={1}> {/* Removendo flex: 1 */}
            <CardGiftcard sx={{ width: 26, height: 26 }} color="primary" fontSize="small" />
            <Stack direction="column" alignItems="center">
              <Typography variant="body2" fontSize={{ sm: '0.875rem', xs: '1rem' }} color="initial">
                {userStickersCount} KA
              </Typography>
              <Link href="/loja/adesivo-digital">
                <Typography fontSize={{ xs: '0.6rem', sm: '0.675rem' }} color="initial">
                  comprar kaixinhas
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Tooltip>
      </Stack>

      <>
        <Divider />
        {/* Adicione mais informações conforme necessário */}
        <Grid2 container spacing={2}>
          {pathname !== '/minha-conta' && (
            <Grid2 size={9}>
              <Button
                size='small'
                fullWidth
                onClick={handleGoToMyAccount} variant="contained"
                sx={{ marginTop: 1, color: theme.palette.light.main }}>
                Ver minha conta
              </Button>
            </Grid2>
          )}
          <Grid2 size={pathname === '/minha-conta' ? 12 : 2}>

            {pathname === '/minha-conta' && (
              <Grid container spacing={1}>

                <Grid item xs={6}>
                  <Button
                    size='small'
                    fullWidth
                    color="primary"
                    onClick={handleOpenRequestWithdraw}
                    variant="contained"
                    sx={{ marginTop: 1, color: theme.palette.light.main }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Saque</Typography>
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    size='small'
                    fullWidth
                    color="primary"
                    onClick={handleOpenChangePassword}
                    variant="contained"
                    sx={{ marginTop: 1, color: theme.palette.light.main }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Alterar senha</Typography>
                  </Button>
                </Grid>
              </Grid>
            )}

            <Button
              size='small'
              fullWidth
              color="error"
              onClick={handleLogout}
              variant="outlined"
              sx={{ marginTop: 1, color: theme.palette.light.main }}>
              {pathname === '/minha-conta' && (<Typography variant="body2" color="error" sx={{ mr: 1 }}>Sair</Typography>)}
              <Login sx={{ width: 22, height: 22 }} color="error" />
            </Button>
          </Grid2>
        </Grid2>
      </>

      <Modal
        open={openRequestWithdraw}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!requestWithdrawStatus && (
            <>
              <Stack display={'flex'} alignItems={'center'}>
                <Stack direction={'row'} display={'flex'} justifyContent={'center'} alignItems={'center'} spacing={1}>
                  <MonetizationOn color="success" />
                  <Typography display={'flex'} alignItems={'center'} variant="h6" component="h2">
                    &nbsp;Informe o valor que deseja sacar
                  </Typography>
                </Stack>
                <Alert severity="info">
                  <Typography variant="body2" sx={{ color: '#4c4c4c' }} fontSize={{ xs: '0.6rem', sm: '0.6rem' }}>
                    Todos os saques entram em uma fila de agendamento, pode demorar até 24hrs para que seja
                    feito para sua conta.
                  </Typography>
                </Alert>
              </Stack>
              <Divider sx={{ py: 1 }} />
              <Stack>
                <TextField
                  size="small"
                  sx={{ mt: 2 }}
                  id="outlined-basic"
                  label="Valor"
                  variant="outlined"
                  value={formatCurrency(valueOfWithdraw)} // Exibição formatada
                  onChange={handleChangeValueOfWithdraw}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>, // R$ fixo aqui
                  }}
                />
              </Stack>
              <Stack spacing={2} direction={'row'} display={'flex'} justifyContent={'center'} mt={3}>
                <Button
                  size='small'
                  color="error"
                  onClick={handleCloseRequestWithdraw}
                  variant="contained"
                  endIcon={<Close sx={{ width: 22, height: 22 }} color="light" />}
                  sx={{ marginTop: 1, color: theme.palette.light.main }}>
                  Cancelar
                </Button>
                <Button
                  size='small'
                  color="success"
                  onClick={handleWithdraw}
                  variant="contained"
                  endIcon={<MonetizationOn sx={{ width: 22, height: 22 }} color="light" />}
                  sx={{ marginTop: 1, color: theme.palette.light.main }}>
                  Solicitar
                </Button>
              </Stack>
            </>
          )}
          {requestWithdrawStatus && (
            <>
              <Stack spacing={2} alignItems={'center'}>
                <CheckCircle color='success' sx={{ width: 48, height: 48 }} />
                <Typography variant="h6" color="initial">
                  Seu saque está sendo processado
                </Typography>
                <Alert severity="success">
                  <Typography variant="body2" sx={{ color: '#4c4c4c' }} fontSize={{ xs: '0.6rem', sm: '0.6rem' }}>
                    Para mais informações consulte a aba Saldo.
                  </Typography>
                </Alert>
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
                  onClick={() => {
                    setRequestWithdraw(false);
                    handleCloseRequestWithdraw();
                  }}
                >
                  Fechar
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>

      <Modal
        open={openChangePassword}
        onClose={handleCloseChangePassword}
      >
        <Box sx={style}>
          <Stack alignItems={'center'} spacing={2}>
            <TextField
              fullWidth
              size="small"
              id="old-password"
              label="Senha antiga"
              type="password"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              id="new-password"
              label="Nova senha"
              type="password"
              autoComplete="current-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              id="re-new-password"
              label="Repita a nova senha"
              type="password"
              autoComplete="current-password"
              value={reNewPassword}
              onChange={(e) => setReNewPassword(e.target.value)}
            />
          </Stack>
          {error !== '' && (
            <Stack spacing={2} direction={'row'} display={'flex'} justifyContent={'center'} mt={3}>
              <Alert severity="error">
                <Typography variant="body2">
                  {error}
                </Typography>
              </Alert>
            </Stack>
          )}
          <Stack spacing={2} direction={'row'} display={'flex'} justifyContent={'center'} mt={3}>
            <Button
              size='small'
              color="error"
              onClick={handleCloseChangePassword}
              variant="contained"
              endIcon={<Close sx={{ width: 22, height: 22 }} color="light" />}
              sx={{ marginTop: 1, color: theme.palette.light.main }}>
              Cancelar
            </Button>
            <Button
              size='small'
              color="success"
              onClick={handleChangePassword}
              variant="contained"
              endIcon={<ChangeCircle sx={{ width: 32, height: 22 }} color="light" />}
              sx={{ marginTop: 1, color: theme.palette.light.main }}>
              Alterar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 320,
  bgcolor: 'background.paper',
  boxShadow: 24,
  py: 4,
  px: 2,
  borderRadius: 1
};