import { useBank } from "@/context/BankContext";
import { currentDateFormatedDDMMYYYHH, formatCurrency } from "@/utils/functions";
import { AccountBalance, CurrencyExchange, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Chip, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from "react";

const pageSize = 15;

export default function MyAccountBalance({ campaigns,
  userDigitalStickersState, userDigitalStickersUsageState,
  balance, balanceAwaitRelease, balanceReleasedWithdraw }) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isMounted = useRef(true);

  const { getTransactions } = useBank();

  const [digitalStickers, setDigitalStickers] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleGetTransactions = async (page) => {

    const response = await getTransactions(page, pageSize);

    if (response.status) {
      console.log(response.data.transactions.items)
      setTransactions(response.data.transactions.items);
      setHasMoreItems(response.data.transactions.hasMoreItems);
      setTotalItems(response.data.transactions.totalItems);
      setCurrentPage(page);
    }
  }

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    handleGetTransactions(value); // Carregar dados da nova página
  };

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      handleGetTransactions(1);
    }
  }, [])

  useEffect(() => {
    if (userDigitalStickersState && userDigitalStickersUsageState) {

      let stickers = [];
      userDigitalStickersState.digitalStickers.forEach(element => {
        let payload = {
          quantity: element.quantity,
          value: element.value,
          status: element.status,
          createdAt: element.createdAt,
        }
        stickers.push(payload);
      });

      setDigitalStickers(stickers);
    }
  }, [userDigitalStickersState, userDigitalStickersUsageState])

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }}>
        <Box
          sx={{
            py: 2,
            px: !isMobile ? 6 : 2,
            flex: 1,
            backgroundColor: theme.palette.success.main,
            textAlign: 'center'
          }}>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Stack>
              <AccountBalance sx={{ color: theme.palette.light.main, width: 32, height: 32 }} />
            </Stack>
            <Stack>
              <Typography variant="body2" color="light.main" fontWeight={300}>Liberado para saque</Typography>
              <Typography variant="h5" color="light.main" fontWeight={600}>R$ {formatCurrency(`${balance}`)}</Typography>
            </Stack>
          </Stack>
        </Box>
        <Box
          sx={{
            py: 2,
            px: !isMobile ? 6 : 2,
            flex: 1,
            backgroundColor: theme.palette.light.opaque,
            textAlign: 'center'
          }}>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Stack>
              <CurrencyExchange sx={{ color: theme.palette.light.main, width: 32, height: 32 }} />
            </Stack>
            <Stack>
              <Typography variant="body2" color="light.main" fontWeight={300}>Aguardando liberação</Typography>
              <Typography variant="h5" color="light.main" fontWeight={600}>R$ {formatCurrency(`${balanceAwaitRelease?.liquid}`)}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <Stack mt={2} direction={'column'}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="subtitle2" color="initial">
              Detalhes
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Stack spacing={1}>
                <Typography variant="body2" color="initial">Total sacado</Typography>
                <TextField
                  size="small"
                  label="Bruto"
                  variant="filled"
                  value={`R$ ${formatCurrency(`${balanceReleasedWithdraw?.grossValue}`)}`}
                  contentEditable={false}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={!isMobile ? 4 : 1}>
                  <TextField
                    size="small"
                    label="Taxas"
                    variant="filled"
                    value={`R$ ${formatCurrency(`${balanceReleasedWithdraw?.tax}`)}`}
                    contentEditable={false}
                    InputProps={{
                      style: { color: theme.palette.error.main },
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    label="Líquido"
                    variant="filled"
                    value={`R$ ${formatCurrency(`${balanceReleasedWithdraw?.liquid}`)}`}
                    contentEditable={false}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }} />
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2" color="initial">Aguardando liberação</Typography>
                <TextField
                  size="small"
                  label="Bruto"
                  variant="filled"
                  value={`R$ ${formatCurrency(`${balanceAwaitRelease?.grossValue}`)}`}
                  contentEditable={false}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={!isMobile ? 4 : 1}>
                  <TextField
                    size="small"
                    label="Pendentes"
                    variant="filled"
                    value={`R$ ${formatCurrency(`${balanceAwaitRelease?.liquid}`)}`}
                    contentEditable={false}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }} />
                  <TextField
                    size="small"
                    label="Taxas"
                    variant="filled"
                    value={`R$ ${formatCurrency(`${balanceAwaitRelease?.tax}`)}`}
                    contentEditable={false}
                    InputProps={{
                      style: { color: theme.palette.error.main },
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                </Stack>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography variant="subtitle2" color="initial">
              Extrato de Doações Recebidas
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {campaigns && campaigns.length > 0 ? (
              campaigns.some(campaign => Array.isArray(campaign.donations) && campaign.donations.length > 0) ? (
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Vaquinha</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Pagamento</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Liberação</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaigns.map((campaign, index) => (
                        <>
                          {campaign.donations && campaign.donations.map((donation, i) =>
                            <TableRow key={i}>
                              <TableCell>{campaign.title}</TableCell>
                              <TableCell>R$ {formatCurrency(`${donation.value}`)}</TableCell>
                              <TableCell>{currentDateFormatedDDMMYYYHH(donation.donatedAt)}</TableCell>
                              <TableCell>
                                {donation.type === 0 && ("PIX")}
                                {donation.type === 1 && ("Cartão")}
                              </TableCell>
                              <TableCell>
                                {donation.status === 0 && (<Chip size="small" label="Pendente" color="warning" />)}
                                {donation.status === 1 && (<Chip size="small" style={{ color: "#fff" }} label="Recebido" color="success" />)}
                                {donation.status === 2 && (<Chip size="small" label="Cancelado" color="error" />)}
                              </TableCell>
                              <TableCell>
                                {donation.balanceStatus === 1 && (<Chip size="small" style={{ color: "#fff" }} label="Liberado" color="success" />)}
                                {donation.balanceStatus === 2 && (<Chip size="small" label="Aguardando" color="warning" />)}
                                {donation.balanceStatus === 3 && (<Chip size="small" style={{ color: "#fff" }} label="Suspenso" color="error" />)}
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary" textAlign={'center'}>
                  Você não possui nenhuma campanha com doação
                </Typography>
              )
            ) : (
              <Typography variant="body2" color="textSecondary" textAlign={'center'}>
                Nenhuma campanha encontrada
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography variant="subtitle2" color="initial">
              Extrato de Campanhas Adquiridas
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {digitalStickers && digitalStickers.length > 0 ? (
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Valor pago</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {digitalStickers.map((kaixinha, i) => (
                      <>
                        <TableRow key={i}>
                          <TableCell>{kaixinha.quantity}</TableCell>
                          <TableCell>R$ {formatCurrency(`${kaixinha.value}`)}</TableCell>
                          <TableCell>
                            {kaixinha.status === 0 && (<Chip size="small" label="Pendente" color="warning" />)}
                            {kaixinha.status === 1 && (<Chip size="small" style={{ color: "#fff" }} label="Pago" color="success" />)}
                            {kaixinha.status === 2 && (<Chip size="small" label="Cancelado" color="error" />)}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary" textAlign={'center'}>
                Nenhuma campanha adquirida
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography variant="subtitle2" color="initial">
              Transações
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {(!transactions || transactions.length === 0) ? (
              <Typography variant="body2" color="textSecondary" textAlign={'center'}>
                Você não possui nenhuma transação
              </Typography>
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{minWidth: 70}}>Valor</TableCell>
                        <TableCell sx={{minWidth: 140}}>Data</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>R$ {formatCurrency(`${transaction.liquid  * 100}`)}</TableCell>
                          <TableCell>{currentDateFormatedDDMMYYYHH(transaction.createdAt)}</TableCell>
                          <TableCell>{transaction?.description ?? transaction?.reasonToFailed}</TableCell>
                          <TableCell>
                            {transaction.status === 0 && (<Chip label="Processando" color="warning" />)}
                            {transaction.status === 2 && (<Chip label="Sucesso" color="success" />)}
                            {transaction.status === 3 && (<Chip label="Falhou" color="error" />)}
                            {transaction.status === 4 && (<Chip label="Aguardando liberação" color="warning" />)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {totalItems > pageSize && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={Math.ceil(totalItems / pageSize)} // Calcula o número total de páginas
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      size={!isMobile ? 'large' : 'medium'}
                      showFirstButton
                      showLastButton
                      hidePrevButton
                      hideNextButton
                      sx={{
                        '& .Mui-selected': { color: '#FFF' } // Cor do número selecionado
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  );
}