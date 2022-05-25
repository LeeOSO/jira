import { setupServer } from "msw/node";
import { rest } from "msw";
import fakeData from "./db.json";
import { render, screen, waitFor } from "@testing-library/react";
import { AppProviders } from "../context";
import { ProjectListScreen } from "../screens/project-list";
import { ReactNode } from "react";
// 集成测试：
const apiUrl = process.env.REACT_APP_API_URL;
const fakeAuth = {
  id: 1,
  name: "jack",
  token: "123",
};

const server = setupServer(
  rest.get(`${apiUrl}/me`, (req, res, ctx) => res(ctx.json(fakeAuth))),
  rest.get(`${apiUrl}/users`, (req, res, ctx) => res(ctx.json(fakeData.users))),
  rest.get(`${apiUrl}/projects`, (req, res, ctx) => {
    const { name = "", personId = undefined } = Object.fromEntries(
      req.url.searchParams
    );
    const result = fakeData?.projects?.filter((project) => {
      return (
        project.name.includes(name) &&
        (personId ? project.personId === +personId : true)
      );
    });
    return res(ctx.json(result));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const waitTable = () =>
  waitFor(() => expect(screen.getByText("骑手管理")).toBeInTheDocument(), {
    timeout: 3000,
  });

test("project-list-normal", async () => {
  renderScreen(<ProjectListScreen />, { route: "/projects" });
  await waitTable(); // 注意：需要确认页面已经渲染完成在测试
  expect(screen.getAllByRole("row").length).toBe(fakeData.projects.length + 1);
});

test("project-list-search", async () => {
  renderScreen(<ProjectListScreen />, { route: "/projects?name=骑手" }); // 模拟URL搜索效果
  await waitTable();
  expect(screen.getAllByRole("row").length).toBe(2);
  expect(screen.getByText("骑手管理")).toBeInTheDocument();
});

const renderScreen = (ui: ReactNode, { route = "/projects" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(<AppProviders>{ui}</AppProviders>);
};
