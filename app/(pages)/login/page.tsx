"use client";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-row justify-center h-full gap-4">
      <button
        onClick={() => router.push('/api/auth/signin')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign in with Google
      </button>
      {/* <div className="flex flex-col p-4 w-1/2 bg-violet-50 gap-4 rounded-lg">
        <p className="!text-lg !h-[80px]">
          Already have an account, sign in to view your details.
        </p>
        <Signin />
      </div>

      <div className="flex flex-col justify-center items-center w-[20px]">
        <div className="flex justify-start bg-gray-200 w-[1px] h-[40%]" />
        <span>or</span>
        <div className="flex justify-end bg-gray-200 w-[1px] h-[40%]" />
      </div>
      <div className="flex flex-col p-4 w-1/2 gap-4 bg-pink-50 rounded-lg h-full">
        <p className="!text-lg !h-[80px]">
          Not Signed up yet? Create an account to start shopping and manage your
          orders.
        </p>
        <Signup groupName={groupName} />
      </div> */}
    </div>
  );
};

export default LoginPage;
