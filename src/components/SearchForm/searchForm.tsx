import { useState, type FormEvent } from "react";

interface SearchFormProps {
  onSearchResults?: (results: any[]) => void;
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
}

export default function SearchForm({
  onSearchResults,
  onSearchStart,
  onSearchEnd,
}: SearchFormProps) {
  const [query, setQuery] = useState<string>("");

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    onSearchStart?.();

    const encodedQuery = query.trim();
    const url = `http://127.0.0.1:8009/search?query=${encodedQuery}&top_k=10`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const resultsArray = data.results || [];

      onSearchResults?.(resultsArray);
      console.log("Kết quả từ backend:", resultsArray);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert(
        "Không thể kết nối đến server tìm kiếm. Vui lòng kiểm tra backend."
      );
      onSearchResults?.([]);
    } finally {
      onSearchEnd?.();
    }
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

      <form className="p-2.5! w-full" onSubmit={handleSearch}>
        <div className="single-input p-2!">
          <label className="block text-md font-medium text-gray-700 mb-1!">
            Tìm kiếm nơi lưu trú theo mô tả của bạn:
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
              placeholder="Mô tả chi tiết về nơi bạn muốn đến..."
              className="flex-1 outline-none text-md"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
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
