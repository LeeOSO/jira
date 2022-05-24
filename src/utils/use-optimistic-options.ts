import { QueryKey, useQueryClient } from "react-query";
import { Project } from "../types/project";
import { reorder } from "./reorder";
import { Task } from "../types/task";

export const useConfig = (
  queryKey: QueryKey,
  callBack: (target: any, old?: any[]) => any[]
) => {
  // 通用的乐观更新
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      // mutate发生时立即被调用
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any) => {
        // 将缓存中的数据更新为待提交数据
        return callBack(target, old);
      });
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      // 错误时回滚
      queryClient.setQueryData(
        queryKey,
        (context as { previousItems: Project[] }).previousItems
      );
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : [target]));

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
