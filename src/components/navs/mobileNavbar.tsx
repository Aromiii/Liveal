import Link from "next/link";

const MobileNavbar = () => {
  return <>
    <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)]">
      <ul className="flex h-full place-items-center">
        <li className="mx-auto">
          <Link href="/post/new">
            <svg className="bg-red-500 rounded-full fill-white"
                 xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
              <path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" />
            </svg>
          </Link>
        </li>
      </ul>
    </nav>
  </>;
};

export default MobileNavbar;