import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/navs/navbar";

const New = () => {
  const router = useRouter()
  const { data: session, status } = useSession();
  const [postText, setPostText] = useState("");

  const handelPostTextInput = (event) => {
    setPostText(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const sendPost = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/post", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        postText: postText
      })
    });

    if (response.status > 399) {
      console.error(response);
      alert("Error occured");
      return;
    }

    alert("Post created");
    location.replace("/");
  };

  if (status == "authenticated") {
    return <>
      <Navbar form={true} showBack={true}>
        <div className="flex place-items-center gap-2">
          <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src={session?.user?.image} />
          <div className="w-[calc(100%-5rem)]">
            <h1 className="font-semibold text-lg break-words">{session?.user?.name}</h1>
            <h2 className="font-extralight">Current time</h2>
          </div>
        </div>
        <img className="p-2 w-full max-h-[70vh] object-cover rounded-2xl" />
        <form className="w-full" onSubmit={sendPost}>
            <textarea onChange={handelPostTextInput}
                      className="max-h-[50vh] w-full p-2 border border-gray-200 rounded-lg resize-none overflow-hidden" />
          <div className="w-full place-items-center flex">
            <button className="ml-auto mt-4 liveal-button">
              Send
            </button>
          </div>
        </form>
      </Navbar>
    </>;
  }

  if (status == "unauthenticated") {
    router.push("/signin")
  }
};

export default New;