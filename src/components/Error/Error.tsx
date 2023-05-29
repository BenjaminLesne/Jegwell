import Head from "next/head";
import { Button } from "../ui/Button/button";

export function Error({message}: {message: string}) {
  return (
    <>
      <Head>
        <title>Erreur...</title>
      </Head>
      <main className="h-[80dvh] flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
      <p>{message}</p>
      <Button onClick={() => window.location.reload()} variant="secondary">
      Réessayer
      </Button>
    </div>
      </main>
    </>
  );
}
