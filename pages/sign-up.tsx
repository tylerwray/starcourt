import { NextPage } from "next";
import Link from "next/link";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import nookies from "nookies";
import Input from "../components/Input";
import { useFormField } from "../hooks/useFormField";

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
    <div className="flex justify-center items-start h-full bg-gray-100">
      <form
        className="w-3/4 sm:w-1/4 px-4 py-8 mt-32 bg-white shadow-lg flex flex-col items-center"
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
        <h2 className="mb-8 text-gray-700 text-2xl">Sign up</h2>
        <div className="mb-4 w-3/4">
          <Input
            id="username"
            label="Username"
            placeholder="jimmy"
            {...username}
          />
        </div>
        <div className="mb-4 w-3/4">
          <Input
            id="password"
            label="Password"
            placeholder="***************"
            {...password}
          />
        </div>
        <button
          type="submit"
          className="bg-pink-800 hover:bg-pink-900 text-white font-bold py-2 px-4 mb-4 rounded-lg"
        >
          Sign up
        </button>
        <hr className="h-px w-3/4 bg-gray-400" />
        <Link href="login">
          <button className="w-3/4 border border-pink-900 text-pink-900 rounded-lg hover:bg-pink-100 py-2 px-4 mt-4">
            &larr; Login
          </button>
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
