"use client";

import React, { useState } from "react";
import { Button, Input, Message } from "@/components/ui";

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (!value) return "이메일을 입력해주세요.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "올바른 이메일 형식을 입력해주세요.";
        }
        return "";
      case "password":
        if (!value) return "비밀번호를 입력해주세요.";
        if (value.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 실시간 유효성 검사
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전체 유효성 검사
    const errors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
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
          name="email"
          type="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <div>
        <Input
          name="password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        로그인
      </Button>
    </form>
  );
};

export { LoginForm, type LoginFormProps };
