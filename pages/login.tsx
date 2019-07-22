import { NextPage } from "next";
import Link from "next/link";
import { parseCookies, setCookie } from "nookies";
import { redirect } from "../lib/utils";
import Input from "../components/Input";
import { useFormField } from "../hooks/useFormField";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

interface Data {
  login: {
    token: string;
  };
}

interface Variables {
  username: string;
  password: string;
}

const Login: NextPage = () => {
  const [login, { error, data }] = useMutation<Data, Variables>(LOGIN);

  const username = useFormField();
  const password = useFormField();

  if (data && data.login.token) {
    setCookie({}, "token", data.login.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });
    Router.push("/");
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-100">
      <div className="hidden md:flex w-2/3 flex flex-col justify-center items-center bg-pink-100">
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
      <div className="md:hidden flex flex-col justify-center items-center bg-pink-100">
        <h1 className="mt-8 font-bold text-pink-900 text-4xl tracking-widest">
          TARS
        </h1>
        <h5 className="text-gray-600 text-lg">
          Do anything you want, with money
        </h5>
      </div>
      <img className="md:hidden w-full -mt-1" src="/static/images/wave.svg" />
      <div className="w-full sm:w-1/3">
        <form
          className="w-3/4 my-0 mx-auto mt-8 md:mt-56 bg-white shadow-md rounded py-8 px-4 flex flex-col items-center"
          onSubmit={e => {
            e.preventDefault();
            login({
              variables: {
                username: username.value,
                password: password.value
              }
            });
          }}
        >
          <h2 className="mb-8 text-gray-700 text-2xl">Login</h2>
          <div className="mb-4 w-3/4">
            <Input
              id="username"
              label="Username"
              placeholder="john"
              {...username}
            />
          </div>
          <div className="mb-6 w-3/4">
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="***************"
              {...password}
            />
          </div>
          <button className="bg-pink-800 hover:bg-pink-900 text-white font-bold py-2 px-4 mb-4 rounded-lg">
            Submit
          </button>
          <hr className="h-px w-3/4 bg-gray-400" />
          <Link href="sign-up">
            <button className="w-3/4 border border-pink-900 text-pink-900 rounded-lg hover:bg-pink-100 py-2 px-4 mt-4">
              Sign up &rarr;
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

Login.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);

  if (token) {
    redirect(ctx, "/");
  }

  return {};
};

export default Login;
