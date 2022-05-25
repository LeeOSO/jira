import { ProfilerOnRenderCallback, ProfilerProps } from "react";
import React from "react";

type Props = {
  metadata?: any;
  phases?: ("update" | "mount")[];
} & Omit<ProfilerProps, "onRender">;

let queue: unknown[] = [];

const sendQueueReport = () => {
  if (queue.length === 0) {
    return;
  }
  const send = [...queue];
  queue = [];
  console.log(send);
};

setInterval(sendQueueReport, 5000);

// 性能优化：统计时间消耗
export const Profiler = ({ metadata, phases, ...props }: Props) => {
  const onRenderCallback: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        metadata,
      });
    }
  };

  return <React.Profiler onRender={onRenderCallback} {...props} />;
};
