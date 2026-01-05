interface AccomItemProps {
  name?: string;
  price?: number | string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  starCount?: number; // 3,4,5 sao
  description?: string;
  score?: number; // độ khớp tìm kiếm
}

const AccomItem = ({
  name = "Tên khách sạn",
  price = "303.030",
  rating = 8.6,
  reviewCount = 304,
  image,
  starCount = 5,
  description = "",
  score = 0,
}: AccomItemProps) => {
  const stars = Array(starCount).fill(0);

  return (
    <div className="shadow-md w-full rounded-md bg-white overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 flex flex-col md:flex-row">
      {/* Phần hình ảnh bên trái */}
      <div className="relative md:w-80 shrink-0">
        <img
          src={
            image ||
            "https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20031457-da81191557ce8f90958fb16348c3445c.png?_src=imagekit&tr=c-at_max,f-jpg,fo-auto,h-332,pr-true,q-80,w-480"
          }
          alt={name}
          className="w-full h-64 md:h-full object-cover rounded-t-md md:rounded-l-md md:rounded-tr-none"
        />
      </div>

      {/* Phần thông tin bên phải */}
      <div className="flex-1 p-5! flex flex-col justify-between min-h-0">
        <div className="flex-1 flex flex-col">
          {/* Tên khách sạn */}
          <h3 className="font-semibold text-lg capitalize mb-2!">{name}</h3>

          {/* Số sao */}
          <div className="flex mb-3!">
            {stars.map((_, index) => (
              <i
                key={index}
                className="fa-solid fa-star text-yellow-300 mr-1!"
              ></i>
            ))}
          </div>

          {/* Rating + số review */}
          <div className="flex items-center mb-4! text-sm">
            <i className="fa-solid fa-dove text-sky-600 mr-1!"></i>
            <span className="text-sky-600 font-medium mr-1!">{rating}/10</span>
            <span className="text-gray-600">({reviewCount} đánh giá)</span>
          </div>

          {/* Mô tả - luôn hiển thị, giới hạn chiều cao và có scroll nếu dài */}
          <div className="flex-1 overflow-hidden mb-4!">
            <div
              className="text-gray-700 text-sm leading-relaxed text-justify overflow-y-auto custom-scrollbar pr-2!"
              style={{ maxHeight: "120px" }} // khoảng 5-6 dòng, tùy font size
            >
              {description || "Chưa có mô tả chi tiết."}
            </div>
          </div>
        </div>

        {/* Phần giá và thông tin phụ */}
        <div>
          {/* Giá */}
          <div className="text-xl font-bold text-[#f96d01] mb-1!">
            {typeof price === "number" ? price.toLocaleString("vi-VN") : price}{" "}
            VND
          </div>
          <div className="text-xs text-gray-500 mb-2!">
            Chưa bao gồm thuế và phí
          </div>

          {/* Độ khớp tìm kiếm */}
          <div className="text-xs text-gray-400">
            Độ khớp tìm kiếm: {score.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccomItem;
