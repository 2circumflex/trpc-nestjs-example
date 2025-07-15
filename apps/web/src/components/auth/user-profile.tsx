"use client";

import React from "react";
import { Button } from "@/components/ui";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface UserProfileProps {
  userInfo: UserInfo;
  onEdit?: () => void;
  onLogout?: () => void;
  editable?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userInfo,
  onEdit,
  onLogout,
  editable = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">프로필 정보</h2>
        {editable && onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            수정
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이름
          </label>
          <div className="text-gray-900">{userInfo.name}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <div className="text-gray-900">{userInfo.email}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            가입일
          </label>
          <div className="text-gray-600">
            {new Date(userInfo.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {onLogout && (
        <div className="mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onLogout}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            로그아웃
          </Button>
        </div>
      )}
    </div>
  );
};

export { UserProfile, type UserProfileProps, type UserInfo };
