import { AccountType } from "../enums/AccountType";

export interface IAccount {
  id: string;
  name: string;
  type: AccountType;
  subtype: string;
  balances: {
    available: number;
    current: number;
  };
}
