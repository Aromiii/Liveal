import Link from "next/link";

export default function FeedPost(props: { authorName: string, authorId: string, authorImage: string, text: string, image: string, createdAt: string }) {
  return <section className="bg-white rounded-lg mb-2 p-2">
    <div className="flex place-items-center gap-2">
      <Link href={`/profile/${props.authorId}`}>
        <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src={props.authorImage} />
      </Link>
      <div>
        <h1 className="font-semibold text-lg">{props.authorName}</h1>
        <h2 className="font-extralight">{props.createdAt}</h2>
      </div>
    </div>
    <img className="p-2 w-full max-h-[70vh] object-cover rounded-2xl" src={props.image} />
    <p className="p-2">
      {props.text}
    </p>
  </section>;
}