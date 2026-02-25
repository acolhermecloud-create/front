// pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-TPJXLJG8KD" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-TPJXLJG8KD');
              `,
            }}
          />

          {/* Fonte Open Sans via Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100..900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=G-TPJXLJG8KD"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
