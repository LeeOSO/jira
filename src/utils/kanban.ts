import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Kanban } from "../types/kanban";
import { useAddConfig } from "./use-optimistic-options";

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();
  // useQuery根据key变换可以重新触发
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (param: Partial<Kanban>) =>
      client(`kanbans/`, { data: param, method: "POST" }),
    useAddConfig(queryKey)
  );
};
