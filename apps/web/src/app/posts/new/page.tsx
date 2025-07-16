"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostForm, MainLayout, Message } from "@/components";
import type { PostFormData } from "@/components";
import { trpc } from "@/lib/trpc";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const postCreator = trpc.posts.createPost.useMutation({
    onSuccess: (data) => {
      router.push(`/posts/${data.id}` as any);
    },
  });

  const handleSubmit = async (data: PostFormData) => {
    setLoading(true);
    setError("");

    try {
      const result = await postCreator.mutate({
        title: data.title,
        content: data.content,
        isPublic: data.isPublic,
      });
    } catch (err: any) {
      console.error("포스트 작성 오류:", err);
      setError(err.message || "포스트 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-64">
          <Message type="warning" title="로그인이 필요합니다">
            포스트를 작성하려면 먼저 로그인해주세요.
          </Message>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">새 포스트 작성</h1>
          <p className="mt-2 text-gray-600">
            새로운 포스트를 작성하여 커뮤니티와 공유하세요
          </p>
        </div>

        {/* 작성 폼 */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <PostForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            submitText="포스트 작성"
          />
        </div>

        {/* 도움말 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            💡 포스트 작성 팁
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 명확하고 설명적인 제목을 사용하세요</li>
            <li>• 내용은 최소 10자 이상 작성해주세요</li>
            <li>• 공개 포스트는 모든 사용자가 볼 수 있습니다</li>
            <li>• 비공개 포스트는 본인만 볼 수 있습니다</li>
            <li>• 작성 후에도 언제든지 수정할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
