import { useSession } from "next-auth/react";
import { useState } from "react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../../../server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../server/auth";
import { useRouter } from "next/router";
import BgWithLivealLogo from "../../../components/bgWithLivealLogo";
import Navbar from "../../../components/navs/navbar";

const PostId = ({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [postText, setPostText] = useState("jsdjsdjf");

  const editPost = async (event) => {
    event.preventDefault();

    console.log(router.query);
    const response = await fetch("/api/post", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        postText: postText,
        postId: router.query.postId
      })
    });

    if (response.status > 399) {
      const error = await response.json()
      alert(error.message);
      return;
    }

    alert("Post updated");
    location.replace("/");
  };

  const handelPostTextInput = (event) => {
    setPostText(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  if (session) {
    return <>
      <Navbar form={true} showBack={true}>
        <div className="flex place-items-center gap-2">
          <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src={session?.user?.image} />
          <div className="w-[calc(100%-5rem)]">
            <h1 className="font-semibold text-lg break-words">{session?.user?.name}</h1>
            <h2 className="font-extralight">Current time</h2>
          </div>
        </div>
        <img className="p-2 w-full max-h-[70vh] object-cover rounded-2xl" />
        <form className="w-full" onSubmit={editPost}>
            <textarea onChange={handelPostTextInput}
                      className="max-h-[50vh] w-full p-2 border border-gray-200 rounded-lg resize-none overflow-hidden"
                      defaultValue={postText} />
          <div className="w-full place-items-center flex">
            <button className="bg-red-500 rounded-lg p-2 text-white mt-4 text-xl left-0 px-5 ml-auto">Send</button>
          </div>
        </form>
      </Navbar>
    </>;
  }

  router.replace("/signin")
};

export default PostId;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  )

  const post = await prisma.post.findFirst({
    select: {
      content: true,
      author: {
        select: {
          name: true
        }
      }
    },
    where: {
      id: context.query.postId,
      author: {
        id: session.user.id
      }
    }
  });

  if (!post) {
    return {
      redirect: {
        destination: "/404",
        permanent: true
      }
    }
  }

  return {
    props: {
      session: session,
      post: post
    }
  };
}