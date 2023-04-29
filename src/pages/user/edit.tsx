import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Navbar, { showNotification } from "../../components/navs/navbar";
import { useSession } from "next-auth/react";

const Edit = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession()
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [desc, setDesc] = useState(user.description);

  const updateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!confirm("Do you want to update your account")) {
      return
    }

    const response = await fetch("/api/user", {
      method: "PUT",
      credentials: "include",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify({
        displayName: displayName,
        username: username,
        description: desc
      })
    });

    if (response.status > 299) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body: {message: string} = await response.json();
      showNotification(body.message)
    }

    if (response.status < 299) {
      await router.replace(`/user/${session?.user.username || ""}`)
    }
  };

  return <>
    <Navbar showBack={true} form={true}>
      <h1 className="text-2xl text-center mb-5">Edit your account</h1>
      <form className="flex flex-col gap-4" onSubmit={event => void updateAccount(event)}>
        <div className="w-full gap-4 flex">
          <input minLength={3} maxLength={30} required className="rounded-lg w-full p-2"
                 placeholder=" Display name..." onChange={event => setDisplayName(event.target.value)} defaultValue={displayName || ""}/>
          <input minLength={3} maxLength={30} required className="rounded-lg w-full p-2"
                 placeholder=" Username..." onChange={event => setUsername(event.target.value)} defaultValue={username || ""}/>
        </div>
        <textarea rows={3} className="rounded-lg w-full p-2" placeholder=" Your profile description..."
                  maxLength={1000} onChange={event => setDesc(event.target.value)} defaultValue={desc || ""}/>
        <button className="liveal-button ml-auto">
          Update profile
        </button>
      </form>
    </Navbar>
  </>
};

export default Edit;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    }
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id
    }
  })

  if (!user) {
    return {
      redirect: {
        destination: "/404",
        permanent: false
      }
    }
  }

  return {
    props: {
      user: user
    }
  };
}