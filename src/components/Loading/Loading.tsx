import Head from "next/head";

export function Loading() {
  return (
    <>
      <Head>
        <title>Chargement...</title>
      </Head>
      <main className="h-[80dvh]">
      <div className="flex items-center justify-center absolute inset-0">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
      </main>
    </>
  );
}
