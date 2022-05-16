import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";
import { Project } from "../types/project";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  // useQuery根据key变换可以重新触发
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  // invalidateQueries 清除缓存数据
  // useQuery 请求数据并缓存
  // getQueryData 获取缓存数据
  // useMutation 用于创建/更新/删除数据或执行服务器命令，mutate对象用于执行修改
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
  ); //onSuccess之后刷新数据
};

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (param: Partial<Project>) =>
      client(`projects/`, { data: param, method: "POST" }),
    useAddConfig(queryKey)
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) => client(`projects/${id}`, { method: "DELETE" }),
    useDeleteConfig(queryKey)
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      enabled: Boolean(id), //只有id存在时才请求
    }
  );
};
