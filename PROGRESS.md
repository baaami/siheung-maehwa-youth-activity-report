# PROGRESS.md

## 현재 상태

- 파일 저장 기반 MVP가 실제 동작 가능한 형태로 연결되었다.
- 학생 활동일지 작성/수정/제출 API와 관리자 수정 API가 구현되었다.
- 관리자 동아리 생성/수정/삭제와 연도 필터, 개별 사진 다운로드, PDF 다운로드가 구현되었다.
- Playwright 기반 단일 PDF 생성과 pdf-lib 기반 다중 PDF 병합이 연결되었다.

## 완료된 작업

- `docs/requirement.md` 기준으로 파일 기반 영속성 방향 확정
- `data/app-data.json` 초기 데이터 파일 추가
- `public/uploads/` 업로드 저장 디렉터리 준비
- `src/lib/repository.ts`를 파일 저장 repository로 교체
- 학생 활동일지 작성/수정/제출 Route Handler 구현
- 관리자 동아리 CRUD Route Handler 구현
- 관리자 활동일지 수정 Route Handler 구현
- 관리자 개별 사진 다운로드 Route Handler 구현
- 관리자 단일/다중 PDF 다운로드 Route Handler 구현
- 학생/관리자 공용 활동일지 편집 폼 구현
- report `updatedAt` 기반 동시 수정 충돌 감지 구현
- 요구사항에 맞는 13개 동아리 초기 데이터 반영
- `npm run lint` 통과
- `npm run build` 통과
- 로컬 `next start` 후 HTTP 경로 확인
- 학생 multipart 업로드 API 실호출 검증
- 관리자 단일/묶음 PDF 다운로드 HTTP 응답 검증
- `pdf-lib` 런타임 의존성 누락 수정과 `package-lock.json` 정합성 복구

## 최근 변경 사항

- Prisma/PostgreSQL 우선 계획을 파일 기반 MVP 우선 계획으로 재정렬했다.
- 활동일지 데이터 구조에 시간, 장소, 작성자, 평점, 다음 활동, 건의사항 필드를 추가했다.
- PDF 출력 레이아웃을 `public/activity-report-pdf-format.png` 기준으로 재구성했다.
- 사진은 `public/uploads/<reportId>/` 아래에 저장하도록 설계했다.
- 로컬 서버에서 `/`, `/student`, `/admin`, `/reports/report-focus-001/print`, 학생 생성 API, 사진 다운로드 API, PDF 다운로드 API를 직접 호출해 응답을 확인했다.
- Vercel 빌드 실패 원인이던 `pdf-lib` 미선언 상태를 수정했고, lockfile 루트 패키지명도 실제 프로젝트명으로 정리했다.

## 진행 중인 작업

- 실제 브라우저 환경에서 PDF 템플릿 배치와 업로드 UX를 다듬는 후속 보완

## 다음 에이전트가 바로 할 일

- 브라우저에서 학생 작성/제출과 관리자 PDF 다운로드를 실제 클릭 플로우로 점검
- PDF 잘림 감지 기준과 출력 스타일을 실데이터 기준으로 미세 조정
- 검색/정렬 같은 관리자 목록 UX를 확장
- 추후 Prisma 저장소로 치환할 수 있도록 저장소 인터페이스 정리

## 참고 문서

- `AGENTS.md`
- `PLAN.md`
- `PROGRESS.md`
- `docs/requirement.md`
- `public/activity-report-pdf-format.png`
