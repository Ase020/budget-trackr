"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_DAYS_RANGE } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React from "react";
import { toast } from "sonner";

function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;

              if (differenceInDays(to, from) > MAX_DATE_DAYS_RANGE) {
                toast.error(
                  `The selected range range is more than ${MAX_DATE_DAYS_RANGE} days!`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Overview;