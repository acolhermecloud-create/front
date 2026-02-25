import { AddBox } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from "@mui/material";

export default function FaqHowToDonate() {
  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={8} sx={{ alignContent: 'center' }}>
          <Accordion defaultExpanded sx={{ p: 2 }}>
            <AccordionSummary
              expandIcon={<AddBox color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontWeight={500}>Taxas do Campanha</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ p: 2 }}>
            <AccordionSummary
              expandIcon={<AddBox color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontWeight={500}>Como contribuir</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ p: 2 }}>
            <AccordionSummary
              expandIcon={<AddBox color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontWeight={500}>É possível abrir uma vaquinha na Campanha?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ p: 2 }}>
            <AccordionSummary
              expandIcon={<AddBox color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontWeight={500}>Existe um contrato entre a VOAA e o beneficiário?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ p: 2 }}>
            <AccordionSummary
              expandIcon={<AddBox color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontWeight={500}>Dúvidas sobre pagamentos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={4} sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <img
            src="https://integras-public.s3.sa-east-1.amazonaws.com/IMG7.png"
            style={{ maxWidth: '100%', borderRadius: 10 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
