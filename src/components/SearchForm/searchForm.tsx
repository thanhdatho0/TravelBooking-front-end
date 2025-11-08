// components/SearchForm.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { dayjs } from "../../lib/dayjs";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function SearchForm() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const renderMonth = (month: dayjs.Dayjs) => {
    const start = month.startOf("month");
    const end = month.endOf("month");
    const daysInMonth = end.date();
    const startDayOfWeek = start.day(); // 0 = Sunday

    const calendarDays: (dayjs.Dayjs | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      calendarDays.push(month.date(d));
    }
    while (calendarDays.length < 42) calendarDays.push(null);

    return (
      <div className="flex-1 min-w-[280px]">
        <div className="text-center font-semibold text-md mb-2! text-gray-800">
          {month.format("MMMM YYYY")}
        </div>
        <div className="grid grid-cols-7 gap-px text-xs">
          {["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"].map((day) => (
            <div
              key={day}
              className={`text-center py-1 font-medium ${
                day === "CN" ? "text-orange-500" : "text-gray-600"
              }`}
            >
              {day}
            </div>
          ))}
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={idx} className="h-8" />;
            const isCurrentMonth = day.month() === month.month();
            const isToday = day.isToday();
            const isSelected = selectedDate && day.isSame(selectedDate, "day");

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleDateSelect(day)}
                className={`
                  h-8 w-full flex items-center justify-center text-md rounded-full transition-colors
                  ${!isCurrentMonth ? "text-gray-400" : "text-gray-800"}
                  ${
                    isToday
                      ? "bg-sky-600 text-white font-bold ring-2 ring-white shadow-md"
                      : ""
                  }
                  ${
                    isSelected && !isToday
                      ? "bg-sky-100 text-sky-700 font-semibold"
                      : ""
                  }
                  ${
                    !isToday && !isSelected && isCurrentMonth
                      ? "hover:bg-gray-100"
                      : ""
                  }
                `}
              >
                {day.format("D")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[50vw] min-h-50 mx-auto! shadow-sm rounded-md bg-white z-20 -mt-10!">
      <div className="w-full bg-[#f7f9fa] h-10 rounded-t-sm px-2.5! py-2!">
        <a
          href="#"
          className="flex items-center gap-1.5 h-full font-bold text-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-sky-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <span className="text-sky-600">Khách sạn xem gần đây</span>
        </a>
      </div>

      <form className="p-2.5! w-full">
        <div className="single-input p-2!">
          <label className="block text-md font-medium text-gray-700 mb-1!">
            Thành phố, địa điểm hoặc tên khách sạn:
          </label>
          <div className="flex gap-1.5 p-1.5! h-10 border border-gray-300 rounded-sm shadow-sm items-center focus-within:ring-1 focus-within:ring-sky-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Thành phố, khách sạn, điểm đến"
              className="flex-1 outline-none text-md"
            />
          </div>
        </div>

        <div className="double-droplist flex gap-4 p-2!">
          <div className="flex-1 relative" ref={calendarRef}>
            <label className="block text-md font-medium text-gray-700 mb-1!">
              Nhận phòng:
            </label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full h-10 px-3! flex items-center justify-between border border-gray-300 rounded-sm shadow-sm bg-white text-left text-md hover:border-sky-500 transition-colors"
            >
              <span
                className={selectedDate ? "text-gray-900" : "text-gray-500"}
              >
                {selectedDate ? selectedDate.format("DD/MM/YYYY") : "Chọn ngày"}
              </span>
              <Calendar className="w-4 h-4 text-gray-500" />
            </button>

            {showCalendar && (
              <div className="absolute top-full left-0 mt-1! w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4! z-50">
                <div className="flex items-center justify-between mb-3!">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(currentMonth.subtract(1, "month"))
                    }
                    className="p-1! hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <select
                    value={currentMonth.format("YYYY-MM")}
                    onChange={(e) =>
                      setCurrentMonth(dayjs(e.target.value + "-01"))
                    }
                    className="text-md font-medium bg-transparent border-b border-gray-300 px-1! focus:outline-none"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const date = dayjs().add(i - 12, "month");
                      return (
                        <option key={i} value={date.format("YYYY-MM")}>
                          {date.format("MMMM YYYY")}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(currentMonth.add(1, "month"))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto">
                  {renderMonth(currentMonth)}
                  {renderMonth(currentMonth.add(1, "month"))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-md font-medium text-gray-700 mb-1!">
              Số đêm:
            </label>
            <input
              type="text"
              placeholder="1"
              className="w-full h-10 px-3! border border-gray-300 rounded-sm shadow-sm text-md"
            />
          </div>

          <div className="flex-1">
            <label className="block text-md font-medium text-gray-700 mb-1!">
              Trả phòng:
            </label>
            <input
              type="text"
              readOnly
              value={
                selectedDate
                  ? selectedDate.add(1, "day").format("DD/MM/YYYY")
                  : ""
              }
              placeholder="Tự động"
              className="w-full h-10 px-3! border border-gray-300 rounded-sm shadow-sm bg-gray-50 text-md"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-sky-600 text-white px-6! py-2! rounded-sm text-md font-medium hover:bg-sky-700 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
}
