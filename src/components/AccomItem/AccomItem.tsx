interface AccomItemProps {
  // từ API /search (camelCase dùng trong FE)
  hotelId?: string; // HotelID
  location?: string; // Location
  description?: string; // Description
  score?: number | string; // score

  // optional
  name?: string;
  price?: number | string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  starCount?: number; // 3,4,5 sao
}

const AccomItem = ({
  hotelId = "",
  location = "",
  description = "",
  score = 0,

  name,
  price,
  rating,
  reviewCount,
  image,
  starCount,
}: AccomItemProps) => {
  const safeScore = typeof score === "number" ? score : Number(score || 0);
  const safeStarCount = typeof starCount === "number" ? starCount : 0;
  const stars = safeStarCount > 0 ? Array(safeStarCount).fill(0) : [];

  const displayName =
    name || (hotelId ? `Khách sạn #${hotelId}` : "Tên khách sạn");

  return (
    <div className="shadow-md w-full rounded-md bg-white overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 flex flex-col md:flex-row">
      <div className="relative md:w-80 shrink-0">
        <img
          src={
            image ||
            "https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20031457-da81191557ce8f90958fb16348c3445c.png?_src=imagekit&tr=c-at_max,f-jpg,fo-auto,h-332,pr-true,q-80,w-480"
          }
          alt={displayName}
          className="w-full h-64 md:h-full object-cover rounded-t-md md:rounded-l-md md:rounded-tr-none"
        />
      </div>

      <div className="flex-1 p-5! flex flex-col justify-between min-h-0">
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg capitalize mb-2!">
            {displayName}
          </h3>

          {location ? (
            <div className="text-sm text-gray-600 mb-2!">
              <i className="fa-solid fa-location-dot mr-1!"></i>
              {location}
            </div>
          ) : null}

          {stars.length > 0 ? (
            <div className="flex mb-3!">
              {stars.map((_, index) => (
                <i
                  key={index}
                  className="fa-solid fa-star text-yellow-300 mr-1!"
                ></i>
              ))}
            </div>
          ) : null}

          {typeof rating === "number" ? (
            <div className="flex items-center mb-4! text-sm">
              <i className="fa-solid fa-dove text-sky-600 mr-1!"></i>
              <span className="text-sky-600 font-medium mr-1!">
                {rating}/10
              </span>
              {typeof reviewCount === "number" ? (
                <span className="text-gray-600">({reviewCount} đánh giá)</span>
              ) : null}
            </div>
          ) : null}

          <div className="flex-1 overflow-hidden mb-4!">
            <div
              className="text-gray-700 text-sm leading-relaxed text-justify overflow-y-auto custom-scrollbar pr-2!"
              style={{ maxHeight: "120px" }}
            >
              {description || "Chưa có mô tả chi tiết."}
            </div>
          </div>
        </div>

        <div>
          {price !== undefined && price !== null ? (
            <>
              <div className="text-xl font-bold text-[#f96d01] mb-1!">
                {typeof price === "number"
                  ? price.toLocaleString("vi-VN")
                  : price}{" "}
                VND
              </div>
              <div className="text-xs text-gray-500 mb-2!">
                Chưa bao gồm thuế và phí
              </div>
            </>
          ) : null}

          <div className="text-xs text-gray-400">
            Độ khớp tìm kiếm: {safeScore.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccomItem;
