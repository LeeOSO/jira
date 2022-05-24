import React from "react";
import { Link } from "react-router-dom";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { KanbanScreen } from "../kanban";
import { EpicScreen } from "../epic";
import styled from "@emotion/styled";
import { Menu } from "antd";

const useRouteType = () => {
  const pathnameArr = useLocation().pathname.split("/");
  return pathnameArr[pathnameArr.length - 1];
};

export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Container>
      {/*to 前缀加/代表根路由*/}
      <Aside>
        <Menu mode={"inline"} selectedKeys={[routeType]}>
          <Menu.Item key={"kanban"}>
            <Link to={"kanban"}>看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to={"epic"}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path={"/kanban"} element={<KanbanScreen />} />
          <Route path={"/epic"} element={<EpicScreen />} />
          {/*设置默认路由*/}
          <Route
            path={"/*"}
            element={
              <Navigate
                to={window.location.pathname + "/kanban"}
                replace={true}
              />
            } //replace={true}: 替换未匹配路由栈，back时回退到最上层
          />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;

const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`;

const Container = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 16rem 1fr;
`;
