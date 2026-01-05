import { useState, type FormEvent } from "react";

interface SearchResultItem {
  HotelID: string;
  Description: string;
  Location: string;
  score: number;
}

interface SearchApiResponse {
  status: number;
  message: string;
  query: string;
  timestamp: number;
  results: SearchResultItem[];
}

interface SearchFormProps {
  onSearchResults?: (results: SearchResultItem[]) => void;
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

    const q = query.trim();
    if (!q) {
      alert("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    onSearchStart?.();

    const url = `http://127.0.0.1:8009/search?query=${encodeURIComponent(
      q
    )}&top_k=10`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `HTTP ${response.status}: ${text || response.statusText}`
        );
      }

      const data = (await response.json()) as Partial<SearchApiResponse>;

      // Debug toàn bộ response
      console.log("Response từ backend:", data);

      // Validate đúng format bạn gửi
      const resultsArray = Array.isArray(data.results) ? data.results : [];

      onSearchResults?.(resultsArray);
      console.log("results[]:", resultsArray);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert(
        "Không thể kết nối đến server tìm kiếm. Vui lòng kiểm tra backend/CORS."
      );
      onSearchResults?.([]);
    } finally {
      onSearchEnd?.();
    }
  };

  return (
    <div className="w-[50vw] min-h-50 mx-auto mt-6 bg-white rounded-xl border border-gray-200 shadow-lg ring-1 ring-black/5 overflow-hidden relative z-20">
      <div className="w-full bg-white h-12 px-4 py-3 border-b border-gray-100">
        <a
          href="#"
          className="flex items-center gap-2 h-full font-bold text-md"
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

      <form className="p-4 w-full" onSubmit={handleSearch}>
        <div className="single-input p-2">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Tìm kiếm nơi lưu trú theo mô tả của bạn:
          </label>

          <div className="flex gap-2 p-2 h-11 border border-gray-300 rounded-md shadow-sm items-center bg-white focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
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
              className="flex-1 outline-none text-md bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-end px-2 pb-2">
          <button
            type="submit"
            className="bg-sky-600 text-white px-6 py-2 rounded-md text-md font-medium hover:bg-sky-700 transition-colors shadow-sm"
          >
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
}
