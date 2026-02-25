'use client'
import DonationCardV2 from "@/components/donation-card-v2";
import { useCampaign } from "@/context/CampaignContext";
import { useLoading } from "@/context/LoadingContext";
import {
  Box, Container, Divider, Grid, Pagination,
  Stack,
  Typography, useMediaQuery
}
  from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Busca() {

  const router = useRouter();
  const { id } = router.query;

  const [currentSeachQuery, setCurrentSeachQuery] = useState('');

  const isMounted = useRef(true);
  const theme = useTheme();
  // Define o tamanho com base na largura da tela
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const { handleGetCampaigns, categoryId, initialDate, finalDate } = useCampaign();

  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const topRef = useRef(null); // Referência para a âncora no topo

  const getDonations = async (page, title, categoryId = undefined, startDate = undefined, endDate = undefined) => {
    setIsLoading(true);
    const response = await handleGetCampaigns({ page, pageSize, name: title, categoryId, startDate, endDate });

    if (response?.data?.items?.length > 0) {
      setCampaigns(response.data.items);
      setHasMoreItems(response.data.hasMoreItems);
      setTotalItems(response.data.totalItems);
    } else {
      setCampaigns([]);
    }

    setIsLoading(false);
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    getDonations(value); // Carregar dados da nova página
    topRef.current?.scrollIntoView({ behavior: 'smooth' }); // Rolar para o topo
  };

  useEffect(() => {
    if (id && currentSeachQuery !== id) {
      setCurrentSeachQuery(id);
      getDonations(1, id);
    }
  }, [id]);

  return (
    <div>
      <Container maxWidth="lg" sx={{ pb: 4 }}>

        {/** Title */}
        <Box sx={{ pt: 5, pb: 2, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4"
            sx={{ fontWeight: 600 }}
            color="initial">Resultado para: {id}</Typography>
        </Box>

        <div ref={topRef}></div> {/* Âncora para rolar ao topo */}
        <Grid container spacing={2} justifyContent="center">
          {isLoading &&
            Array.from({ length: pageSize }).map((_, index) => ( // Gera placeholders
              <Grid item xs={12} sm={6} md={4} key={index}>
                <DonationCardV2 loading={true} />
              </Grid>
            ))
          }
          {!isLoading && campaigns.map((campaign, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DonationCardV2
                loading={false}
                id={campaign.id}
                title={campaign.title}
                slug={campaign.slug}
                goalAmount={campaign.financialGoal}
                donations={campaign.donations}
                category={campaign.category.name}
                medias={campaign.media}
              />
            </Grid>
          ))}
          {!isLoading && campaigns.length === 0 && (
            <Grid item>
              <Divider />
              <Stack alignItems={'center'}>
                <Typography variant="h1" color="initial">😕</Typography>
                <Typography variant="h6" color="initial" fontWeight={600}>Ooops...</Typography>
                <Typography variant="h6" color="initial" fontWeight={600}>Nenhum resultado encontrado</Typography>
              </Stack>
            </Grid>
          )}
        </Grid>
        {!isLoading && totalItems > pageSize && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(totalItems / pageSize)} // Calcula o número total de páginas
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size={isDesktop ? 'large' : 'medium'}
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

      </Container>
    </div>
  );
}