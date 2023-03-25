import Link from "next/link";
import { useSession } from "next-auth/react";

const SignInFooter = () => {
  const { status } = useSession()

  if (status == "unauthenticated") {
    return <>
      <footer className="fixed h-20 z-50 w-screen bottom-0 left-0 bg-red-500 flex place-items-center">
        <h1 className="text-white text-xl p-5 mr-auto hidden md:block">
          Don't be alone - Be connected to your community
        </h1>
        <Link href="/signin" className="text-white text-[120%] w-fit m-10 p-2 px-5 rounded-lg bg-white text-black">
          Sing in
        </Link>
      </footer>
    </>;
  }

  return null
};

export default SignInFooter;