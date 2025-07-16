"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, MainLayout, LoadingSpinner, Message } from "@/components";
import type { UserInfo } from "@/components";

export default function ProfilePage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem("auth-token");
    const userInfoStr = localStorage.getItem("user-info");

    if (!token || !userInfoStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userInfoStr);
      setUserInfo({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt || new Date().toISOString(),
      });
    } catch (err) {
      setError("사용자 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleEdit = () => {
    // TODO: 프로필 편집 모달 또는 페이지 구현
    console.log("프로필 편집 기능 - 추후 구현");
  };

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-info");
    router.push("/");
  };

  if (loading) {
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
        <Message type="error" title="오류가 발생했습니다">
          {error}
        </Message>
      </MainLayout>
    );
  }

  if (!userInfo) {
    return (
      <MainLayout>
        <Message type="warning" title="로그인이 필요합니다">
          프로필을 보려면 먼저 로그인해주세요.
        </Message>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">내 프로필</h1>
          <p className="mt-2 text-gray-600">계정 정보를 확인하고 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 프로필 정보 */}
          <div className="lg:col-span-2">
            <UserProfile
              userInfo={userInfo}
              onEdit={handleEdit}
              onLogout={handleLogout}
            />
          </div>

          {/* 사이드바 - 통계 등 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                활동 통계
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">작성한 포스트</span>
                  <span className="font-medium">0개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">공개 포스트</span>
                  <span className="font-medium">0개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">비공개 포스트</span>
                  <span className="font-medium">0개</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                빠른 작업
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/posts/new" as any)}
                  className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  새 포스트 작성
                </button>
                <button
                  onClick={() => router.push("/posts" as any)}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  내 포스트 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
