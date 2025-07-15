"use client";

import React, { useState } from "react";
import { Button, Input, Message } from "@/components/ui";

interface PostFormData {
  title: string;
  content: string;
  isPublic: boolean;
}

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  submitText?: string;
}

const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error,
  submitText = "작성하기",
}) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    isPublic: initialData?.isPublic ?? true,
  });
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    content?: string;
  }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "title":
        if (!value.trim()) return "제목을 입력해주세요.";
        if (value.length < 2) return "제목은 2자 이상이어야 합니다.";
        if (value.length > 100) return "제목은 100자 이하여야 합니다.";
        return "";
      case "content":
        if (!value.trim()) return "내용을 입력해주세요.";
        if (value.length < 10) return "내용은 10자 이상이어야 합니다.";
        if (value.length > 2000) return "내용은 2000자 이하여야 합니다.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 실시간 유효성 검사
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isPublic: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전체 유효성 검사
    const errors = {
      title: validateField("title", formData.title),
      content: validateField("content", formData.content),
    };

    setFieldErrors(errors);

    // 에러가 있으면 제출하지 않음
    if (Object.values(errors).some((error) => error)) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // 에러는 상위 컴포넌트에서 처리
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Message type="error">{error}</Message>}

      <div>
        <Input
          name="title"
          type="text"
          label="제목"
          placeholder="포스트 제목을 입력하세요"
          value={formData.title}
          onChange={handleChange}
          error={fieldErrors.title}
          disabled={loading}
          helperText={`${formData.title.length}/100자`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          내용
        </label>
        <textarea
          name="content"
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="포스트 내용을 입력하세요"
          value={formData.content}
          onChange={handleChange}
          disabled={loading}
        />
        {fieldErrors.content && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.content}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.content.length}/2000자
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={handleCheckboxChange}
          disabled={loading}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
          공개 포스트로 설정
        </label>
      </div>

      <div className="flex items-center justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            취소
          </Button>
        )}
        <Button type="submit" loading={loading} disabled={loading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export { PostForm, type PostFormProps, type PostFormData };
