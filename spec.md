# 나만의 일기장 - 기능 명세서 (spec.md)

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 앱 이름 | 나만의 일기장 |
| 목적 | 개인용 일기 작성 및 관리 웹 애플리케이션 |
| 현재 범위 | Phase 1 -- 인증 + 일기 CRUD |

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 백엔드/DB | Supabase (Auth, PostgreSQL) |

## 3. 기능별 상세 설명

### 3.1 회원가입

- **동작**: 이메일과 비밀번호를 입력하여 계정을 생성한다. 가입 완료 후 로그인 페이지로 이동한다.
- **페이지 경로**: `/signup`
- **Supabase 기능**: `supabase.auth.signUp()`

### 3.2 로그인

- **동작**: 이메일과 비밀번호로 로그인한다. 로그인 성공 시 일기 목록 페이지(`/diary`)로 이동한다.
- **페이지 경로**: `/login`
- **Supabase 기능**: `supabase.auth.signInWithPassword()`

### 3.3 로그아웃

- **동작**: 현재 세션을 종료하고 로그인 페이지로 이동한다. 헤더/네비게이션 영역의 로그아웃 버튼으로 실행한다.
- **페이지 경로**: 별도 페이지 없음 (네비게이션 내 버튼)
- **Supabase 기능**: `supabase.auth.signOut()`

### 3.4 일기 작성

- **동작**: 제목, 본문, 기분을 입력하여 새 일기를 저장한다. 저장 완료 후 일기 목록 페이지로 이동한다.
- **기분 선택지**: 행복, 보통, 슬픔, 화남, 피곤
- **페이지 경로**: `/diary/new`
- **Supabase 기능**: `entries` 테이블 INSERT

### 3.5 일기 목록 조회

- **동작**: 로그인한 사용자의 일기를 날짜 내림차순(최신순)으로 보여준다. 각 항목에 제목, 기분, 작성일을 표시하며, 클릭하면 상세 페이지로 이동한다.
- **페이지 경로**: `/diary`
- **Supabase 기능**: `entries` 테이블 SELECT (조건: `user_id` = 현재 사용자, 정렬: `created_at` DESC)

### 3.6 일기 상세 조회

- **동작**: 선택한 일기의 제목, 본문, 기분, 작성일을 보여준다. 수정/삭제 버튼을 제공한다.
- **페이지 경로**: `/diary/[id]`
- **Supabase 기능**: `entries` 테이블 SELECT (조건: `id` = 파라미터, `user_id` = 현재 사용자)

### 3.7 일기 수정

- **동작**: 기존 일기의 제목, 본문, 기분을 수정한다. 저장 완료 후 상세 페이지로 이동한다. 본인의 일기만 수정 가능하다.
- **페이지 경로**: `/diary/[id]/edit`
- **Supabase 기능**: `entries` 테이블 UPDATE (조건: `id` = 파라미터, `user_id` = 현재 사용자)

### 3.8 일기 삭제

- **동작**: 확인 다이얼로그 후 일기를 삭제한다. 삭제 완료 후 목록 페이지로 이동한다. 본인의 일기만 삭제 가능하다.
- **페이지 경로**: 별도 페이지 없음 (상세 페이지 내 삭제 버튼)
- **Supabase 기능**: `entries` 테이블 DELETE (조건: `id` = 파라미터, `user_id` = 현재 사용자)

## 4. DB 테이블 스키마

### `entries` 테이블

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | 일기 고유 ID |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | 작성자 ID |
| `title` | `text` | NOT NULL | 제목 |
| `content` | `text` | NOT NULL | 본문 |
| `mood` | `text` | NOT NULL, CHECK (`mood` IN ('행복', '보통', '슬픔', '화남', '피곤')) | 기분 |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | 작성일시 |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | 수정일시 |

## 5. 페이지 구조

### 라우트 목록

| 경로 | 파일 | 설명 | 인증 필요 |
|------|------|------|-----------|
| `/` | `app/page.tsx` | 홈 (로그인 시 `/diary`로 리다이렉트) | 아니오 |
| `/login` | `app/login/page.tsx` | 로그인 | 아니오 |
| `/signup` | `app/signup/page.tsx` | 회원가입 | 아니오 |
| `/diary` | `app/diary/page.tsx` | 일기 목록 | 예 |
| `/diary/new` | `app/diary/new/page.tsx` | 일기 작성 | 예 |
| `/diary/[id]` | `app/diary/[id]/page.tsx` | 일기 상세 | 예 |
| `/diary/[id]/edit` | `app/diary/[id]/edit/page.tsx` | 일기 수정 | 예 |

### 레이아웃 구성

| 파일 | 역할 |
|------|------|
| `app/layout.tsx` | 루트 레이아웃 (전역 스타일, 폰트, Supabase Provider) |
| `app/diary/layout.tsx` | 일기 영역 레이아웃 (네비게이션 바, 인증 가드) |
