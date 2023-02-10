import { type NextPage } from "next";

function ConnectionOrChatWidget(props: {image: string, text: string}) {
  return <li className="mx-3 mb-2 bg-gray-300 rounded-lg flex place-items-center p-1 gap-2">
    <img className="object-cover w-16 h-16 rounded-full" src={props.image} alt="person or chat image"/>
    <h2>{ props.text }</h2>
  </li>;
}

const Home: NextPage = () => {
  return (
    <>
      <div className="flex mt-5 gap-5">
        <aside className="w-1/6">
          <div className="h-36 bg-white rounded-lg flex place-items-center flex-col">
            <img className="w-24 h-24 rounded-full object-cover m-2"
                 src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images" />
            <h1 className="font-bold text-lg">Kissa koira</h1>
          </div>
          <div className="bg-white rounded-lg mt-5 p-1">
            <h1>
              Friends
            </h1>
              <ul>
                <ConnectionOrChatWidget text="Some person" image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
                <ConnectionOrChatWidget text="Some person" image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
                <ConnectionOrChatWidget text="Some person" image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
                <ConnectionOrChatWidget text="Some person" image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
                <ConnectionOrChatWidget text="Some person" image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
              </ul>
          </div>
        </aside>
        <main className=" bg-white h-96 w-1/2 mx-auto rounded-lg">

        </main>
        <aside className="w-1/6 h-fit bg-white rounded-lg p-1">
          <h1>
            Chats
          </h1>
          <ul>
            <ConnectionOrChatWidget text="Some chat" image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
            <ConnectionOrChatWidget text="Some chat" image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
            <ConnectionOrChatWidget text="Some chat" image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.naso.org%2Fwp-content%2Fuploads%2F2016%2F12%2Fperson-pointing.jpg&f=1&nofb=1&ipt=4ec920cdb2e204f2ef7432a17fe62fc3e0488579b2c41781e01150491edc3bda&ipo=images"/>
          </ul>
        </aside>
      </div>
    </>
  );
};

export default Home;