// components/DonationCardV2.jsx

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, Skeleton, Stack } from "@mui/material";
import { ArrowForward, CardGiftcard } from '@mui/icons-material';
import { formatCurrency, getCachedFileUrl, getTotalDonations, truncateText } from '../utils/functions';
import { ProgressBarWithLabel } from './progressbar-with-label';
import Carousel from 'react-material-ui-carousel';
import { useRouter } from "next/router";
import Link from "next/link";

export default function DonationCardV2({
  isLoading, title, slug, goalAmount, donations, category, medias
}) {

  const router = useRouter();

  // Gera a query string com os parâmetros atuais
  const currentQuery = new URLSearchParams(router.query).toString();
  const fullLink = `/vaquinha/${slug}${currentQuery ? `?${currentQuery}` : ''}`;


  const [images, setImages] = useState([]);
  const [totalOfDonationsInBRL, setTotalOfDonationsInBRL] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [totalSmallDonation, setTotalSmallDonation] = useState(0);

  const handleGetFileUrl = async () => {
    if (!medias || medias.length === 0) return;

    const imageUrls = await Promise.all(medias.map(getCachedFileUrl));
    setImages(imageUrls);
  };

  useEffect(() => {
    if (donations) {
      const smallDonations = donations.filter(x => x.status === 1 && x.type === 1);
      const sumTotalSmallDonations = smallDonations.reduce((acc, donation) => acc + donation.amount, 0);
      setTotalSmallDonation(sumTotalSmallDonations);

      const financialGoalInCents = goalAmount;
      const { totalInCents } = getTotalDonations(donations);
      setTotalOfDonationsInBRL(formatCurrency(`${totalInCents}`));
      const progress = (totalInCents / financialGoalInCents) * 100;
      setProgressPercent(parseFloat(progress.toFixed(2)));
    }
  }, [donations]);

  useEffect(() => {
    handleGetFileUrl();
  }, [medias]);

  if (isLoading) {
    return (
      <Card sx={{ maxWidth: 400, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <Skeleton variant="rectangular" height={200} width="100%" />
          <Skeleton variant="rectangular" width={80} height={24} sx={{ position: 'absolute', right: 16, bottom: -12, borderRadius: 1 }} />
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width="70%" height={32} />
          <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Box>
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="text" width={100} height={24} sx={{ mt: 1 }} />
            </Box>
            <Box>
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="text" width={100} height={24} sx={{ mt: 1 }} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" width="100%" height={48} sx={{ mt: 2, borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          zIndex: 999,
          top: 5,
          left: 20,
          backgroundColor: 'rgba(0,0,0, 0.2)',
          py: 0.5,
          px: 1,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Stack direction={'row'} spacing={1} alignContent={'center'}>
            <CardGiftcard color="light" fontSize="small" />
            <Typography variant="body2" fontWeight={700} color="white" display={'flex'} alignContent={'center'}>
              {totalSmallDonation}
            </Typography>
          </Stack>
        </Box>
        <Carousel
          animation={false}
          indicators={false}
          swipe={true}
          sx={{ height: 200, overflow: 'hidden' }}
        >
          {(images.length === 0 ? ['/assets/images/img_loading.png'] : images).map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image}
              alt={`Campaign image ${index + 1}`}
              sx={{ height: 200, width: '100%', objectFit: 'cover' }}
            />
          ))}
        </Carousel>
        <Chip
          label={category}
          sx={{
            position: 'absolute',
            right: 16,
            bottom: -12,
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 500,
            fontSize: '0.875rem',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            zIndex: 999
          }}
        />
      </Box>
      <CardContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle1" component="h4" sx={{ fontWeight: 500 }}>
            {truncateText(title, 30)}
          </Typography>
        </Box>
        <Box sx={{ py: 1 }}>
          <ProgressBarWithLabel progress={progressPercent} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
              Arrecadado
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              R$ {formatCurrency(`${totalOfDonationsInBRL}`)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
              Meta
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              R${formatCurrency(`${goalAmount}`)}
            </Typography>
          </Box>
        </Box>
        <Link href={fullLink} passHref legacyBehavior>
          <Button
            component="a"
            variant="contained"
            fullWidth
            endIcon={<ArrowForward />}
            sx={{
              py: 1.6,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 15,
              background: "linear-gradient(135deg, #F43F5E, #E11D48)",
              boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #F43F5E, #BE123C)",
              },
            }}
          >
            Saber mais
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
