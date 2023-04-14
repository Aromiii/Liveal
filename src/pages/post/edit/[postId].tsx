import { useSession } from "next-auth/react";
import { type ChangeEvent, useState } from "react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../../../server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../server/auth";
import { useRouter } from "next/router";
import Navbar from "../../../components/navs/navbar";

const PostId = ({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [postText, setPostText] = useState(post.content);

  const editPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(router.query);
    const response = await fetch("/api/post", {
      method: "PUT",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postText: postText,
        postId: router.query.postId
      })
    });

    if (response.status > 399) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const error: { message: string } = await response.json();
      alert(error.message);
      return;
    }

    alert("Post updated");
    location.replace("/");
  };

  const handelPostTextInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  if (session) {
    return <>
      <Navbar form={true} showBack={true}>
        <div className="flex place-items-center gap-2">
          <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src={session?.user?.image || ""} />
          <div className="w-[calc(100%-5rem)]">
            <h1 className="font-semibold text-lg break-words">{session?.user?.name || ""}</h1>
            <h2 className="font-extralight">Current time</h2>
          </div>
        </div>
        <img className="p-2 w-full max-h-[70vh] object-cover rounded-2xl" />
        <form className="w-full" onSubmit={event => void editPost(event)}>
            <textarea onChange={event => handelPostTextInput(event)}
                      className="max-h-[50vh] w-full p-2 border border-gray-200 rounded-lg resize-none overflow-hidden"
                      defaultValue={postText} />
          <div className="w-full place-items-center flex">
            <button className="bg-red-500 rounded-lg p-2 text-white mt-4 text-xl left-0 px-5 ml-auto">Send</button>
          </div>
        </form>
      </Navbar>
    </>;
  }

  void router.replace("/signin")
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
      id: context.query.postId?.toString() || "",
      author: {
        id: session?.user.id
      }
    }
  });

  if (!post) {
    return {
      redirect: {
        destination: "/404",
        permanent: false
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