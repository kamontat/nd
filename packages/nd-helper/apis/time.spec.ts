import test from "ava";
import { TimeUtils } from "..";

test("get timestamp from date object", t => {
  const date = new Date("Mon Oct 07 2019 11:35:49 GMT+0700 (Indochina Time)");
  const stamp = 1570422949000;

  const timestamp = TimeUtils.GetTimestamp(date);
  t.is(timestamp, stamp, `The timestamp of ${date} must be ${stamp}`);
});

test("get timestamp from string", t => {
  const date = "25 Jan 2011 12:00:02 UTC";
  const stamp = 1295956802000;

  const timestamp = TimeUtils.GetTimestamp(date);
  t.is(timestamp, stamp, `The timestamp of ${date} must be ${stamp}`);
});

test("get date from string", t => {
  const date = TimeUtils.GetDate(1900000000000);
  t.deepEqual(date, new Date("2030-03-17 17:46:40 UTC"));
});

test("get date from undefined", t => {
  const date = TimeUtils.GetDate(undefined);
  t.falsy(date);
});

test("get date from invalid string", t => {
  const date = TimeUtils.GetDate("hello, world");
  t.falsy(date);
});

test("converting short thai month", t => {
  const month6 = TimeUtils.ConvertThaiMonth("ก.ค.", "short");
  t.is(month6, 6);

  const month0 = TimeUtils.ConvertThaiMonth("ม.ค.", "short");
  t.is(month0, 0);

  const month9 = TimeUtils.ConvertThaiMonth("ต.ค", "short");
  t.is(month9, 9);
});

test("converting long thai month", t => {
  const month1 = TimeUtils.ConvertThaiMonth("กุมภาพันธ์", "long");
  t.is(month1, 1);

  const month11 = TimeUtils.ConvertThaiMonth("ธันวาคม", "long");
  t.is(month11, 11);
});

test("converting thai year", t => {
  const y1969 = TimeUtils.ConvertThaiYear("12");
  t.is(y1969, 1969);

  const y2017 = TimeUtils.ConvertThaiYear("60");
  t.is(y2017, 2017);

  const y2117 = TimeUtils.ConvertThaiYear("2660");
  t.is(y2117, 2117);
});

test("build current datetime", t => {
  t.deepEqual(TimeUtils.BuildDate({}), new Date());
});

test("build datetime with number", t => {
  t.deepEqual(TimeUtils.BuildDate({ year: 2010, month: 9, date: 6 }), new Date("2010/10/06"));
});

test("formatting datetime with default format config", t => {
  const date = TimeUtils.BuildDate({ year: 2010, month: 9, date: 6 });
  const format = TimeUtils.FormatDate(date);

  t.is(format, "Wed 06 October 2010 00:00:00:00");
});

test("formatting datetime with thai short format", t => {
  const date = TimeUtils.BuildDate({ year: 2022, month: 4, date: 2, hour: 22, minute: 12 });
  const format = TimeUtils.FormatDate(date, { format: "short", lang: "th" });

  t.is(format, "2 พ.ค. 2022 22:12");
});

test("formatting date with thai short format", t => {
  const date = TimeUtils.BuildDate({ year: 2022, month: 11, date: 4 });
  const format = TimeUtils.FormatDate(date, { format: "short", lang: "th" });

  t.is(format, "4 ธ.ค. 2022");
});

test("formatting date with incorrect month", t => {
  const date = TimeUtils.BuildDate({ year: 10000, month: 20, date: 4 });
  const format = TimeUtils.FormatDate(date, { format: "short", lang: "th" });

  t.is(format, "4 ก.ย. 10001");
});

test("formatting date with undefined", t => {
  const format = TimeUtils.FormatDate(undefined, { format: "short", lang: "th" });
  t.is(format, "Invalid Date");
});
