"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc";

export default function Home() {
  const trpc = useTRPC();

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery(trpc.posts.getPublicPosts.queryOptions());

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  // posts가 배열인지 확인
  const postsArray = Array.isArray(posts) ? posts : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">tRPC 풀스택 앱</h1>
      <p className="text-gray-600 mb-8">
        Next.js + tRPC + NestJS를 활용한 풀스택 애플리케이션
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">공개 포스트</h2>
        {postsArray.length > 0 ? (
          <div className="space-y-4">
            {postsArray.map((post: any) => (
              <div key={post.id} className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-gray-600 mt-2">{post.content}</p>
                <div className="mt-2 text-sm text-gray-500">
                  작성자: {post.author?.name} | 작성일:{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">아직 포스트가 없습니다.</p>
        )}
      </div>

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-medium text-green-800">
          ✅ tRPC 연결 성공!
        </h3>
        <p className="text-green-700 mt-1">
          useTRPC 훅과 queryOptions 방식으로 백엔드와 프론트엔드가
          연결되었습니다!
        </p>
      </div>
    </div>
  );
}
