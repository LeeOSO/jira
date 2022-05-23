import { Kanban } from "../../types/kanban";
import { useTasks } from "../../utils/task";
import { useTasksModal, useTasksSearchParams } from "./util";
import { useTaskTypes } from "../../utils/task-type";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Card } from "antd";
import { CreateTask } from "./create-task";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((item) => item.id === id)?.name;
  if (name) {
    return <img src={name === "task" ? taskIcon : bugIcon} alt={"icon"} />;
  } else {
    return null;
  }
};

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  const { startEdit } = useTasksModal();

  return (
    <Container>
      <h3>{kanban.name}</h3>
      <TaskContainer>
        {tasks?.map((item) => (
          <Card
            onClick={() => startEdit(item.id)}
            style={{ marginBottom: "0.5rem", cursor: "pointer" }}
            key={item.id}
          >
            <div>{item.name}</div>
            <TaskTypeIcon id={item.typeId} />
          </Card>
        ))}
        <CreateTask kanbanId={kanban.id} />
      </TaskContainer>
    </Container>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;
