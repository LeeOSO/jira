import { Button, Form, Input } from "antd";
import React, { FormEvent } from "react";
import { LongButton } from "unauthenticated-app";
import { useAuth } from "../context/auth-context";
import { useAsync } from "../utils/use-async";
//鸭子类型"面向接口编程而不是面向对象类型。只要类型匹配就可以
export const LoginScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { login, user } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });
  const handleSubmit = (values: { username: string; password: string }) => {
    run(login(values)).catch((error) => {
      onError(error);
    });
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={"username"}
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input type={"text"} id={"username"} />
      </Form.Item>
      <Form.Item
        name={"password"}
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input type={"password"} id={"password"} />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType={"submit"} type={"primary"}>
          登录
        </LongButton>
      </Form.Item>
    </Form>
  );
};
