import Navbar from "../../components/navs/navbar";
import FriendsNav from "../../components/navs/friendsNav";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../../server/db";
import Link from "next/link";
import FeedPost from "../../components/feed/feedPost";

const User = ({ user, posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(user)
  return <>
    <Navbar />
    <div className="pt-5 relative">
      <img className="h-[30vh] object-cover w-full rounded-lg"
           src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.forestryengland.uk%2Fsites%2Fdefault%2Ffiles%2Fmedia%2FSavernake.jpg&f=1&nofb=1&ipt=bdec4b84b78ef7739a8e5d24a31ffe772381fae3ac10d3f2b9dfcd4068340f18&ipo=images" />
      <div className="md:flex md:p-4 absolute w-full top-[60%]">
        <div className="flex md:block w-full md:w-1/6 p-4">
          <div className="w-full mr-auto md:block flex gap-5">
            <div className="w-3/5 md:w-full bg-white rounded-lg flex place-items-center flex-col">
              <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture" src={user.image} />
              <h1 className="font-bold text-lg break-words max-w-[80%]">{user.name}</h1>
            </div>
            <div className="w-2/5 md:w-full flex-col flex">
              <button className="mt-0 md:mt-4 liveal-button h-full">
                Start chat
              </button>
              <Link href={`/user/${user.username}/friends`} className="md:hidden mt-4 block p-2 px-5 md:mt-2 rounded-lg bg-white flex place-items-center place-content-center">
                Friends
              </Link>
            </div>
          </div>
        </div>
        <main className="mx-auto md:w-1/2 w-full h-72 flex flex-col gap-4">
          <div className="h-10" />
          {user.description ?
            <section className="p-3 bg-white rounded-lg text-xl">
              {user.description}
            </section>
            : null
          }
          {
            posts.map((post) => <FeedPost authorName={user.name} authorUsername={user.username}
                                          authorImage={user.image} text={post.content} image={post.image}
                                          createdAt={post.createdAt} />)
          }
        </main>
        <div className="md:w-1/6 w-1/3 h-96 md:block hidden">
          <FriendsNav />
        </div>
      </div>
    </div>
  </>;
};

export default User;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();

  const user = await prisma.user.findFirst({
    where: {
      username: context.query.username
    }
  });

  const posts = await prisma.post.findMany({
    select: {
      content: true,
      createdAt: true
    },
    where: {
      author: {
        username: context.query.username
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const formattedPosts = posts.map(post => {
    return {
      content: post.content,
      createdAt: post.createdAt.toString(),
      image: data.message
    };
  });

  return {
    props: {
      posts: formattedPosts,
      user: {
        description: user.description,
        username: user.username,
        name: user.name,
        image: user.image
      }
    }
  };
}
