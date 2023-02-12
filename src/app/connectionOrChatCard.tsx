export default function ConnectionOrChatWidget(props: {image: string, text: string}) {
  return <li className="mx-3 mb-2 bg-gray-300 rounded-lg flex place-items-center p-1 gap-2">
    <img className="object-cover w-16 h-16 rounded-full" src={props.image} alt="person or chat image"/>
    <h2>{ props.text }</h2>
  </li>;
}