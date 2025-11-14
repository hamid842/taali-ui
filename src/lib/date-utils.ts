import dayjs from "dayjs";
import jalaliPlugin from "@zoomit/dayjs-jalali-plugin";
import "dayjs/locale/fa";

dayjs.extend(jalaliPlugin);

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string) {
  return input.replace(/\d/g, (d) => persianDigits[Number(d)]);
}


export function toJalali(date: string | Date | dayjs.Dayjs): string {
  return dayjs(date).calendar("jalali").format("YYYY-MM-DD");
}

export function fromJalali(jalaliDate: string): string {
  return dayjs(jalaliDate, {
    jalali: true,
  })
    .calendar("gregory")
    .format("YYYY-MM-DD");
}

export function formatJalali(
  date: string | Date | dayjs.Dayjs,
  format = "DD MMMM YYYY"
) {
  const formatted = dayjs(date).locale("fa").calendar("jalali").format(format);

  return toPersianDigits(formatted);
}

export function todayJalali(): string {
  return dayjs().calendar("jalali").format("YYYY-MM-DD");
}

export function formatGregorian(
  date: string | Date | dayjs.Dayjs,
  format = "DD MMMM YYYY"
) {
  return dayjs(date)
    .locale("en") 
    .calendar("gregory")
    .format(format);
}

