import { useSetUrlSearchParam, useUrlQueryParam } from "../../utils/url";
import { useMemo } from "react";
import { useProject } from "../../utils/project";

export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  // 直接返回{ ...param, personId: Number(param.personId) || undefined }时每次都是新建对象，如果有依赖改对象的hook每次都会无限刷新。
  // 使用useMemo封装返回此对象
  // useMemo仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
  return [
    useMemo(() => {
      return { ...param, personId: Number(param.personId) || undefined };
    }, [param]),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [params] = useProjectsSearchParams();
  return ["projects", params] as const;
};

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);

  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);

  const setUrlParams = useSetUrlSearchParam();

  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const open = () => setProjectCreate({ projectCreate: true });

  const close = () => {
    setUrlParams({ editingProjectId: "", projectCreate: "" });
  }; //undefined则不在URL中展示

  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });

  return {
    projectModalOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
  // 三个以上返回参数使用对象，否则使用下面方式。
  // return [
  //   projectCreate === "true",
  //   open,
  //   close
  // ] as const;
};
