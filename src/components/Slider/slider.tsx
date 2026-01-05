import { useEffect, useRef, useState } from "react";

const IMAGES = [
  "https://ik.imagekit.io/tvlk/image/imageResource/2025/10/28/1761624765134-50ba7774e771378e25e59119fa8953ba.jpeg?tr=h-230,q-75,w-472",
  "https://ik.imagekit.io/tvlk/image/imageResource/2025/07/09/1752036510252-61e121867314d3e385fb91d0fb67c371.jpeg?tr=h-230,q-75,w-472",
  "https://ik.imagekit.io/tvlk/image/imageResource/2025/07/05/1751708958506-132cf418fce3ce80a12b4584b436acff.jpeg?tr=h-230,q-75,w-472",
  "https://ik.imagekit.io/tvlk/image/imageResource/2025/09/08/1757326785628-d3a65dbe61bad7b1e94f4790da81f7ba.jpeg?tr=h-230,q-75,w-472",
];

const Slider = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const SPEED = 70; // px/giây (tăng/giảm tuỳ bạn)

    // đảm bảo bắt đầu đúng điểm
    el.scrollLeft = 0;

    const tick = (t: number) => {
      if (!lastRef.current) lastRef.current = t;
      const dt = (t - lastRef.current) / 1000;
      lastRef.current = t;

      if (!paused) {
        const half = el.scrollWidth / 2; // vì render 2 bản giống nhau
        el.scrollLeft += SPEED * dt;

        // tới gần hết list 1 -> nhảy về đầu list 1 (mượt vì list 2 giống hệt)
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onResize = () => {
      // resize có thể làm scrollWidth thay đổi -> reset tránh lệch
      el.scrollLeft = 0;
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener("resize", onResize);
    };
  }, [paused]);

  // Render 2 lần để loop mượt
  const loopImages = [...IMAGES, ...IMAGES];

  return (
    <div
      id="slider"
      className="w-full h-[33vh] bg-linear-to-b from-sky-300 to-sky-600 overflow-hidden"
    >
      <div
        ref={trackRef}
        className={[
          "picture-wrapper h-full px-10 py-4",
          "flex gap-4 items-center",
          "overflow-x-auto overflow-y-hidden", // ✅ không kéo lên/xuống
          "whitespace-nowrap",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "touch-pan-x",
        ].join(" ")}
      >
        {loopImages.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt=""
            draggable={false}
            className="inline-block h-full max-h-[230px] object-contain select-none pointer-events-none"
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
