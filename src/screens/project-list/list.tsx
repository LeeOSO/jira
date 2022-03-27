import React from "react";
import { User } from "./search-panel";
import dayjs from "dayjs";
import { Table, TableProps } from "antd";

export interface Project {
  id: string;
  name: string;
  personId: string;
  pin: boolean;
  organization: string;
  created: number;
}

interface ListProps extends TableProps<Project> {
  // list: Project[];
  users: User[];
}

//loading处理：通过父组件透传属性到子组件的Table中
//取出users
//...props对象类型: type PropsType = Omit<ListProps, 'users'>;
export const List = ({ users, ...props }: ListProps) => {
  // let object = { name: "jack", age: 3 };
  return (
    <Table
      //{/*{...object} === name={'jack'} age={8}*/}
      pagination={false}
      columns={[
        {
          title: "名称",
          dataIndex: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
      ]}
      {...props}
    />
  );
};
