import { useEffect, useRef, useState } from "react";

export const isFalsy = (value: any) => (value === 0 ? false : !value);
export const isVoid = (value: any) =>
  value === undefined || value === null || value === "";

//ts中object类型广泛，函数也是object类型
export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
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
  }, [value, delay]); //每次在value变化后设置定时器 //存在无限渲染问题：render触发后，如果value是对象则一直会变化导致循环渲染问题，如果value是state对象不会循环渲染
  return debounceValue;
};

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  //闭包方案
  // const oldTitle = document.title;
  //页面加载时：oldTitle === 旧title
  //页面加载后：oldTitle === 新title

  //新方案：
  const oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        // 如果不指定依赖，这里读到的oldTitle一直是旧title
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

export const resetRoute = () => {
  window.location.href = window.location.origin;
};
