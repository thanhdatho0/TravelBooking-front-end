import AccomItem from "../AccomItem/AccomItem";

interface Accommodation {
  doc_id: number;
  name_hotel: string;
  title: string; // Đây là mô tả dài
  location: string;
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
        {/* Vòng xoay tạo bằng Tailwind */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-sky-600 rounded-full animate-spin mb-4!"></div>
        <p className="text-gray-500 text-sm animate-pulse">
          Đang tìm kiếm dữ liệu...
        </p>
      </div>
    );
  }

  if (!hasSearched && items.length === 0) {
    return null;
  }

  if (hasSearched && items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Không tìm thấy khách sạn nào</p>
        <p className="text-gray-500 mt-2">Hãy thử từ khóa khác nhé!</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 gap-10">
      {items.map((item) => {
        const randomPrice = Math.floor(
          Math.random() * (2000000 - 300000) + 300000
        );
        const randomStar = Math.floor(Math.random() * 3) + 3; // 3 đến 5 sao
        const randomRating = (item.score * 10).toFixed(1); // Giả lập rating từ score AI

        return (
          <AccomItem
            key={item.doc_id} // JSON dùng doc_id
            // CSS capitalize để viết hoa chữ cái đầu (backend trả về chữ thường)
            name={
              (<span className="capitalize">{item.name_hotel}</span>) as any
            }
            // Các trường backend chưa có -> dùng fallback
            price={randomPrice}
            rating={Number(randomRating) > 10 ? 9.5 : Number(randomRating)} // Score đôi khi > 1
            reviewCount={Math.floor(Math.random() * 500)} // Random số review
            starCount={randomStar}
            description={item.title}
          />
        );
      })}
    </div>
  );
};

export default AccomListItems;
