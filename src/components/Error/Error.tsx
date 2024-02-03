import Head from "next/head";
import { Button } from "../ui/Button/button";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

type Props = {
  message?: string;
};

export function Error({ message = "Une erreur est survenue." }: Props) {
  return (
    <>
      <Head>
        <title>Erreur...</title>
      </Head>
      <Header />
      <main className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <p>{message}</p>
          <Button onClick={() => window.location.reload()} variant="secondary">
            Réessayer
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
