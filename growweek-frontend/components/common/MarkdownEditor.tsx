"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import type { ICommand } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MDPreview = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

// 텍스트 기반 마크다운 명령어만 포함 (이미지/파일 업로드 제외)
const textOnlyCommands: ICommand[] = [
  {
    name: "bold",
    keyCommand: "bold",
    buttonProps: { "aria-label": "굵게" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 384 512">
        <path
          fill="currentColor"
          d="M333.5 238a122 122 0 0 0 27-65.2C367.9 96.5 308 32 228.7 32H32a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h32v320H32a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h218.7c84.3 0 148.1-70.5 140.5-152.5a122 122 0 0 0-57.7-99.5zM128 96h100.7c36.1 0 65.5 29.4 65.5 65.5 0 36-29.4 65.5-65.5 65.5H128V96zm116.7 320H128V288h116.7c41.2 0 74.7 33.6 74.7 74.7 0 41.2-33.5 53.3-74.7 53.3z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `**${state.selectedText || "굵은 텍스트"}**`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "italic",
    keyCommand: "italic",
    buttonProps: { "aria-label": "기울임" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 320 512">
        <path
          fill="currentColor"
          d="M320 48v32a16 16 0 0 1-16 16h-62.76l-80 320H208a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h62.76l80-320H112a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `*${state.selectedText || "기울임 텍스트"}*`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "strikethrough",
    keyCommand: "strikethrough",
    buttonProps: { "aria-label": "취소선" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M496 224H293.9l-87.2-26.2C162.6 183.9 150 175.7 150 152c0-16.5 12.4-34.9 47.2-41.4 41.4-7.7 79.2-2.3 117.5 17.2a24.1 24.1 0 0 0 30.5-10.3l16-28a24 24 0 0 0-8.4-31.9C299.9 24.1 265.3 16 218.7 16c-11.3 0-23.1.6-35.2 2C114.5 27.3 68 78.8 68 135.2c0 26.1 9.5 47.8 27.8 63.3a60.3 60.3 0 0 1 7.3 6.5H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h480a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-180.4 96h-60.2c-19.6 5.5-36.6 12-48.2 17.4-31.5 14.5-45 35.8-45 64.6 0 29.5 21.8 52.5 58.9 62.3 44.1 11.7 84.8 5.5 123.5-18.9a24 24 0 0 0 7.3-32l-16-28a24.1 24.1 0 0 0-30.7-9.3c-17.5 8-35.3 12.1-51.5 12.1-23.8 0-36.5-9.2-36.5-26.3 0-7.5 4.4-15.3 12.5-21.5a66.2 66.2 0 0 1 25.9-13.1l12-2.5a74.4 74.4 0 0 0 48-46.8z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `~~${state.selectedText || "취소선 텍스트"}~~`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "divider",
    keyCommand: "divider",
    icon: <span style={{ borderLeft: "1px solid currentColor", height: "14px" }} />,
  },
  {
    name: "title",
    keyCommand: "title",
    buttonProps: { "aria-label": "제목" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 448 512">
        <path
          fill="currentColor"
          d="M432 416h-23.41L277.88 53.76A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.76L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `## ${state.selectedText || "제목"}`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "divider2",
    keyCommand: "divider2",
    icon: <span style={{ borderLeft: "1px solid currentColor", height: "14px" }} />,
  },
  {
    name: "quote",
    keyCommand: "quote",
    buttonProps: { "aria-label": "인용" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `> ${state.selectedText || "인용문"}`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "code",
    keyCommand: "code",
    buttonProps: { "aria-label": "인라인 코드" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 640 512">
        <path
          fill="currentColor"
          d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L googletag 247.2c-4.9-4.6-12.5-4.4-17 .5l-43.5 46.4c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `\`${state.selectedText || "코드"}\``;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "codeBlock",
    keyCommand: "codeBlock",
    buttonProps: { "aria-label": "코드 블록" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 448 512">
        <path
          fill="currentColor"
          d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm153 81c-7.1-7.6-19.1-7.6-26.2 0l-72 78c-7.1 7.6-7.1 19.4 0 27L127 360c7.1 7.6 19.1 7.6 26.2 0 7.1-7.6 7.1-19.4 0-27l-59-63.4 59-63.4c7.1-7.7 7.1-19.4 0-27zm119.1 0c-7.1-7.6-19.1-7.6-26.2 0-7.1 7.6-7.1 19.4 0 27L305 268l-59 63.4c-7.1 7.6-7.1 19.4 0 27 7.1 7.6 19.1 7.6 26.2 0l72-78c7.1-7.6 7.1-19.4 0-27l-72-78z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `\`\`\`\n${state.selectedText || "코드를 입력하세요"}\n\`\`\``;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "divider3",
    keyCommand: "divider3",
    icon: <span style={{ borderLeft: "1px solid currentColor", height: "14px" }} />,
  },
  {
    name: "unorderedList",
    keyCommand: "unorderedList",
    buttonProps: { "aria-label": "목록" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M48 48a48 48 0 1 0 48 48A48 48 0 0 0 48 48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `- ${state.selectedText || "목록 항목"}`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "orderedList",
    keyCommand: "orderedList",
    buttonProps: { "aria-label": "번호 목록" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M3.3 392.8L31.8 381c10.1 23.6 30.7 42 58.3 42 16.2 0 29.9-6.7 38.7-13.9 9.4-7.6 15-17.5 15-29.4 0-26-24-37.3-60.1-49.3-.6-.2-1.2-.4-1.9-.6C50 319.3 0 302.4 0 246.2c0-22.7 13.3-43.8 32.9-56.4 19.5-12.6 45.3-18.3 72.7-12.5l-11.2 36.1c-17.5-1.4-34.4 2.2-45.9 9.8-6.3 4.1-10.7 9.7-10.7 17.8 0 20.4 19.3 31.5 55.3 45.2 40.9 14.4 87.8 34.1 87.8 88.6 0 26.7-13.4 50-34.6 65.6-21.1 15.5-49.6 23.9-80.2 19l12.7-38.9c-22.4-4.6-38-18.4-46.1-39.6L3.4 392.8zm168.3-79.9h320c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-320c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16zM36.1 175.9c9.2 7.4 22.3 10.1 35.9 8.3L84.1 147c-12.3 2.5-24.1-.7-29.8-5.9-3.4-3.2-4.6-6.7-4.6-10.6 0-3.9 1.6-8.5 6.2-12.8 9.8-9.4 32.2-15.2 51.8-8.4l11.4-36.1c-35.4-9.6-71.2-3.7-95.9 19.9-12 11.5-19.3 26.4-19.3 42.9.1 14.7 6.1 28.3 18.2 39.9zM496 64h-320c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16zm0 320h-320c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `1. ${state.selectedText || "번호 목록 항목"}`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "checkedList",
    keyCommand: "checkedList",
    buttonProps: { "aria-label": "체크리스트" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M208 132h288c8.8 0 16-7.2 16-16V76c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h288c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h288c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zM64 368c-26.5 0-48.6 21.5-48.6 48s22.1 48 48.6 48 48-21.5 48-48-21.5-48-48-48zm92.5-299L93.7 131.8c-6.3 6.3-6.3 16.4 0 22.6l25.4 25.4c6.2 6.3 16.4 6.3 22.6 0l52.8-52.6c6.3-6.3 6.3-16.4 0-22.6l-25.4-25.4c-6.3-6.3-16.4-6.3-22.6-.2zM64 208c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `- [ ] ${state.selectedText || "할 일"}`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "divider4",
    keyCommand: "divider4",
    icon: <span style={{ borderLeft: "1px solid currentColor", height: "14px" }} />,
  },
  {
    name: "link",
    keyCommand: "link",
    buttonProps: { "aria-label": "링크" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M326.6 185.4c59.7 59.8 58.9 155.7.4 214.6-.1.1-.2.3-.4.4l-67.2 67.2c-59.3 59.3-155.7 59.3-215 0-59.3-59.3-59.3-155.7 0-215l37.1-37.1c9.8-9.8 26.8-3.3 27.3 10.6.6 17.7 3.8 35.5 9.7 52.7 2 5.8.6 12.3-3.8 16.6l-13.1 13.1c-28 28-28.9 73.7-1.2 102 28 28.6 74.1 28.7 102.3.5l67.2-67.2c28.2-28.2 28.1-73.8 0-101.8-3.7-3.7-7.4-6.6-10.3-8.6a16 16 0 0 1-6.9-12.6c-.4-10.6 3.3-21.5 11.7-29.8l21.1-21.1c5.5-5.5 14.2-6.2 20.6-1.7a152.5 152.5 0 0 1 20.5 17.2zM467.5 44.4c-59.3-59.3-155.7-59.3-215 0l-67.2 67.2c-.1.1-.3.3-.4.4-58.6 58.9-59.4 154.8.4 214.6a152.5 152.5 0 0 0 20.5 17.2c6.4 4.5 15.1 3.8 20.6-1.7l21.1-21.1c8.4-8.4 12.1-19.2 11.7-29.8a16 16 0 0 0-6.9-12.6c-2.9-2-6.6-4.9-10.3-8.6-28.1-28.1-28.2-73.6 0-101.8l67.2-67.2c28.2-28.2 74.3-28.1 102.3.5 27.8 28.3 26.9 73.9-1.2 102l-13.1 13.1c-4.4 4.4-5.8 10.8-3.8 16.6 5.9 17.2 9 35 9.7 52.7.5 13.9 17.5 20.4 27.3 10.6l37.1-37.1c59.3-59.3 59.3-155.7 0-215z"
        />
      </svg>
    ),
    execute: (state, api) => {
      const modifyText = `[${state.selectedText || "링크 텍스트"}](url)`;
      api.replaceSelection(modifyText);
    },
  },
  {
    name: "hr",
    keyCommand: "hr",
    buttonProps: { "aria-label": "구분선" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 448 512">
        <path
          fill="currentColor"
          d="M432 256c0 17.7-14.3 32-32 32H48c-17.7 0-32-14.3-32-32s14.3-32 32-32h352c17.7 0 32 14.3 32 32z"
        />
      </svg>
    ),
    execute: (state, api) => {
      api.replaceSelection("\n\n---\n\n");
    },
  },
];

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  height?: number;
  preview?: "edit" | "live" | "preview";
  required?: boolean;
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  helperText,
  height = 200,
  preview = "live",
  required,
}: MarkdownEditorProps) {
  const handleChange = useCallback(
    (val?: string) => {
      onChange(val || "");
    },
    [onChange]
  );

  return (
    <div className="w-full" data-color-mode="auto">
      {label && (
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={`
          rounded-xl overflow-hidden
          border transition-colors
          ${error ? "border-rose-500" : "border-stone-200 dark:border-stone-700"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <MDEditor
          value={value}
          onChange={handleChange}
          preview={preview}
          height={height}
          commands={textOnlyCommands}
          extraCommands={[]}
          textareaProps={{
            placeholder,
            disabled,
          }}
          hideToolbar={disabled}
          visibleDragbar={!disabled}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-rose-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-stone-500">{helperText}</p>
      )}
    </div>
  );
}

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  return (
    <div data-color-mode="auto" className={className}>
      <MDPreview source={content} />
    </div>
  );
}
