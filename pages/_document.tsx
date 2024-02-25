import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="See pictures from Kirk's 7th Birthday Superhero Bash."
          />
          <meta property="og:site_name" content="nextjsconf-pics.vercel.app" />
          <meta
            property="og:description"
            content="See pictures from Kirk's 7th Birthday Superhero Bash."
          />
          <meta property="og:title" content="Kirk's 7th Birthday Superhero Bash Pictures" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Kirk's 7th Birthday Superhero Bash Pictures" />
          <meta
            name="twitter:description"
            content="See pictures from Kirk's 7th Birthday Superhero Bash."
          />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
