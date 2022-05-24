import { useForm } from "antd/es/form/Form";
import { useTasksModal, useTasksQueryKey } from "./util";
import { useDeleteTask, useEditTask } from "../../utils/task";
import { useEffect } from "react";
import { Button, Form, Modal } from "antd";
import Input from "antd/es/input/Input";
import { UserSelect } from "../../components/user-select";
import { TaskTypeSelect } from "../../components/task-type-select";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const { editingTask, editingTaskId, close } = useTasksModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );
  const { mutateAsync: deleteTask } = useDeleteTask(useTasksQueryKey());

  const onCancel = () => {
    close();
    form.resetFields();
  };

  const onOK = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  const startEdit = () => {
    close();
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除任务吗",
      onOk() {
        return deleteTask({ id: Number(editingTaskId) });
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  return (
    <Modal
      forceRender={true} //避免未渲染时，form警告
      onCancel={onCancel}
      onOk={onOK}
      okText={"确认"}
      cancelText={"取消"}
      confirmLoading={editLoading}
      title={"编辑任务"}
      visible={!!editingTaskId}
    >
      <Form initialValues={editingTask} form={form} {...layout}>
        <Form.Item
          label={"任务名"}
          name={"name"}
          rules={[{ required: true, message: "请输入任务名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={"经办人"} name={"processorId"}>
          <UserSelect defaultOptionName={"经办人"} />
        </Form.Item>
        <Form.Item label={"类型"} name={"typeId"}>
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button size={"small"} style={{ fontSize: "14px" }} onClick={startEdit}>
          删除
        </Button>
      </div>
    </Modal>
  );
};
