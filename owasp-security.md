# OWASP 중심 보안 감사 (vibe-project)

검토 범위: Next.js App Router(`frontend`), Supabase(`@supabase/ssr`), API 라우트 및 Supabase 클라이언트 사용처.  
스킬 지침에 따라 **SQL 인젝션·PostgREST 필터 조립**, **세션**, **에러·정보 유출**, **Bcrypt** 네 축을 중심으로 검토했다.

## 요약 (해당 없음·정상)

- **Raw SQL / `.rpc()`**: 앱 코드에서 raw SQL 문자열·`rpc` 호출은 확인되지 않았다. 일기 API는 `from().select/insert/update/delete`와 `.eq()` 등 클라이언트 메서드로 값을 분리 전달하는 패턴이 주를 이룬다.
- **세션**: 인증은 API 라우트에서 `createServerClient` + `cookies()` 어댑터로 처리되며, 로그아웃에서 `signOut()`을 호출한다. 로그인·회원가입 응답 본문에 Supabase 원문 에러를 넣지 않는다. 쿠키의 `HttpOnly`/`Secure`/`SameSite` 구체값은 `@supabase/ssr` 및 배포 환경(HTTPS)에 맡겨져 있으므로, 프로덕션에서 HTTPS·Supabase Auth 설정을 문서 기준으로 재확인하는 것이 좋다.
- **Bcrypt**: 애플리케이션 코드에 bcrypt 사용이 없으며 비밀번호 처리는 Supabase Auth에 위임된 형태다. 프로젝트 대시보드의 비밀번호 정책(최소 길이·해시 알고리즘 등)을 [Supabase Auth 문서](https://supabase.com/docs/guides/auth)에 맞게 점검할 것을 권고한다.

## 발견 사항

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | Medium | frontend/src/app/api/diary/route.ts | `GET`, `sanitizeSearchTerm` 이후 `.or(\`title.ilike.${pattern},...\`)` | 검색어를 PostgREST 필터 문자열에 직접 끼워 넣는다. 쉼표·괄호·`\`·`%`·`_` 등은 제거하지만 **점(`.`)·따옴표 등 PostgREST 구문에 영향을 줄 수 있는 문자**는 그대로 남을 수 있어, 필터 파싱 오류·의도와 다른 조건 해석(필터 조립 취약점) 가능성이 있다. 전통적 DB SQLi와는 메커니즘이 다르지만, 스킬이 지정한 “필터 문자열 조립” 검토 항목에 해당한다. | `.or()` 문자열 대신 **컬럼별 `.or()` 분리**, **RPC + 서버측 파라미터**, 또는 PostgREST가 요구하는 방식으로 **값 이스케이프/따옴표 규칙**을 문서에 맞게 적용한다. 가능하면 **화이트리스트(길이·허용 문자)** 로 검색어를 더 제한한다. |
| 2 | Medium | frontend/src/app/api/auth/signup/route.ts | `if (process.env.NODE_ENV === "development")` 블록 내 `console.error(..., error)` | 개발 모드에서 Supabase `error` 객체 전체를 서버 로그에 남긴다. 운영에서는 꺼지지만, **개발·스테이징 로그에 공급자 메시지·내부 힌트가 누적**될 수 있어 정보 유출·디버그 정보 관리 측면에서 리스크가 있다. | 개발 로그도 **민감도가 낮은 코드/상태만** 남기거나, 구조화 로깅 시 필드 마스킹·로그 보존 정책을 둔다. |

---

*본 문서는 코드 수정 없이 감사 전용으로 작성되었다.*
