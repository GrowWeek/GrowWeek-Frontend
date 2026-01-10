# GrowWeek Frontend

## Project Overview
GrowWeek는 주간 회고와 할일 관리를 위한 웹 애플리케이션입니다.

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Design System

### Color Palette
메인 컬러는 **lime (연두색)** 으로, "Grow"의 성장 이미지를 반영합니다.
중립 색상은 **stone** 계열을 사용합니다.

#### Primary Colors (Lime)
| 용도 | Light Mode | Dark Mode |
|------|------------|-----------|
| 큰 배경 영역 (카드 등) | `bg-lime-100` | `dark:bg-lime-900/20` |
| 큰 영역 테두리 | `border-lime-200` | `dark:border-lime-800` |
| 아이콘 배경 | `bg-lime-200` | `dark:bg-lime-800/50` |
| 버튼, 배지, 진행률 바 | `bg-lime-400` | `dark:bg-lime-400` |
| 버튼 호버 | `hover:bg-lime-300` | `dark:hover:bg-lime-300` |
| 아이콘 색상 | `text-lime-600` | `dark:text-lime-400` |

#### Neutral Colors (Stone)
| 용도 | Light Mode | Dark Mode |
|------|------------|-----------|
| 페이지 배경 | `bg-stone-50` | `dark:bg-stone-950` |
| 카드 배경 | `bg-white` | `dark:bg-stone-900` |
| 카드 테두리 | `border-stone-200` | `dark:border-stone-800` |
| 주요 텍스트 | `text-stone-900` | `dark:text-stone-100` |
| 보조 텍스트 | `text-stone-500` | `dark:text-stone-400` |
| 비활성 텍스트 | `text-stone-400` | `dark:text-stone-500` |

#### Semantic Colors
| 용도 | 색상 |
|------|------|
| 우선순위 높음 | `rose-400` / `rose-600` |
| 우선순위 중간 | `amber-400` / `amber-600` |
| 우선순위 낮음 | `lime-400` / `lime-600` |
| 경고 | `amber-50`, `amber-200`, `amber-600` |
| 에러 | `rose-100`, `rose-600` |

### Design Tokens

#### Border Radius
- 카드, 모달: `rounded-xl` (12px)
- 버튼, 배지: `rounded-lg` (8px)
- 작은 요소: `rounded` (4px)
- 원형: `rounded-full`

#### Icon Stroke Width
- 일반 아이콘: `strokeWidth={1.5}`
- 강조 아이콘: `strokeWidth={2}`

#### Spacing
- 카드 패딩: `p-5` 또는 `p-6`
- 섹션 간격: `space-y-6`
- 요소 간격: `gap-3` 또는 `gap-4`

### Component Guidelines

#### Button Variants
- `primary`: lime-400 배경, 주요 액션에 사용
- `secondary`: stone 배경에 테두리, 보조 액션
- `ghost`: 투명 배경, 텍스트만 표시
- `danger`: rose 계열, 삭제 등 위험한 액션

#### Cards
- 기본: 흰색 배경 + stone 테두리
- 강조: lime-100 배경 + lime-200 테두리 (큰 영역에만 사용)

#### Progress Bars
- 배경: `bg-stone-100` / `dark:bg-stone-800`
- 진행: `bg-lime-400`
- 높이: `h-1.5` 또는 `h-2`

### Do's and Don'ts

#### Do's
- 큰 배경 영역에는 `lime-100` 사용 (부드러운 느낌)
- 버튼, 배지 등 작은 강조 요소에는 `lime-400` 사용
- 다크모드에서 lime 배경은 `lime-900/20` 처럼 투명도 적용
- stone 계열로 중립적인 UI 요소 구성

#### Don'ts
- `lime-500` 이상의 진한 색을 큰 영역 배경에 사용하지 않기
- 여러 강조 색상을 한 화면에 섞어 사용하지 않기
- 기본 폰트 외 다른 폰트 사용하지 않기
