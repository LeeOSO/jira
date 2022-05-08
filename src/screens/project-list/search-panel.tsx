import { Form, Input } from "antd";
import React from "react";
import { UserSelect } from "../../components/user-select";
import { Project } from "../../types/project";
import { User } from "../../types/user";

interface SearchPanelProps {
  users: User[];
  // param: {
  //   name: string;
  //   personId: string;
  // };
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ param, setParam }: SearchPanelProps) => {
  return (
    <Form style={{ marginBottom: "2rem" }} layout={"inline"}>
      <Form.Item>
        <Input
          type="text"
          placeholder={"项目名"}
          value={param.name}
          onChange={(evt) =>
            setParam({
              ...param,
              name: evt.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          value={param.personId}
          onChange={(value) =>
            setParam({
              ...param,
              personId: value,
            })
          }
          defaultOptionName={"负责人"}
        />
        {/*<Select*/}
        {/*  value={param.personId}*/}
        {/*  onChange={*/}
        {/*    (value) =>*/}
        {/*      setParam({*/}
        {/*        ...param,*/}
        {/*        personId: value*/}
        {/*      })*/}
        {/*  }*/}
        {/*>*/}
        {/*  <Select.Option value={""}>负责人</Select.Option>*/}
        {/*  {users.map((user) => (*/}
        {/*    <Select.Option key={user.id} value={String(user.id)}>*/}
        {/*      {user.name}*/}
        {/*    </Select.Option>*/}
        {/*  ))}*/}
        {/*</Select>*/}
      </Form.Item>
    </Form>
  );
};
