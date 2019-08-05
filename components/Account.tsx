import React from "react";
import { IAccount } from "../models";

interface Props {
  account: IAccount;
}

const Account: React.FC<Props> = ({ account }) => {
  return (
    <>
      <h5>{account.name}</h5>
      <div>{account.subtype}</div>
      <div>${account.balances.current}</div>
      <div>${account.balances.available}</div>
    </>
  );
};

export default Account;
