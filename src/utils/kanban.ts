import { useHttp } from "./http";
import { useQuery } from "react-query";
import { Kanban } from "../types/kanban";

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();
  // useQuery根据key变换可以重新触发
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};
