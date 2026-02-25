import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';

export default function PolicyPrivacy() {
  return (
    <Container maxWidth="md" sx={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <Typography variant="h3" gutterBottom>
        Política de Privacidade
      </Typography>

      <Typography variant="body1" paragraph>
        A sua privacidade é importante para nós. É política do Acolher respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Acolher, e outros sites que possuímos e operamos.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Coleta de Informações
      </Typography>
      <Typography variant="body1" paragraph>
        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Armazenamento de Dados
      </Typography>
      <Typography variant="body1" paragraph>
        Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Compartilhamento de Informações
      </Typography>
      <Typography variant="body1" paragraph>
        Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Links Externos
      </Typography>
      <Typography variant="body1" paragraph>
        O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Controle de Informações
      </Typography>
      <Typography variant="body1" paragraph>
        Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Consentimento
      </Typography>
      <Typography variant="body1" paragraph>
        O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Google AdSense
      </Typography>
      <Typography variant="body1" paragraph>
        O serviço Google AdSense que usamos para veicular publicidade usa um cookie DoubleClick para veicular anúncios mais relevantes em toda a Web e limitar o número de vezes que um determinado anúncio é exibido para você.
      </Typography>
      <Typography variant="body1" paragraph>
        Para mais informações sobre o Google AdSense, consulte as{' '}
        <Link href="https://support.google.com/adsense/answer/1348695" target="_blank" rel="noopener">
          FAQs oficiais sobre privacidade do Google AdSense
        </Link>.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Anúncios
      </Typography>
      <Typography variant="body1" paragraph>
        Utilizamos anúncios para compensar os custos de funcionamento deste site e fornecer financiamento para futuros desenvolvimentos. Os cookies de publicidade comportamental usados ​​por este site foram projetados para garantir que você forneça os anúncios mais relevantes sempre que possível, rastreando anonimamente seus interesses e apresentando coisas semelhantes que possam ser do seu interesse.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Parceiros Afiliados
      </Typography>
      <Typography variant="body1" paragraph>
        Vários parceiros anunciam em nosso nome e os cookies de rastreamento de afiliados simplesmente nos permitem ver se nossos clientes acessaram o site através de um dos sites de nossos parceiros, para que possamos creditá-los adequadamente e, quando aplicável, permitir que nossos parceiros afiliados ofereçam qualquer promoção que pode fornecê-lo para fazer uma compra.
      </Typography>

      <Typography variant="h4" gutterBottom>
        Compromisso do Usuário
      </Typography>
      <Typography variant="body1" paragraph>
        O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Acolher oferece no site e com caráter enunciativo, mas não limitativo:
      </Typography>
      <Box component="ul" sx={{ pl: 4 }}>
        <Typography variant="body1" component="li" paragraph>
          A. Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;
        </Typography>
        <Typography variant="body1" component="li" paragraph>
          B. Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, pixbet ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;
        </Typography>
        <Typography variant="body1" component="li" paragraph>
          C. Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Acolher, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        Mais Informações
      </Typography>
      <Typography variant="body1" paragraph>
        Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
      </Typography>

      <Typography variant="body1" paragraph>
        Esta política é efetiva a partir de <strong>12 de Fevereiro de 2025, 12:13</strong>.
      </Typography>
    </Container>
  );
}