"user client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { dateToUTCDate, getFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function StatsCards({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = React.useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative w-full flex flex-wrap md:flex-nowrap gap-2">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="size-12 flex items-center rounded-lg text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="size-12 flex items-center rounded-lg text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="size-12 flex items-center rounded-lg text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

interface StatsCardProp {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: ReactNode;
}

function StatsCard({ formatter, value, title, icon }: StatsCardProp) {
  const formatFn = React.useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );
  return (
    <Card className="flex items-center h-24 w-full gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          end={value}
          preserveValue
          redraw={false}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
