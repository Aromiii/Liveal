import Link from "next/link";
import React, { useState } from "react";
import Comment from "./comment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type PostType from "../../types/post";
import { DeleteSvg, SettingsSvg } from "../svg";

export default function Post(props: { post: PostType }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [liked, setLiked] = useState(props.post.liked);
  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState(props.post.likes);
  const [comments, setComments] = useState(props.post.comments);

  const deletePost = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const response = await fetch("/api/post", {
      method: "DELETE",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postId: props.post.id
      })
    });

    if (response.status < 300) {
      void router.reload()
    }
  }

  const comment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session) {
      if (confirm("You can't comment because you are not signed in\nDo you want to be redirected in to sign in page"))
        await router.push("/signin");

      return;
    }

    const response = await fetch("/api/post/comment", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: commentText,
        postId: props.post.id
      })
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body: { message: string, id: string } = await response.json();
    console.log(body);

    if (response.status == 200) {
      setComments([{
        author: {
          image: session?.user?.image || null,
          name: session?.user?.name || null,
          username: session?.user.username || null
        },
        content: commentText,
        updatedAt: new Date().toString(),
        postId: props.post.id,
        id: body.id || ""
      }, ...comments]);

      const target = event.target as HTMLFormElement
      target.reset()
    }
  };

  const like = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!session) {
      if (confirm("You can't like because you are not signed in\nDo you want to be redirected in to sign in page"))
        await router.push("/signin");

      return;
    }

    setLiked(!liked);

    if (!liked) {
      setLikes(likes + 1);
    } else {
      setLikes(likes - 1);
    }


    const response = await fetch("/api/post/like", {
      method: !liked ? "POST" : "DELETE",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postId: props.post.id
      })
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await response.json();
    console.log(body);
  };

  console.log(props.post.author)

  return <li className="shadow base-color rounded-lg mb-2 p-2">
    <div className="flex place-items-center gap-2">
      <Link href={`/user/${props.post.author.username ? props.post.author.username : "error"}`}>
        <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src={props.post.author.image ? props.post.author.image: "error"} />
      </Link>
      <div className="w-[calc(100%-5rem)]">
        <div className="flex">
          <p className="break-words max-w-[calc(100%-60px)] font-semibold text-lg mr-auto">{props.post.author.name}</p>
          {props.post.author.username == session?.user.username ?
            <div className="flex">
              <Link href={`/post/edit/${props.post.id}`}>
                <SettingsSvg className="h-[30px] w-[30px]"/>
              </Link>
              <button onClick={event => void deletePost(event)}>
                <DeleteSvg viewBox="0 0 48 48" className="h-[30px] w-[30px]"/>
              </button>
            </div>
            :
            null
          }
        </div>
        <h2 className="font-extralight">{new Intl.DateTimeFormat("eur", {
          year: new Date().getFullYear() === new Date(props.post.createdAt).getFullYear() ? undefined : "numeric",
          month: "long",
          day: "numeric"
        }).format(new Date(props.post.createdAt))}</h2>
      </div>
    </div>
    {props.post.image ?
      <img className="p-2 w-full max-h-[70vh] object-cover rounded-2xl" src={props.post.image} />
      :
      null
    }
    <p className="p-2 py-3 break-words whitespace-pre-line">
      {props.post.content}
    </p>
    <div className="mx-2 mb-1 w-full flex place-items-center">
      <button onClick={event => void like(event)} className="h-8 w-8">
        <svg className={liked ? "hidden" : "h-full w-full"} xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
          <path
            d="M716 936H272V424l278-288 39 31q6 5 9 14t3 22v10l-45 211h299q24 0 42 18t18 42v81.839q0 7.161 1.5 14.661T915 595L789 885q-8.878 21.25-29.595 36.125Q738.689 936 716 936Zm-384-60h397l126-299v-93H482l53-249-203 214v427Zm0-427v427-427Zm-60-25v60H139v392h133v60H79V424h193Z" />
        </svg>
        <svg className={liked ? "fill-red-500 h-full w-full" : "hidden"} xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 48 48">
          <path
            d="M36.05 42H12.7V16.4L26.6 2l1.65 1.3q.55.4.725.9.175.5.175 1.15v.5L26.9 16.4H43q1.15 0 2.075.925Q46 18.25 46 19.4v4.1q0 .55-.125 1.275-.125.725-.375 1.275l-5.8 13.4q-.45 1.05-1.475 1.8Q37.2 42 36.05 42ZM9.7 16.4V42H4V16.4Z" />
        </svg>
      </button>
      <p className="ml-2 text-sm font-semibold">{likes}</p>
      <form className="ml-auto mr-4 w-2/3 flex" onSubmit={event => void comment(event)}>
        <input onChange={event => setCommentText(event.target.value)} maxLength={200} type="text"
               className="rounded-l-lg p-2 w-full" placeholder=" Comment..." />
        <button className="bg-red-500 rounded-r-lg p-2 px-5 text-white text-l right-0">Send</button>
      </form>
    </div>
    <ul className="mt-2 p-1 rounded-lg flex flex-col gap-1">
      {/* eslint-disable-next-line react/jsx-key */}
      {comments.map(comment => <Comment authorImage={comment.author.image} authorName={comment.author.name}
                                        authorUsername={comment.author.username} content={comment.content}
                                        postAuthorUsername={props.post.author.username} commentId={comment.id} />)}
    </ul>
  </li>;
}