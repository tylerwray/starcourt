import { NextPage } from "next";

import "../style.css";

const Login: NextPage = () => (
  <div className="flex h-full">
    <div className="w-2/3 flex flex-col justify-center items-center bg-pink-100">
      <h1 className="mt-32 font-bold text-pink-900 text-4xl tracking-widest">
        TARS
      </h1>
      <h5 className="text-gray-600 text-lg">
        Do anything you want, with money
      </h5>
      <div className="flex-grow" />
      <img
        className="max-w-md mb-64"
        src="/static/images/savings.svg"
        alt="Man with overflowing piggy bank"
      />
    </div>
    <div className="w-1/3 flex flex-col items-center mt-56">
      <h2 className="mb-8 text-gray-700 text-2xl">Login</h2>
      <input className="mb-4" placeholder="Username" />
      <input className="mb-8" placeholder="Password" />
      <button className="border border-gray-500 rounded-lg px-3 py-1 text-gray-700 hover:bg-gray-100">
        Submit
      </button>
    </div>
  </div>
);

export default Login;
