"use client";

import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "../lib/trpc";
import { PostCard, LoadingSpinner, Message, MainLayout } from "@/components";

export default function Home() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", "getPublicPosts"],
    queryFn: () => (trpcClient as any).posts.getPublicPosts.query(),
  });

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
          {error.message}
        </Message>
      </MainLayout>
    );
  }

  // posts가 배열인지 확인
  const postsArray = Array.isArray(posts) ? posts : [];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            tRPC 풀스택 앱
          </h1>
          <p className="text-xl text-gray-600">
            Next.js + tRPC + NestJS를 활용한 풀스택 애플리케이션
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            최근 공개 포스트
          </h2>

          {postsArray.length > 0 ? (
            <div className="space-y-6">
              {postsArray.map((post: any) => (
                <PostCard key={post.id} post={post} />
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
              <p className="text-gray-500">첫 번째 포스트를 작성해보세요!</p>
            </div>
          )}
        </div>

        <Message type="success" title="✅ tRPC 연결 성공!" className="mt-8">
          useTRPC 훅과 queryOptions 방식으로 백엔드와 프론트엔드가
          연결되었습니다!
        </Message>
      </div>
    </MainLayout>
  );
}
