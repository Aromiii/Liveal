import Link from "next/link";
import { useSession } from "next-auth/react";

const Comment = (props: { authorImage: string, authorName: string, authorUsername: string, content: string, postAuthorUsername: string }) => {
  const { data: session } = useSession()

  return <>
    <li className={props.authorUsername == props.postAuthorUsername ? "rounded-lg shadow shadow-red-500 p-1 m-1 flex gap-1" : "rounded-lg shadow p-1 m-1 flex gap-1"}>
      <Link className="w-[10%] h-[10%] md:min-w-[60px] min-w-[40px]" href={`/user/${props.authorUsername}`}>
        <img className="h-full rounded-full w-full" src={props.authorImage} />
      </Link>
      <div className="w-[80%]">
        <h1 className="font-semibold m-0.5">{props.authorName}</h1>
        <p className="m-0.5 rounded-lg break-words whitespace-pre-line">{props.content}</p>
      </div>
      <p className={props.authorUsername == session?.user.username ? "m-0.5 bg-gray-200 h-fit p-1 rounded-lg text-sm ml-auto" : "hidden"}>Me</p>
    </li>
  </>
};

export default Comment;