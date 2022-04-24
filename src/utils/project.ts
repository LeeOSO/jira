import { Project } from "../screens/project-list/list";
import { useHttp } from "./http";
import { useAsync } from "./use-async";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    { onSuccess: () => queryClient.invalidateQueries("projects") }
  ); //onSuccess回到之后刷新数据
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (param: Partial<Project>) =>
      client(`projects/`, { data: param, method: "POST" }),
    { onSuccess: () => queryClient.invalidateQueries("projects") }
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery(["project", { id }], () => client(`projects/${id}`), {
    enabled: !!id, //只有id存在时才请求
  });
};
