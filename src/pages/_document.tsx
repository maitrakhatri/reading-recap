import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head title="2024 Reading Recap by Maitra Khatri">
        <title>2024 Reading Recap by Maitra Khatri</title>
        <meta
          name="description"
          content="Visualize your 2024 reading journey with a responsive chart and personalized categories."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Maitra Khatri" />
        <meta
          name="keywords"
          content="reading recap, books, 2024, reading chart, circle packing, visualization"
        />
        <meta
          property="og:title"
          content="2024 Reading Recap by Maitra Khatri"
        />
        <meta
          property="og:description"
          content="Track and visualize your reading journey in 2024 with a personalized chart!"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="2024 Reading Recap" />
        <meta
          name="twitter:description"
          content="Track and visualize your reading journey in 2024 with a personalized chart!"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
        />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
