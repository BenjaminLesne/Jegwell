import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { type AppType } from "next/app";

import { api } from "~/lib/api";

import "~/styles/globals.css";
import Head from "next/head";
import { BASE_ADMIN_ROUTE, BRAND_NAME, isDevelopment } from "~/lib/constants";
import { Header } from "~/components/Header/Header";
import { Footer } from "~/components/Footer/Footer";
import { useRouter } from "next/router";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";

type ConditionalHydrationOverlayProps = {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode
}

const ConditionalHydrationOverlay = ({ condition, wrapper, children }: ConditionalHydrationOverlayProps) => 
  condition ? <>{wrapper(children)}</> : <>{children}</>;

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const isAdmin = router.pathname.includes(BASE_ADMIN_ROUTE);

  return (
    <ConditionalHydrationOverlay
    condition={isDevelopment}
    wrapper={children => <HydrationOverlay>{children}</HydrationOverlay>}
    >
      <Head>
        <title>{BRAND_NAME}</title>
      </Head>
      {isAdmin === false && <Header />}
      <Component {...pageProps} />
      {isAdmin === false && <Footer />}
    </ConditionalHydrationOverlay>
  );
};


export default api.withTRPC(MyApp);
