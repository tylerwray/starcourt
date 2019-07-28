import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import { setCookie } from "nookies";
import React, { useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useFormField } from "../hooks/useFormField";
import { client } from "../lib/apollo";

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
  const timeout = useRef<NodeJS.Timeout>(null);

  const username = useFormField();
  const password = useFormField();

  const [available, setAvailable] = useState<boolean | null>(null);

  if (data && data.signUp.token) {
    setCookie({}, "token", data.signUp.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });
    Router.push("/");
  }

  function checkUsernameDebounced(username: string) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      client
        .query<{ usernameAvailable: boolean }>({
          query: gql`
            query UsernameAvailable($username: String!) {
              usernameAvailable(username: $username)
            }
          `,
          variables: { username }
        })
        .then(({ data }) => setAvailable(data.usernameAvailable));
    }, 1500);
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    username.onChange(event);
    checkUsernameDebounced(event.target.value);
  }

  return (
    <main className="flex justify-center items-start h-full bg-gray-100">
      <form
        className="w-3/4 max-w-sm px-4 py-8 mt-32 bg-white shadow-lg flex flex-col items-center"
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
            value={username.value}
            onChange={handleUsernameChange}
          />
          {available != null && (available ? "available" : "taken")}
        </div>
        <div className="mb-4 w-3/4">
          <Input
            id="password"
            label="Password"
            placeholder="***************"
            {...password}
          />
        </div>
        <Button type="submit" className="mb-4">
          Sign up
        </Button>
        <hr className="h-px w-3/4 bg-gray-400" />
        <Link href="login">
          <Button outline className="mt-4 w-3/4">
            &larr; Login
          </Button>
        </Link>
      </form>
    </main>
  );
};

export default SignUp;
