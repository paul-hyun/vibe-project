---
name: nextjs-supabase-performance-audit
description: >-
  Performs senior-level performance audits on Next.js App Router and Supabase
  codebases: rerenders, data fetching, bundle size, image/font optimization, and
  API payload shape. Outputs a severity table only; does not modify code unless
  the user requests fixes. Use when the user asks for a performance audit,
  performance review, Core Web Vitals-related code review, or optimization pass
  on Next.js + Supabase apps.
---

# Next.js + Supabase 성능 감사

## 역할

시니어 성능 엔지니어 관점에서 아래 항목을 중심으로 코드·설정을 검토한다. 사용자가 명시하지 않으면 **코드를 수정하지 않고 리포트만** 작성한다.

## 감사 항목 (필수)

1. **불필요한 리렌더링**
   - `useEffect` 의존성 배열 누락·과다·불안정 참조로 인한 루프·stale closure 가능성
   - 컨텍스트·콜백·객체/배열 리터럴로 하위 트리 전체 갱신
   - `useMemo` / `useCallback` / `React.memo`가 필요한 핫 경로 미적용(과도한 남용 지적은 Medium 이하로)

2. **데이터 페칭 최적화**
   - N+1 패턴(루프·맵 안에서 개별 fetch, RLS/클라이언트 반복 호출)
   - 동일 데이터의 중복 요청(마운트·탭·라우트 전환 시 이중 호출)
   - Next.js 캐시·`revalidate`·태그 무효화, React `cache`, SWR/React Query 등 **프로젝트에서 쓰는 패턴** 대비 캐싱·중복 제거 여부
   - Supabase: 한 번에 가져올 수 있는 관계/조인·단일 쿼리로 대체 가능한 연쇄 호출

3. **번들 사이즈**
   - 클라이언트 번들로 끌려가는 무거운 라이브러리(차트, 날짜, 에디터 등) 전역 import
   - `"use client"` 경계 위에서 불필요하게 큰 모듈 로드
   - `next/dynamic`으로 분리 가능한 UI·에디터·맵 등 미적용 여부

4. **이미지·폰트 최적화**
   - `<img>` 대신 `next/image` 미사용, `sizes`/`priority` 부적절로 LCP 악화 가능성
   - 폰트: `next/font` 또는 최적 로딩 전략 부재, FOIT/FOUT·layout shift 유발 패턴
   - 명시적 width/height·aspect ratio 부재로 CLS 위험

5. **API 응답 최적화**
   - `select('*')` 또는 동등하게 전체 행·전체 컬럼 반환
   - Route Handler / Server Actions에서 클라이언트에 불필요한 필드·대용량 JSON 전달
   - Supabase 쿼리에 필요한 컬럼만 나열했는지, 페이지네이션·limit 누락 여부

## 출력 형식 (필수)

마크다운 표로만 정리한다. 심각도는 **Critical / High / Medium** 만 사용한다. 해당 없음·정상은 본문에 한 줄 요약하거나 표에 포함하지 않는다.

```markdown
| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | Medium | path/to/file.tsx | 줄 또는 심볼 | … | … |
```

- **파일**: 저장소 기준 상대 경로 권장.
- **위치**: 대략적 줄 번호, 훅/함수/라우트 이름, 또는 개념적 위치.
- 문제·권고는 짧고 실행 가능하게 작성한다.

## 심각도 기준 (가이드)

| 수준 | 적용 예 |
|------|---------|
| **Critical** | 확정적 무한 루프·과도한 클라이언트 페칭으로 서비스/탭 마비, 민감 대용량 전송, LCP/CLS가 구조적으로 심각하게 깨지는 패턴 등 |
| **High** | N+1, 명백한 전역 대형 번들, `select *` + 대용량 테이블, 누락된 의존성으로 잘못된 동작·과도한 재실행 등 사용자 체감 큼 |
| **Medium** | 개선 여지·미세 최적화, 추정이 일부 필요한 항목, 일관된 패턴 위반 |

추정만으로 Critical/High를 주지 않는다. 근거가 약하면 Medium 이하로 낮추거나 본문에 “추가 확인 필요(런타임 프로파일)”로 적는다.

## 절차

1. `app/` 라우트, `"use client"` 컴포넌트, Supabase 클라이언트 호출부, `route.ts`/Server Actions, `next.config`·폰트·이미지 사용처를 우선 검색한다.
2. 위 다섯 항목 각각에 대해 증거(코드 인용 또는 파일·심볼)를 확보한 뒤 표에만 반영한다.
3. 사용자가 “수정까지” 요청하기 전에는 패치를 적용하지 않는다. 리포트 전용이면 **코드 변경 없음**.

## 프로젝트 맥락 (vibe-project)

- 스택: Next.js App Router, TypeScript, Tailwind, Supabase(`@supabase/ssr` 등).
- 서버/클라이언트 Supabase 사용처를 구분해, 비밀·서버 전용 로직이 클라이언트 번들/노출로 이어지지 않는지 성능·아키텍처 관점에서만 짚는다(보안 전용 감사는 별도 스킬).

## 범위 한정

이 스킬은 **성능**에 초점을 맞춘다. 접근성·보안·일반 코드 스타일은 사용자가 요청하거나 문제가 성능에 직결될 때만 언급한다.
