# Next.js + Supabase 성능 감사 (vibe-project / frontend)

감사 기준: `.cursor/skills/nextjs-supabase-performance-audit/SKILL.md`  
범위: `frontend/src/app`, API 라우트, Supabase 호출, 레이아웃·폰트·의존성.

**정상·해당 없음 (한 줄)**  
이미지: `<img>` / `next/image` 사용처 없음. 번들: 차트·리치 에디터·맵 등 대형 클라이언트 라이브러리 없음. 루트 `layout.tsx`는 `next/font`(Geist) 사용. N+1 형태의 루프 내 Supabase 호출 없음.

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | High | frontend/src/app/api/diary/route.ts | `GET`, `query.order(...)` 직전 | 사용자 전체 `entries`를 한 번에 조회·JSON으로 반환하며 `limit`/`range`·커서 페이지네이션 없음 | 데이터가 늘수록 응답 크기·TTFB·클라이언트 리스트 렌더 비용이 함께 증가. `limit`+`offset` 또는 커서 기반 페이지네이션과 필요 시 총건수 쿼리 분리 |
| 2 | Medium | frontend/src/app/api/diary/[id]/route.ts | `GET` / `PATCH`의 `.select("*")` | 단일 행이라도 `*`는 스키마에 컬럼이 추가될 때마다 불필요 필드가 응답에 포함됨 | `id,title,content,mood,created_at,updated_at` 등 클라이언트 계약에 맞는 컬럼만 명시 |
| 3 | Medium | frontend/src/app/api/diary/route.ts | `POST`의 `.select("*").single()` | `diary/new`는 성공 시 본문을 읽지 않고 `/diary`로 이동해 불필요한 전체 행 직렬화 가능 | 응답에 `id`만 반환하거나 본문 없는 최소 페이로드로 축소 |
| 4 | Medium | frontend/src/app/diary/[id]/edit/page.tsx 및 `[id]/page.tsx` | 편집 저장 후 `router.push(\`/diary/${id}\`)` | 동일 `id`에 대해 편집 화면에서 이미 로드한 데이터 직후 상세에서 `GET /api/diary/:id` 재호출 | SWR/React Query 등으로 키 단위 캐시·무효화, 또는 서버 컴포넌트/`fetch` 캐시로 중복 네트워크 완화 검토 |
| 5 | Medium | frontend/src/app/page.tsx, frontend/src/app/diary/layout.tsx | 각 `useEffect` 내 `fetch("/api/auth/session", { cache: "no-store" })` | 홈에서 세션 확인 후 `/diary` 진입 시 레이아웃에서 동일 세션 API가 다시 호출됨 | 상위 레이아웃·미들웨어·한 번의 검증으로 흐름 통합, 또는 클라이언트 캐시로 짧은 TTL 공유 |
| 6 | Medium | frontend/src/app (다수 `page.tsx`, `diary/layout.tsx`) | `"use client"`가 페이지·레이아웃 전체를 감쌈 | RSC 기본 `fetch` 캐시·중복 제거·스트리밍을 활용하기 어려운 구조 | 로딩 UI·정적 뼈대·권한과 무관한 영역은 서버 컴포넌트로 옮기고 데이터만 서버에서 가져오는 패턴 검토 |
| 7 | Medium | frontend/src/app/layout.tsx | `Geist` / `Geist_Mono`의 `subsets: ["latin"]` | UI 카피가 한글 중심인데 라틴 서브셋만 로드 시 시스템 폰트 폴백으로 미세한 FOUT·글꼴 톤 불일치 가능 | 한글에 맞는 `subset`/`preload` 전략 또는 의도한 폴백 스택을 `globals.css`/폰트 설정에 명시 |
| 8 | Medium | frontend/src/app/diary/page.tsx | `useEffect` 의존성 `[debouncedSearch, router]` + React Strict Mode(개발) | 개발 빌드에서 마운트 시 이펙트가 두 번 실행되면 `AbortController`로 첫 요청은 취소되지만 네트워크 상 이중 시도가 발생할 수 있음 | 프로덕션 영향은 제한적; 반복이 부담되면 데이터 레이어 dedup 또는 서버 측 캐시 태그 활용 등 추가 확인(런타임 네트워크 탭 권장) |
