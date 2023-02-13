import Navbar from "./navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar/>
      <div>{children}</div>
    </>
  )
}