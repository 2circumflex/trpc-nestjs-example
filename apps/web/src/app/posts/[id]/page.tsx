"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PostDetail,
  MainLayout,
  LoadingSpinner,
  Message,
  Button,
} from "@/components";
import { trpc } from "@/lib/trpc";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  const postId = parseInt(params?.id as string);

  useEffect(() => {
    // 현재 사용자 정보 확인
    const userInfoStr = localStorage.getItem("user-info");
    if (userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setCurrentUserId(user.id);
      } catch (err) {
        console.error("사용자 정보 파싱 오류:", err);
      }
    }
  }, []);

  const postQuery = trpc.posts.getPostById.useQuery({ id: postId });
  const { data: post, isLoading, error } = postQuery;

  const handleEdit = () => {
    router.push(`/posts/${postId}/edit` as any);
  };

  const postDeleter = trpc.posts.deletePost.useMutation();

  const handleDelete = async () => {
    try {
      await postDeleter.mutate({ id: postId });

      router.push("/posts" as any);
    } catch (err: any) {
      console.error("포스트 삭제 오류:", err);
      alert("포스트 삭제에 실패했습니다.");
    }
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Message type="error" title="포스트를 불러올 수 없습니다">
            {(error as any).message ||
              "포스트를 찾을 수 없거나 접근 권한이 없습니다."}
          </Message>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => router.push("/posts" as any)}
            >
              포스트 목록으로 돌아가기
            </Button>
          </div>
        </div>
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

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>뒤로가기</span>
          </Button>
        </div>

        {/* 포스트 상세 내용 */}
        {post && (
          <PostDetail
            post={post as any}
            currentUserId={currentUserId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* 관련 작업 */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => router.push("/posts" as any)}
          >
            포스트 목록 보기
          </Button>

          {currentUserId && (
            <Button onClick={() => router.push("/posts/new" as any)}>
              새 포스트 작성
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
