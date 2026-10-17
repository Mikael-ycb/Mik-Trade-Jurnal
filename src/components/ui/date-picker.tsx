"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  id?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
};

export function DatePicker({ id, value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            className="w-full justify-start border-white/10 bg-[#080b18] text-left font-normal text-white hover:bg-white/5"
          />
        }
      >
        <CalendarIcon className="mr-2 size-4" />
        {value ? format(value, "dd MMM yyyy") : "Pilih tanggal"}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
