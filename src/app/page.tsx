import { type NextPage } from "next";
import { redirect } from "next/navigation";

const Home: NextPage = () => {
  return redirect("/feed")
};

export default Home;