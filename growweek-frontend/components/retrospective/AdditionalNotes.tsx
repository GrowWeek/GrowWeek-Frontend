"use client";

import { useState } from "react";
import { Button, MarkdownEditor, MarkdownPreview } from "@/components/common";

interface AdditionalNotesProps {
  initialNotes?: string;
  onSave: (notes: string) => Promise<void>;
  disabled?: boolean;
}

export function AdditionalNotes({
  initialNotes = "",
  onSave,
  disabled,
}: AdditionalNotesProps) {
  const [isEditing, setIsEditing] = useState(!initialNotes);
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(notes.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        추가 메모
      </h3>

      <p className="text-sm text-zinc-500 mb-4">
        질문 외에 추가로 기록하고 싶은 내용을 자유롭게 작성하세요.
      </p>

      {isEditing && !disabled ? (
        <div className="space-y-3">
          <MarkdownEditor
            value={notes}
            onChange={setNotes}
            placeholder="이번 주에 있었던 일, 느낀 점, 개선하고 싶은 점 등을 자유롭게 작성해주세요..."
            height={200}
            disabled={isSaving}
          />
          <div className="flex justify-end gap-2">
            {initialNotes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNotes(initialNotes);
                  setIsEditing(false);
                }}
                disabled={isSaving}
              >
                취소
              </Button>
            )}
            <Button size="sm" onClick={handleSave} isLoading={isSaving}>
              저장
            </Button>
          </div>
        </div>
      ) : notes ? (
        <div>
          <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed prose dark:prose-invert prose-sm max-w-none">
            <MarkdownPreview content={notes} />
          </div>
          {!disabled && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              수정하기
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          disabled={disabled}
          className={`
            w-full p-4 rounded-xl border-2 border-dashed text-center transition-colors
            ${
              disabled
                ? "border-zinc-200 dark:border-zinc-700 text-zinc-400 cursor-not-allowed"
                : "border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:border-indigo-400 hover:text-indigo-600"
            }
          `}
        >
          클릭하여 메모 작성하기
        </button>
      )}
    </div>
  );
}

