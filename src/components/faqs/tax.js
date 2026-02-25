import theme from "@/theme";
import { AddBox } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from "@mui/material";

export default function FaqTaxExplanation() {
  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={4} sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <img
            src="https://integras-public.s3.sa-east-1.amazonaws.com/IMG7.png"
            style={{ maxWidth: '100%', borderRadius: 10 }}
          />
        </Grid>
        <Grid item xs={12} sm={8} sx={{ alignContent: 'center' }}>
          <Accordion defaultExpanded sx={{ p: 2 }}>
            <AccordionSummary
              expandIcon={<AddBox color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontWeight={500}>Taxas do Acolher</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontWeight={300}>
                As taxas do Acolher começam a partir de 9,90% sobre o valor arrecadado.
                Essa taxa cobre toda a estrutura da plataforma, suporte e estratégias de marketing para acelerar a arrecadação da sua vaquinha.
                O valor exato pode variar conforme o plano escolhido.
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
              <Typography fontWeight={300}>
                Para contribuir com uma vaquinha na Acolher, basta acessar a campanha desejada, escolher um valor e realizar o pagamento via Pix ou cartão.
                O processo é rápido, seguro e transparente.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ p: 2 }}>
            <AccordionSummary
              expandIcon={<AddBox color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontWeight={500}>É possível abrir uma vaquinha na Acolher?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontWeight={300}>
                Sim! Qualquer pessoa pode criar uma vaquinha na Acolher para arrecadar fundos para uma causa pessoal ou de terceiros.
                Basta se cadastrar na plataforma, preencher as informações da campanha e começar a arrecadação.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ p: 2 }}>
            <AccordionSummary
              expandIcon={<AddBox color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontWeight={500}>Existe um contrato entre o Acolher e o beneficiário?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontWeight={300}>
                Sim. Ao criar uma vaquinha na Acolher, o beneficiário concorda com os termos de uso da plataforma, incluindo as taxas e regras de arrecadação.
                O contrato digital garante transparência e segurança para todas as partes envolvidas.
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
              <Typography fontWeight={300}>
                Se você tem dúvidas sobre pagamentos, prazos de repasse ou formas de contribuição, entre em contato com nosso suporte.
                Estamos disponíveis para esclarecer qualquer questão e garantir que sua arrecadação aconteça da melhor forma possível.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
}
