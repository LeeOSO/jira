import { useAsync } from "../utils/use-async";
import { act, renderHook } from "@testing-library/react-hooks";
// hook测试：
const defaultState: ReturnType<typeof useAsync> = {
  status: "idle",
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
  run: expect.any(Function),
};

const loadingState: ReturnType<typeof useAsync> = {
  ...defaultState,
  status: "loading",
  isIdle: false,
  isLoading: true,
};

const successState: ReturnType<typeof useAsync> = {
  ...defaultState,
  status: "success",
  isIdle: false,
  isSuccess: true,
};

test("async", async () => {
  let resolve: any, reject: any;
  const promise = new Promise((res, rej) => {
    resolve = res;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reject = rej;
  });

  const { result } = renderHook(() => useAsync()); //渲染Hook
  expect(result.current).toEqual(defaultState);

  let p: Promise<any>;
  act(() => {
    //内部有异步setState操作时使用
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(loadingState); // promise处于Pending状态

  const resolveValue = { mockValue: "resolved" };
  await act(async () => {
    resolve(resolveValue); // promise处于Resolve状态
    await p;
  });

  expect(result.current).toEqual({ ...successState, data: resolveValue });
});
