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
    <p className="p-2 break-words whitespace-pre-line">
      {props.text}
    </p>
    <div className="mx-2 mb-1 w-full flex place-items-center">
      <button>
        <svg className="h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960"><path d="M716 936H272V424l278-288 39 31q6 5 9 14t3 22v10l-45 211h299q24 0 42 18t18 42v81.839q0 7.161 1.5 14.661T915 595L789 885q-8.878 21.25-29.595 36.125Q738.689 936 716 936Zm-384-60h397l126-299v-93H482l53-249-203 214v427Zm0-427v427-427Zm-60-25v60H139v392h133v60H79V424h193Z"/></svg>
      </button>
      <form className="ml-auto mr-4 w-2/3 flex">
        <input type="text" className="bg-gray-200 rounded-l-lg p-2 w-full" placeholder=" Comment..."/>
        <button className="bg-red-500 rounded-r-lg p-2 px-5 text-white text-l right-0">Send</button>
      </form>
    </div>
  </section>;
}