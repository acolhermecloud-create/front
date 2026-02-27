import BtnCreateCampaing from "@/components/btn-create-campaign";
import BtnDonateNow from "@/components/btn-donate";
import CtaSection from "@/components/cta-section";
import { InstitucionalVideo } from "@/components/video";
import { Box, Button, Container, Grid, Link, List, ListItem, Stack, Typography }
  from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function AboutUs() {

  const theme = useTheme();

  return (
    <div>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6 }}>
        {/** COMO FUNCIONA */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={6} display={'flex'} alignItems={'center'}>
            <InstitucionalVideo 
              height={315} 
              thumbnail={'https://integras-public.s3.sa-east-1.amazonaws.com/thumb-Acolher.jpg'}/>
          </Grid>
          <Grid item xs={12} md={6} lg={6} spacing={2}>
            <Typography variant="overline" color="primary"
              fontSize={{ xs: '0.8rem', sm: '1rem' }}>
              Como funciona
            </Typography>
            <Typography variant="h2" color="initial"
              fontSize={{ xs: '1.5rem', sm: '2.8rem' }}
              sx={{ fontWeight: 600, }}>
              A sua jornada no Acolher
            </Typography>
            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1rem' }}>
              Apoie seus sonhos com o Acolher No Acolher, você encontra o poder de transformar ideias em realidade com o apoio de uma comunidade solidária.
              Acompanhe nosso guia para criar e divulgar sua campanha de forma eficaz e alcançar sua meta.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={4}>
              <BtnCreateCampaing />
              <BtnDonateNow />
            </Stack>
          </Grid>
        </Grid>

        {/** CRIE SUA Acolher */}
        <Grid container spacing={4} sx={{ pt: 6 }}>
          <Grid item xs={12} md={6} lg={6} spacing={2} alignSelf={'center'}>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%', // torna o Box circular
                  width: 30,           // largura fixa para o círculo
                  height: 30,          // altura fixa para o círculo
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }} color="light">1</Typography>
              </Box>
              <Typography variant="h2" color="initial"
                fontSize={{ xs: '1.5rem', sm: '2rem' }}
                sx={{ fontWeight: 600, }}>
                Crie sua Acolher
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Defina sua Meta
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Inicie com uma meta clara Dê o primeiro passo definindo quanto deseja arrecadar e o
              motivo. Se é um projeto pessoal, comunitário ou um grande sonho,
              compartilhe sua visão com clareza e inspiração para conectar-se com seus doadores.
            </Typography>

            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Conte sua história
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Conte a sua história Sua história é única e merece ser compartilhada.
              Expresse o porquê da sua campanha e o impacto de cada doação. Ao incluir uma imagem,
              você fortalece essa conexão, tornando sua campanha ainda mais pessoal e atraente.
            </Typography>

          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <img src="https://i.ibb.co/GfHSTWXz/vecteezy-woman-working-on-computer-notebook-planner-3444482.jpg"
              style={{ borderRadius: 15, maxWidth: '100%' }} />
          </Grid>
        </Grid>

        {/** DIVULGUE SUA Acolher */}
        <Grid container spacing={4} sx={{ pt: 6 }}>
          <Grid item xs={12} md={6} lg={6}>
            <img src="https://i.ibb.co/23yhMdH0/vecteezy-3d-colorful-megaphone-on-a-white-background-27292007.jpg"
              style={{ borderRadius: 15, maxWidth: '100%' }} />
          </Grid>
          <Grid item xs={12} md={6} lg={6} spacing={2} alignSelf={'center'}>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%', // torna o Box circular
                  width: 30,           // largura fixa para o círculo
                  height: 30,          // altura fixa para o círculo
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }} color="light">2</Typography>
              </Box>
              <Typography variant="h2" color="initial"
                fontSize={{ xs: '1.5rem', sm: '2rem' }}
                sx={{ fontWeight: 600, }}>
                Divulgue
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Use as redes sociais
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Ganhe visibilidade com as redes sociais
              Compartilhar sua campanha nas redes sociais aumenta o alcance,
              mas não hesite em pedir que amigos e familiares ajudem na divulgação.
              Uma campanha bem divulgada gera mais apoio e visibilidade.
            </Typography>

            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Envie mensagens diretas
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Envie mensagens personalizadas Mensagens diretas podem fazer a diferença!
              Abordagens personalizadas incentivam as pessoas a compartilhar sua campanha,
              aumentando o alcance e as chances de sucesso.
            </Typography>

          </Grid>
        </Grid>

        {/** CRIE UMA EQUIPE */}
        <Grid container spacing={4} sx={{ pt: 6 }}>
          <Grid item xs={12} md={6} lg={6} spacing={2} alignSelf={'center'}>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%', // torna o Box circular
                  width: 30,           // largura fixa para o círculo
                  height: 30,          // altura fixa para o círculo
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }} color="light">3</Typography>
              </Box>
              <Typography variant="h2" color="initial"
                fontSize={{ xs: '1.5rem', sm: '2rem' }}
                sx={{ fontWeight: 600, }}>
                Crie uma equipe para te ajudar
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Vaquinhas que possuem equipes arrecadam 30% mais. Sabe por que?
            </Typography>

            <List>
              <ListItem disableGutters>
                <Typography
                  variant="subtitle1"
                  fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
                  sx={{ fontWeight: 500 }}
                >
                  1. Sua equipe assume a responsabilidade de ajudar na divulgação e tem acesso às ferramentas de divulgação dentro da área logada do Vakinha.
                </Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography
                  variant="subtitle1"
                  fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
                  sx={{ fontWeight: 500 }}
                >
                  2. Quem estiver na sua equipe pode ajudar postando atualizações, novidades, agradecendo quem já doou.
                </Typography>
              </ListItem>
            </List>

            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              E vale lembrar que prezamos sempre pela sua segurança
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Saques, transferências de valores e contas bancárias são funcionalidades exclusivas suas!
            </Typography>

          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <img src="https://i.ibb.co/6RfgpS5W/closeup-diverse-people-joining-their-hands.jpg"
              style={{ borderRadius: 15, maxWidth: '100%' }} />
          </Grid>
        </Grid>

        {/** DIVULGUE SUA Acolher */}
        <Grid container spacing={4} sx={{ pt: 6 }}>
          <Grid item xs={12} md={6} lg={6}>
            <img src="https://i.ibb.co/8DKGc1Mn/excited-young-woman-hold-paper-letter-feel-euphoric-receiving-job-promotion-tax-refund-from-bank-hap.jpg"
              style={{ borderRadius: 15, maxWidth: '100%' }} />
          </Grid>
          <Grid item xs={12} md={6} lg={6} spacing={2} alignSelf={'center'}>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%', // torna o Box circular
                  width: 30,           // largura fixa para o círculo
                  height: 30,          // altura fixa para o círculo
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }} color="light">4</Typography>
              </Box>
              <Typography variant="h2" color="initial"
                fontSize={{ xs: '1.5rem', sm: '2rem' }}
                sx={{ fontWeight: 600, }}>
                Incentive a compra de Corações
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Use as redes sociais
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Destaque sua campanha Os corações são o símbolo do apoio! Quanto mais corações,
              maior a visibilidade da sua campanha. Incentive seus apoiadores a adquirir
              corações e dar destaque à sua vaquinha, aumentando o engajamento.
            </Typography>

            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Mostre o valor dos Corações
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Mostre o valor dos corações Explique aos seus apoiadores que cada coração é uma
              forma de impulsionar sua campanha, gerando ainda mais chances de sucesso.
              Quanto mais visível, mais chances de novas contribuições.
            </Typography>

          </Grid>
        </Grid>

        {/** AGRADEÇA */}
        <Grid container spacing={4} sx={{ pt: 6 }}>
          <Grid item xs={12} md={6} lg={6} spacing={2} alignSelf={'center'}>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%', // torna o Box circular
                  width: 30,           // largura fixa para o círculo
                  height: 30,          // altura fixa para o círculo
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }} color="light">5</Typography>
              </Box>
              <Typography variant="h2" color="initial"
                fontSize={{ xs: '1.5rem', sm: '2rem' }}
                sx={{ fontWeight: 600, }}>
                Agradeça e conte novidades
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Crie uma comunidade de gratidão
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Fortaleça a conexão com gratidão Agradeça cada contribuição de forma personalizada.
              Essa proximidade mantém a motivação dos apoiadores e fortalece o vínculo com sua campanha.
            </Typography>

            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Atualize sua vaquinha postando novidades
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Compartilhe o progresso Informar sobre as conquistas e os próximos passos mantém o
              engajamento. Cada atualização reforça o impacto das doações, deixando os
              apoiadores animados com o progresso.
            </Typography>

          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <img src="https://i.ibb.co/1tjZGQpR/image-cute-african-american-woman-saying-thank-you-smiling-press-hands-together.jpg"
              style={{ borderRadius: 15, maxWidth: '100%' }} />
          </Grid>
        </Grid>

        {/** COMEMORAÇÃO */}
        <Grid container spacing={4} sx={{ pt: 6 }}>
          <Grid item xs={12} md={6} lg={6}>
            <img src="https://i.ibb.co/B5q7N1qz/menina-feliz-em-jaqueta-branca-soprando-confete-durante-uma-sessao-de-fotos-sobre-um-fundo-bege-2916.jpg"
              style={{ borderRadius: 15, maxWidth: '100%' }} />
          </Grid>
          <Grid item xs={12} md={6} lg={6} spacing={2} alignSelf={'center'}>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%', // torna o Box circular
                  width: 30,           // largura fixa para o círculo
                  height: 30,          // altura fixa para o círculo
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }} color="light">6</Typography>
              </Box>
              <Typography variant="h2" color="initial"
                fontSize={{ xs: '1.5rem', sm: '2rem' }}
                sx={{ fontWeight: 600, }}>
                Hora de comemorar!
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              Saque o valor arrecadado
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Aproveite os frutos da sua campanha Ao atingir sua meta, é hora de celebrar!
              Você pode acompanhar o processo de saque e entender cada etapa da transação até
              que os valores estejam disponíveis na sua conta.
            </Typography>

            <Typography variant="subtitle1" color="initial" pt={2}
              fontSize={{ xs: '0.8rem', sm: '1.2rem' }}
              sx={{ fontWeight: 600 }}>
              À sua disposição
            </Typography>

            <Typography variant="subtitle1" color="initial"
              fontSize={{ xs: '0.7rem', sm: '0.9rem' }}
              sx={{ fontWeight: 500 }}>
              Sempre ao seu lado Nossa equipe está aqui para ajudar em qualquer etapa do processo.
              Seja uma dúvida técnica ou uma questão sobre transferências,
              conte conosco para garantir que você tenha uma experiência tranquila e
              segura no Acolher.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <CtaSection />
    </div>
  );
}