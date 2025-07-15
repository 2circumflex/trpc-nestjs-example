"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

interface HeaderProps {
  isAuthenticated?: boolean;
  userInfo?: {
    name: string;
    email: string;
  };
  onLogin?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  userInfo,
  onLogin,
  onLogout,
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold text-blue-600">tRPC 풀스택</div>
          </Link>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              홈
            </Link>
            <Link
              href={"/posts" as any}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              포스트
            </Link>
            {isAuthenticated && (
              <Link
                href={"/posts/new" as any}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                포스트 작성
              </Link>
            )}
          </nav>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && userInfo ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={"/profile" as any}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {userInfo.name}님
                </Link>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={onLogin}>
                  로그인
                </Button>
                <Link href={"/auth/register" as any}>
                  <Button variant="primary" size="sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header, type HeaderProps };
