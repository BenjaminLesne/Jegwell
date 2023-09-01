import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { type AppType } from "next/app";

import { api } from "~/lib/api";

import "~/styles/globals.css";
import Head from "next/head";
import { BASE_ADMIN_ROUTE, BRAND_NAME } from "~/lib/constants";
import { Header } from "~/components/Header/Header";
import { Footer } from "~/components/Footer/Footer";
import { useRouter } from "next/router";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const showHeaderFooter =
    [BASE_ADMIN_ROUTE].includes(router.pathname) === false;
  return (
    <>
      <Head>
        <title>{BRAND_NAME}</title>
      </Head>
      {showHeaderFooter && <Header />}
      <Component {...pageProps} />
      {showHeaderFooter && <Footer />}
    </>
  );
};

export default api.withTRPC(MyApp);
