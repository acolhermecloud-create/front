// app/layout.jsx ou app/layout.tsx (ou pages/_app.js caso esteja usando pages router)
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Box, ThemeProvider } from "@mui/material";
import theme from "./theme";
import Head from "next/head";
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Head>
          <title>Acolher</title>
          <meta name="description" content="Transformamos solidariedade em ação 🧡, Doe, crie campanhas e conecte corações!" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />

          {/* Facebook Pixel */}
          <script dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1554207512648166');
              fbq('init', '988398956462728');
              fbq('track', 'PageView');
            `,
          }} />

          {/* Google Tag Manager */}
          <script dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5JKHZXHS');
            `
          }} />

          {/* Hotjar Tracking Code for https://www.Acolher.io/ */}
          <script dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:5359911,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `
          }} />
        </Head>

        {/* noscript tags for tracking fallback */}
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1554207512648166&ev=PageView&noscript=1" />
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=988398956462728&ev=PageView&noscript=1" />
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5JKHZXHS"
            height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>

        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            {children}
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default RootLayout;
