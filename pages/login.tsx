import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import Button from "../components/Button";
import Input from "../components/Input";
import { useFormField } from "../hooks/useFormField";
import { redirect } from "../lib/utils";

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
    <div className="flex flex-col md:flex-row h-full bg-gray-200">
      <div className="hidden md:flex w-1/2 flex flex-col justify-center items-center">
        <h1 className="mt-32 font-bold text-gray-800 text-4xl tracking-widest font-serif">
          TARS
        </h1>
        <h5 className="text-gray-700 text-lg">
          Do anything you want, with money
        </h5>
        <div className="flex-grow" />
        <img
          className="max-w-md mb-64"
          src="/static/images/savings.svg"
          alt="Man with overflowing piggy bank"
        />
      </div>
      <div className="md:hidden flex flex-col justify-center items-center">
        <h1 className="mt-8 text-gray-800 text-4xl tracking-widest font-thin">
          TARS
        </h1>
        <h5 className="text-gray-700 text-lg italic font-hairline">
          Do anything you want, with money
        </h5>
      </div>
      <main className="w-full sm:w-1/2">
        <form
          className="w-3/4 my-0 mx-auto mt-8 md:mt-56 bg-white shadow-md rounded py-8 px-4 flex flex-col items-center max-w-sm"
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
          <h2 className="mb-8 text-gray-700 text-2xl font-light">Login</h2>
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
          <Button type="submit" className="mb-4">
            Login
          </Button>
          <hr className="h-px w-3/4 bg-gray-400" />
          <Link href="sign-up">
            <Button outline className="w-3/4 mt-4">
              Sign up &rarr;
            </Button>
          </Link>
        </form>
      </main>
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
