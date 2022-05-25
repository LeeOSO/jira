import { setupServer } from "msw/node";
import { rest } from "msw";
import { http } from "../utils/http";

const apiUrl = process.env.REACT_APP_API_URL;
const server = setupServer();
// jest：测试框架
// beforeAll：代表所有的测试执行之前执行的回调函数
beforeAll(() => server.listen());

// 每一个测试执行完成后，重置mock路由
afterEach(() => server.resetHandlers());

// 所有测试执行完成后，关闭mock路由
afterAll(() => server.close());

test("http async", async () => {
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, context) =>
      res(context.json(mockResult))
    )
  );

  const result = await http(endpoint);
  expect(result).toEqual(mockResult);
});

test("http token", async () => {
  const token = "FAKE";
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };
  let request: any;

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, context) => {
      request = req;
      return res(context.json(mockResult));
    })
  );

  await http(endpoint, { token });
  expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`);
});
