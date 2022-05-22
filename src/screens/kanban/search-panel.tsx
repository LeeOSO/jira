import { useTasksSearchParams } from "./util";
import { useSetUrlSearchParam } from "../../utils/url";
import { Row } from "../../components/lib";
import { Button, Input } from "antd";
import { UserSelect } from "../../components/user-select";
import { TaskTypeSelect } from "../../components/task-type-select";

export const SearchPanel = () => {
  const tasksSearchParams = useTasksSearchParams();
  const setUrlSearchParam = useSetUrlSearchParam();

  const reset = () => {
    setUrlSearchParam({
      typeId: undefined,
      processorId: undefined,
      tagId: undefined,
      name: undefined,
    });
  };

  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: "20rem" }}
        placeholder={"任务名"}
        value={tasksSearchParams.name}
        onChange={(evt) => setUrlSearchParam({ name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName={"经办人"}
        value={tasksSearchParams.processorId}
        onChange={(value) => setUrlSearchParam({ processorId: value })}
      />
      <TaskTypeSelect
        defaultOptionName={"类型"}
        value={tasksSearchParams.typeId}
        onChange={(value) => setUrlSearchParam({ typeId: value })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Row>
  );
};
