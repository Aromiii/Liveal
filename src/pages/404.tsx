import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/navs/navbar";

const FourZeroFour = () => {
  const { data: session } = useSession()
  const router = useRouter()

  return <>
    <Navbar form={true} showBack={false}>
      <div className="h-28">
        <h1 className="text-2xl font-semibold text-center h-2/3">404 Page not found</h1>
        <ul className="flex gap-4 w-fit mx-auto">
          <li>
            <Link href="/">
              <p className="text-lg hover:text-red-500 hover:underline hover:text-xl transition">Feed</p>
            </Link>
          </li>
          <li>
            <Link href={`/user/${session?.user.username}`}>
              <p className="text-lg hover:text-red-500 hover:underline hover:text-xl transition">Profile</p>
            </Link>
          </li>
          <li>
            <button onClick={() => router.reload()}>
              <p className="text-lg hover:text-red-500 hover:underline hover:text-xl transition">Reload</p>
            </button>
          </li>
        </ul>
      </div>
    </Navbar>
  </>;
};

export default FourZeroFour;