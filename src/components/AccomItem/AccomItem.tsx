interface AccomItemProps {
  name?: string;
  price?: number | string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  starCount?: number; // 3,4,5 sao
  description?: string;
}

const AccomItem = ({
  name = "Tên khách sạn",
  price = "303.030",
  rating = 8.6,
  reviewCount = 304,
  image,
  starCount = 5,
  description = "",
}: AccomItemProps) => {
  const stars = Array(starCount).fill(0);
  return (
    <div className="group shadow-md w-full rounded-md pb-5! bg-white overflow-hidden cursor-pointer transition-transform hover:-translate-y-1">
      <div className="relative">
        <div className="relative items-image">
          <img
            src={
              image ||
              "https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20031457-da81191557ce8f90958fb16348c3445c.png?_src=imagekit&tr=c-at_max,f-jpg,fo-auto,h-332,pr-true,q-80,w-480"
            }
            alt={name}
            className="rounded-t-md"
          />
          <div className="absolute inset-0 bg-black/40 text-white p-3! opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-md flex flex-col justify-center items-center">
            <h4 className="text-sky-400 font-bold text-sm mb-2! border-b border-gray-500 pb-1! w-full text-center">
              Thông tin
            </h4>

            {/* Vẫn giữ class scrollbar xịn xò */}
            <div className="w-full h-full overflow-y-auto text-xs leading-relaxed text-justify custom-scrollbar px-2!">
              {description || "Chưa có mô tả chi tiết."}
            </div>
          </div>
        </div>
        <div className="px-3! py-3!">
          <h3 className="font-semibold my-1! capitalize">{name}</h3>
          <div className="flex my-1!">
            {stars.map((_, index) => (
              <i key={index} className="fa-solid fa-star text-yellow-300"></i>
            ))}
          </div>
          <div className="my-1!">
            <i className="fa-solid fa-dove text-sky-600"></i>
            <span className="text-sky-600 mr-1!">{rating}/10</span>
            <span>({reviewCount})</span>
          </div>
          <div>
            <span className="text-[#f96d01]">
              {typeof price === "number"
                ? price.toLocaleString("vi-VN")
                : price}{" "}
              VND
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-xs">
              Chưa bao gồm thuế và phí
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccomItem;
