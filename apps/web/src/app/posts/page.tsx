"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PostCard,
  MainLayout,
  LoadingSpinner,
  Message,
  Button,
} from "@/components";
import { trpc } from "@/lib/trpc";

export default function PostsPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();

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

  const postsQuery = trpc.posts.getPublicPosts.useQuery();
  const { data: posts, isLoading, error, refetch } = postsQuery;

  const handleEdit = (postId: number) => {
    router.push(`/posts/${postId}/edit` as any);
  };

  const postDeleter = trpc.posts.deletePost.useMutation();

  const handleDelete = async (postId: number) => {
    try {
      await postDeleter.mutate({ id: postId });

      // 목록 새로고침
      refetch();
    } catch (err: any) {
      console.error("포스트 삭제 오류:", err);
      alert("포스트 삭제에 실패했습니다.");
    }
  };

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
        <Message type="error" title="에러가 발생했습니다">
          {(error as any).message}
        </Message>
      </MainLayout>
    );
  }

  const postsArray = Array.isArray(posts) ? posts : [];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">모든 포스트</h1>
            <p className="mt-2 text-gray-600">
              커뮤니티의 모든 공개 포스트를 확인해보세요
            </p>
          </div>

          {currentUserId && (
            <Button
              onClick={() => router.push("/posts/new" as any)}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>새 포스트</span>
            </Button>
          )}
        </div>

        {/* 통계 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {postsArray.length}
              </div>
              <div className="text-sm text-gray-600">총 포스트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {postsArray.filter((post) => post.isPublic).length}
              </div>
              <div className="text-sm text-gray-600">공개 포스트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {new Set(postsArray.map((post) => post.author?.name)).size}
              </div>
              <div className="text-sm text-gray-600">작성자 수</div>
            </div>
          </div>
        </div>

        {/* 포스트 목록 */}
        {postsArray.length > 0 ? (
          <div className="space-y-6">
            {postsArray.map((post: any) => (
              <PostCard
                key={post.id}
                post={post}
                showActions={true}
                currentUserId={currentUserId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 포스트가 없습니다
            </h3>
            <p className="text-gray-500 mb-6">첫 번째 포스트를 작성해보세요!</p>
            {currentUserId && (
              <Button onClick={() => router.push("/posts/new" as any)}>
                포스트 작성하기
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
