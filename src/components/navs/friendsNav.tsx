const FriendsNav = () => {
  return <>
    <aside className="w-1/6">
      <div className="h-36 bg-white rounded-lg flex place-items-center flex-col">
        <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture" src="src/pages" />
        <h1 className="font-bold text-lg"></h1>
      </div>
      <div className="bg-white rounded-lg mt-5 p-1">
        <h1>
          Friends
        </h1>
        <ul>

        </ul>
      </div>
    </aside>
  </>;
};

export default FriendsNav;