import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Liveal - Be connected</title>
        <meta name="description" content="Liveal - Be connected" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen place-content-center place-items-center bg-black">
          <h1 className="font-bold text-5xl text-red-600 px-28 py-10 bg-white rounded-full">
            Liveal - Be connected
          </h1>
      </main>
    </>
  );
};

export default Home;
