import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "../context/auth-context";

const apiURL = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  data?: object;
  token?: string;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: headers || {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }
  // axios 和 fetch 的表现不一样，axios可以直接在返回状态不为2xx的时候抛出异常
  return fetch(`${apiURL}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      await auth.logout();
      window.location.reload();
      return Promise.reject({ message: "请重新登录" });
    } else {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    }
  });
};

export const useHttp = () => {
  const { user } = useAuth();
  //ts 操作符
  // typeof: ts中静态，js中动态。 typeof 操作符可以用来获取一个变量或对象的类型。
  // utility type: 用泛型给他传入一个其他类型，然后utility type对这个类型进行某种操作
  // Parameters 类型别名
  return (...[endpoint, config]: Parameters<typeof http>) =>
    http(endpoint, { ...config, token: user?.token });
};
//联合类型
let data: string | number;

//类型别名, 对于联合类型interface在这种情况下无法替代别名
type dataType = string | number;
let data2: dataType;

//interface和类型别名可以互换
interface Person {
  name: string;
}
type Person2 = { name: string };
const xx: Person = { name: "x" };
const xxPerson: Person2 = { name: "s" };

//interface无法实现utility type
type Person3 = { name: string; age: number };
// keyof 键值集合
type Personkeys = keyof Person3;

// Partial将制定类型变为可选的：name? age?
const xiao: Partial<Person3> = { name: "xx" };
// Omit将制定类型删除： "name" | "age"
const shenmiren: Omit<Person3, "name"> = { age: 1 };
// Pick挑选制定类型组成新类型
type PersonKeyPick = Pick<Person3, "name">;
// 移除键名，返回剩余键名
type Age = Exclude<Personkeys, "name">;

//Partial实现
//in遍历操作
type Partial<T> = {
  [P in keyof T]?: T[P];
};
