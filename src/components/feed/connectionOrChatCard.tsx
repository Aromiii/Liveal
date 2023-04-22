import Link from "next/link";

export default function ConnectionOrChatCard(props: {image: string, text: string, link: string}) {
  return <li className="mb-2 bg-gray-300 dark:bg-gray-500 rounded-lg p-1 text-black">
    <Link className="flex place-items-center gap-2" href={props.link}>
      <img className="object-cover w-12 h-12 rounded-full" src={props.image}/>
      <p className="break-words w-[calc(100%-3rem-0.5rem)]">{ props.text }</p>
    </Link>
  </li>;
}