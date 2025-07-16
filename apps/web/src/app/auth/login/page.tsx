"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginForm, MainLayout } from "@/components";
import { trpc } from "@/lib/trpc";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const authLogin = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // 로그인 성공 시 토큰 저장
      localStorage.setItem("auth-token", data.access_token);
      localStorage.setItem("user-info", JSON.stringify(data.user));

      // 메인 페이지로 리다이렉트
      router.push("/");
    },
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError("");

    try {
      await authLogin.mutate(data);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">로그인</h2>
            <p className="mt-2 text-sm text-gray-600">
              계정에 로그인하여 포스트를 작성하고 관리하세요
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border">
            <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

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
                  계정이 없으신가요?{" "}
                  <Link
                    href={"/auth/register" as any}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    회원가입
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
