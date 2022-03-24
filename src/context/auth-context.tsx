import React, { ReactNode, useState } from "react";
import { User } from "../screens/project-list/search-panel";
import * as auth from "auth-provider";
import { http } from "../utils/http";
import { useMount } from "../utils";

interface AuthForm {
  username: string;
  password: string;
}

const bootstrapUser = async () => {
  const token = auth.getToken();
  let user = null;
  if (token) {
    const data = await http("me", { token: token });
    user = data.user;
  }
  return user;
};

const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useMount(() => {
    //记住登录状态
    bootstrapUser().then(setUser);
  });

  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout }}
      children={children}
    />
  );
};

// @ts-ignore
export const useAuth = () => {
  //接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。
  // 当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定。
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
