import { useState } from "react";
import AccomListItems from "../AccomListItems/AccomListItems";
import SearchForm from "../SearchForm/searchForm";

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
  return (
    <div className="w-[80%] mx-auto!">
      <SearchForm
        onSearchResults={handleSearchResults}
        onSearchStart={handleSearchStart}
      />
      <div className="py-10!"></div>
      <AccomListItems items={accommodations} isLoading={loading} />
      <div className="w-full h-[100px]"></div>
    </div>
  );
};

export default PageBody;
