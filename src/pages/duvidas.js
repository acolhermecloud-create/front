import CtaSection from "@/components/cta-section";
import { Box, Button, Container, Typography }
  from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useState } from "react";
import PropTypes from 'prop-types';
import FaqTaxExplanation from "@/components/faqs/tax";
import FaqHowToDonate from "@/components/faqs/how-to-donate";
import FaqGeneral from "@/components/faqs/geral";

export default function Doubts() {

  const theme = useTheme();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box>
        <Container maxWidth="lg" sx={{ pt: 4, mb: 4 }}>
          <Typography variant="h4"
            textAlign={'center'}
            fontSize={{ xs: '1rem', sm: '3rem' }}
            fontWeight={600} color="initial"
            mt={2}
            mb={6}>
            Perguntas Frequentes
          </Typography>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}>
              <Button
                sx={{
                  mb: 2, mx: 2,
                  color: value === 0 ? theme.palette.light.main : theme.palette.dark.main,
                  bgcolor: value === 0 ? theme.palette.primary.main : theme.palette.light.disabled,
                  borderColor: '#fff'
                }}
                variant={value === 0 ? 'contained' : 'outlined'} onClick={() => handleChange(null, 0)}>
                {`FAQ Geral`}
              </Button>

              {/*
              <Button
                sx={{
                  mb: 2, mx: 2,
                  color: value === 1 ? theme.palette.light.main : theme.palette.dark.main,
                  bgcolor: value === 1 ? theme.palette.primary.main : theme.palette.light.disabled,
                  borderColor: '#fff'
                }}
                variant={value === 1 ? 'contained' : 'outlined'} onClick={() => handleChange(null, 1)}>
                {`Como contribuir`}
              </Button>
              <Button
                sx={{
                  mb: 2, mx: 2,
                  color: value === 2 ? theme.palette.light.main : theme.palette.dark.main,
                  bgcolor: value === 2 ? theme.palette.primary.main : theme.palette.light.disabled,
                  borderColor: '#fff'
                }}
                variant={value === 2 ? 'contained' : 'outlined'} onClick={() => handleChange(null, 2)}>
                {`Taxas`}
              </Button>
              */}
            </Box>

            <CustomTabPanel value={value} index={0}>
              <FaqTaxExplanation />
            </CustomTabPanel>
            {/*
            <CustomTabPanel value={value} index={1}>
              <FaqHowToDonate />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <FaqGeneral />
            </CustomTabPanel>*/}
          </Box>
        </Container>

        {/**  CTA */}
        <CtaSection />
      </Box>
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}