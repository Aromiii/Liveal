import Link from "next/link";

const Comment = (props: { authorImage: string, authorName: string, authorUsername: string, content: string }) => {
  return <>
    <li className="rounded-lg shadow p-1 m-1 flex gap-1">
      <Link className="w-[10%] h-[10%] md:min-w-[60px] min-w-[40px]" href={`/user/${props.authorUsername}`}>
        <img className="h-full rounded-full w-full" src={props.authorImage} />
      </Link>
      <div className="w-[80%]">
        <h1 className="font-semibold m-0.5">{props.authorName}</h1>
        <p className="m-0.5 rounded-lg break-words whitespace-pre-line">{props.content}</p>
      </div>
    </li>
  </>
};

export default Comment;