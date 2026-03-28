---
name: 나만의 일기장 개발 계획
overview: spec.md와 api-spec.md를 기반으로, 0단계(초기 셋업) → 1단계(목업) → 2단계(실제 구현)로 나누어 개발한다. 1단계가 완전히 끝나기 전에는 2단계로 넘어가지 않으며, 각 섹션 완료 후 반드시 진행 여부를 확인받는다.
todos:
  - id: step0-1
    content: "0단계: Next.js 프로젝트 생성 (frontend/ 폴더, App Router, TypeScript, Tailwind)"
    status: completed
  - id: step0-2
    content: "0단계: 폴더 구조 잡기 (app, components, lib, types, mock)"
    status: completed
  - id: step0-3
    content: "0단계: 타입 정의 (Entry, Mood)"
    status: completed
  - id: step0-4
    content: "0단계: Mock 데이터 준비 (mockData.ts)"
    status: completed
  - id: step1-a
    content: "1단계 섹션A: 공통 레이아웃 + 홈 페이지"
    status: completed
  - id: step1-b
    content: "1단계 섹션B: 인증 UI (로그인/회원가입/로그아웃)"
    status: completed
  - id: step1-c
    content: "1단계 섹션C: 일기 목록 페이지"
    status: completed
  - id: step1-d
    content: "1단계 섹션D: 일기 작성 페이지"
    status: completed
  - id: step1-e
    content: "1단계 섹션E: 일기 상세 조회 페이지"
    status: completed
  - id: step1-f
    content: "1단계 섹션F: 일기 수정 + 삭제 + 전체 플로우 검증"
    status: completed
  - id: step2-a
    content: "2단계 섹션A: Supabase 초기 설정 + DB 테이블 생성 (MCP)"
    status: completed
  - id: step2-b
    content: "2단계 섹션B: 인증 API 구현 + 인증 UI 연결"
    status: completed
  - id: step2-c
    content: "2단계 섹션C: 일기 CRUD API 구현"
    status: completed
  - id: step2-d
    content: "2단계 섹션D: 페이지에서 mock을 실제 API로 교체"
    status: completed
  - id: step2-e
    content: "2단계 섹션E: 마무리 (로딩/에러 처리, 전체 플로우 테스트)"
    status: completed
isProject: true
---

# 나만의 일기장 - 개발 계획 ([plan.md](http://plan.md))

> **핵심 규칙**: 1단계(목업)가 완전히 완료되고 플로우 검증이 끝나기 전에는 절대 2단계(실제 구현)로 넘어가지 않는다.
> 각 섹션이 끝나면 반드시 멈추고 다음 진행 여부를 확인받는다.

---

## 0단계: 프로젝트 초기 셋업

### 0-1. Next.js 프로젝트 생성

- `frontend/` 폴더에 Next.js 프로젝트 생성 (App Router, TypeScript, Tailwind CSS)
- 불필요한 보일러플레이트 파일 정리 (기본 아이콘, 샘플 CSS 등)
- dev 서버 실행하여 초기 화면 확인

### 0-2. 폴더 구조 잡기

- `frontend/src/app/` -- 페이지 및 레이아웃
- `frontend/src/components/` -- 공통 컴포넌트
- `frontend/src/lib/` -- 유틸리티, Supabase 클라이언트 (2단계에서 사용)
- `frontend/src/types/` -- TypeScript 타입 정의
- `frontend/src/mock/` -- 목업 데이터

### 0-3. 타입 정의

- `types/diary.ts` -- `Entry` 타입 정의 (id, user_id, title, content, mood, created_at, updated_at)
- `types/diary.ts` -- `Mood` 타입 정의 ('행복' | '보통' | '슬픔' | '화남' | '피곤')

### 0-4. Mock 데이터 준비

- `mock/mockData.ts` -- 샘플 일기 데이터 3~5개 작성
- `mock/mockData.ts` -- 샘플 사용자 정보 (이메일, 로그인 상태 플래그)
- `mock/mockData.ts` -- 목 데이터 CRUD 헬퍼 함수 (추가, 수정, 삭제, 조회)

---

## 1단계: 목업 (Supabase 연동 없음, mockData.ts만 사용)

> 이 단계에서는 Supabase를 전혀 사용하지 않는다.
> 모든 데이터는 mockData.ts의 하드코딩 데이터와 클라이언트 상태로 처리한다.
> 모든 화면을 클릭하여 전체 플로우를 확인할 수 있는 수준까지 구현한다.

### 섹션 A: 공통 레이아웃 + 홈 페이지

- `app/layout.tsx` -- 루트 레이아웃 (전역 스타일, 폰트 설정)
- `components/Header.tsx` -- 헤더 컴포넌트 (앱 이름 표시)
- `app/page.tsx` -- 홈 페이지 (로그인/회원가입 링크 표시, 로그인 상태면 /diary로 이동 버튼)

> **섹션 A 완료 후 멈추고 진행 여부 확인**

### 섹션 B: 인증 UI (로그인 / 회원가입 / 로그아웃)

