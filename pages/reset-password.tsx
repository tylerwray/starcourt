import { NextPage } from "next";
import Link from "next/link";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import nookies from "nookies";
import Input from "../components/Input";
import { useFormField } from "../hooks/useFormField";

const RESET_PASSWORD = gql`
  mutation ResetPassword($currentPassword: String!, $newPassword: String!) {
    resetPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      token
    }
  }
`;

interface Data {
  resetPassword: {
    token: string;
  };
}

interface Variables {
  currentPassword: string;
  newPassword: string;
}

const ResetPassword: NextPage = () => {
  const [resetPassword, { error, data }] = useMutation<Data, Variables>(
    RESET_PASSWORD
  );

  const currentPassword = useFormField();
  const newPassword = useFormField();

  if (data && data.resetPassword.token) {
    nookies.set({}, "token", data.resetPassword.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });
  }

  return (
    <div className="flex justify-center items-start h-full bg-gray-100">
      <form
        className="w-3/4 sm:w-1/4 px-4 py-8 mt-32 bg-white shadow-lg flex flex-col items-center"
        onSubmit={e => {
          e.preventDefault();
          resetPassword({
            variables: {
              currentPassword: currentPassword.value,
              newPassword: newPassword.value
            }
          });
        }}
      >
        {error && <div className="text-red-500">{error.message}</div>}
        <h2 className="mb-8 text-gray-700 text-2xl">Reset password</h2>
        <div className="mb-4 w-3/4">
          <Input
            id="current-password"
            label="Current password"
            type="password"
            placeholder="***************"
            {...currentPassword}
          />
        </div>
        <div className="mb-4 w-3/4">
          <Input
            id="new-password"
            label="New password"
            type="password"
            placeholder="***************"
            {...newPassword}
          />
        </div>
        <button
          type="submit"
          className="bg-pink-800 hover:bg-pink-900 text-white font-bold py-2 px-4 mb-4 rounded-lg"
        >
          Reset password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
