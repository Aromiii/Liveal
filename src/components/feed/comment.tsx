import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const Comment = (props: { authorImage: string, authorName: string, authorUsername: string, content: string, postAuthorUsername: string, commentId: string }) => {
  const { data: session } = useSession()
  const [deleted, setDeleted] = useState(false)

  const deleteComment = async () => {
    const response = await fetch("/api/post/comment", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({
        commentId: props.commentId
      })
    });
    const body = await response.json();
    console.log(body);

    if (response.status == 200)
      setDeleted(true)

  }

  return <>
    <li className={deleted ? "hidden" : `${props.authorUsername == props.postAuthorUsername ? "rounded-lg shadow shadow-red-500 p-1 m-1 flex gap-1" : "rounded-lg shadow p-1 m-1 flex gap-1"}`}>
      <Link className="w-[10%] h-[10%] md:min-w-[60px] min-w-[40px]" href={`/user/${props.authorUsername}`}>
        <img className="h-full rounded-full w-full" src={props.authorImage} />
      </Link>
      <div className="w-[calc(100%-80px)]">
        <p className="font-semibold w-full break-words">{props.authorName}</p>
        <p className="m-0.5 rounded-lg break-words whitespace-pre-line">{props.content}</p>
      </div>
      <div className={props.authorUsername == session?.user.username ? "ml-auto w-[40px]" : "hidden"}>
        <button className="ml-auto" onClick={deleteComment}>
          <Image src="/delete.svg" width={30} height={30}/>
        </button>
      </div>
    </li>
  </>
};

export default Comment;