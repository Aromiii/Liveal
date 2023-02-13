import GoogleSignInSvg from "../googleSignInSvg";

const Signin = () => {
  return <>
    <div className="h-[calc(100vh-2.5rem)] flex place-content-center place-items-center">
      <main className="bg-white gap-3 flex flex-col rounded-lg p-10 place-items-center">
        <h1 className="text-center">Sign in</h1>
        <form className="flex flex-col gap-3">
          <input className="w-[220px] p-2 bg-gray-200 rounded-lg" type="email" placeholder=" Email"/>
          <input className="w-[220px] p-2 bg-gray-200 rounded-lg" type="password" placeholder=" Password"/>
          <button className="w-[220px] bg-red-500 text-white p-2 rounded-lg" type="submit">Sign in</button>
        </form>
        <p>Or</p>
        <button>
          <GoogleSignInSvg/>
        </button>
      </main>
    </div>
  </>
}

export default Signin;