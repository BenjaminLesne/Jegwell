import Head from "next/head";

export function Loading() {
  return (
    <>
      <Head>
        <title>Chargement...</title>
      </Head>
      <div
        className="absolute inset-0 flex items-center justify-center"
        role="progressbar"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    </>
  );
}
