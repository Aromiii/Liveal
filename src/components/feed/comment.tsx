import Link from "next/link";

const Comment = (props: { authorImage: string, authorName: string, authorUsername: string, content: string }) => {
  return <>
    <li className="h-12 m-1 flex place-items-center gap-2">
      <Link className="h-full" href={`/user${props.authorUsername}`}>
        <img className="h-full rounded-full" src={props.authorImage} />
      </Link>
      <div>
        <h1 className="font-semibold m-0.5">{props.authorName}</h1>
        <p className="m-0.5 rounded-lg">{props.content}</p>
      </div>
    </li>
  </>
};

export default Comment;