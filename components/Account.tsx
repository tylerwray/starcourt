import React from "react";
import { IAccount } from "../models";

interface Props {
  account: IAccount;
}

const Account: React.FC<Props> = ({ account }) => {
  return (
    <>
      <h5 className="text-lg">{account.name}</h5>
      <div className="capitalize text-sm font-hairline">{account.subtype}</div>
      <div>
        <span className="italic font-hairline">Current: </span>
        &#x24;{account.balances.current}
      </div>
      <div>
        <span className="italic font-hairline">Available: </span>
        &#x24;{account.balances.available}
      </div>
    </>
  );
};

export default Account;
