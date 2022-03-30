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

  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error("Promise type error.");
    }
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

  return {
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    setData,
    setError,
    run,
    ...state,
  };
};
