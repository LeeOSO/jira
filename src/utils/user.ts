import { useHttp } from "./http";
import { useEffect } from "react";
import { useAsync } from "./use-async";
import { User } from "../types/user";

export const useUser = (param?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useEffect(() => {
    run(client("users"));
  }, [client, param, run]);
  return result;
};
