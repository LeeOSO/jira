import { Project } from "../screens/project-list/list";
import { useHttp } from "./http";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  // useQuery根据key变换可以重新触发
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
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
    { onSuccess: () => queryClient.invalidateQueries("projects") }
  ); //onSuccess之后刷新数据
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
