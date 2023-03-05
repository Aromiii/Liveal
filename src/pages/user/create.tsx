import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import BgWithLivealLogo from "../../components/bgWithLivealLogo";

const Create: NextPage = () => {
  const { status } = useSession();

  if (status == "authenticated") {
    return (
      <>
        <BgWithLivealLogo>

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