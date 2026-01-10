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
 * 회고 작성 가능 여부 확인
 * 비즈니스 규칙: 금요일 0시 ~ 다음 주 월요일 0시 0분까지 작성 가능
 */
export function canWriteRetrospective(date: Date = new Date()): boolean {
  const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 5: 금요일, 6: 토요일

  // 금요일(5), 토요일(6), 일요일(0) 은 작성 가능
  if (day === 5 || day === 6 || day === 0) {
    return true;
  }

  // 월요일(1) 0시 0분 0초까지만 가능 (0시 0분 0초 정각은 불가능)
  if (day === 1) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // 월요일 0시 0분 0초 이전까지만 허용 (실제로는 일요일 23:59:59까지)
    return hours === 0 && minutes === 0 && seconds === 0 ? false : false;
  }

  // 화요일(2), 수요일(3), 목요일(4) 은 작성 불가
  return false;
}

/**
 * 회고 작성 가능 기간 정보 반환
 * @returns 이번 주 회고 작성 시작/종료 시간
 */
export function getRetrospectiveWritePeriod(date: Date = new Date()): {
  startTime: Date;
  endTime: Date;
  isWithinPeriod: boolean;
} {
  const weekStart = getWeekStart(date); // 이번 주 월요일

  // 회고 작성 시작: 이번 주 금요일 0시
  const startTime = new Date(weekStart);
  startTime.setDate(startTime.getDate() + 4); // 월요일 + 4 = 금요일
  startTime.setHours(0, 0, 0, 0);

  // 회고 작성 종료: 다음 주 월요일 0시 0분 0초
  const endTime = new Date(weekStart);
  endTime.setDate(endTime.getDate() + 7); // 다음 주 월요일
  endTime.setHours(0, 0, 0, 0);

  const now = date.getTime();
  const isWithinPeriod = now >= startTime.getTime() && now < endTime.getTime();

  return { startTime, endTime, isWithinPeriod };
}

/**
 * 다음 회고 작성 가능 시간까지 남은 시간 계산
 */
export function getTimeUntilRetrospectiveOpen(date: Date = new Date()): {
  days: number;
  hours: number;
  minutes: number;
  nextOpenTime: Date;
} | null {
  const { startTime, isWithinPeriod } = getRetrospectiveWritePeriod(date);

  // 이미 작성 가능 기간이면 null 반환
  if (isWithinPeriod) {
    return null;
  }

  // 현재 시간이 금요일 이전이면 이번 주 금요일까지
  // 현재 시간이 월요일 이후이면 다음 주 금요일까지
  let nextOpenTime = startTime;

  if (date >= startTime) {
    // 이미 금요일이 지났으면 다음 주 금요일
    nextOpenTime = new Date(startTime);
    nextOpenTime.setDate(nextOpenTime.getDate() + 7);
  }

  const diff = nextOpenTime.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, nextOpenTime };
}

/**
 * 회고 작성 마감까지 남은 시간 계산
 */
export function getTimeUntilRetrospectiveClose(date: Date = new Date()): {
  days: number;
  hours: number;
  minutes: number;
  closeTime: Date;
} | null {
  const { endTime, isWithinPeriod } = getRetrospectiveWritePeriod(date);

  // 작성 가능 기간이 아니면 null 반환
  if (!isWithinPeriod) {
    return null;
  }

  const diff = endTime.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, closeTime: endTime };
}

/**
 * 특정 회고의 작성 기간 만료 여부 확인
 * @param retrospectiveEndDate 회고의 종료일 (yyyy-MM-dd 형식)
 * @param currentDate 현재 시간
 * @returns 만료 여부 및 마감 시간 정보
 */
