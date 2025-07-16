"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterForm, MainLayout, Message } from "@/components";
import { trpc } from "@/lib/trpc";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const authRegistrar = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      console.log(data);
      // TODO: 토큰 저장 로직 구현
      // localStorage.setItem("auth-token", data.access_token);
      // localStorage.setItem("user-info", JSON.stringify(data.user));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await authRegistrar.mutate({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      // setSuccess(true);

      // // 잠시 후 메인 페이지로 리다이렉트
      // setTimeout(() => {
      //   router.push("/");
      // }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
            <p className="mt-2 text-sm text-gray-600">
              새 계정을 만들어 tRPC 풀스택 앱을 시작하세요
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border">
            {success && (
              <Message type="success" title="회원가입 성공!" className="mb-6">
                환영합니다! 잠시 후 메인 페이지로 이동합니다.
              </Message>
            )}

            <RegisterForm
              onSubmit={handleRegister}
              loading={loading}
              error={error}
            />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  이미 계정이 있으신가요?{" "}
                  <Link
                    href={"/auth/login" as any}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    로그인
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
