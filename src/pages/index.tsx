import { type GetServerSidePropsContext, InferGetServerSidePropsType, type NextPage } from "next";
import Navbar from "../components/navs/navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";
import { useSession } from "next-auth/react";
import ChatsNav from "../components/navs/chatsNav";
import FriendsNav from "../components/navs/friendsNav";
import Link from "next/link";
import FeedPost from "../components/feed/feedPost";
import { prisma } from "../server/db";

const Home: NextPage = ({ posts, image }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { status } = useSession();

  if (status == "authenticated") {
    return (
      <>
        <Navbar />
        <div className="flex mt-5 gap-5">
          <FriendsNav />
          <main className="w-[90vw] mx-auto md:w-1/2">
            {
              posts.map((post) => <FeedPost authorName={post.author.name} authorId={post.author.id}
                                            authorImage={post.author.image} text={post.content} image={image}
                                            createdAt={post.createdAt} />)
            }
            <Link href="/post/new">
              <svg className="bg-red-500 rounded-full fill-white fixed bottom-[1rem] md:right-[28%] right-[10%]"
                   xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                <path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" />
              </svg>
            </Link>
          </main>
          <ChatsNav />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex mt-5 gap-5">
        <main className="w-[90vw] mx-auto md:w-1/2">
          {
            posts.map((post) => <FeedPost authorName={post.author.name} authorId={post.author.id}
                                          authorImage={post.author.image} text={post.content} image={image}
                                          createdAt={post.createdAt} />)
          }
        </main>
      </div>
      <footer className="fixed h-20 w-screen bottom-0 left-0 bg-red-500 flex place-items-center">
        <h1 className="text-white text-xl p-5 mr-auto hidden md:block">
          Don't be left alone - Be conneted to your community
        </h1>
        <Link href="/auth/signin" className="text-white text-[120%] w-fit m-10 p-2 px-5 rounded-lg bg-white text-black">
          Sing in
        </Link>
      </footer>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();

  const posts = await prisma.post.findMany({
    select: {
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });

  const formattedPosts = posts.map(post => {
    return {
      content: post.content,
      createdAt: post.createdAt.toString(),
      author: post.author// convert the timestamp to a string
    }
  })

  return {
    props: {
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      ),
      posts: formattedPosts,
      image: data.message
    }
  };
}