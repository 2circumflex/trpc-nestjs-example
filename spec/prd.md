# PRD: tRPC 기반 풀스택 모노레포 프로젝트

## 📋 프로젝트 개요

### 목적

tRPC를 중심으로 한 현대적인 풀스택 애플리케이션 개발 환경을 구축하여, 타입 안전성과 개발 생산성을 극대화하는 것

### 배경

- 타입 안전한 API 개발 및 클라이언트-서버 통신 구현
- 모노레포 기반의 효율적인 코드 관리 및 재사용성 향상

## 🏗️ 기술 스택

### 핵심 기술

- **API Layer**: tRPC (타입 안전한 API)
- **Backend**: NestJS + TypeORM
- **Frontend Web**: Next.js (App Router)
- **Mobile**: React Native (Expo) + WebView + @gronxb/webview-bridge
- **Database**: PostgreSQL (TypeORM)

### 개발 환경

- **모노레포**: pnpm workspace + Turborepo
- **언어**: TypeScript
- **패키지 관리**: pnpm
- **빌드 도구**: Turborepo
- **코드 품질**: ESLint, Prettier

## 📱 애플리케이션 구조

### 모노레포 구조

```
trpc-nestjs-example/
├── apps/
│   ├── backend/          # NestJS API 서버
│   ├── web/              # Next.js 웹 애플리케이션
│   └── mobile/           # React Native (Expo) 앱
├── packages/
│   ├── shared/           # 공통 타입, 유틸리티
│   └── database/         # TypeORM 엔티티, 마이그레이션
└── 설정 파일들
```

### 주요 기능 요구사항

#### 1. 백엔드 (NestJS)

- **tRPC 라우터 구현**
  - 타입 안전한 API 엔드포인트
  - 입력 검증 및 에러 핸들링
  - 인증/인가 시스템

- **데이터베이스 연동**
  - TypeORM을 통한 PostgreSQL 연결
  - 엔티티 정의 및 관계 설정
  - 마이그레이션 관리

- **비즈니스 로직**
  - 사용자 인증 시스템 (회원가입, 로그인, 로그아웃)
  - 사용자 관리 (프로필 조회/수정)
  - 포스트 관리 (CRUD)
    - 제목(title), 내용(content)
    - 공개/비공개 설정 (isPublic)
    - 작성자 인증 필요
  - 인가 시스템 (로그인된 사용자만 포스트 작성 가능)

#### 2. 웹 프론트엔드 (Next.js)

- **tRPC 클라이언트 구현**
  - 타입 안전한 API 호출
  - React Query 통합
  - 에러 바운더리

- **UI/UX**
  - 반응형 디자인
  - 다크/라이트 모드
  - 로딩 상태 관리

- **페이지 구성**
  - 메인 페이지 (공개 포스트 목록)
  - 로그인/회원가입 페이지
  - 사용자 프로필 페이지
  - 포스트 목록/상세 페이지
  - 포스트 작성/수정 페이지 (로그인 필요)

#### 3. 모바일 앱 (React Native)

- **WebView 기반 구현**
  - @gronxb/webview-bridge를 통한 타입 안전한 통신
  - 웹 애플리케이션 임베딩 (Next.js 앱)
  - 하위 호환성 보장
  - 앱 리뷰 없는 JavaScript 기반 구현

- **네이티브 기능**
  - 카메라/갤러리 접근
  - 푸시 알림
  - 디바이스 정보 수집
  - WebView ↔ React Native 간 타입 안전한 메시지 전달

#### 4. 공통 패키지

- **shared 패키지**
  - 타입 정의
  - 유틸리티 함수
  - 상수 정의

- **database 패키지**
  - TypeORM 엔티티
  - 마이그레이션 파일
  - 시드 데이터

## 🎯 개발 단계

### Phase 1: 기반 구조 설정

- [x] 모노레포 기본 구조 설정
- [x] 공통 패키지 설정
- [x] TypeScript 설정 최적화

### Phase 2: 백엔드 개발

- [x] NestJS 기본 설정
- [x] TypeORM 데이터베이스 연결 (PostgreSQL)
- [x] tRPC 라우터 구현 (기본 사용자 API)
- [x] 사용자 인증 시스템 구현
  - [x] JWT 기반 인증
  - [x] 회원가입/로그인 API
  - [x] 인증 미들웨어
- [x] 포스트 시스템 구현
  - [x] Post 엔티티 생성
  - [x] 포스트 CRUD API
  - [x] 공개/비공개 설정
  - [x] 작성자 권한 확인

### Phase 3: 웹 프론트엔드 개발

- [x] Next.js 앱 설정
- [x] tRPC 클라이언트 설정
- [ ] 기본 UI 컴포넌트 개발
- [x] 페이지 구현 (기본 메인 페이지)

### Phase 4: 모바일 앱 개발

- [ ] Expo 앱 설정
- [ ] @gronxb/webview-bridge 통합
- [ ] 타입 안전한 WebView 통신 구현
- [ ] 네이티브 기능 브릿지 구현
- [ ] 기본 기능 테스트

## 🔧 개발 환경 요구사항

### 필수 도구

- pnpm 10+
- PostgreSQL 14+
- Git

## 📊 성공 지표

### 기술적 목표

- 타입 안전성 100% 달성
- 테스트 커버리지 80% 이상

### 학습 목표

- tRPC 실무 활용 능력 습득
- 모노레포 관리 경험 축적
- 풀스택 개발 역량 강화

## 🚀 배포 전략

### 개발 환경

- 로컬 개발 서버
- Docker Compose 활용

### 스테이징 환경

- Railway (백엔드)

### 프로덕션 환경

- 클라우드 서비스 활용
- CI/CD 파이프라인 구축

## 📝 참고 자료

- [tRPC 공식 문서](https://trpc.io/)
- [NestJS 공식 문서](https://nestjs.com/)
- [Next.js 공식 문서](https://nextjs.org/)
- [Turborepo 공식 문서](https://turbo.build/)
- [TypeORM 공식 문서](https://typeorm.io/)
- [WebViewBridge 공식 문서](https://gronxb.github.io/webview-bridge/)
