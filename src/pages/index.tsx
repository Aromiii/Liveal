import { type GetServerSidePropsContext, InferGetServerSidePropsType, type NextPage } from "next";
import Navbar from "../components/navs/navbar";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../server/auth";
import { useSession } from "next-auth/react"
import ChatsNav from "../components/navs/chatsNav";
import FriendsNav from "../components/navs/friendsNav";
import Link from "next/link";
import FeedPost from "../components/feed/feedPost";

const Home: NextPage = ({ posts, images }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { status } = useSession()

  if (status == "authenticated") {
    return (
      <>
        <Navbar />
        <div className="flex mt-5 gap-5">
          <FriendsNav />
          <main className="w-[90vw] mx-auto md:w-1/2">
              {
                posts.map((post) => <FeedPost postAuthor={post.title} postText={post.body} image={images[post.id - 1]}/>)
              }
          </main>
          <ChatsNav />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="flex mt-5 gap-5">
        <main className="w-[90vw] mx-auto md:w-1/2">
          {
            posts.map((post) => <FeedPost postAuthor={post.title} postText={post.body} image={images[post.id - 1]}/>)
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
  )
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const images = []
  for (let i = 0; i < 10; i++) {
    let image = await fetch('https://dog.ceo/api/breeds/image/random')
    image = await image.json()
    images.push(image.message)
  }

  const result = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")
  const data = await result.json()

  return {
    props: {
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      ),
      posts: data,
      images: images
    },
  }
}