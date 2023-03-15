import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return <nav className="bg-white rounded-lg h-[80px] flex place-items-center justify-center">
    <Image className="md:block hidden mr-auto mx-3" src="/livealLogoWithText.svg" width={160} height={0} alt="Liveal logo" />
    <Image className="md:hidden mr-auto mx-3" src="/livealLogoWithoutText.svg" alt="Liveal logo" width={60} height={0} />
    <Link href={`/user/${session?.user.username}`} className="block w-[60px] mx-3">
      <img className="rounded-full" src={session?.user?.image} />
    </Link>
  </nav>;
}