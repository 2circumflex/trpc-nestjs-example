"use client";

import React from "react";
import { Button, ConfirmModal } from "@/components/ui";
import type { PostInfo } from "./post-card";

interface PostDetailProps {
  post: PostInfo;
  currentUserId?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
}

const PostDetail: React.FC<PostDetailProps> = ({
  post,
  currentUserId,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const isOwner = currentUserId === post.author.id;

  const handleDeleteConfirm = () => {
    onDelete?.();
    setShowDeleteModal(false);
  };

  return (
    <>
      <article className="bg-white rounded-lg shadow-sm border">
        {/* 헤더 */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>작성자:</span>
                  <span className="font-medium text-gray-900">
                    {post.author.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span>작성일:</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {post.updatedAt !== post.createdAt && (
                  <div className="flex items-center space-x-2">
                    <span>수정일:</span>
                    <span>
                      {new Date(post.updatedAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                {post.isPublic ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    공개
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    비공개
                  </span>
                )}
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center space-x-2 ml-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  disabled={loading}
                >
                  수정
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </div>
      </article>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="포스트 삭제"
        message="정말로 이 포스트를 삭제하시겠습니까? 삭제된 포스트는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </>
  );
};

export { PostDetail, type PostDetailProps };
