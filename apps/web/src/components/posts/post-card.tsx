"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

interface PostInfo {
  id: number;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
  };
}

interface PostCardProps {
  post: PostInfo;
  showActions?: boolean;
  currentUserId?: number;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  showActions = false,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const isOwner = currentUserId === post.author.id;
  const truncatedContent =
    post.content.length > 150
      ? post.content.substring(0, 150) + "..."
      : post.content;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/posts/${post.id}` as any} className="block">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
          </Link>

          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-600">{post.author.name}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("ko-KR")}
            </span>
            {!post.isPublic && (
              <>
                <span className="text-gray-400">•</span>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  비공개
                </span>
              </>
            )}
          </div>
        </div>

        {showActions && isOwner && (
          <div className="flex items-center space-x-2 ml-4">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(post.id)}>
                수정
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                className="text-red-600 hover:bg-red-50"
              >
                삭제
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{truncatedContent}</p>
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {post.updatedAt !== post.createdAt && (
            <span>
              수정됨: {new Date(post.updatedAt).toLocaleDateString("ko-KR")}
            </span>
          )}
        </div>

        <Link href={`/posts/${post.id}` as any}>
          <Button variant="ghost" size="sm">
            자세히 보기
          </Button>
        </Link>
      </div>
    </div>
  );
};

export { PostCard, type PostCardProps, type PostInfo };
