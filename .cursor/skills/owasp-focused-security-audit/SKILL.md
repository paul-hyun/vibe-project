---
name: owasp-focused-security-audit
description: >-
  Performs OWASP-aligned security audits on application code with emphasis on SQL
  injection (parameterized queries), session safety (expiry, replay), error
  message leakage, and bcrypt rules. Produces a severity table report without
  modifying code unless the user requests fixes. Use when the user asks for a
  security audit, OWASP review, penetration-style code review, or compliance
  checks for SQLi, sessions, errors, or password hashing.
---

# OWASP 중심 보안 감사 (SQLi · 세션 · 에러 유출 · Bcrypt)

## 역할

시니어 보안 아키텍트 관점에서 OWASP Top 10과 연관된 위 항목을 중심으로 코드·설정을 검토한다. 사용자가 명시하지 않으면 **코드를 수정하지 않고 리포트만** 작성한다.

## 감사 항목 (필수)

1. **SQL 인젝션**: 문자열 연결·템플릿 리터럴로 만든 raw SQL, ORM/클라이언트에서 필터 문자열을 사용자 입력으로 조립하는 패턴, `rpc` 인자 검증 누락 여부. **권장**: 파라미터 바인딩·클라이언트 제공 메서드(값이 별도 인자로 전달되는지) 확인.
2. **세션 관리**: 토큰/쿠키 만료·갱신, 로그아웃 시 무효화, 고정·재사용(replay) 완화, `HttpOnly`/`Secure`/`SameSite`, 클라이언트에 장기 refresh 노출 여부.
3. **에러·정보 유출**: API·페이지 응답에 스택 트레이스, DB/스키마/내부 경로, 공급자 원문 에러 노출 여부. 서버 로그(개발 전용 포함)의 민감 정보 기록.
4. **Bcrypt 규칙**: 앱에서 직접 해시할 때 `saltRounds`(또는 cost) **최소 12 이상**, 평문 비밀번호와의 직접 비교 금지, `bcrypt.compare` 사용 여부. **위임형 인증**(Supabase Auth, Auth0 등)인 경우 앱 코드에 bcrypt가 없을 수 있음 → 플랫폼 문서·대시보드 설정으로 정책 확인하라고 권고.

## 출력 형식 (필수)

마크다운 표로만 정리한다. 심각도는 **Critical / High / Medium** 만 사용한다. 해당 없음·정상은 본문에 한 줄 요약하거나 표에 포함하지 않는다.

```markdown
| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | Medium | path/to/file.ts | 줄 또는 심볼 | … | … |
```

- **파일**: 저장소 기준 상대 경로 권장.
- **위치**: 대략적 줄 번호, 함수/핸들러 이름, 또는 개념적 위치.
- 문제·권고는 짧고 실행 가능하게 작성한다.

## 절차

1. 백엔드·API 라우트, DB 접근 계층, 인증/세션 설정 파일을 우선 검색한다.
2. 위 네 항목 각각에 대해 증거(코드 인용)를 확보한 뒤 표에만 반영한다.
3. 추정으로 Critical/High를 주지 않는다. 근거가 약하면 Medium 이하로 낮추거나 본문에 “추가 확인 필요”로 적는다.
4. 사용자가 “수정까지” 요청하기 전에는 패치를 제안하지 않아도 되며, **리포트 전용** 요청이면 코드 변경을 하지 않는다.

## 프로젝트 맥락 (vibe-project)

- 스택: Next.js App Router, Supabase(`@supabase/ssr`). Raw SQL 문자열이 없으면 Supabase/PostgREST 필터 문자열 조립(`.or()` 등)을 SQLi 관련으로 별도 검토한다.
- 비밀번호: 앱에서 bcrypt를 쓰지 않고 Supabase Auth에 위임하는 경우가 많다 → bcrypt 항목은 “코드 미사용 + 플랫폼 정책 확인” 권고로 처리한다.

## 추가 참고 (선택)

OWASP Top 10 전 범위가 아니라 위 네 축에 집중한다. 범위를 넓히라는 요청이 있을 때만 XSS, CSRF, 접근제어(IDOR) 등을 확장한다.
