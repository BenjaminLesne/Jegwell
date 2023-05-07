import { type NextPage } from "next";
import Head from "next/head";

import {  TAB_BASE_TITLE } from "~/utils/constants";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>{TAB_BASE_TITLE}créations</title>
      </Head>
      <main className="">
      nos créations 
      </main>
    </>
  );
};

export default Home;
