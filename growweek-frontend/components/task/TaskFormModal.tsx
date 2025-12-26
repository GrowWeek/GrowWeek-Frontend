"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Input, Textarea, Select } from "@/components/common";
import type {
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
  SensitivityLevel,
} from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  task?: TaskResponse | null;
  mode: "create" | "edit";
}

const priorityOptions = [
  { value: "1", label: "🔴 높음" },
  { value: "2", label: "🟡 중간" },
  { value: "3", label: "🟢 낮음" },
];

const sensitivityOptions = [
  { value: "NONE", label: "없음" },
  { value: "TITLE_ONLY", label: "제목만" },
  { value: "NEVER", label: "항상" },
];

const statusOptions = [
  { value: "TODO", label: "할 일" },
  { value: "IN_PROGRESS", label: "진행 중" },
  { value: "DONE", label: "완료" },
  { value: "CANCEL", label: "취소" },
];

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  mode,
}: TaskFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("2");
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [dueDate, setDueDate] = useState(formatDate(new Date()));
  const [sensitivityLevel, setSensitivityLevel] = useState<SensitivityLevel>("NONE");
  const [status, setStatus] = useState<TaskStatus>("TODO");

  // 태스크 데이터로 폼 초기화
  useEffect(() => {
    if (task && mode === "edit") {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(String(task.priority));
      setStartDate(task.startDate);
      setDueDate(task.dueDate);
      setSensitivityLevel(task.sensitivityLevel);
      setStatus(task.status);
    } else {
      // 생성 모드: 기본값으로 리셋
      setTitle("");
      setDescription("");
      setPriority("2");
      setStartDate(formatDate(new Date()));
      setDueDate(formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)));
      setSensitivityLevel("NONE");
      setStatus("TODO");
    }
    setErrors({});
  }, [task, mode, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    if (!startDate) {
      newErrors.startDate = "시작일을 선택해주세요.";
    }

    if (!dueDate) {
      newErrors.dueDate = "마감일을 선택해주세요.";
    }

    if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
      newErrors.dueDate = "마감일은 시작일 이후여야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const data: CreateTaskRequest = {
          title: title.trim(),
          description: description.trim() || undefined,
          priority: parseInt(priority),
          startDate,
          dueDate,
          sensitivityLevel,
        };
        await onSubmit(data);
      } else {
        const data: UpdateTaskRequest = {
          title: title.trim(),
          description: description.trim() || undefined,
          priority: parseInt(priority),
          dueDate,
          sensitivityLevel,
          status,
        };
        await onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error("Failed to submit task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = task?.hasRetrospective;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "할일 추가" : "할일 수정"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {isLocked && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm font-medium">
                회고가 작성된 할일은 수정할 수 없습니다.
              </span>
            </div>
          </div>
        )}

        <Input
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할일 제목을 입력하세요"
          error={errors.title}
          required
          disabled={isLocked}
        />

        <Textarea
          label="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="할일에 대한 설명을 입력하세요 (선택사항)"
          rows={3}
          disabled={isLocked}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="우선순위"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={priorityOptions}
            required
            disabled={isLocked}
          />

          <Select
            label="민감도"
            value={sensitivityLevel}
            onChange={(e) => setSensitivityLevel(e.target.value as SensitivityLevel)}
            options={sensitivityOptions}
            disabled={isLocked}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="시작일"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={errors.startDate}
            required
            disabled={mode === "edit" || isLocked}
          />

          <Input
            type="date"
            label="마감일"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
            required
            disabled={isLocked}
          />
        </div>

        {mode === "edit" && (
          <Select
            label="상태"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={statusOptions}
            disabled={isLocked}
          />
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isLocked}>
            {mode === "create" ? "추가" : "저장"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

