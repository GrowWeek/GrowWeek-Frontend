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
        p-6 rounded-xl border transition-all
        ${
          isAnswered
            ? "bg-lime-50/50 dark:bg-lime-900/10 border-lime-200 dark:border-lime-800"
            : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"
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
                ? "bg-lime-400 text-stone-900"
                : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
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
          <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100">
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
          <div className="text-stone-700 dark:text-stone-300 leading-relaxed prose dark:prose-invert prose-sm max-w-none">
            <MarkdownPreview content={answer.content} />
          </div>
          {!disabled && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 text-sm text-lime-600 hover:text-lime-700 font-medium"
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
                  ? "border-stone-200 dark:border-stone-700 text-stone-400 cursor-not-allowed"
                  : "border-stone-300 dark:border-stone-600 text-stone-500 hover:border-lime-400 hover:text-lime-600"
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

