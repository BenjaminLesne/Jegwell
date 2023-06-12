import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { type AppType } from "next/app";

import { api } from "~/lib/api";

import "~/styles/globals.css";
import Head from "next/head";
import { BRAND_NAME } from "~/lib/constants";
import { Header } from "~/components/Header/Header";
import { Footer } from "~/components/Footer/Footer";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>{BRAND_NAME}</title>
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default api.withTRPC(MyApp);
