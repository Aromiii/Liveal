import ConnectionOrChatCard from "../feed/connectionOrChatCard";
import type Friend from "../../types/friend";

const FriendsNav = (props: { friends: Friend[] }) => {
  return <>
    <aside className="shadow hidden md:block">
      <div className="base-color rounded-lg px-4 p-1">
        <h1 className="m-0.5 mx-3 text-lg font-semibold">
          Friends
        </h1>
        <ul>
          {/* eslint-disable-next-line react/jsx-key */}
          {props.friends.map(friend => {return <ConnectionOrChatCard image={friend.image} text={friend.name} link={`/user/${friend.username}`}/>})}
        </ul>
      </div>
    </aside>
  </>;
};

export default FriendsNav;