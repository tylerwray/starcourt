import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { NextPage } from "next";
import { setCookie } from "nookies";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
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

const Settings: NextPage = () => {
  const [resetPassword, { error, data }] = useMutation<Data, Variables>(
    RESET_PASSWORD
  );

  const currentPassword = useFormField();
  const newPassword = useFormField();

  if (data && data.resetPassword.token) {
    setCookie({}, "token", data.resetPassword.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });
  }

  return (
    <Layout>
      <div className="flex justify-center items-start h-full bg-gray-300">
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
          <Button>Reset password</Button>
        </form>
      </div>
    </Layout>
  );
};

export default Settings;
