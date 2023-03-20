import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Navbar from "../components/navs/navbar";
import { useSession } from "next-auth/react";
import ChatsNav from "../components/navs/chatsNav";
import FriendsNav from "../components/navs/friendsNav";
import Link from "next/link";
import Post from "../components/feed/post";
import { prisma } from "../server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";

const Home: NextPage = ({ posts, image }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  if (status == "authenticated") {
    return (
      <>
        <Navbar />
        <aside className="flex mt-5 gap-5">
          <div className="w-1/6 md:block hidden">
            <Link href={`/user/${session?.user.username}`}>
              <div className="bg-white rounded-lg flex place-items-center flex-col">
                <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture"
                     src={session.user.image} />
                <h1 className="m-2 font-bold text-lg break-words max-w-[80%]">{session?.user?.name}</h1>
              </div>
            </Link>
            <div className="hidden md:block mt-5">
              <FriendsNav />
            </div>
          </div>
          <main className="mx-auto md:w-1/2 w-full">
            {
              posts.map((post) => <Post postId={post.id} authorName={post.author.name} liked={post.liked}
                                        authorUsername={post.author.username}
                                        authorImage={post.author.image} text={post.content} image={image}
                                        createdAt={post.createdAt} comments={post.comments} />)
            }
            <Link href="/post/new">
              <svg className="bg-red-500 rounded-full fill-white fixed bottom-[1rem] md:right-[28%] right-[10%]"
                   xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                <path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" />
              </svg>
            </Link>
          </main>
          <aside className="w-1/6 md:block hidden">
            <ChatsNav />
          </aside>
        </aside>
      </>
    );
  }

  if (status == "unauthenticated") {
    return (
      <>
        <Navbar />
        <div className="flex mt-5 gap-5">
          <main className="w-[90vw] mx-auto md:w-1/2">
            {
              posts.map((post) => <Post authorName={post.author.name} authorUsername={post.author.username}
                                        authorImage={post.author.image} text={post.content} image={image}
                                        createdAt={post.createdAt} comments={post.comments}/>)
            }
          </main>
        </div>
        <footer className="fixed h-20 w-screen bottom-0 left-0 bg-red-500 flex place-items-center">
          <h1 className="text-white text-xl p-5 mr-auto hidden md:block">
            Don't be left alone - Be connected to your community
          </h1>
          <Link href="/signin" className="text-white text-[120%] w-fit m-10 p-2 px-5 rounded-lg bg-white text-black">
            Sing in
          </Link>
        </footer>
      </>
    );
  }
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      likes: true,
      author: {
        select: {
          username: true,
          name: true,
          image: true
        }
      }
    }
  });

  let formattedLikedPosts: string[]

  if (session) {
    const likedPosts = await prisma.like.findMany({
      where: {
        postId: {
          in: posts.map(post => {
            return post.id;
          })
        },
        userId: session.user.id
      },
      select: { postId: true }
    });

    formattedLikedPosts = likedPosts.map(likedPost => {
      return likedPost.postId;
    });
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId: {
        in: posts.map(post => {
          return post.id;
        })
      }
    },
    select: {
      id: true,
      postId: true,
      content: true,
      updatedAt: true,
      author: {
        select: {
          username: true,
          name: true,
          image: true
        }
      }
    }
  });

  const formattedComments = comments.map(comment => {
    return {
      ...comment,
      updatedAt: comment.updatedAt.toLocaleString()
    };
  });

  const formattedPosts = posts.map(post => {
    return {
      id: post.id,
      liked: formattedLikedPosts ? formattedLikedPosts.includes(post.id) : false,
      content: post.content,
      createdAt: post.createdAt.toString(),
      author: post.author,
      comments: formattedComments.filter(comment => comment.postId === post.id)
    };
  });

  return {
    props: {
      posts: formattedPosts,
      image: data.message
    }
  };
}