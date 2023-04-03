import Navbar from "../../../components/navs/navbar";
import FriendsNav from "../../../components/navs/friendsNav";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../../../server/db";
import Link from "next/link";
import Post from "../../../components/feed/post";
import SignInFooter from "../../../components/signInFooter";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../server/auth";
import { getComments } from "../../../utils/getComments";
import { getLikes } from "../../../utils/getLikes";
import getFriends from "../../../utils/getFriends";

const User = ({ user, posts, friends }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: session } = useSession();

  const addFriend = async (event: any) => {
    event.preventDefault();

    const response = await fetch("/api/user/friend", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        userId: user.id
      })
    });
    const body = await response.json();
    alert(body.message);
  }

  const removeFriend = async (event: any) => {
    event.preventDefault();

    const response = await fetch("/api/user/friend", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({
        userId: user.id
      })
    });
    const body = await response.json();
    alert(body.message);
  }

  return <>
    <Navbar>
      <div className="relative">
        <img className=" h-[30vh] object-cover w-full rounded-lg relative z-10"
             src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.OtEQqkEb8CMbiWEmWYSgVAHaEK%26pid%3DApi&f=1&ipt=bf106f2e6831f40c3e1dd70b4e234149612cae230e4758981505cb011fd32f6f&ipo=images" />
        <div className="md:flex px-5 absolute w-full w-[calc(100%+2.5rem)] left-[-1.25rem] top-[60%] bg-gray-200">
          <div className="flex md:block w-full md:w-1/6 md:min-w-[150px] md:ml-4 md:z-20">
            <div className="w-full mr-auto md:block flex gap-5">
              <div
                className="shadow w-[calc(60%-1.25rem)] md:w-full bg-white rounded-lg flex place-items-center flex-col z-30">
                <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture" src={user.image} />
                <h1 className="font-bold text-lg break-words max-w-[80%]">{user.name}</h1>
              </div>
              <div className=" w-2/5 md:w-full flex-col flex z-30 gap-4">
                {session?.user.username == router.query.username ?
                  <Link
                    className="shadow p-2 h-full bg-white md:mt-3 rounded-lg text-center flex place-items-center place-content-center text-xl"
                    href="/user/edit">
                    Edit profile
                  </Link> :
                  <div className="w-full">
                    {friends.map(friend => { return friend.id }).includes(session?.user?.id) ?
                      <button onClick={removeFriend} className="w-full liveal-button md:mt-3 h-full">Remove friend</button> :
                      <button onClick={addFriend} className="w-full liveal-button md:mt-3 h-full">Add friend</button>
                    }
                  </div>
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
          <div className="md:w-1/6 md:min-w-[175px] w-1/3 h-96 md:block hidden md:mr-4 z-20">
            <FriendsNav friends={friends} />
          </div>
        </div>
        <SignInFooter />
      </div>
    </Navbar>
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
    };
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

  const friends = await getFriends(user.id);
  const likedPosts = await getLikes(session?.user.id, posts);
  const comments = await getComments(posts);

  if (friends.some(friend => friend.id == session.user.id && friend.blocked)) {
    return {
      redirect: {
        destination: "/",
        permanent: true
      }
    };
  }

  const formattedPosts = posts.map(post => {
    return {
      ...post,
      liked: likedPosts ? likedPosts.includes(post.id) : false,
      createdAt: post.createdAt.toString(),
      image: data.message,
      comments: comments.filter(comment => comment.postId === post.id)
    };
  });

  return {
    props: {
      friends: friends,
      posts: formattedPosts,
      user: user
    }
  };
}
