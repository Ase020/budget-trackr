import { Currencies } from "./currencies";

export const dateToUTCDate = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
};

export function getFormatterForCurrency(currency: string) {
  const locale = Currencies.find((curr) => currency === curr.value)?.locale;

  return Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
