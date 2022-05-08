import { useHttp } from "./http";
import { useAsync } from "./use-async";
import { useCallback, useEffect } from "react";
import { cleanObject } from "./index";
import { Project } from "../types/project";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  const fetchProjects = useCallback(
    () => client("projects", { data: cleanObject(param || {}) }),
    [param, client]
  );

  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
  }, [param, run, fetchProjects]);
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