- `app/login/page.tsx` -- 로그인 페이지 레이아웃
- `app/login/page.tsx` -- 이메일 입력 필드
- `app/login/page.tsx` -- 비밀번호 입력 필드
- `app/login/page.tsx` -- 로그인 버튼 (클릭 시 mock 로그인 → /diary로 이동)
- `app/login/page.tsx` -- 회원가입 페이지 링크
- `app/signup/page.tsx` -- 회원가입 페이지 레이아웃
- `app/signup/page.tsx` -- 이메일 입력 필드
- `app/signup/page.tsx` -- 비밀번호 입력 필드
- `app/signup/page.tsx` -- 회원가입 버튼 (클릭 시 /login으로 이동)
- `app/signup/page.tsx` -- 로그인 페이지 링크
- `app/diary/layout.tsx` -- 일기 영역 레이아웃 (네비게이션 바)
- `app/diary/layout.tsx` -- 네비게이션 바에 로그아웃 버튼 (클릭 시 mock 로그아웃 → /login으로 이동)
- 인증 상태 관리 -- mock 로그인/로그아웃 상태를 클라이언트에서 관리
- 미로그인 시 /diary 접근하면 /login으로 리다이렉트 처리

> **섹션 B 완료 후 멈추고 진행 여부 확인**

### 섹션 C: 일기 목록 페이지

- `app/diary/page.tsx` -- 페이지 레이아웃
- `app/diary/page.tsx` -- mockData에서 일기 목록 불러오기
- `app/diary/page.tsx` -- 각 항목에 제목 표시
- `app/diary/page.tsx` -- 각 항목에 기분 표시
- `app/diary/page.tsx` -- 각 항목에 작성일 표시
- `app/diary/page.tsx` -- 날짜 내림차순(최신순) 정렬
- `app/diary/page.tsx` -- 항목 클릭 시 /diary/[id] 상세 페이지로 이동
- `app/diary/page.tsx` -- "새 일기 작성" 버튼 → /diary/new로 이동
- `app/diary/page.tsx` -- 일기가 없을 때 빈 상태 메시지 표시

> **섹션 C 완료 후 멈추고 진행 여부 확인**

### 섹션 D: 일기 작성 페이지

- `app/diary/new/page.tsx` -- 페이지 레이아웃
- `app/diary/new/page.tsx` -- 제목 입력 필드
- `app/diary/new/page.tsx` -- 본문 입력 필드 (textarea)
- `app/diary/new/page.tsx` -- 기분 선택 UI (행복, 보통, 슬픔, 화남, 피곤)
- `app/diary/new/page.tsx` -- 빈 필드 유효성 검사 및 에러 메시지
- `app/diary/new/page.tsx` -- 저장 버튼 (클릭 시 mockData에 추가 → /diary로 이동)
- `app/diary/new/page.tsx` -- 취소/뒤로가기 버튼

> **섹션 D 완료 후 멈추고 진행 여부 확인**

### 섹션 E: 일기 상세 조회 페이지

- `app/diary/[id]/page.tsx` -- 페이지 레이아웃
- `app/diary/[id]/page.tsx` -- mockData에서 id로 일기 조회
- `app/diary/[id]/page.tsx` -- 제목 표시
- `app/diary/[id]/page.tsx` -- 본문 표시
- `app/diary/[id]/page.tsx` -- 기분 표시
- `app/diary/[id]/page.tsx` -- 작성일 표시
- `app/diary/[id]/page.tsx` -- 수정 버튼 → /diary/[id]/edit로 이동
- `app/diary/[id]/page.tsx` -- 삭제 버튼 표시
- `app/diary/[id]/page.tsx` -- 목록으로 돌아가기 링크

> **섹션 E 완료 후 멈추고 진행 여부 확인**

### 섹션 F: 일기 수정 + 삭제

- `app/diary/[id]/edit/page.tsx` -- 페이지 레이아웃
- `app/diary/[id]/edit/page.tsx` -- mockData에서 기존 데이터 불러와 폼에 채우기
- `app/diary/[id]/edit/page.tsx` -- 제목 수정 필드
- `app/diary/[id]/edit/page.tsx` -- 본문 수정 필드
- `app/diary/[id]/edit/page.tsx` -- 기분 수정 UI
- `app/diary/[id]/edit/page.tsx` -- 유효성 검사 및 에러 메시지
- `app/diary/[id]/edit/page.tsx` -- 저장 버튼 (클릭 시 mockData 수정 → /diary/[id]로 이동)
- `app/diary/[id]/edit/page.tsx` -- 취소 버튼 → 상세 페이지로 돌아가기
- `app/diary/[id]/page.tsx` -- 삭제 버튼 클릭 시 확인 다이얼로그 표시
- `app/diary/[id]/page.tsx` -- 확인 시 mockData에서 삭제 → /diary로 이동

> **섹션 F 완료 후 1단계 전체 플로우 검증**
> 가입 → 로그인 → 목록 → 작성 → 상세 → 수정 → 삭제 → 로그아웃 흐름을 전부 클릭으로 확인한다.

