import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, type NextPage } from "next";
import BgWithLivealLogo from "../../components/bgWithLivealLogo";
import { useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";

const Create: NextPage = ({ user }: InferGetServerSidePropsType<GetServerSideProps>) => {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
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

    return (
      <>
        <BgWithLivealLogo showBack={false}>
          <h1 className="text-2xl text-center mb-5">Create your account</h1>
          <form className="flex flex-col gap-4" onSubmit={createAccount}>
            <div className="w-full gap-4 flex">
              <input minLength={3} maxLength={50} required className="bg-gray-200 rounded-lg w-full p-2"
                     placeholder=" Display name..." onChange={event => setDisplayName(event.target.value)} defaultValue={displayName}/>
              <input minLength={3} maxLength={50} required className="bg-gray-200 rounded-lg w-full p-2"
                     placeholder=" Username..." onChange={event => setUsername(event.target.value)} defaultValue={username}/>
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
};

export default Create;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: true
      }
    }
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: session.user.id }
    })

    if (user.profileCreated) {
      return {
        redirect: {
          destination: "/signin",
          permanent: true
        }
      }
    }

    return {
      props: {
        user: {
          name: user.name,
          username: user.email.match(/^([^@]+)/)[1]
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
  }
}