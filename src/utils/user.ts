import { useHttp } from "./http";
import { useEffect, useState } from "react";
import { User } from "../screens/project-list/search-panel";
import { useAsync } from "./use-async";

export const useUser = (param?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useEffect(() => {
    run(client("users"));
  }, [client, param, run]);
  return result;
};
