import Navbar from "../../components/navs/navbar";
import FriendsNav from "../../components/navs/friendsNav";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../../server/db";
import Link from "next/link";
import Post from "../../components/feed/post";
import SignInFooter from "../../components/signInFooter";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { getComments } from "../../utils/getComments";
import { getLikes } from "../../utils/getLikes";

const User = ({ user, posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: session } = useSession();

  return <>
    <Navbar />
    <div className="pt-5 relative">
      <img className=" h-[30vh] object-cover w-full rounded-lg relative z-10"
           src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.forestryengland.uk%2Fsites%2Fdefault%2Ffiles%2Fmedia%2FSavernake.jpg&f=1&nofb=1&ipt=bdec4b84b78ef7739a8e5d24a31ffe772381fae3ac10d3f2b9dfcd4068340f18&ipo=images" />
      <div className="md:flex px-5 absolute w-full w-[calc(100%+2.5rem)] left-[-1.25rem] top-[60%] bg-gray-200">
        <div className="flex md:block w-full md:w-1/6 md:min-w-[150px] md:ml-4 md:z-20">
          <div className="w-full mr-auto md:block flex gap-5">
            <div className="shadow w-[calc(60%-1.25rem)] md:w-full bg-white rounded-lg flex place-items-center flex-col z-30">
              <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture" src={user.image} />
              <h1 className="font-bold text-lg break-words max-w-[80%]">{user.name}</h1>
            </div>
            <div className=" w-2/5 md:w-full flex-col flex z-30 gap-4">
              {session?.user.username == router.query.username ?
                <Link className="shadow p-2 h-full bg-white mt-0 md:mt-3 rounded-lg text-center flex place-items-center place-content-center text-xl" href="/user/edit">
                  Edit profile
                </Link> :
                null
              }
              <Link href={`/user/${user.username}/friends`}
                    className="shadow md:hidden h-full block p-2 px-5 md:mt-2 rounded-lg bg-white flex place-items-center place-content-center text-xl">
                Friends
              </Link>
            </div>
          </div>
        </div>
        <main className="mt-4 md:mt-0 z-20 flex flex-col gap-4 md:w-1/2 mx-auto md:px-4">
          <div className="h-5 hidden md:block" />
          {user.description ?
            <div className="shadow p-3 bg-white rounded-lg text-xl">
              {user.description}
            </div>
            : null
          }
          <ul>
            {
              posts.map(post => <Post authorName={user.name} authorUsername={user.username}
                                      authorImage={user.image} text={post.content} image={post.image}
                                      createdAt={post.createdAt} comments={post.comments} postId={post.id}
                                      postLikes={post.likes} liked={post.liked} />)
            }
          </ul>
        </main>
        <div className="md:w-1/6 md:min-w-[150px] w-1/3 h-96 md:block hidden md:mr-4 z-20">
          <FriendsNav />
        </div>
      </div>
      <SignInFooter />
    </div>
  </>;
};

export default User;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();

  const user = await prisma.user.findFirst({
    where: {
      username: context.query.username
    }
  });

  if (!user) {
    return {
      redirect: {
        destination: "/404",
        permanent: true
      }
    }
  }

  const posts = await prisma.post.findMany({
    select: {
      likes: true,
      id: true,
      content: true,
      createdAt: true
    },
    where: {
      author: {
        username: context.query.username
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  const formattedLikedPosts = await getLikes(session?.user.id, posts);
  const formattedComments = await getComments(posts);

  const formattedPosts = posts.map(post => {
    return {
      ...post,
      liked: formattedLikedPosts ? formattedLikedPosts.includes(post.id) : false,
      createdAt: post.createdAt.toString(),
      image: data.message,
      comments: formattedComments.filter(comment => comment.postId === post.id)
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
