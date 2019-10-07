import { TimeUtils } from "@nd/helper";

const __dateToString = (lang: "en" | "th") => {
  return (text: string, render: (s: string) => string) => {
    const date = TimeUtils.GetDate(parseInt(render(text), 10));
    return render(TimeUtils.FormatDate(date, { format: "short", lang }));
  };
};

// For Mustache usage only :)
export const DateTHString = () => __dateToString("th");
export const DateENString = () => __dateToString("en");
