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
const monthsShortTH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const dayShortTH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];

const prefixZero = (num: number) => {
  return ("0" + num).slice(-2);
};

export default {
  BuildDate({ year = 0, month = 0, date = 1, hour = 0, minute = 0, second = 0 }) {
    // build to this format: 1995-12-17T03:24:00
    return new Date(year, month, date, hour, minute, second);
  },
  ConvertThaiMonth(str: string, type: "short" | "long") {
    if (!str.endsWith(".")) str += ".";
    const arr = type === "short" ? monthsShortTH : monthsTH;

    return arr.reduce((p, c, i) => {
      if (c === str) return i;
      return p;
    }, -1);
  },
  ConvertThaiYear(str: string) {
    if (str.length === 2) str = `25${str}`;
    const n = parseInt(str, 10);
    return n - 543;
  },
  GetTimestamp(date: string | Date) {
    if (typeof date === "string") return +new Date(date);
    else return date.getTime();
  },
  GetDate(timestamp?: number | string) {
    const number = parseInt((timestamp && timestamp.toString()) || "unknown");
    if (isNaN(number)) return undefined;
    return new Date(number);
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
      if (date.getHours() === 0 && date.getMinutes() === 0) {
        return `${_date} ${_monthShort} ${_year}`;
      } else return `${_date} ${_monthShort} ${_year} ${prefixZero(date.getHours())}:${prefixZero(date.getMinutes())}`;
    if (config.format === "long")
      return `${_dayShort} ${prefixZero(_date)} ${_month} ${_year} ${prefixZero(date.getHours())}:${prefixZero(
        date.getMinutes(),
      )}:${prefixZero(date.getSeconds())}:${prefixZero(date.getMilliseconds())}`;

    return "Invalid Date Config";
  },
};
