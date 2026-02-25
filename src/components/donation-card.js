"use client";

import React from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, Chip, IconButton, Stack, Button } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useTheme } from '@mui/material/styles';
import { truncateText } from '../utils/functions';
import { ArrowForward, Remove } from '@mui/icons-material';

export default function DonationCard({ title, description, goalAmount, raisedAmount, progress, category, banner }) {

  const theme = useTheme();

  return (
    <Card sx={{ maxWidth: 400, borderRadius: 4, position: 'relative', boxShadow: 3 }}>
      {/* Gray placeholder for image */}
      <Box sx={{ height: 200, backgroundImage: `url(${banner})`, borderRadius: 2, mb: 2 }} />

      {/* Education Tag */}
      <Chip
        label={category}
        sx={{
          position: 'absolute',
          right: 16,
          top: 180,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.light.main,
          fontWeight: 500,
          fontSize: '0.875rem',
          px: 1,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0

        }}
      />

      <CardContent>
        {/* Title and Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h6" sx={{ fontSize: 18, fontWeight: 'bold' }}>
            {truncateText(title, 88)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'space-between'}>
              <Stack direction={'column'}>
                <Stack direction={'row'} spacing={2}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={progress}
                      size={50}
                      thickness={6}
                      sx={{ color: theme.palette.secondary.main }}
                    />
                    {/* Progress Section */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        {`${progress}%`}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack >
                    <Typography variant="subtitle2" color={theme.palette.primary.main} sx={{ fontWeight: '400' }}>
                      Arrecadado
                    </Typography>
                    <Typography variant="h6">
                      R${raisedAmount.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Remove />
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle2" color={theme.palette.primary.main} sx={{ fontWeight: '400' }}>
                      Meta
                    </Typography>
                    <Typography variant="h6">
                      R${goalAmount.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction={'row'} spacing={1} mt={2}>
                  {/* Donate Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      py: 0.6,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: theme.palette.primary.secondary,
                      },
                      mb: 2
                    }}
                  >
                    Doar agora
                  </Button>
                </Stack>
              </Stack>
              <Stack direction={'column'}>
                {/* Social Icons */}
                <IconButton size="small" sx={{ color: '#1877F2' }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: '#25D366' }}>
                  <WhatsAppIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: '#E4405F' }}>
                  <InstagramIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Box>

      </CardContent>
    </Card>
  );
}
