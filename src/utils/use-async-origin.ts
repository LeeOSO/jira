import { useCallback, useState } from "react";
import { useMountedRef } from "./index";

interface State<D> {
  error: Error | null;
  data: D | null;
  status: "idle" | "loading" | "error" | "success";
}

const defaultState: State<null> = {
  status: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

//, 泛型的语法与 JSX 的语法冲突
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const defConfig = { ...defaultConfig, ...initialConfig };
  const [state, setState] = useState<State<D>>({
    ...defaultState,
    ...initialState,
  });
  const mountedRef = useMountedRef();
  //useState传入函数，认为是惰性初始化state。不认为是保存函数。
  //传入函数的函数，使保存的state是函数类型
  const [retry, setRetry] = useState(() => () => {});

  const setData = useCallback(
    (data: D) =>
      setState({
        //异步函数，不能同步执行获取对应结果
        data,
        status: "success",
        error: null,
      }),
    []
  );

  const setError = useCallback(
    (error: Error) =>
      setState({
        error,
        status: "error",
        data: null,
      }),
    []
  );

  // useCallback useMemo使用时机：
  // 当需要添加非基本类型的依赖时，使用其可以限制包裹对象不要在每次页面渲染时重新创建
  // 当在使用自定义Hook返回自定义函数时，需要使用useCallback包裹保证他人使用时不会死循环
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("Promise type error.");
      }
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });
      // useCallback中直接调用setSate会使用其他值覆盖修改state变量，导致依赖改变循环调用的问题。
      // setState({ ...state, status: "loading" });
      // 解决方式：使用异步方式修改state变量，useCallback移除依赖state
      setState((prevState) => ({ ...prevState, status: "loading" }));
      return promise
        .then((data) => {
          //防止组件卸载时，仍然修改状态
          if (mountedRef) setData(data);
          return data;
        })
        .catch((error) => {
          //catch之后异常不再抛出，需要手动抛出
          setError(error); //异步设置Error
          if (defConfig.throwOnError) {
            return Promise.reject(error);
          } else {
            return error;
          }
        });
    },
    [defConfig.throwOnError, mountedRef, setData, setError]
  );

  return {
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    setData,
    setError,
    // retry 被调用时重新执行run，state刷新
    retry,
    run,
    ...state,
  };
};
