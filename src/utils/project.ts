import { Project } from "../screens/project-list/list";
import { useHttp } from "./http";
import { useAsync } from "./use-async";
import { useEffect } from "react";
import { cleanObject } from "./index";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  const fetchProjects = () =>
    client("projects", { data: cleanObject(param || {}) });
  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
  }, [param]);
  return result;
};

export const useEditProject = () => {
  const client = useHttp();
  const { run, ...asyncResult } = useAsync();
  // 由业务逻辑调用，执行具体逻辑。
  // 业务逻辑不能直接调用Hook函数。
  const mutate = (param: Partial<Project>) => {
    return run(
      client(`projects/${param.id}`, { data: param, method: "PATCH" })
    );
  };
  return { mutate, ...asyncResult };
};

export const useAddProject = () => {
  const client = useHttp();
  const { run, ...asyncResult } = useAsync();
  // 由业务逻辑调用，执行具体逻辑。
  // 业务逻辑不能直接调用Hook函数。
  const mutate = (param: Partial<Project>) => {
    return run(client(`projects/${param.id}`, { data: param, method: "POST" }));
  };
  return { mutate, ...asyncResult };
};
