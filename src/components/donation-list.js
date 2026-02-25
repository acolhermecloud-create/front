"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Grid, Pagination, useMediaQuery, Typography } from "@mui/material";
import DonationCardV2 from './donation-card-v2';
import { useCampaign } from '@/context/CampaignContext';
import { useTheme } from '@mui/material/styles';

export default function DonationList() {

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const isMounted = useRef(true);
  const isFirstLoading = useRef(true);
  const { handleGetCampaigns, categoryId, initialDate, finalDate } = useCampaign();

  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const topRef = useRef(null); // Referência para a âncora no topo

  const getDonations = async (page, categoryId = undefined, startDate = undefined, endDate = undefined) => {
    setIsLoading(true);
    const response = await handleGetCampaigns({ page, pageSize, categoryId, startDate, endDate });

    if (response?.data?.items?.length > 0) {
      setCampaigns(response.data.items);
      setHasMoreItems(response.data.hasMoreItems);
      setTotalItems(response.data.totalItems);
    } else {
      setCampaigns([]);
    }

    setIsLoading(false);
    isFirstLoading.current = false;
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    getDonations(value); // Carregar dados da nova página
    topRef.current?.scrollIntoView({ behavior: 'smooth' }); // Rolar para o topo
  };

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      getDonations(currentPage, categoryId, initialDate, finalDate);
    }
  }, [categoryId, initialDate, finalDate]);

  useEffect(() => {
    if (!isFirstLoading.current) {
      getDonations(1, categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    if (!isFirstLoading.current) {
      getDonations(1, categoryId, initialDate, finalDate);
    }
  }, [initialDate, finalDate]);

  return (
    <Container sx={{ pt: 2 }}>
      <div ref={topRef}></div> {/* Âncora para rolar ao topo */}
      <Grid container spacing={2} justifyContent="center">
        {isLoading &&
          Array.from({ length: pageSize }).map((_, index) => ( // Gera placeholders
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DonationCardV2 isLoading={true} />
            </Grid>
          ))
        }
        {!isLoading && campaigns.map((campaign, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DonationCardV2
              isLoading={false}
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
              '& .MuiPaginationItem-root.Mui-selected': {
                color: '#FFF' // Cor do número selecionado
              },
              '& .MuiPaginationItem-root': {
                // Cor do número não selecionado
                color: '#000'
              }
            }}
          />
        </Box>
      )}
      {!isLoading && campaigns.length === 0 && (
        <>
          <Typography variant="h5" fontWeight={700} align="center">
            Oops 🙁
          </Typography>
          <Typography variant="h6" color="initial" align="center">
            Nenhum resultado para a busca realizada!
          </Typography>
        </>
      )}
    </Container>
  );
}
