"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import type { TaskResponse, TaskStatus } from "@/lib/api";

interface TaskKanbanProps {
  tasks: TaskResponse[];
  onStatusChange: (taskId: number, newStatus: TaskStatus) => Promise<void>;
  onTaskClick: (task: TaskResponse) => void;
  onAddTask: () => void;
}

const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "CANCEL"];

export function TaskKanban({
  tasks,
  onStatusChange,
  onTaskClick,
  onAddTask,
}: TaskKanbanProps) {
  const [activeTask, setActiveTask] = useState<TaskResponse | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 상태별로 태스크 그룹화
  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<TaskStatus, TaskResponse[]>);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as number;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // over.id가 상태(컬럼)인지 확인
    let newStatus: TaskStatus;
    if (statuses.includes(over.id as TaskStatus)) {
      newStatus = over.id as TaskStatus;
    } else {
      // over.id가 다른 태스크인 경우, 해당 태스크의 상태를 가져옴
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      } else {
        return;
      }
    }

    // 상태가 변경된 경우에만 API 호출
    if (task.status !== newStatus) {
      // 회고가 작성된 태스크는 이동 불가
      if (task.hasRetrospective) {
        alert("회고가 작성된 할일은 상태를 변경할 수 없습니다.");
        return;
      }
      await onStatusChange(taskId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onTaskClick={onTaskClick}
            onAddTask={status === "TODO" ? onAddTask : undefined}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}

