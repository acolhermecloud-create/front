'use client'
import DonationList from "@/components/donation-list";
import { useCampaign } from "@/context/CampaignContext";
import { DeleteForever } from "@mui/icons-material";
import {
  Box, Button, Container, Divider, FormControl, MenuItem,
  OutlinedInput, Pagination, Select, Stack,
  Typography, useMediaQuery
}
  from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from "react";


export default function Vaquinhas() {

  const isMounted = useRef(true);
  const theme = useTheme();
  // Define o tamanho com base na largura da tela
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const { handleSetCategoryId, categories, handleGetCategories, handleSetDate } = useCampaign();
  const [activeCategory, setActiveCategory] = useState(undefined);

  const [date, setDate] = useState(undefined);

  const handleOnChangeCategory = (categoryId) => {
    handleSetCategoryId(categoryId);
    setActiveCategory(categoryId);
  }

  const handleSetFilterDate = (filter) => {
    let initialDate = '';
    let finalDate = '';

    const today = new Date();

    if (filter === 'today') {
      // Hoje: intervalo do início ao final do dia atual
      finalDate = new Date(today);
      initialDate = new Date(today);
      initialDate.setUTCHours(0, 0, 0, 0); // Início do dia
    } else if (filter === 'thisWeek') {
      // Semana passada (últimos 7 dias até hoje)
      finalDate = new Date(today); // Hoje às 23:59:59
      initialDate = new Date(today);
      initialDate.setUTCDate(today.getUTCDate() - 6); // Sete dias antes
      initialDate.setUTCHours(0, 0, 0, 0); // Início do intervalo
    } else if (filter === 'thisMonth') {
      // Mês anterior ao dia atual
      finalDate = new Date(today); // Hoje às 23:59:59
      initialDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), 1); // Primeiro dia do mês
      initialDate.setUTCHours(0, 0, 0, 0); // Início do intervalo
    } else if (filter === 'thisYear') {
      // Ano até o dia atual
      finalDate = new Date(today); // Hoje às 23:59:59
      initialDate = new Date(today.getUTCFullYear(), 0, 1); // Primeiro dia do ano
      initialDate.setUTCHours(0, 0, 0, 0); // Início do intervalo
    }else{
      initialDate = undefined;
      finalDate = undefined;
    }

    handleSetDate(initialDate, finalDate);
    setDate(filter);

    console.log('Initial Date:', initialDate);
    console.log('Final Date:', finalDate);
  };

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      handleGetCategories();
    }
  }, []);

  return (
    <div>
      <Container maxWidth="lg" sx={{ pb: 4 }}>

        {/** Title */}
        <Box sx={{ pt: 5, pb: 2, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4"
            sx={{ fontWeight: 600 }}
            color="initial">Encontre todas nossas vaquinhas</Typography>
        </Box>

        {/** Filter */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="initial"
            fontSize={{ xs: '1.2rem', sm: '1.2rem' }}>Filtrar por:</Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}
            display={'flex'} justifyContent={'center'}>
            {/*<FormControl sx={{ width: 'auto', mt: 3 }}>
              <Select
                size="small"
                multiple
                value={['']}
                displayEmpty
                input={<OutlinedInput />}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem disabled value="">
                  <em>Qualquer estado</em>
                </MenuItem>
              </Select>
            </FormControl>*/}
            <FormControl sx={{ width: 'auto', mt: 3 }}>
              <Select
                size="small"
                value={date}
                displayEmpty
                input={<OutlinedInput />}
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => handleSetFilterDate(e.target.value)}
              >
                <MenuItem value={undefined}><em>Criadas em qualquer data</em></MenuItem>
                <MenuItem value="today">Hoje</MenuItem>
                <MenuItem value="thisWeek">Essa semana</MenuItem>
                <MenuItem value="thisMonth">Esse mês</MenuItem>
                <MenuItem value="thisYear">Esse ano</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 'auto', mt: 3 }}>
              <Select
                size="small"
                value={activeCategory}
                displayEmpty
                input={<OutlinedInput />}
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => handleOnChangeCategory(e.target.value)}
              >
                <MenuItem key={-1} value={undefined}>
                  <em>Todas as categorias</em>
                </MenuItem>
                {categories && categories.map((category, index) =>
                  (<MenuItem key={index} value={category.id}>{category.name}</MenuItem>)
                )}
              </Select>
            </FormControl>
            <Button startIcon={<DeleteForever />}>
              Limpar filtros
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ height: "0.1px", margin: "32px 0", backgroundColor: theme.palette.light.secondary }} />

        {/** Vaquinhas */}
        <DonationList />
      </Container>
    </div>
  );
}