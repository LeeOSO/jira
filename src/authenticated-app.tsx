import { useAuth } from "./context/auth-context";
import React from "react";
import { ProjectListScreen } from "./screens/project-list";
import styled from "@emotion/styled";
import { Row } from "./components/lib";
import { ReactComponent } from "./assets/software-logo.svg";
import { Button, Dropdown, Menu } from "antd";
import { Navigate, Route, Routes } from "react-router";
import { ProjectScreen } from "./screens/project";
import { BrowserRouter as Router } from "react-router-dom";
import { resetRoute } from "./utils";

export const AuthenticatedApp = () => {
  return (
    <Container>
      <PageHeader />
      <Main>
        {/*context 共享数据时设置Router */}
        <Router>
          <Routes>
            <Route path={"/projects"} element={<ProjectListScreen />} />
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            />
            <Route path={"/*"} element={<Navigate to={"/projects"} />} />
          </Routes>
        </Router>
      </Main>
    </Container>
  );
};

const PageHeader = () => {
  const { logout, user } = useAuth();
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <Button onClick={resetRoute}>
          <ReactComponent width={"18rem"} color={"rgb(38, 132, 255)"} />
        </Button>
        <h2>2</h2>
        <h2>3</h2>
      </HeaderLeft>
      <HeaderRight>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={"logout"}>
                <Button type={"link"} onClick={logout}>
                  登出
                </Button>
              </Menu.Item>
            </Menu>
          }
        >
          <Button type={"link"} onClick={(e) => e.preventDefault()}>
            HI, {user?.name}
          </Button>
        </Dropdown>
      </HeaderRight>
    </Header>
  );
};

/**
 * Grid和Flex应用场景：
 * 1、一维布局用flex，二维布局用grid
 * 2、从内容出发还是布局出发？
 * 从内容出发：有一组内容不固定数量，希望均匀分布在容器中，内容大小决定占据大小-》flex
 * 从布局出发：先规划网格数量比较固定，再填充元素-》grid
 */
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;

const Main = styled.main`
  height: calc(100vh - 6rem);
`;
