"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PostForm, MainLayout, LoadingSpinner, Message } from "@/components";
import type { PostFormData } from "@/components";
import { trpc } from "@repo/trpc/client";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  const postId = parseInt(params?.id as string);

  useEffect(() => {
    // 로그인 상태 및 사용자 정보 확인
    const token = localStorage.getItem("auth-token");
    const userInfoStr = localStorage.getItem("user-info");

    if (!token || !userInfoStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userInfoStr);
      setCurrentUserId(user.id);
    } catch (err) {
      console.error("사용자 정보 파싱 오류:", err);
      router.push("/auth/login");
    }
  }, [router]);

  const postQuery = trpc.posts.getPostById.useQuery({ id: postId });
  const { data: post, isLoading: postLoading, error: postError } = postQuery;

  const postUpdater = trpc.posts.updatePost.useMutation({
    onSuccess: () => {
      router.push(`/posts/${postId}` as any);
    },
  });

  const handleSubmit = async (data: PostFormData) => {
    setLoading(true);
    setError("");

    try {
      await postUpdater.mutate({
        id: postId,
        data: {
          title: data.title,
          content: data.content,
          isPublic: data.isPublic,
        },
      });
    } catch (err: any) {
      console.error("포스트 수정 오류:", err);
      setError(err.message || "포스트 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/posts/${postId}` as any);
  };

  if (!postId || isNaN(postId)) {
    return (
      <MainLayout>
        <Message type="error" title="잘못된 요청">
          올바르지 않은 포스트 ID입니다.
        </Message>
      </MainLayout>
    );
  }

  if (!currentUserId) {
    return (
      <MainLayout>
        <Message type="warning" title="로그인이 필요합니다">
          포스트를 수정하려면 먼저 로그인해주세요.
        </Message>
      </MainLayout>
    );
  }

  if (postLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (postError) {
    return (
      <MainLayout>
        <Message type="error" title="포스트를 불러올 수 없습니다">
          {(postError as any).message ||
            "포스트를 찾을 수 없거나 접근 권한이 없습니다."}
        </Message>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <Message type="warning" title="포스트를 찾을 수 없습니다">
          요청하신 포스트가 존재하지 않습니다.
        </Message>
      </MainLayout>
    );
  }

  // 권한 확인 - 작성자만 수정 가능
  if (post.author?.id !== currentUserId) {
    return (
      <MainLayout>
        <Message type="error" title="권한이 없습니다">
          본인이 작성한 포스트만 수정할 수 있습니다.
        </Message>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">포스트 수정</h1>
          <p className="mt-2 text-gray-600">
            "{post.title}" 포스트를 수정하고 있습니다
          </p>
        </div>

        {/* 수정 폼 */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <PostForm
            initialData={{
              title: post.title,
              content: post.content,
              isPublic: post.isPublic,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            submitText="수정 완료"
          />
        </div>

        {/* 주의사항 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-900 mb-3">
            ⚠️ 수정 시 주의사항
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• 수정된 내용은 즉시 반영됩니다</li>
            <li>• 공개/비공개 설정을 변경할 수 있습니다</li>
            <li>• 수정 시간이 포스트에 기록됩니다</li>
            <li>• 변경사항을 저장하지 않고 나가면 수정 내용이 사라집니다</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
