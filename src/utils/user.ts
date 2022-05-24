import { useHttp } from "./http";
import { User } from "../types/user";
import { useQuery } from "react-query";

// export const useUser = (param?: Partial<User>) => {
//   const client = useHttp();
//   const { run, ...result } = useAsync<User[]>();
//
//   useEffect(() => {
//     run(client("users"));
//   }, [client, param, run]);
//   return result;
// };

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();

  return useQuery<User[]>(["users", param], () =>
    client("users", { data: param })
  );
};
