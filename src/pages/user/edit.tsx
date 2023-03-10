import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";
import BgWithLivealLogo from "../../components/bgWithLivealLogo";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

const Edit: NextPage = ({ user }: InferGetServerSidePropsType<GetServerSideProps>) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [displayName, setDisplayName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [desc, setDesc] = useState(user.description);

  const updateAccount = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/user", {
      method: "PUT",
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

  return <>
    <BgWithLivealLogo>
      <h1 className="text-2xl text-center mb-5">Create your account</h1>
      <form className="flex flex-col gap-4" onSubmit={updateAccount}>
        <div className="w-full gap-4 flex">
          <input minLength={3} maxLength={50} required className="bg-gray-200 rounded-lg w-full p-2"
                 placeholder=" Display name..." onChange={event => setDisplayName(event.target.value)} defaultValue={displayName}/>
          <input minLength={3} maxLength={50} required className="bg-gray-200 rounded-lg w-full p-2"
                 placeholder=" Username..." onChange={event => setUsername(event.target.value)} defaultValue={username}/>
        </div>
        <textarea rows={3} className="bg-gray-200 rounded-lg w-full p-2" placeholder=" Your profile description..."
                  maxLength={1000} onChange={event => setDesc(event.target.value)} defaultValue={desc}/>
        <button className="liveal-button ml-auto">
          Update profile
        </button>
      </form>
    </BgWithLivealLogo>
  </>
};

export default Edit;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id
    }
  })

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: true
      }
    }
  }

  return {
    props: {
      user: user
    }
  };
}