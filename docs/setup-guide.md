# 개발 셋업 가이드

## 1. 권장 기술 스택

MVP 기준으로는 복잡도를 낮추는 구성이 적합하다.

- 프론트엔드: Next.js
- 백엔드: Next.js Route Handlers 또는 Server Actions
- 데이터베이스: PostgreSQL
- ORM: Prisma
- 파일 저장: 로컬 개발은 `uploads/`, 운영은 객체 스토리지로 확장
- PDF 생성: Playwright 또는 Puppeteer 기반 HTML to PDF
- 스타일링: Tailwind CSS

이 구성이 적합한 이유는 다음과 같다.

- 화면과 서버를 하나의 프로젝트에서 관리할 수 있다.
- HTML/CSS 기반 PDF 렌더링과 궁합이 좋다.
- 관리자/학생 화면을 빠르게 만들 수 있다.
- Prisma로 스키마 변경과 초기 개발 속도를 확보할 수 있다.

## 2. 초기 폴더 구조 제안

```text
activity_report/
  docs/
    mvp-spec.md
    setup-guide.md
  prisma/
    schema.prisma
  public/
  uploads/
  src/
    app/
      page.tsx
      student/
      admin/
      clubs/
      reports/
      api/
    components/
    lib/
      db.ts
      pdf.ts
      validators.ts
      report-formatters.ts
    server/
      report-service.ts
      club-service.ts
      pdf-service.ts
    types/
  .env
  package.json
```

## 3. 먼저 해야 할 셋업 순서

### 1단계. 프로젝트 생성

```bash
npx create-next-app@latest activity_report --typescript --eslint --app --src-dir --tailwind
cd activity_report
```

### 2단계. 필수 패키지 설치

```bash
npm install prisma @prisma/client zod dayjs
npm install playwright
```

선택 패키지:

```bash
npm install react-hook-form
```

## 4. 개발 환경 변수

`.env` 예시:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/activity_report"
UPLOAD_DIR="./uploads"
PDF_OUTPUT_DIR="./tmp/pdf"
```

## 5. 데이터 모델 초안

최소 테이블은 아래 정도로 시작하는 것이 적절하다.

### `students`

- id
- name
- created_at

### `admins`

- id
- name
- created_at

### `clubs`

- id
- name
- description
- created_at
- updated_at

### `student_clubs`

- id
- student_id
- club_id

학생과 동아리의 다대다 관계를 표현한다.

### `activity_reports`

- id
- club_id
- student_id
- report_date
- title
- content
- reflection
- status (`draft`, `submitted`)
- pdf_truncated (`true/false`)
- created_at
- updated_at

학생 화면에서는 `draft = 미제출`, `submitted = 제출`로 보여주면 된다.

### `report_participants`

- id
- activity_report_id
- name
- gender
- age_group

### `report_photos`

- id
- activity_report_id
- file_name
- file_path
- file_size
- created_at

정확히 2장만 허용하도록 애플리케이션 레벨에서 검증한다.

## 6. 핵심 구현 포인트

### 학생 작성 흐름

- 동아리 선택
- 활동일지 작성
- 참가자 여러 명 입력
- 사진 2장 업로드
- 저장
- 제출

제출 시 아래 검증을 수행한다.

- 활동내용 200~300자
- 소감 200~300자
- 참가자 1명 이상
- 사진 정확히 2장

### 관리자 운영 흐름

- 동아리 목록 진입
- 동아리 선택
- 제출된 활동일지 목록 조회
- 검색/필터
- 여러 건 선택
- PDF 다운로드

## 7. HTML to PDF 구현 방식

권장 방식은 다음과 같다.

1. 활동일지 1건을 화면용과 분리된 전용 HTML 템플릿으로 렌더링한다.
2. Playwright로 해당 HTML을 열어 A4 1페이지 PDF로 생성한다.
3. 여러 활동일지를 순차 생성해 하나의 PDF로 합친다.
4. 내용 overflow 여부를 사전에 계산하거나 렌더 후 검출해 `pdf_truncated` 값을 저장한다.

구현 팁:

- PDF 전용 라우트를 만든다.
  - 예: `/reports/{id}/print`
- 화면용 CSS와 PDF용 CSS를 분리한다.
- `@media print`와 고정 높이 레이아웃을 사용한다.
- 사진 영역 높이를 고정해 1페이지가 무너지지 않도록 한다.

## 8. 유효성 검사 기준

서버와 클라이언트에서 동일하게 검사해야 한다.

- 역할별 접근 가능 화면
- 사진 2장 여부
- 이미지당 15MB 이하
- 내용/소감 200~300자
- 제출 후 학생 수정 불가
- 제출된 활동일지만 PDF 생성 가능

검증 정의는 `zod` 같은 스키마 라이브러리로 한 곳에 모으는 편이 좋다.

## 9. UI 우선순위

처음부터 모든 화면을 완성하려고 하지 말고 아래 순서로 가는 것이 좋다.

1. 초기 역할 선택 화면
2. 학생 동아리 목록
3. 학생 활동일지 작성/제출
4. 관리자 동아리 목록
5. 관리자 활동일지 목록/검색/수정
6. PDF 다운로드
7. PDF 잘림 경고 표시

## 10. 로컬 개발 시 바로 해볼 일

1. Next.js 앱 생성
2. Prisma 연결
3. 기본 테이블 생성
4. 더미 데이터 시드 작성
5. 학생 작성 폼 구현
6. 관리자 목록 화면 구현
7. 단일 활동일지 PDF 출력 구현
8. 다중 선택 PDF 병합 구현

## 11. 추천 개발 방식

처음부터 전체를 만들지 말고 아래처럼 나누는 것이 안전하다.

### 1주차

- 화면 흐름 확정
- DB 스키마 작성
- 학생 작성/제출 기능 구현

### 2주차

- 관리자 목록/검색/수정 구현
- 사진 업로드 처리

### 3주차

- PDF 템플릿 구현
- 단일/다중 PDF 다운로드 구현
- 잘림 표시 처리

## 12. 바로 다음 단계 제안

셋업 다음에는 아래 순서가 적절하다.

1. Prisma 스키마 작성
2. 화면 라우트 구조 생성
3. 활동일지 작성 폼 스키마 작성
4. PDF 템플릿 시안 HTML 작성

이 네 가지를 먼저 고정하면 이후 구현이 크게 흔들리지 않는다.
