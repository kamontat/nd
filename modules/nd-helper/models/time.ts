import { Verify } from "nd-commandline-interpreter";

const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthsTH = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];
const monthsShortTH = ["ม.ค", "ก.พ", "มี.ค", "เม.ย", "พ.ค", "มิ.ย", "ก.ค", "ส.ค", "ก.ย", "ต.ค", "พ.ย", "ธ.ค"];

const dayShortTH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const prefixZero = (num: number) => {
  return ("0" + num).slice(-2);
};

export default {
  GetTimestamp(date: string | Date) {
    if (typeof date === "string") return +new Date(date);
    else return date.getTime();
  },
  GetDate(timestamp: number) {
    if (Verify.IsNumber(timestamp)) return new Date(timestamp);
    return undefined;
  },
  FormatDate(date?: Date, conf?: { format?: "long" | "short"; lang?: "th" | "en" }) {
    if (!date) return "Invalid Date";

    const config = {
      format: "long",
      lang: "en",
      ...conf,
    };

    let _dayShort = dayShort[date.getDay()];

    const _date = date.getDate();
    let _month = months[date.getMonth()];
    let _monthShort = monthsShort[date.getMonth()];
    const _year = date.getFullYear();

    if (config.lang === "th") {
      _dayShort = dayShortTH[date.getDay()];

      _month = monthsTH[date.getMonth()];
      _monthShort = monthsShortTH[date.getMonth()];
    }

    if (config.format === "short")
      return `${_date} ${_monthShort} ${_year} ${prefixZero(date.getHours())}:${prefixZero(date.getMinutes())}`;
    if (config.format === "long")
      return `${_dayShort} ${prefixZero(_date)} ${_month} ${_year} ${prefixZero(date.getHours())}:${prefixZero(
        date.getMinutes(),
      )}:${prefixZero(date.getSeconds())}:${prefixZero(date.getMilliseconds())}`;

    return "Invalid Date Config";
  },
};
