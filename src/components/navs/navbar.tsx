import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [showSearch, setShowSearch] = useState(false)

  return <div className="h-[calc(80px-1.25rem)] w-full">
    <nav className="fixed top-0 bg-white h-[80px] flex place-items-center justify-center w-full right-0 shadow-lg z-50 border-b">
      <Image className="md:block hidden mr-auto mx-3" src="/livealLogoWithText.svg" width={160} height={0} alt="Liveal logo" />
      <Image className="md:hidden mr-auto mx-3" src="/livealLogoWithoutText.svg" alt="Liveal logo" width={60} height={0} />
      <ul className="h-[70] mx-3 flex gap-6 place-items-center">
        <li>
          <Link href="/">
            <Image src="/home.svg" width={50} height={50}/>
          </Link>
        </li>
        <li className="h-[50px]">
          <button onClick={() => setShowSearch(!showSearch)}>
            <Image src="/search.svg" width={50} height={50}/>
          </button>
        </li>
        <li>
          <Link href={`/user/${session?.user.username}`}>
            <img className="rounded-full h-[60px]" src={session?.user?.image} />
          </Link>
        </li>
      </ul>
      <div className="w-full md:w-[60%] md:min-w-[700px] h-[80px] rounded-b-lg bg-white absolute top-[100%] shadow-lg" hidden={!showSearch}>
        <form className="m-4">
          <input className="w-full bg-gray-300 rounded-lg h-full shadow p-3" placeholder=" Search for anything..."/>
        </form>
      </div>
    </nav>
  </div>
}