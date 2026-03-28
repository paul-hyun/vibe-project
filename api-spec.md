# 나만의 일기장 - API 명세서 (api-spec.md)

## 1. 개요

- 모든 API는 Next.js App Router의 Route Handler(`app/api/...`)로 구현한다.
- 요청/응답 형식은 JSON을 사용한다.
- 인증이 필요한 API는 Supabase 세션 쿠키로 사용자를 확인한다.
- 인증 실패 시 `401 Unauthorized`를 반환한다.

## 2. 인증 API

### POST `/api/auth/signup`

회원가입

| 구분 | 내용 |
|------|------|
| 인증 | 불필요 |

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "비밀번호"
}
```

**Response**

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 가입 성공 |
| 400 | 입력값 오류 (이메일 형식, 비밀번호 길이 등) |
| 409 | 이미 존재하는 이메일 |

---

### POST `/api/auth/login`

로그인

| 구분 | 내용 |
|------|------|
| 인증 | 불필요 |

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "비밀번호"
}
```

**Response**

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 로그인 성공 (세션 쿠키 설정) |
| 401 | 이메일 또는 비밀번호 불일치 |

---

### POST `/api/auth/logout`

로그아웃

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |

**Request Body**: 없음

**Response**

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 로그아웃 성공 (세션 쿠키 제거) |

---

## 3. 일기 API

### GET `/api/diary`

일기 목록 조회 (최신순)

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |

**Response (200)**

```json
{
  "entries": [
    {
      "id": "uuid",
      "title": "제목",
      "mood": "행복",
      "created_at": "2026-03-27T09:00:00Z"
    }
  ]
}
```

---

### GET `/api/diary/:id`

일기 상세 조회

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |

**Response**

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 조회 성공 |
| 404 | 해당 일기 없음 또는 권한 없음 |

**Response (200)**

```json
{
  "id": "uuid",
  "title": "제목",
  "content": "본문 내용",
  "mood": "행복",
  "created_at": "2026-03-27T09:00:00Z",
  "updated_at": "2026-03-27T09:00:00Z"
}
```

---

### POST `/api/diary`

일기 작성

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |

**Request Body**

```json
{
  "title": "제목",
  "content": "본문 내용",
  "mood": "행복"
}
```

**유효성 검사**

| 필드 | 조건 |
|------|------|
| `title` | 빈 문자열 불가 |
| `content` | 빈 문자열 불가 |
| `mood` | '행복', '보통', '슬픔', '화남', '피곤' 중 하나 |

**Response**

| 상태 코드 | 설명 |
|-----------|------|
| 201 | 작성 성공 (생성된 일기 반환) |
| 400 | 입력값 오류 |

---

### PATCH `/api/diary/:id`

일기 수정

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |

**Request Body**

```json
{
  "title": "수정된 제목",
  "content": "수정된 본문",
  "mood": "보통"
}
```

**Response**

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 수정 성공 (수정된 일기 반환, `updated_at` 갱신) |
| 400 | 입력값 오류 |
| 404 | 해당 일기 없음 또는 권한 없음 |

---

### DELETE `/api/diary/:id`

일기 삭제

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |

**Request Body**: 없음

**Response**

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 삭제 성공 |
| 404 | 해당 일기 없음 또는 권한 없음 |

## 4. 공통 에러 응답 형식

모든 에러 응답은 아래 형식을 따른다.

```json
{
  "error": "에러 메시지"
}
```

## 5. API 라우트 파일 구조

```
app/
  api/
    auth/
      signup/route.ts    → POST
      login/route.ts     → POST
      logout/route.ts    → POST
    diary/
      route.ts           → GET (목록), POST (작성)
      [id]/
        route.ts         → GET (상세), PATCH (수정), DELETE (삭제)
```
