import ConnectionOrChatCard from "../feed/connectionOrChatCard";

const FriendsNav = (props: { friends: {image: string, name: string, username: string}[] }) => {
  console.log(props.friends)

  return <>
    <aside className="shadow hidden md:block">
      <div className="bg-white rounded-lg px-4 p-1">
        <h1 className="m-0.5 mx-3 text-lg font-semibold">
          Friends
        </h1>
        <ul>
          {props.friends.map(friend => {return <ConnectionOrChatCard image={friend.image} text={friend.name} link={`/user/${friend.username}`}/>})}
        </ul>
      </div>
    </aside>
  </>;
};

export default FriendsNav;