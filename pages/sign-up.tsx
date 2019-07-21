import { useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import nookies from "nookies";

const SIGN_UP = gql`
  mutation SignUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password) {
      token
    }
  }
`;

interface Data {
  signUp: {
    token: string;
  };
}

interface Variables {
  username: string;
  password: string;
}

const SignUp: NextPage = () => {
  const [signUp, { error, data }] = useMutation<Data, Variables>(SIGN_UP);

  const username = useFormField();
  const password = useFormField();

  if (data && data.signUp.token) {
    nookies.set({}, "token", data.signUp.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });
    Router.push("/");
  }

  return (
    <div className="flex justify-center items-start h-full bg-blue-400">
      <Link href="/login">
        <a className="fixed left-0 top-0 p-3 cursor-pointer text-gray-900 hover:underline">
          &larr; Login
        </a>
      </Link>
      <form
        className="px-12 py-8 mt-64 bg-white shadow-lg flex flex-col items-center"
        onSubmit={e => {
          e.preventDefault();
          signUp({
            variables: {
              username: username.value,
              password: password.value
            }
          });
        }}
      >
        {error && <div className="text-red-500">{error.message}</div>}
        <h1 className="text-gray-900 font-semibold text-xl mb-8">Sign up</h1>
        <input className="mb-4" placeholder="Username" {...username} />
        <input className="mb-8" placeholder="Password" {...password} />
        <button
          type="submit"
          className="border border-blue-900 rounded-lg px-3 py-1 text-blue-900 hover:bg-blue-100"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const useFormField = () => {
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  return { value, onChange: handleChange };
};

export default SignUp;
