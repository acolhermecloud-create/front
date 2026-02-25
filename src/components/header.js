import React, { useEffect, useRef, useState } from "react";
import {
  AppBar, Box, Container, Toolbar, Button, IconButton,
  Drawer, List, ListItem, ListItemText, Stack, Popover, Typography,
  Divider, Tooltip, Avatar, Grid2,
  ClickAwayListener,
  TextField
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useRouter } from 'next/router';  // Importando useRouter
import logo from './../assets/images/logo0.png';
import Link from "next/link";
import { useTheme } from '@mui/material/styles';
import { useAuth } from "@/context/AuthContext";
import { Campaign, Close, Person, Search } from "@mui/icons-material";
import { UserBalanceInfo } from "./user-balance-info";
import { useUser } from "@/context/UserContext";
import { useStore } from "@/context/StoreContext";
import { useBank } from "@/context/BankContext";

export default function Header() {
  const theme = useTheme();
  const isMounted = useRef(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();  // Usando o hook useRouter

  const [searchText, setSearchText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const [loggedUser, setLoggedUser] = useState();
  const { token, getToken, validateTokenWithOutRedirect } = useAuth();

  const { balanceAwaitingRelease, balanceReleasedWithdraw, balanceAwaitRelease } = useUser();
  const { userDigitalStickersState,
    userDigitalStickersUsageState,
    getUserDigitalStickers, getUserDigitalStickersUsage } = useStore();

  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar a posição do popover
  const openPopover = Boolean(anchorEl); // Verifica se o popover está aberto
  const id = openPopover ? 'simple-popover' : undefined;

  const { getBalance } = useBank();

  const [balance, setBalance] = useState(0);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const isActive = (path) => router.pathname === path; // Função para verificar se a rota está ativa

  const handleGoToLogin = () => {
    window.location.href = '/login';
  }

  const handleClickPopover = (event) => {
    setAnchorEl(event.currentTarget); // Define a posição do popover
  };

  const handleClosePopover = () => {
    setAnchorEl(null); // Fecha o popover
  };

  const handleGetUserAcolhers = async () => {
    await getUserDigitalStickers();
  }

  const handleGetUserUsageAcolhers = async () => {
    await getUserDigitalStickersUsage();
  }

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchRef.current?.focus();
    }, 100); // Pequeno delay para garantir que o campo está visível antes do foco
  };

  const handleClickAway = () => {
    setIsSearchOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event === 'enter' || event.key === "Enter" && searchText.trim() !== "") {
      router.push(`/vaquinha/busca?id=${encodeURIComponent(searchText)}`);
      setIsSearchOpen(false);
      setSearchText(""); // Limpa o campo após a busca
    }
  };

  const handleGetBalance = async () => {
    const response = await getBalance();
    if (response.status) {
      setBalance(response.data.balance)
    }
  }

  const handleGetBalanceAwaitingRelease = async () => {

    await balanceAwaitingRelease();
  }

  const SeachComponent = () => {
    return (
      <ClickAwayListener onClickAway={handleClickAway} >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
          <IconButton
            sx={{ backgroundColor: "#f8f8f8" }}
            color="inherit"
            onClick={handleSearchClick}
          >
            <SearchIcon sx={{ color: "#333" }} />
          </IconButton>

          <TextField
            inputRef={searchRef}
            variant="outlined"
            size="small"
            placeholder="Pesquisar..."
            autoFocus
            onKeyDown={handleKeyDown}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              width: isSearchOpen ? "300px" : "0px",
              opacity: isSearchOpen ? 1 : 0,
              transition: "width 0.4s ease-in-out, opacity 0.2s",
              overflow: "hidden",
              bgcolor: "white",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                paddingRight: "10px",
              },
            }}
          />
        </Box>
      </ClickAwayListener >
    );
  }

  useEffect(() => {
    if (token && token !== '') {
      const loggedData = getToken();
      setLoggedUser(loggedData);
    }
  }, [token])

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      validateTokenWithOutRedirect().then(() => {
        const loggedData = getToken();
        setLoggedUser(loggedData);
      })
      Promise.all([
        handleGetBalanceAwaitingRelease(),
        handleGetBalance(),
      ]).finally(() => {
      });
    }
  }, [getToken]);

  useEffect(() => {
    if (loggedUser) {
      handleGetUserAcolhers();
      handleGetUserUsageAcolhers();
    }
  }, [loggedUser]);

  return (
    <Box sx={{ width: "100%", borderBottom: `4px solid ${theme.palette.primary.main}` }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: "#fff", color: "#333" }}>
        <Container maxWidth="lg">
          <Toolbar>
            {/* Logo e Slogan */}
            <Stack sx={{ display: "flex", flexGrow: 1 }}>
              <Link href="/" passHref>
                <img src={logo.src} alt="logo" width={140} />
              </Link>
            </Stack>

            {/* Menu Horizontal para Desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>

              <Link href="/" passHref>
                <Button sx={{ borderRadius: 0, color: isActive('/') ? theme.palette.primary.main : '#333', fontWeight: isActive('/') ? 'bold' : 'normal', borderBottom: isActive('/') ? '2px solid #ff6701' : 'none' }}>
                  Início
                </Button>
              </Link>
              <Link href="/vaquinhas" passHref>
                <Button sx={{ borderRadius: 0, color: isActive('/vaquinhas') ? theme.palette.primary.main : '#333', fontWeight: isActive('/vaquinhas') ? 'bold' : 'normal', borderBottom: isActive('/vaquinhas') ? '2px solid #ff6701' : 'none' }}>
                  Vaquinhas
                </Button>
              </Link>
              <Link href="/sobre-nos" passHref>
                <Button sx={{ borderRadius: 0, color: isActive('/sobre-nos') ? theme.palette.primary.main : '#333', fontWeight: isActive('/sobre-nos') ? 'bold' : 'normal', borderBottom: isActive('/sobre-nos') ? '2px solid #ff6701' : 'none' }}>
                  Sobre Nós
                </Button>
              </Link>
              <Link href="/duvidas" passHref>
                <Button sx={{ borderRadius: 0, color: isActive('/duvidas') ? theme.palette.primary.main : '#333', fontWeight: isActive('/duvidas') ? 'bold' : 'normal', borderBottom: isActive('/duvidas') ? '2px solid #ff6701' : 'none' }}>
                  Dúvidas?
                </Button>
              </Link>
              <Link href="/contato" passHref>
                <Button sx={{ borderRadius: 0, color: isActive('/contato') ? theme.palette.primary.main : '#333', fontWeight: isActive('/contato') ? 'bold' : 'normal', borderBottom: isActive('/contato') ? '2px solid #ff6701' : 'none' }}>
                  Contato
                </Button>
              </Link>

              {SeachComponent()}

              <Link href="#" passHref>
                {!loggedUser && (
                  <Button
                    onClick={handleGoToLogin}
                    endIcon={<PersonOutlineIcon sx={{ color: "#333" }} />}
                    variant="outlined" sx={{ borderColor: "#f8f8f8", color: "#333" }}>
                    Entrar
                  </Button>
                )}
                {loggedUser && (
                  <Button
                    onClick={handleClickPopover} // Abre o popover ao clicar
                    endIcon={<PersonOutlineIcon sx={{ color: "#333" }} />}
                    variant="outlined" sx={{ borderColor: "#f8f8f8", color: "#333" }}>
                    Minha Conta
                  </Button>
                )}
              </Link>
            </Box>

            {/* Ícone de menu hambúrguer para mobile */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton aria-label="menu" color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen}>
                <Box
                  sx={{ width: '100vw' }}
                  role="presentation"
                >
                  <Box sx={{ position: 'absolute', right: 10, top: 20, zIndex: 999 }} onClick={() => setDrawerOpen(false)}>
                    <Link href='#' >
                      <Close />
                    </Link>
                  </Box>
                  {loggedUser && (
                    <Stack p={2} direction={'column'} alignItems={'center'} spacing={1}>
                      <Avatar
                        alt="Remy Sharp"
                        src={loggedUser && loggedUser.avatar !== '' ? loggedUser.avatar : '/assets/images/avatar.png'}
                        sx={{ width: 58, height: 58 }}
                      />
                      <Typography variant="body2" color="initial">{loggedUser.name}</Typography>
                    </Stack>
                  )}
                  <List>
                    {!loggedUser && (
                      <Stack pl={2} pt={1} sx={{ display: "flex", flexGrow: 1, maxWidth: '80%' }}>
                        <Link href="/" passHref>
                          <img src={logo.src} alt="logo" width={140} />
                        </Link>
                      </Stack>
                    )}
                    {loggedUser && (
                      <ListItem>
                        {<UserBalanceInfo
                          balance={balance}
                          balanceAwaitRelease={balanceAwaitRelease}
                          balanceReleasedWithdraw={balanceReleasedWithdraw}
                          setLoggedUser={setLoggedUser} />}
                      </ListItem>
                    )}

                    <ListItem>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Pesquisar..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{
                          overflow: "hidden",
                          bgcolor: "white",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                            paddingRight: "10px",
                          },
                        }}
                      />
                      <IconButton
                        sx={{ backgroundColor: "#f8f8f8" }}
                        color="inherit"
                        onClick={() => {
                          setDrawerOpen(false);
                          handleKeyDown('enter');
                        }}
                      >
                        <SearchIcon sx={{ color: "#333" }} />
                      </IconButton>
                    </ListItem>

                    <ListItem button component={Link} href="/" onClick={() => setDrawerOpen(false)}>
                      <ListItemText
                        primary={<Typography variant="h6" fontWeight={500} color="initial">
                          Início
                        </Typography>} />
                    </ListItem>
                    <ListItem button component={Link} href="/vaquinhas" onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary={
                        <Typography variant="h6" fontWeight={500} color="initial">
                          Vaquinhas
                        </Typography>
                      } />
                    </ListItem>
                    <ListItem button component={Link} href="/sobre-nos" onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary={
                        <Typography variant="h6" fontWeight={500} color="initial">
                          Sobre nós
                        </Typography>
                      } />
                    </ListItem>
                    <ListItem button component={Link} href="/duvidas" onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary={
                        <Typography variant="h6" fontWeight={500} color="initial">
                          Dúvidas?
                        </Typography>
                      } />
                    </ListItem>
                    <ListItem button component={Link} href="/contato" onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary={
                        <Typography variant="h6" fontWeight={500} color="initial">
                          Contato
                        </Typography>
                      } />
                    </ListItem>
                    {!loggedUser && (
                      <Stack p={2} spacing={1} direction={'column'} alignItems={'center'}>
                        <Link style={{ width: '80%' }} href="/criar-Acolher">
                          <Button
                            onClick={() => setDrawerOpen(false)}
                            variant="contained" sx={{
                              p: 1,
                              width: '100%',
                              color: theme.palette.light.main
                            }}
                            startIcon={<Campaign/>}>
                            Criar vaquinha
                          </Button>
                        </Link>
                        <Button
                          onClick={handleGoToLogin}
                          variant="outlined"
                          style={{ width: '80%' }}
                          startIcon={<Person/>}
                          sx={{
                            p: 1,
                            backgroundColor: theme.palette.light.main,
                            color: theme.palette.dark.main,
                            borderColor: theme.palette.dark.main,
                            '&:hover': {
                              bgcolor: theme.palette.dark.main,
                              color: theme.palette.light.main
                            },
                          }}>
                          Fazer login
                        </Button>
                      </Stack>
                    )}
                  </List>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Popover com informações do usuário */}
      {loggedUser && (
        <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ padding: 2, minWidth: 300 }}>
            <UserBalanceInfo
              balance={balance}
              balanceReleasedWithdraw={balanceReleasedWithdraw}
              balanceAwaitRelease={balanceAwaitRelease}
              userDigitalStickersState={userDigitalStickersState}
              userDigitalStickersUsageState={userDigitalStickersUsageState}
              setLoggedUser={setLoggedUser} />
          </Box>
        </Popover>
      )}
    </Box>
  );
}