import React from "react";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import { useDebounce, useDocumentTitle } from "../../utils";
import { useProjects } from "../../utils/project";
import { useUser } from "../../utils/user";
import { useProjectModal, useProjectsSearchParams } from "./util";
import {
  ButtonNoPadding,
  ErrorBox,
  Row,
  ScreenContainer,
} from "../../components/lib";

// const apiURL = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  // const [users, setUsers] = useState([]);

  // const [, setParam] = useState({
  //   name: "",
  //   personId: "",
  // });
  // const [keys] = useState<('name'|'personId')[]>(['name', 'personId']);
  // 基本类型、组件状态可以放到依赖中。非组件状态对象不能放到依赖。
  // const [param, setParam] = useUrlQueryParam(["name", "personId"]);

  // const [list, setList] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<Error | null>(null);

  // param中的personId从URL获取的都是string需要转换类型
  // const projectsParam = { ...param, personId: Number(param.personId) || undefined };
  const [param, setParam] = useProjectsSearchParams();
  const debounceParam = useDebounce(param, 500);
  // const client = useHttp();

  // useEffect(() => {
  //   // setLoading(true);
  //   // client("projects", { data: cleanObject(debounceParam) }).then(setList).catch((error) => {
  //   //   setList([]);
  //   //   setError(error);
  //   // }).finally(() => {
  //   //   setLoading(false);
  //   // });
  //
  //   run(client("projects", { data: cleanObject(debounceParam) }));
  // }, [debounceParam]);

  // useMount(() => {
  //   client("users").then(setUsers);
  // });

  // 使用自定义Hook封装异步操作
  const { error, isLoading: loading, data: list } = useProjects(debounceParam);
  const { data: users } = useUser();
  const { open } = useProjectModal();
  useDocumentTitle("项目列表", false);
  return (
    <ScreenContainer>
      <Row between={true}>
        <h2>项目列表</h2>
        <ButtonNoPadding type={"link"} onClick={open}>
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List dataSource={list || []} users={users || []} loading={loading} />
    </ScreenContainer>
  );
};

ProjectListScreen.whyDidYouRender = true;
