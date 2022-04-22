import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface State {
  projectModalOpen: boolean;
}

const initialState: State = {
  projectModalOpen: false,
};

export const projectListSlice = createSlice({
  name: "projectListSlice",
  initialState,
  reducers: {
    //内部使用immer处理state修改，返回新对象包含修改
    openProjectModal(state) {
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
    },
  },
});

export const projectListActions = projectListSlice.actions;
// 注意：此处用法 state.projectList原理
export const selectProjectModalOpen = (state: RootState) =>
  state.projectList.projectModalOpen;
