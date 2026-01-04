import { useState } from "react";
import AccomListItems from "../AccomListItems/AccomListItems";
import SearchForm from "../SearchForm/searchForm";
import AccommodationGrid from "../Accommodation/AccommodationGrid";

const PageBody = () => {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchResults = (results: any[]) => {
    console.log("Dữ liệu nhận được tại PageBody:", results);
    setAccommodations(results);
    setLoading(false);
  };

  const handleSearchStart = () => {
    setLoading(true);
    setAccommodations([]);
  };

  const showStrip = !loading && accommodations.length === 0; // chỉ hiện khi chưa có kết quả search

  return (
    <div className="w-[80%] mx-auto!">
      <SearchForm
        onSearchResults={handleSearchResults}
        onSearchStart={handleSearchStart}
      />

      {/* 10 accommodation ngay bên dưới thanh tìm kiếm */}
      {showStrip ? (
        <div className="mt-6">
          <AccommodationGrid />
        </div>
      ) : null}

      <div className="py-10!"></div>

      <AccomListItems items={accommodations} isLoading={loading} />
      <div className="w-full h-[100px]"></div>
    </div>
  );
};

export default PageBody;
