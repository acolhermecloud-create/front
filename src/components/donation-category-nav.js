import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Container } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useCampaign } from '@/context/CampaignContext';

export default function DonationCategoryNav() {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [activeItem, setActiveItem] = useState(undefined);

  const theme = useTheme();

  const { handleSetCategoryId, categories } = useCampaign();

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      checkOverflow();
    }
  };

  const checkOverflow = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  const handleOnChangeCategory = (categoryId) => {
    handleSetCategoryId(categoryId);
    setActiveItem(categoryId);
  }

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [categories]);

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ minHeight: 'auto', padding: '0' }}>
          <Box position="relative" width="100%" id="wannadonate">
            {showLeftArrow && (
              <IconButton
                onClick={() => scroll('left')}
                sx={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'background.paper' },
                }}
                aria-label="move-to-left"
              >
                <ChevronLeft />
              </IconButton>
            )}
            <Box
              ref={scrollContainerRef}
              sx={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                gap: '8px',
                py: 1,
                width: '100%',
              }}
              onScroll={checkOverflow}
            >
              <Button
                  key={-1}
                  onClick={() => handleOnChangeCategory(undefined)}
                  sx={{
                    borderRadius: '20px',
                    bgcolor: !activeItem ? '#ffebee' : 'transparent',
                    color: !activeItem ? theme.palette.primary.main : 'inherit',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      bgcolor: !activeItem ? '#ffebee' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Todos
                </Button>
              {categories && categories.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => handleOnChangeCategory(item.id)}
                  sx={{
                    borderRadius: '20px',
                    bgcolor: activeItem === item.id ? '#ffebee' : 'transparent',
                    color: activeItem === item.id ? theme.palette.primary.main : 'inherit',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      bgcolor: activeItem === item.id ? '#ffebee' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
            {showRightArrow && (
              <IconButton
                onClick={() => scroll('right')}
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'background.paper' },
                }}
                aria-label="move-to-right"
              >
                <ChevronRight />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Container>
  );
}
