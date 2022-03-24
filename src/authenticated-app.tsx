import { useAuth } from "./context/auth-context";
import React from "react";
import { ProjectListScreen } from "./screens/project-list";
import styled from "@emotion/styled";
import { Row } from "./components/lib";

export const AuthenticatedApp = () => {
  const { logout } = useAuth();
  return (
    <div>
      <Header between={true}>
        <HeaderLeft gap={true}>
          <h2>1</h2>
          <h2>2</h2>
          <h2>3</h2>
        </HeaderLeft>
        <HeaderRight>
          <button
            onClick={() => {
              logout();
            }}
          >
            登出
          </button>
        </HeaderRight>
      </Header>
      <Main>
        <ProjectListScreen />
      </Main>
    </div>
  );
};
/**
 * Grid和Flex应用场景：
 * 1、一维布局用flex，二维布局用grid
 * 2、从内容出发还是布局出发？
 * 从内容出发：有一组内容不固定数量，希望均匀分布在容器中，内容大小决定占据大小-》flex
 * 从布局出发：先规划网格数量比较固定，再填充元素-》grid
 */
const Header = styled(Row)``;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;

const Main = styled.main`
  height: calc(100vh - 6rem);
`;
