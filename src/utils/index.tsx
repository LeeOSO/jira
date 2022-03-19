import { useEffect, useState } from "react";

export const isFalsy = (value: any) => (value === 0 ? false : !value);

export const cleanObject = (object: object) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    // @ts-ignore
    const value = result[key];
    if (isFalsy(value)) {
      // @ts-ignore
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  //只在mount后执行一次
  useEffect(() => {
    callback();
  }, []);
};

//unknown无法读取值无法调用方法
//根据类型推断函数默认是unknown类型
//可以强制申请返回类型
//可以使用泛型来规范类型
export const useDebounce = <V,>(value: V, delay?: number) => {
  //delay? 可不传入
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => clearTimeout(timeout); //每次在上一个useEffect处理完后再运行
  }, [value, delay]); //每次在value变化后设置定时器
  return debounceValue;
};
