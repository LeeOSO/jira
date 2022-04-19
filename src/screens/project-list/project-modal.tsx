import { Button, Drawer } from "antd";
import React from "react";
import {
  projectListActions,
  selectProjectModalOpen,
} from "./project-list_slice";
import { useDispatch, useSelector } from "react-redux";

export const ProjectModal = () => {
  //代替connect高阶组件的实现
  const dispatch = useDispatch();
  //从根状态树读取目标状态
  const projectModalOpen = useSelector(selectProjectModalOpen);
  return (
    <Drawer
      width={"100%"}
      visible={projectModalOpen}
      onClose={() => dispatch(projectListActions.closeProjectModal())}
    >
      <h1>Project Modal</h1>
      <Button onClick={() => dispatch(projectListActions.closeProjectModal())}>
        关闭
      </Button>
    </Drawer>
  );
};
