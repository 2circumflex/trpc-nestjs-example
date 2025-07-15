"use client";

import React, { useState } from "react";
import { Button, Input, Message } from "@/components/ui";

interface RegisterFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value) return "이름을 입력해주세요.";
        if (value.length < 2) return "이름은 2자 이상이어야 합니다.";
        return "";
      case "email":
        if (!value) return "이메일을 입력해주세요.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "올바른 이메일 형식을 입력해주세요.";
        }
        return "";
      case "password":
        if (!value) return "비밀번호를 입력해주세요.";
        if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.";
        }
        return "";
      case "confirmPassword":
        if (!value) return "비밀번호 확인을 입력해주세요.";
        if (value !== formData.password) return "비밀번호가 일치하지 않습니다.";
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

    // 비밀번호 변경 시 확인 비밀번호도 다시 검사
    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전체 유효성 검사
    const errors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };

    setFieldErrors(errors);

    // 에러가 있으면 제출하지 않음
    if (Object.values(errors).some((error) => error)) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      // 에러는 상위 컴포넌트에서 처리
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Message type="error">{error}</Message>}

      <div>
        <Input
          name="name"
          type="text"
          label="이름"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={handleChange}
          error={fieldErrors.name}
          disabled={loading}
          autoComplete="name"
        />
      </div>

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
          placeholder="비밀번호를 입력하세요 (8자 이상, 대소문자, 숫자 포함)"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={loading}
          autoComplete="new-password"
        />
      </div>

      <div>
        <Input
          name="confirmPassword"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          disabled={loading}
          autoComplete="new-password"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        회원가입
      </Button>
    </form>
  );
};

export { RegisterForm, type RegisterFormProps };
