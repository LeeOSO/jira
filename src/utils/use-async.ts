import { useState } from "react";

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

  //useState传入函数，认为是惰性初始化state。不认为是保存函数。
  //传入函数的函数，使保存的state是函数类型
  const [retry, setRetry] = useState(() => () => {});

  const setData = (data: D) =>
    setState({
      //异步函数，不能同步执行获取对应结果
      data,
      status: "success",
      error: null,
    });

  const setError = (error: Error) =>
    setState({
      error,
      status: "error",
      data: null,
    });

  const run = (
    promise: Promise<D>,
    runConfig?: { retry: () => Promise<D> }
  ) => {
    if (!promise || !promise.then) {
      throw new Error("Promise type error.");
    }
    setRetry(() => () => {
      if (runConfig?.retry) {
        run(runConfig?.retry(), runConfig);
      }
    });
    setState({ ...state, status: "loading" });
    return promise
      .then((data) => {
        setData(data);
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
  };

  // const retry = ()=>{
  //
  // }

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
