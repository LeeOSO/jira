import { useUrlQueryParam } from "../../utils/url";
import { useMemo } from "react";

export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  // 直接返回{ ...param, personId: Number(param.personId) || undefined }时每次都是新建对象，如果有依赖改对象的hook每次都会无限刷新。
  // 使用useMemo封装返回此对象
  return [
    useMemo(() => {
      return { ...param, personId: Number(param.personId) || undefined };
    }, [param]),
    setParam,
  ] as const;
};
