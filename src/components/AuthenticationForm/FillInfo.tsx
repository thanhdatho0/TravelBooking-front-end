import { useState } from "react";

interface DateSelect {
  day: string;
  month: string;
  year: string;
}

const FillInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<DateSelect>({
    day: "",
    month: "",
    year: "",
  });

  // Tạo danh sách ngày (1–31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  // Tháng (1–12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // Năm (từ 1900 đến năm hiện tại)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  // Tính số ngày tối đa theo tháng + năm
  const getMaxDays = () => {
    if (!date.month || !date.year) return 31;
    const month = parseInt(date.month);
    const year = parseInt(date.year);
    return new Date(year, month, 0).getDate(); // getDate() trả về ngày cuối tháng
  };

  const maxDays = getMaxDays();

  const handleChange = (field: keyof DateSelect, value: string) => {
    setDate((prev) => {
      const newDate = { ...prev, [field]: value };

      // Nếu chọn ngày > maxDays → reset ngày
      if (field !== "day" && newDate.day && parseInt(newDate.day) > maxDays) {
        newDate.day = "";
      }

      return newDate;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Giả lập API call
    setTimeout(() => {
      alert("Đăng nhập thành công!");
      setIsSubmitting(false);
    }, 1000);
  };
  return (
    <div className="w-[80%] mx-auto! mb-10!">
      <h1 className="text-2xl my-5! font-semibold">Thông tin bổ sung</h1>
      <form onSubmit={handleSubmit} className="">
        <div className="my-5!">
          <label htmlFor="email" className="w-full text-sm">
            Ngày sinh
          </label>
          <div className="flex flex-1 gap-3 items-center my-0.5!">
            {/* Ngày */}
            <div className="relative">
              <select
                value={date.day}
                onChange={(e) => handleChange("day", e.target.value)}
                className={`
            w-20 appearance-none bg-white border border-gray-300 rounded-lg
            px-3! py-2! pr-8! text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200
            ${date.day ? "text-gray-900" : "text-gray-400"}
          `}
              >
                <option value="" disabled>
                  DD
                </option>
                {days.slice(0, maxDays).map((d) => (
                  <option key={d} value={d}>
                    {d.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0! right-0 flex items-center pr-2!">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Tháng */}
            <div className="relative">
              <select
                value={date.month}
                onChange={(e) => handleChange("month", e.target.value)}
                className={`
            w-20 appearance-none bg-white border border-gray-300 rounded-lg
            px-3! py-2! pr-8! text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200
            ${date.month ? "text-gray-900" : "text-gray-400"}
          `}
              >
                <option value="" disabled>
                  MM
                </option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2!">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Năm */}
            <div className="relative">
              <select
                value={date.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className={`
            w-24 appearance-none bg-white border border-gray-300 rounded-lg
            px-3! py-2! pr-8! text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200
            ${date.year ? "text-gray-900" : "text-gray-400"}
          `}
              >
                <option value="" disabled>
                  YYYY
                </option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2!">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-[0.75rem] text-gray-400">
            Để có thông tin đặt phòng chính xác, vui lòng đảm bảo rằng thông tin
            đó chính xác như được ghi trong ID/Hộ chiếu do chính phủ cấp.
          </p>
        </div>

        <div className="">
          <label htmlFor="password" className="w-full text-sm">
            Giới tính (Không bắt buộc)
          </label>
          <div className="flex gap-5 mt-0.5!">
            <div className="flex items-center gap-2">
              <input
                id="inline-radio"
                type="radio"
                value="male"
                name="inline-radio-group"
                className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 "
              />
              <label
                htmlFor="inline-radio"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Name
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="inline-2-radio"
                type="radio"
                value="female"
                name="inline-radio-group"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
              />
              <label
                htmlFor="inline-2-radio"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Nữ
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-white text-md font-semibold text-center w-full py-3.5! my-2! rounded-full shadow-md cursor-pointer transition-all ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-sky-600 hover:shadow-lg hover:bg-sky-800"
          }`}
        >
          {isSubmitting ? (
            <svg
              aria-hidden="true"
              className="w-8 h-8 m-auto! text-gray-200 animate-spin dark:text-gray-600 fill-sky-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "Đăng ký"
          )}
        </button>
        <button
          disabled={true}
          className="text-white text-md font-semibold text-center w-full py-3.5! mt-5! rounded-full bg-sky-600 shadow-md cursor-pointer hover:shadow-lg hover:bg-sky-800 transition-shadow"
        >
          Bỏ qua bước này
        </button>
      </form>
    </div>
  );
};

export default FillInfo;
