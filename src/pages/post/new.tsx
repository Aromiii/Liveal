import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/navs/navbar";

const New = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [postText, setPostText] = useState("");

  const handelPostTextInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const sendPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/post", {
      method: "POST",
      credentials: "include",
      headers:{'content-type': 'application/json'},
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
          <img className="rounded-full object-cover h-16 w-16" alt="Profile picture" src={session?.user?.image || undefined} />
          <div className="w-[calc(100%-5rem)]">
            <h1 className="font-semibold text-lg break-words">{session?.user?.name}</h1>
            <h2 className="font-extralight">Current time</h2>
          </div>
        </div>
        <img className="p-2 w-full max-h-[70vh] object-cover rounded-2xl" />
        <form className="w-full" onSubmit={event => void sendPost(event)}>
            <textarea maxLength={3000} onChange={event => handelPostTextInput(event)}
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
    void router.push("/signin")
  }
};

export default New;