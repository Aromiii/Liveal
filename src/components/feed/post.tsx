import Link from "next/link";
import { useState } from "react";
import Comment from "./comment";

export default function Post(props: { postId: string, authorName: string, authorUsername: string, authorImage: string, text: string, image: string, createdAt: string, liked: boolean, comments: {updatedAt: string, author: {image: string | null, name: string | null, username: string | null}, content: string, postId: string}[] }) {
  const [liked, setLiked] = useState(props.liked);
  const [commentText, setCommentText] = useState("")

  const comment = async (event) => {
    event.preventDefault();
    console.log(commentText, props.postId)

    const response = await fetch("/api/post/comment", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        text: commentText,
        postId: props.postId
      })
    });
    const body = await response.json();
    console.log(body);
  }

  const like = async (event) => {
    event.preventDefault();
    setLiked(!liked);

    const response = await fetch("/api/post/like", {
      method: !liked ? "POST" : "DELETE",
      credentials: "include",
      body: JSON.stringify({
        postId: props.postId
      })
    });
    const body = await response.json();
    console.log(body);
  };

  return<section className="bg-white rounded-lg mb-2 p-2">
    <div className="flex place-items-center gap-2">
      <Link href={`/user/${props.authorUsername}`}>
        <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src={props.authorImage} />
      </Link>
      <div>
        <h1 className="font-semibold text-lg">{props.authorName}</h1>
        <h2 className="font-extralight">{props.createdAt}</h2>
      </div>
    </div>
    <img className="p-2 w-full max-h-[70vh] object-cover rounded-2xl" src={props.image} />
    <p className="p-2 break-words whitespace-pre-line">
      {props.text}
    </p>
    <div className="mx-2 mb-1 w-full flex place-items-center">
      <button onClick={like} className="h-8 w-8">
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
      <form className="ml-auto mr-4 w-2/3 flex" onSubmit={comment}>
        <input onChange={event => setCommentText(event.target.value)} maxLength={200} type="text"
               className="bg-gray-200 rounded-l-lg p-2 w-full" placeholder=" Comment..." />
        <button className="bg-red-500 rounded-r-lg p-2 px-5 text-white text-l right-0">Send</button>
      </form>
    </div>
    <ul className="mt-2 p-1 rounded-lg flex flex-col gap-1">
      {props.comments.map(comment => <Comment authorImage={comment.author.image} authorName={comment.author.name} authorUsername={comment.author.username} content={comment.content}/>)}
    </ul>
  </section>;
}