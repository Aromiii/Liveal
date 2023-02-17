export default function FeedPost(props: { postAuthor: string, postText: string, image: string }) {
  console.log(props.image);
  return <section className="bg-white rounded-lg mb-2 p-2">
    <div className="flex place-items-center gap-2">
      <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftheawesomedaily.com%2Fwp-content%2Fuploads%2F2017%2F02%2Ffunny-profile-pictures-18-1.jpg&f=1&nofb=1&ipt=e63fb7ed47d4823fc23d7bc3dca70cde4dca3f5b39cd234f4b1e66671a5e53c5&ipo=images" />
      <div>
        <h1 className="font-semibold text-lg">{props.postAuthor}</h1>
        <h2 className="font-extralight">17.32 21.4.2022</h2>
      </div>
    </div>
    <img className="p-2 w-full max-h-[70vh] object-cover rounded-2xl" src={props.image} />
    <p className="p-2">
      {props.postText}
    </p>
  </section>;
}