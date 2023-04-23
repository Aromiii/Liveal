import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { DeleteSvg } from "../svg";

const Comment = (props: { authorImage: string | null, authorName: string | null, authorUsername: string | null, content: string, postAuthorUsername: string | null, commentId: string }) => {
  const { data: session } = useSession()
  const [deleted, setDeleted] = useState(false)

  const deleteComment = async () => {
    const response = await fetch("/api/post/comment", {
      method: "DELETE",
      credentials: "include",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify({
        commentId: props.commentId
      })
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await response.json();
    console.log(body);

    if (response.status == 200)
      setDeleted(true)

  }

  return <>
    <li className={deleted ? "hidden" : `${props.authorUsername == props.postAuthorUsername ? "rounded-lg shadow shadow-red-500 p-1 m-1 flex gap-1" : "rounded-lg shadow p-1 m-1 flex gap-1"}`}>
      <Link className="w-[10%] h-[10%] md:min-w-[60px] min-w-[40px]" href={`/user/${props.authorUsername || ""}`}>
        <img className="h-full rounded-full w-full" src={props.authorImage || undefined} alt="profile picture"/>
      </Link>
      <div className="w-[calc(100%-80px)]">
        <p className="font-semibold w-full break-words">{props.authorName}</p>
        <p className="m-0.5 rounded-lg break-words whitespace-pre-line">{props.content}</p>
      </div>
      <div className={props.authorUsername == session?.user.username ? "ml-auto w-[30px]" : "hidden"}>
        <button onClick={() => void deleteComment()}>
          <DeleteSvg viewBox="0 0 48 48" className="h-[30px] w-[30px]"/>
        </button>
      </div>
    </li>
  </>
};

export default Comment;