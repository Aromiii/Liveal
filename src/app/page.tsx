import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
        <div className="flex mt-5 gap-5">
          <aside className="w-1/6">
            <div className="h-36 bg-white rounded-lg">

            </div>
            <div className="bg-white rounded-lg h-72 mt-5">
              <h1>
                Friends
              </h1>
            </div>
          </aside>
          <main className=" bg-white h-96 w-1/2 mx-auto rounded-lg">

          </main>
          <aside className="w-1/6 bg-white rounded-lg">
            <h1>
              Chats
            </h1>
          </aside>
        </div>
    </>
  );
};

export default Home;