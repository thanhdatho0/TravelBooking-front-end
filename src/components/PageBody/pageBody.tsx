import { useMemo, useRef, useState } from "react";
import AccomListItems from "../AccomListItems/AccomListItems";
import SearchForm from "../SearchForm/searchForm";
import AccommodationGrid from "../Accommodation/AccommodationGrid";

type LogoItem = { name: string; src: string };

function SectionDivider() {
  return <div className="my-10 h-px w-full bg-slate-200" />;
}

function ArrowButton({
  onClick,
  side,
}: {
  onClick: () => void;
  side: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Prev" : "Next"}
      className={[
        "absolute top-1/2 -translate-y-1/2 z-10",
        "h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-slate-200",
        "shadow-md hover:bg-white transition",
        "flex items-center justify-center text-slate-700",
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
      ].join(" ")}
    >
      <span className="text-xl leading-none">
        {side === "left" ? "‹" : "›"}
      </span>
    </button>
  );
}

function LogoCarousel({ items }: { items: LogoItem[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <ArrowButton onClick={() => scrollByAmount("left")} side="left" />
      <ArrowButton onClick={() => scrollByAmount("right")} side="right" />

      <div
        ref={ref}
        className={[
          "overflow-x-auto scroll-smooth",
          "flex gap-6 items-center",
          "py-2 px-2",
          "[-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {items.map((x) => (
          <div
            key={x.name}
            className="shrink-0 w-[120px] h-[56px] flex items-center justify-center"
            title={x.name}
          >
            <img
              src={x.src}
              alt={x.name}
              className="max-h-[48px] max-w-[110px] object-contain opacity-90 hover:opacity-100 transition"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerBlock({
  title,
  desc,
  items,
}: {
  title: string;
  desc: string;
  items: LogoItem[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div className="md:col-span-4">
        <div className="text-xl font-extrabold text-slate-900">{title}</div>
        <div className="mt-2 text-sm text-slate-600 leading-relaxed">
          {desc}
        </div>
      </div>

      <div className="md:col-span-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <LogoCarousel items={items} />
        </div>
      </div>
    </div>
  );
}

function ReasonCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="h-14 w-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
        {icon}
      </div>
      <div className="mt-4 font-extrabold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</div>
    </div>
  );
}

function WhyTravelokaSection() {
  return (
    <div className="text-center">
      <div className="text-2xl font-extrabold text-slate-900">
        Tại sao nên đặt chỗ với Traveloka?
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
        <ReasonCard
          title="Giá rẻ mỗi ngày"
          desc="Nhiều ưu đãi dành riêng cho ứng dụng, giúp bạn dễ săn giá tốt."
          icon={
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M12 1a2 2 0 0 1 2 2v1.1a8 8 0 0 1 6 7.7v.2a8 8 0 0 1-8 8h-1a6 6 0 0 1-6-6v-1a8 8 0 0 1 7.7-8H10V3a2 2 0 0 1 2-2Zm0 5a6 6 0 0 0-6 6v1a4 4 0 0 0 4 4h1a6 6 0 0 0 6-6v-.2A6 6 0 0 0 12 6Z" />
            </svg>
          }
        />
        <ReasonCard
          title="Thanh toán linh hoạt"
          desc="Nhiều phương thức thanh toán an toàn, nhanh chóng và tiện lợi."
          icon={
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1H3V6Zm0 4h21v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8Zm4 6a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2H7Z" />
            </svg>
          }
        />
        <ReasonCard
          title="Hỗ trợ 24/7"
          desc="Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ mọi lúc."
          icon={
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M12 2a9 9 0 0 0-9 9v1a4 4 0 0 0 4 4h1v-6H6a1 1 0 0 1-1-1 7 7 0 1 1 14 0 1 1 0 0 1-1 1h-2v6h1a4 4 0 0 0 4-4v-1a9 9 0 0 0-9-9Z" />
            </svg>
          }
        />
        <ReasonCard
          title="Đánh giá thực"
          desc="Nhiều đánh giá từ khách đã ở giúp bạn chọn đúng nơi phù hợp."
          icon={
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-3.5 19.4c.6.2 1-.3 1-1v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C16.7 3.4 17.7 3.7 17.7 3.7c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.3.8 1 .8 2.1v3.1c0 .7.4 1.2 1 1A10 10 0 0 0 12 2Z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

function VietnamHotelIntro() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center text-2xl font-extrabold text-slate-900">
        Đặt phòng khách sạn tại Việt Nam trên Traveloka
      </div>

      <div
        className={[
          "mx-auto mt-4 text-sm text-slate-600 leading-relaxed",
          "max-w-4xl",
          open ? "" : "line-clamp-4",
        ].join(" ")}
      >
        Traveloka là một trong những nền tảng du lịch trực tuyến phổ biến, cung
        cấp nhiều lựa chọn lưu trú và tiện ích giúp bạn lên kế hoạch chuyến đi
        thuận tiện. Bạn có thể tìm kiếm khách sạn theo khu vực, mức giá, đánh
        giá, và nhiều bộ lọc khác. Ngoài ra còn có các tính năng hỗ trợ thanh
        toán linh hoạt và chăm sóc khách hàng 24/7 để bạn yên tâm hơn khi đặt
        phòng.
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 mx-auto block text-sky-700 font-bold hover:text-sky-800"
      >
        {open ? "Thu gọn" : "Xem thêm"}
      </button>
    </div>
  );
}

const PageBody = () => {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchResults = (results: any[]) => {
    setAccommodations(results);
    setLoading(false);
  };

  const handleSearchStart = () => {
    setLoading(true);
    setAccommodations([]);
  };

  const showStrip = !loading && accommodations.length === 0;

  // Bạn thay logo bằng file của bạn (public/...) hoặc url thật
  const hotelPartners: LogoItem[] = useMemo(
    () => [
      {
        name: "Accor",
        src: "https://tse3.mm.bing.net/th/id/OIP.G48vORLPwhEPKpfDL6wGAQHaGa?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "Marriott",
        src: "https://dokumfe7mps0i.cloudfront.net/oms/7527/image/2025/11/YH9HK_MarriottHotelsLogo/MarriottHotelsLogo.jpg",
      },
      {
        name: "Minor",
        src: "https://th.bing.com/th/id/R.d3a6ee276c121a3d47379e536a5eec03?rik=FjDvbo313TiR2Q&pid=ImgRaw&r=0",
      },
      {
        name: "Fusion",
        src: "https://tse3.mm.bing.net/th/id/OIP.mWlMALTVs5ysGUXOczwglgHaB4?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "Mường Thanh",
        src: "https://tse4.mm.bing.net/th/id/OIP.EspRhe2DD04pdHal5ABVpgHaD5?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "OYO",
        src: "https://static.vecteezy.com/system/resources/previews/022/100/821/non_2x/oyo-logo-transparent-free-png.png",
      },
      {
        name: "IHG",
        src: "https://tse2.mm.bing.net/th/id/OIP.bBAD5kh2DXQoYNj6bVRcigAAAA?w=240&h=240&rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "Hilton",
        src: "https://logos-world.net/wp-content/uploads/2021/02/Hilton-Logo.png",
      },
    ],
    []
  );

  const paymentPartners: LogoItem[] = useMemo(
    () => [
      {
        name: "Mastercard",
        src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      },
      {
        name: "JCB",
        src: "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg",
      },
      {
        name: "VISA",
        src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
      },
      {
        name: "MoMo",
        src: "https://developers.momo.vn/v3/assets/images/icon-52bd5808cecdb1970e1aeec3c31a3ee1.png",
      },
      {
        name: "Vietcombank",
        src: "https://tse4.mm.bing.net/th/id/OIP.r1fEE75vwals6IQhm1-tsgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "Techcombank",
        src: "https://tse2.mm.bing.net/th/id/OIP.LW3SIkXeaXYjuylApLYACwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "MB",
        src: "https://inkythuatso.com/uploads/images/2021/11/mb-bank-logo-inkythuatso-01-10-09-01-10.jpg",
      },
    ],
    []
  );

  return (
    // Sửa wrapper: căn giữa + không dùng mx-auto! sai cú pháp
    <div className="w-full max-w-7xl mx-auto px-4">
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

      {/* Thêm các mục để trang đỡ trống */}
      {showStrip ? (
        <>
          <SectionDivider />

          <PartnerBlock
            title="Đối tác khách sạn"
            desc="Đối tác khách sạn trong nước & quốc tế. Chúng tôi hợp tác với nhiều chuỗi uy tín để mang đến chỗ ở thoải mái và đáng tin cậy."
            items={hotelPartners}
          />

          <SectionDivider />

          <PartnerBlock
            title="Đối tác thanh toán"
            desc="Hợp tác với các nhà cung cấp thanh toán hàng đầu để đảm bảo giao dịch suôn sẻ, an toàn và dễ dàng."
            items={paymentPartners}
          />

          <SectionDivider />

          <WhyTravelokaSection />

          <SectionDivider />

          <VietnamHotelIntro />

          <SectionDivider />
        </>
      ) : null}

      {/* Sửa py-10! sai cú pháp */}
      <div className="py-10"></div>

      <AccomListItems items={accommodations} isLoading={loading} />
      <div className="w-full h-[1px]"></div>
    </div>
  );
};

export default PageBody;
