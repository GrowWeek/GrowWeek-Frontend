"use client";

import { useState } from "react";
import { Button, MarkdownEditor, MarkdownPreview } from "@/components/common";
import type { QuestionResponse, AnswerResponse } from "@/lib/api";

interface QuestionItemProps {
  question: QuestionResponse;
  answer?: AnswerResponse;
  onSaveAnswer: (questionId: number, content: string) => Promise<void>;
  disabled?: boolean;
}

export function QuestionItem({
  question,
  answer,
  onSaveAnswer,
  disabled,
}: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(!answer?.content);
  const [content, setContent] = useState(answer?.content || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await onSaveAnswer(question.id, content.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save answer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(answer?.content || "");
    setIsEditing(false);
  };

  const isAnswered = !!answer?.content;

  return (
    <div
      className={`
        p-6 rounded-2xl border transition-all
        ${
          isAnswered
            ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800"
            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        }
      `}
    >
      {/* 질문 헤더 */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${
              isAnswered
                ? "bg-emerald-500 text-white"
                : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
            }
          `}
        >
          {isAnswered ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            question.order
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {question.content}
          </h3>
        </div>
      </div>

      {/* 답변 영역 */}
      {isEditing && !disabled ? (
        <div className="ml-12 space-y-3">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="이 질문에 대한 답변을 작성해주세요..."
            height={200}
            disabled={isSaving}
          />
          <div className="flex justify-end gap-2">
            {answer?.content && (
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
                취소
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              disabled={!content.trim()}
            >
              저장
            </Button>
          </div>
        </div>
      ) : answer?.content ? (
        <div className="ml-12">
          <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed prose dark:prose-invert prose-sm max-w-none">
            <MarkdownPreview content={answer.content} />
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
        <div className="ml-12">
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
            클릭하여 답변 작성하기
          </button>
        </div>
      )}
    </div>
  );
}

