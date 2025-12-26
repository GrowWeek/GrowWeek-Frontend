/**
 * 현재 주의 시작일 (월요일) 계산
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 현재 주의 종료일 (일요일) 계산
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * 날짜를 yyyy-MM-dd 형식으로 포맷
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 날짜를 한국어 형식으로 포맷 (M월 D일)
 */
export function formatDateKorean(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 날짜 범위를 한국어로 표시
 */
export function formatDateRangeKorean(start: string, end: string): string {
  return `${formatDateKorean(start)} ~ ${formatDateKorean(end)}`;
}

/**
 * 요일 이름 반환
 */
export function getDayName(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}

/**
 * 오늘이 금요일인지 확인
 */
export function isFriday(date: Date = new Date()): boolean {
  return date.getDay() === 5;
}

/**
 * 주차 계산 (해당 월의 몇 번째 주인지)
 */
export function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay();
  const offsetDate = date.getDate() + firstDayOfWeek - 1;
  return Math.floor(offsetDate / 7) + 1;
}

