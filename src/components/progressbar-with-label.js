import { LinearProgress, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function ProgressBarWithLabel({ progress }) {
  const theme = useTheme();
  const safeProgress = Math.min(progress, 100); // trava a barra, mas não o texto

  return (
    <Box position="relative" display="flex" flexDirection="column" alignItems="center" width="100%">
      <LinearProgress
        variant="determinate"
        value={safeProgress}
        sx={{
          width: '100%',
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
        role="progressbar"
        aria-label="amount-progress"
      />
      <Box
        position="absolute"
        top="-25px"
        right="20px"
        transform="translateX(50%)"
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 400 }}
          color="textPrimary"
        >{`${progress}%`}</Typography>
      </Box>
    </Box>
  );
}