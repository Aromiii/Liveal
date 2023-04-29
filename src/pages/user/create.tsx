import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";
import Navbar, { showNotification } from "../../components/navs/navbar";

const Create = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.name);
  const [username, setUsername] = useState(user.username || "");
  const [desc, setDesc] = useState("");

  const createAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/user", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
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
      await router.replace("/");
    }
  };

  return (
    <>
      <Navbar form={true}>
        <h1 className="text-2xl text-center mb-5">Create your account</h1>
        <form className="flex flex-col gap-4" onSubmit={event => void createAccount(event)}>
          <div className="w-full gap-4 flex">
            <input minLength={3} maxLength={30} required className="rounded-lg w-full p-2"
                   placeholder=" Display name..." onChange={event => setDisplayName(event.target.value)}
                   defaultValue={displayName || ""} />
            <input minLength={3} maxLength={30} required className="rounded-lg w-full p-2"
                   placeholder=" Username..." onChange={event => setUsername(event.target.value)}
                   defaultValue={username || ""} />
          </div>
          <textarea className="rounded-lg w-full p-2" placeholder=" Your profile description..."
                    maxLength={1000} onChange={event => setDesc(event.target.value)} />
          <button className="liveal-button ml-auto">
            Create profile
          </button>
        </form>
      </Navbar>
    </>
  );
};

export default Create;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: true
      }
    };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: session.user.id }
    });

    /*if (!user || user.profileCreated) {
      return {
        redirect: {
          destination: "/",
          permanent: false
        }
      };
    }*/

    return {
      props: {
        user: {
          name: user?.name,
          username: /^([^@]+)/.exec(user?.username || "")
        }
      }
    };

  } catch (error) {

  }

  return {
    props: {
      user: {
        name: null,
        username: null
      }
    }
  };
}