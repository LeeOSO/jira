import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { cleanObject } from "./index";

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  // 返回页面URL中制定键的参数值
  const [searchParams, setSearchParams] = useSearchParams();
  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      [searchParams]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      // iterator: 可以使用for/of遍历
      // Object.fromEntries(searchParams): 读取searchParams的iterator转换为普通对象
      const obj = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(obj);
    },
  ] as const;
};
//const断言告诉编译器为表达式推断出它能推断出的最窄或最特定的类型。
// const a = ["jack", 12, { gender: "male" }] as const;
// let zz = a[0];
