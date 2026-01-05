import AccomItem from "../AccomItem/AccomItem";

interface Accommodation {
  HotelID: string;
  Description: string;
  Location: string;
  score: number;
}

interface AccomListItemsProps {
  items: Accommodation[];
  isLoading?: boolean;
  hasSearched?: boolean;
}

const AccomListItems = ({
  items,
  isLoading = false,
  hasSearched = false,
}: AccomListItemsProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20!">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-sky-600 rounded-full animate-spin mb-4!"></div>
        <p className="text-gray-500 text-sm animate-pulse">
          Đang tìm kiếm dữ liệu...
        </p>
      </div>
    );
  }

  if (!hasSearched && items.length === 0) return null;

  if (hasSearched && items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Không tìm thấy khách sạn nào</p>
        <p className="text-gray-500 mt-2">Hãy thử từ khóa khác nhé!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10">
      {items.map((item) => {
        const randomPrice = Math.floor(
          Math.random() * (2000000 - 300000) + 300000
        );
        const randomStar = Math.floor(Math.random() * 3) + 3; // 3-5 sao
        const randomRating = (randomStar * 2).toFixed(1); // 6.0 - 10.0

        return (
          <AccomItem
            key={item.HotelID}
            hotelId={item.HotelID}
            location={item.Location}
            description={item.Description}
            score={item.score}
            // fallback
            price={randomPrice}
            rating={Number(randomRating) > 10 ? 9.5 : Number(randomRating)}
            reviewCount={Math.floor(Math.random() * 500)}
            starCount={randomStar}
          />
        );
      })}
    </div>
  );
};

export default AccomListItems;
