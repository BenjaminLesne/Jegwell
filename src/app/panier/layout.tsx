import "~/styles/globals.css";
import { BRAND_NAME } from "~/lib/constants";
import { Footer } from "~/components/Footer/Footer";
import { Header } from "~/components/Header/Header";

export const metadata = {
  title: `${BRAND_NAME} | panier`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
