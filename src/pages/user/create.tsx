import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import BgWithLivealLogo from "../../components/bgWithLivealLogo";

const Create: NextPage = () => {
  const { status } = useSession();

  if (status == "authenticated") {
    return (
      <>
        <BgWithLivealLogo>
          <h1 className="text-2xl text-center mb-5">Create your account</h1>
          <form className="flex flex-col gap-4">
            <div className="w-full gap-4 flex">
              <input required className="bg-gray-200 rounded-lg w-full p-2" placeholder=" Display name..."/>
              <input required className="bg-gray-200 rounded-lg w-full p-2" placeholder=" Username..."/>
            </div>
            <textarea required className="bg-gray-200 rounded-lg w-full p-2" placeholder=" Your profile description..." maxLength={1000}/>
            <button className="liveal-button ml-auto">
              Create profile
            </button>
          </form>
        </BgWithLivealLogo>
      </>
    );
  }

  if (status == "loading") {
    return null
  }

  return <h1>Access denied</h1>
};

export default Create;