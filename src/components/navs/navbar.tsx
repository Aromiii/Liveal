import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar({ showBack = false, form = false, children }: {
  showBack?: boolean,
  form?: boolean,
  children: ReactNode
}) {
  const { data: session } = useSession();
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  return <div className="min-h-[calc(100vh-2.5rem)] w-full">
    <div className="h-[80px]">
      <nav
        className="md:fixed top-0 bg-white h-[80px] place-items-center flex absolute justify-center w-full right-0 shadow-lg z-50 border-b">
        <Link className="md:block hidden mr-auto mx-3" href="/">
          <Image src="/livealLogoWithText.svg" width={160} height={0} alt="Liveal logo" />
        </Link>
        <Link className="md:hidden mr-auto mx-3" href="/">
          <Image src="/livealLogoWithoutText.svg" alt="Liveal logo" width={60} height={0} />
        </Link>
        <ul className="h-[70] mx-3 gap-3 place-items-center flex">
          <li className="hidden md:block">
            <Link href="/">
              <Image src="/home.svg" width={50} height={50} alt="home" />
            </Link>
          </li>
          <li className={session ? "md:block hidden" : "hidden"}>
            <Link href="/user/friends">
              <Image src="/group.svg" width={50} height={50} alt="friends" />
            </Link>
          </li>
          <li className="h-[50px] hidden md:block">
            <button onClick={() => setShowSearch(!showSearch)}>
              <Image src="/search.svg" width={50} height={50} alt="seacrh" />
            </button>
          </li>
          <li className="h-[50px] hidden md:block">
            <button onClick={() => void signOut({ redirect: false })}>
              <Image src="/logout.svg" width={50} height={50} alt="settings" />
            </button>
          </li>
          <li>
            <Link href={`/user/${session?.user.username || ""}`}>
              <img className="rounded-full h-[60px]" src={session?.user?.image || ""} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    <div
      className="w-full md:w-[60%] md:min-w-[700px] h-[80px] right-0 md:right-[20%] rounded-b-lg bg-white fixed md:top-[79px] top-0 z-50 shadow-lg"
      hidden={!showSearch}>
      <form className="m-4">
        <input className="w-full bg-gray-300 rounded-lg h-full shadow p-3" placeholder=" Search for anything..." />
      </form>
    </div>
    <Image src="/arrow_back.svg" className="absolute" width={50} height={50} onClick={() => router.back()}
           hidden={!showBack} alt="back" />
    {form ?
      <div className="h-[calc(100vh-160px-2.5rem)] flex place-content-center place-items-center">
        <div className="md:w-1/2 w-full bg-white rounded-lg p-5 shadow">
          {children}
        </div>
      </div> :
      <div>
        {children}
      </div>
    }
    <footer className="fixed hidden md:flex h-20 z-50 w-screen bottom-0 left-0 bg-red-500 place-items-center">
      <h1 className="text-white text-xl p-5 mr-auto hidden md:block">
        Don&apos;t be alone - Be connected to your community
      </h1>
      <Link href="/signin" className="text-[120%] w-fit m-10 p-2 px-5 rounded-lg bg-white text-black">
        Sign in
      </Link>
    </footer>
    <div className="h-[80px] md:hidden">
      <nav className="fixed bottom-0 bg-white h-[80px] w-full right-0 shadow-lg z-50">
        <ul className="flex h-full place-items-center gap-3 p-3">
          <li>
            <Link href="/">
              <Image src="/home.svg" width={50} height={50} alt="home" />
            </Link>
          </li>
          <li className="h-[50px] ml-auto">
            <button onClick={() => setShowSearch(!showSearch)}>
              <Image src="/search.svg" width={50} height={50} alt="search" />
            </button>
          </li>
          <li className="mx-auto">
            <Link href="/post/new">
              <svg className="shadow shadow-gray-500 bg-red-500 rounded-full fill-white "
                   xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                <path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" />
              </svg>
            </Link>
          </li>
          {session ?
            <>
              <li className="mr-auto">
                <Link href="/user/friends">
                  <Image src="/group.svg" width={50} height={50} alt="friends" />
                </Link>
              </li>
              <li>
                <button onClick={() => void signOut({ redirect: false })}>
                  <Image src="/logout.svg" width={50} height={50} alt="settings" />
                </button>
              </li>
            </> :
            <div className="w-[calc(100px+1.5rem)] ml-auto">
              <Link href="/signin">
                <div className="liveal-button w-full h-full text-center">
                  Sign in
                </div>
              </Link>
            </div>
          }
        </ul>
      </nav>
    </div>
  </div>;
}