export function isRetrospectiveExpired(
  retrospectiveEndDate: string,
  currentDate: Date = new Date()
): {
  isExpired: boolean;
  deadline: Date;
} {
  // 회고 종료일(일요일) 파싱
  const [year, month, day] = retrospectiveEndDate.split("-").map(Number);
  const endDate = new Date(year, month - 1, day);

  // 마감: 해당 주 일요일 다음 월요일 0시 0분 0초
  const deadline = new Date(endDate);
  deadline.setDate(deadline.getDate() + 1); // 다음 날 (월요일)
  deadline.setHours(0, 0, 0, 0);

  const isExpired = currentDate >= deadline;

  return { isExpired, deadline };
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

// ============================================================
// WeekId 관련 유틸리티 함수들 (ISO 8601 Week Date)
// ============================================================

/**
 * 주어진 날짜의 WeekId를 반환합니다.
 * @param date Date 객체 또는 날짜 문자열
 * @returns WeekId (YYYY-Www 형식, 예: 2025-W02)
 */
export function getWeekId(date: Date | string = new Date()): string {
  const d = typeof date === "string" ? new Date(date) : new Date(date);

  // ISO 8601 week number 계산
  // 목요일이 속한 연도가 해당 주의 연도
  d.setHours(0, 0, 0, 0);
  // 목요일로 이동 (현재 요일에서 목요일까지의 차이 계산)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));

  // 1월 4일이 포함된 주가 1주차
  const week1 = new Date(d.getFullYear(), 0, 4);
  // 1주차의 목요일로 이동
  week1.setDate(week1.getDate() + 3 - ((week1.getDay() + 6) % 7));

  // 주 번호 계산
  const weekNumber =
    1 + Math.round((d.getTime() - week1.getTime()) / (7 * 24 * 60 * 60 * 1000));

  // ISO 8601에서 연도는 주가 속한 연도 (1월 1일이 아님)
  const year = d.getFullYear();

  return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
}

/**
 * 현재 주의 WeekId를 반환합니다.
 * @returns WeekId (YYYY-Www 형식)
 */
export function getCurrentWeekId(): string {
  return getWeekId(new Date());
}

/**
 * WeekId를 파싱하여 해당 주의 시작일(월요일)과 종료일(일요일)을 반환합니다.
 * @param weekId WeekId (YYYY-Www 형식)
 * @returns { start: Date, end: Date }
 */
export function parseWeekId(weekId: string): { start: Date; end: Date } {
  const match = weekId.match(/^(\d{4})-W(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid weekId format: ${weekId}`);
  }

  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);

  // ISO 8601: 1월 4일이 포함된 주가 1주차
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7; // 일요일을 7로 변환

  // 1주차의 월요일 계산
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - dayOfWeek + 1);

  // 원하는 주의 월요일 계산
  const start = new Date(week1Monday);
  start.setDate(week1Monday.getDate() + (week - 1) * 7);
  start.setHours(0, 0, 0, 0);

  // 일요일 계산
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * WeekId를 한국어 형식으로 표시합니다.
 * @param weekId WeekId (YYYY-Www 형식)
 * @returns "M월 D일 ~ M월 D일" 형식
 */
export function formatWeekIdKorean(weekId: string): string {
  const { start, end } = parseWeekId(weekId);
  return formatDateRangeKorean(formatDate(start), formatDate(end));
}

/**
 * 두 WeekId가 같은지 비교합니다.
 */
export function isSameWeek(weekId1: string, weekId2: string): boolean {
  return weekId1 === weekId2;
}

/**
 * 주어진 날짜가 특정 WeekId에 속하는지 확인합니다.
 */
export function isDateInWeek(date: Date | string, weekId: string): boolean {
  return getWeekId(date) === weekId;
}

/**
 * 특정 WeekId의 회고 작성 기간을 반환합니다.
 * 작성 가능 기간: 해당 주의 금요일 00:00 ~ 다음 주 월요일 00:00
 * @param weekId WeekId (YYYY-Www 형식)
 * @param now 현재 시간 (테스트 용이성을 위해 주입 가능)
 */
export function getRetrospectiveWritePeriodForWeek(
  weekId: string,
  now: Date = new Date()
): {
  startTime: Date;
  endTime: Date;
  isWithinPeriod: boolean;
} {
  const { start } = parseWeekId(weekId);

  // 금요일 00:00 (월요일 + 4일)
  const friday = new Date(start);
  friday.setDate(start.getDate() + 4);
  friday.setHours(0, 0, 0, 0);

  // 다음 주 월요일 00:00 (월요일 + 7일)
  const nextMonday = new Date(start);
  nextMonday.setDate(start.getDate() + 7);
  nextMonday.setHours(0, 0, 0, 0);

  const isWithinPeriod = now >= friday && now < nextMonday;

  return { startTime: friday, endTime: nextMonday, isWithinPeriod };
}

/**
 * 특정 WeekId의 회고 작성 기간이 만료되었는지 확인합니다.
 * @param weekId WeekId (YYYY-Www 형식)
 * @param now 현재 시간 (테스트 용이성을 위해 주입 가능)
 */
export function isRetrospectiveExpiredForWeek(
  weekId: string,
  now: Date = new Date()
): {
  isExpired: boolean;
  deadline: Date;
} {
  const { start } = parseWeekId(weekId);

  // 마감: 다음 주 월요일 00:00
  const deadline = new Date(start);
  deadline.setDate(start.getDate() + 7);
  deadline.setHours(0, 0, 0, 0);

  return { isExpired: now >= deadline, deadline };
}