---

## !! 1단계 완료 확인 !!

> **1단계의 모든 섹션(A~F)이 완료되고 전체 플로우 검증이 끝나야만 2단계를 시작한다.**
> **검증 전에 2단계 작업을 절대 시작하지 않는다.**

---

## 2단계: 실제 구현 (Supabase 연동)

> 1단계 목업 플로우 검증이 완료된 후에만 시작한다.
> mockData.ts를 Supabase API 호출로 교체한다.
> Supabase 작업은 Supabase MCP를 사용한다.
> Supabase 프로젝트 이름: **vibe-tutorial**

### 섹션 A: Supabase 초기 설정 + DB 테이블 생성

- Supabase MCP를 통해 vibe-tutorial 프로젝트 정보 확인
- `.env.local` 파일 생성 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- `@supabase/supabase-js` 패키지 설치
- `lib/supabase.ts` -- 브라우저용 Supabase 클라이언트 생성 함수
- `lib/supabase-server.ts` -- 서버용 Supabase 클라이언트 생성 함수
- Supabase MCP로 `entries` 테이블 생성 (spec.md 스키마 기준)
- Supabase 대시보드에서 테이블 생성 확인

> **섹션 A 완료 후 멈추고 진행 여부 확인**

### 섹션 B: 인증 API 구현 + 인증 UI 연결

- `app/api/auth/signup/route.ts` -- POST 핸들러 작성 (supabase.auth.signUp)
- `app/api/auth/signup/route.ts` -- 입력값 검증 (이메일 형식, 비밀번호 길이)
- `app/api/auth/signup/route.ts` -- 에러 응답 처리 (400, 409)
- `app/api/auth/login/route.ts` -- POST 핸들러 작성 (supabase.auth.signInWithPassword)
- `app/api/auth/login/route.ts` -- 에러 응답 처리 (401)
- `app/api/auth/logout/route.ts` -- POST 핸들러 작성 (supabase.auth.signOut)
- `app/signup/page.tsx` -- mock 로직을 실제 `/api/auth/signup` 호출로 교체
- `app/login/page.tsx` -- mock 로직을 실제 `/api/auth/login` 호출로 교체
- 로그아웃 버튼 -- mock 로직을 실제 `/api/auth/logout` 호출로 교체
- 인증 상태 관리 -- mock 플래그를 Supabase 세션 기반으로 교체
- 인증 가드 -- Supabase 세션으로 리다이렉트 로직 교체

> **섹션 B 완료 후 멈추고 진행 여부 확인**

### 섹션 C: 일기 CRUD API 구현

- `app/api/diary/route.ts` -- GET 핸들러 (목록 조회, created_at DESC)
- `app/api/diary/route.ts` -- GET 응답에 인증 확인 (401 처리)
- `app/api/diary/route.ts` -- POST 핸들러 (일기 작성)
- `app/api/diary/route.ts` -- POST 입력값 검증 (title, content 빈 문자열 불가, mood 유효값)
- `app/api/diary/route.ts` -- POST 에러 응답 처리 (400, 401)
- `app/api/diary/[id]/route.ts` -- GET 핸들러 (상세 조회)
- `app/api/diary/[id]/route.ts` -- GET 에러 처리 (401, 404)
- `app/api/diary/[id]/route.ts` -- PATCH 핸들러 (수정, updated_at 갱신)
- `app/api/diary/[id]/route.ts` -- PATCH 입력값 검증 및 에러 처리 (400, 404)
- `app/api/diary/[id]/route.ts` -- DELETE 핸들러 (삭제)
- `app/api/diary/[id]/route.ts` -- DELETE 에러 처리 (401, 404)

> **섹션 C 완료 후 멈추고 진행 여부 확인**

### 섹션 D: 페이지에서 mock을 실제 API로 교체

- `app/diary/page.tsx` -- mockData 조회를 `GET /api/diary` 호출로 교체
- `app/diary/new/page.tsx` -- mockData 추가를 `POST /api/diary` 호출로 교체
- `app/diary/[id]/page.tsx` -- mockData 조회를 `GET /api/diary/:id` 호출로 교체
- `app/diary/[id]/edit/page.tsx` -- mockData 수정을 `PATCH /api/diary/:id` 호출로 교체
- `app/diary/[id]/page.tsx` -- mockData 삭제를 `DELETE /api/diary/:id` 호출로 교체
- mock 관련 파일 제거 (`mock/mockData.ts`)

> **섹션 D 완료 후 멈추고 진행 여부 확인**

### 섹션 E: 마무리

- 각 페이지에 로딩 상태 표시 추가
- 각 API 호출 실패 시 에러 메시지 표시
- 전체 플로우 테스트 (가입 → 로그인 → 작성 → 목록 → 상세 → 수정 → 삭제 → 로그아웃)
- UI 스타일 최종 정리

> **섹션 E 완료 → Phase 1 개발 완료**

