import Navbar from "../../components/navs/navbar";
import { useSession } from "next-auth/react";
import FriendsNav from "../../components/navs/friendsNav";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../../server/db";

const Profile = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { status } = useSession();

  if (status == "authenticated") {
    return <>
      <Navbar />
      <div className="pt-5 relative">
        <img className="h-[30vh] object-cover w-full rounded-lg"
             src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.forestryengland.uk%2Fsites%2Fdefault%2Ffiles%2Fmedia%2FSavernake.jpg&f=1&nofb=1&ipt=bdec4b84b78ef7739a8e5d24a31ffe772381fae3ac10d3f2b9dfcd4068340f18&ipo=images" />
        <div className="flex p-4 absolute w-full top-[60%]">
          <div className="w-1/6 md:block hidden">
            <div className="h-36 bg-white rounded-lg flex place-items-center flex-col">
              <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture"
                   src={user.image} />
              <h1 className="font-bold text-lg">{user.name}</h1>
            </div>
            <button className="bg-red-500 text-white p-2 px-5 text-2xl w-full mt-4 rounded-lg">
              Start chat
            </button>
          </div>
          <div className="mx-auto md:w-1/2 w-full h-72">
            <div className="h-10" />
            <main className="h-full bg-white rounded-lg">

            </main>
          </div>
          <div className="w-1/6 md:block hidden">
            <FriendsNav/>
          </div>
        </div>
      </div>
    </>;
  }

  return null;
};

export default Profile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await prisma.user.findUnique({
    where: {
      id: context.query.userId
    }
  })

  return {
    props: {
      user: {
        name: user.name,
        image: user.image
      }
    }
  };
}