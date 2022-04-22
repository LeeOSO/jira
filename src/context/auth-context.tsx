import React, { ReactNode, useCallback } from "react";
import { User } from "../screens/project-list/search-panel";
import * as auth from "auth-provider";
import { http } from "../utils/http";
import { useMount } from "../utils";
import { useAsync } from "../utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "../components/lib";
import { useDispatch, useSelector } from "react-redux";
import * as authStore from "store/auth-slice";
import { bootstrap, selectUser } from "store/auth-slice";

export interface AuthForm {
  username: string;
  password: string;
}

export const bootstrapUser = async () => {
  const token = auth.getToken();
  let user = null;
  if (token) {
    const data = await http("me", { token: token });
    user = data.user;
  }
  return user;
};
//
// const AuthContext = React.createContext<| {
//   user: User | null;
//   login: (form: AuthForm) => Promise<void>;
//   register: (form: AuthForm) => Promise<void>;
//   logout: () => Promise<void>;
// }
//   | undefined>(undefined);
// AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { error, isLoading, isIdle, isError, run } = useAsync<User | null>();
  // @ts-ignore
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();

  useMount(() => {
    //记住登录状态
    run(dispatch(bootstrap())); //使用run方法执行异步
  });

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return <div>{children}</div>;
};

// @ts-ignore
// export const useAuth = () => {
//   //接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。
//   // 当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定。
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth必须在AuthProvider中使用");
//   }
//   return context;
// };

export const useAuth = () => {
  // @ts-ignore
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();
  const user = useSelector(selectUser);
  const login = useCallback(
    (form: AuthForm) => dispatch(authStore.login(form)),
    [dispatch]
  );
  const register = useCallback(
    (form: AuthForm) => dispatch(authStore.register(form)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch]);
  return {
    user,
    login,
    register,
    logout,
  };
};
