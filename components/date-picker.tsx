import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";

export const DatePicker = () => {
  const router = useRouter();

  // Initialize date range with today's date and 20 days ahead
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const isDisabled = !date?.from || !date?.to;

  // Handle filtering by date
  const handleFilterDate = () => {
    router.push(`?from=${format(date?.from as Date, "yyyy-MM-dd")}&to=${format(date?.to as Date, "yyyy-MM-dd")}`);
  };

  // Handle resetting date range
  const handleReset = () => {
    setDate(undefined);
    router.replace(`/overview`);
  };

  return (
    <>
      <div className={cn("grid gap-2", "-mt-32 mb-5")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button id="date" variant={"outline"} className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
            <div className="mx-3 flex pb-4 gap-2">
              <Button variant={"outline"} onClick={handleReset}>
                Reset
              </Button>
              <Button disabled={isDisabled} onClick={handleFilterDate}>
                Set Date
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
