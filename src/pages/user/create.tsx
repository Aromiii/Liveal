import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import BgWithLivealLogo from "../../components/bgWithLivealLogo";
import { useState } from "react";
import { useRouter } from "next/router";

const Create: NextPage = () => {
  const router = useRouter()
  const { status } = useSession()
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [desc, setDesc] = useState();

  const createAccount = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/user", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        displayName: displayName,
        username: username,
        description: desc
      })
    });
    const body = await response.json();
    alert(body.message);

    if (response.status < 299) {
      await router.replace("/")
    }
  };

  if (status == "authenticated") {
    return (
      <>
        <BgWithLivealLogo>
          <h1 className="text-2xl text-center mb-5">Create your account</h1>
          <form className="flex flex-col gap-4" onSubmit={createAccount}>
            <div className="w-full gap-4 flex">
              <input minLength={3} maxLength={50} required className="bg-gray-200 rounded-lg w-full p-2"
                     placeholder=" Display name..." onChange={event => setDisplayName(event.target.value)} />
              <input minLength={3} maxLength={50} required className="bg-gray-200 rounded-lg w-full p-2"
                     placeholder=" Username..." onChange={event => setUsername(event.target.value)} />
            </div>
            <textarea className="bg-gray-200 rounded-lg w-full p-2" placeholder=" Your profile description..."
                      maxLength={1000} onChange={event => setDesc(event.target.value)} />
            <button className="liveal-button ml-auto">
              Create profile
            </button>
          </form>
        </BgWithLivealLogo>
      </>
    );
  }

  if (status == "unauthenticated") {
    router.push("/signin")
  }
};

export default Create;