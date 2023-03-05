import { useSession } from "next-auth/react";
import { useState } from "react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../../../server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../server/auth";
import { useRouter } from "next/router";
import BgWithLivealLogo from "../../../components/bgWithLivealLogo";

const PostId = ({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [postText, setPostText] = useState(post.content);

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
      console.error(response);
      alert("Error occured");
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

  if (status == "authenticated") {
    return <>
      <BgWithLivealLogo>
        <div className="flex place-items-center gap-2">
          <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src={session?.user?.image} />
          <div>
            <h1 className="font-semibold text-lg">{session?.user?.name}</h1>
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
      </BgWithLivealLogo>
    </>;
  }

  if (status == "unauthenticated") {
    location.replace("/auth/signin");
  }

  return null;
};

export default PostId;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

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
      id: {
        equals: context.query.postId
      },
      author: {
        id: {
          equals: session.user.id
        }
      }
    }
  });

  console.log(post);

  return {
    props: {
      post: post
    }
  };
}