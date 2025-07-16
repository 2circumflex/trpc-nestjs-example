"use client";

import React from "react";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  userInfo?: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isAuthenticated,
  userInfo,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        userInfo={userInfo}
        onLogout={onLogout}
      />

      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* 푸터 (필요시) */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            © 2025 tRPC 풀스택 앱. Made with Next.js, tRPC, NestJS.
          </div>
        </div>
      </footer>
    </div>
  );
};

export { MainLayout, type MainLayoutProps };
