import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

const PageFooter = () => {
  const Collaborators = [
    "https://ik.imagekit.io/tvlk/image/imageResource/2019/05/20/1558339548088-c536c896b175cb38f99a31f5dd2a989a.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2019/05/20/1558339578215-99466ea3d377ada2939bf2117df21b11.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736478807774-cdbb79122765aebcf7d24eb57556413e.webp?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736478703439-b54413d6267a4f10ab1e47ab37f99c7f.webp?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407489503-73395581e922112a270b9a923438d404.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736479136374-812410948d351fd86936adcb7fbb3b3f.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736490350569-aa858f77723a5e65ad006a06d91dac83.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407562642-1767114a08ea40b3ef52dcdcb0358492.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407613272-e32d24a555a5029908b720993c87fa2e.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407622371-291315073f0e649f2e24519277b8f182.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407629268-d27076303abf84ab0da2f58864022f43.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407672024-f9e1112960f69a08824273672eeaccc2.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407693601-2156e3df924fbf685cf6af0073763b94.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407698432-309405f720b1d92d67072bfaedcd5f75.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736407704604-779d86d8202d1be33758ec0b9944e269.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736408367987-6b7c9eccbfb7683104f4e66ab0327dab.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736490355901-8daa12990ad492cc0c29f6a1c0fc351c.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736408552357-4d6650882134f3e9ca27950f481dae68.png?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/09/1736408606545-f76fc22054f17df71e270d4c6eecd488.jpeg?tr=h-19,q-75,w-57",
    "https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736483115847-7c6a9f9a9532db58007269382bc9d4bb.png?tr=h-19,q-75,w-57",
  ];
  return (
    <footer id="footer" className="w-full h-auto bg-[#1c2930]">
      <div className="flex items-center justify-center mt-10! mb-30! gap-35!">
        <div className="h-auto">
          <div>
            <img
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.6.0/a/ad89f39fe62c8b500e6f9a25fa4427d8.svg"
              alt=""
            />
          </div>
          <div className="flex gap-6 items-center">
            <img
              src="https://ik.imagekit.io/tvlk/image/imageResource/2017/12/13/1513150321127-5096be77d2a19401b476853e54ba2cc6.svg?tr=h-35,q-75"
              alt=""
            />
            <img
              src="https://ik.imagekit.io/tvlk/image/imageResource/2021/05/10/1620638808154-e6c02ed786235ab59252628a9aa9b715.png?tr=h-35,q-75"
              alt=""
            />
            <img
              src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/23/1569229181629-eeb038ad844874f951326d0a8534bf48.png?tr=q-75,w-100"
              alt=""
            />
          </div>
          <div className="bg-gray-500 rounded-[10px]! my-8!">
            <a
              href="#"
              className="text-center text-md text-white px-6! py-4! flex items-center justify-around"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <p>Hợp tác với Traveloka</p>
            </a>
          </div>
          <div>
            <p className="text-white font-semibold">Đối tác thanh toán</p>
            <div className="grid grid-cols-4 gap-2 my-4!">
              {Collaborators.map((collaborator, index) => (
                <div className="bg-white rounded-md">
                  <img
                    key={index}
                    src={collaborator}
                    alt={`Collaborator ${index + 1}`}
                    className="px-2! py-4!"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="mb-10!">
              <h4 className="text-white font-semibold">Về Traveloka</h4>
              <div className="text-gray-300 flex flex-col gap-2 py-2! text-md">
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Cách đặt chỗ
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Liên hệ chúng tôi
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Trợ giúp
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Tuyển dụng
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Về chúng tôi
                </a>
              </div>
            </div>

            <div className="">
              <h4 className="text-white font-semibold">
                Theo dõi chúng tôi trên
              </h4>
              <div className="text-white  flex flex-col gap-2 py-2!">
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                  <span>Facebook</span>
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                  <span>Instagram</span>
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faTiktok} />
                  <span>Tiktok</span>
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                  <span>Youtube</span>
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faTelegram} />
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>

          <div className="">
            <h4 className="text-white font-semibold">Sản phẩm</h4>
            <div className="text-gray-300 flex flex-col gap-2 py-2!">
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Khách sạn
              </a>
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Vé máy bay
              </a>
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Vé xe khách
              </a>
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Đưa đón sân bay
              </a>
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Cho thuê xe
              </a>
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Hoạt động & Giải trí
              </a>
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Du thuyền
              </a>
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Biệt thự
              </a>
              <a
                href="#"
                className="opacity-65 hover:opacity-100 hover:underline"
              >
                Căn hộ
              </a>
            </div>
          </div>

          <div>
            <div className="mb-10!">
              <h4 className="text-white font-semibold">Khác</h4>
              <div className="text-gray-300 flex flex-col gap-2 py-2! max-w-70">
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Traveloka Affiliate
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Giới thiệu bạn bè
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Traveloka Blog
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Chính Sách Quyền Riêng
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Điều khoản & Điều kiện
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Đăng ký nơi nghỉ của bạn
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Đăng ký doanh nghiệp hoạt động du lịch của bạn
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Khu vực báo chí
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Quy chế hoạt động
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  Vulnerability Disclosure Program
                </a>
                <a
                  href="#"
                  className="opacity-65 hover:opacity-100 hover:underline"
                >
                  APAC Travel Insights
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold">
                Tải ứng dụng Traveloka
              </h4>
              <div className="text-gray-300 flex flex-col gap-2 py-2!">
                <a href="">
                  <img
                    src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.6.0/f/f519939e72eccefffb6998f1397901b7.svg"
                    alt=""
                  />
                </a>
                <a href="">
                  <img
                    src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.6.0/1/18339f1ae28fb0c49075916d11b98829.svg"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="text-white opacity-40" />
      <div className="my-4!">
        <p className="text-center text-white pb-4! text-sm opacity-65">
          Công ty TNHH Traveloka Việt Nam. Mã số DN: 0313581779. Tòa nhà An Phú,
          117-119 Lý Chính Thắng, Phường Xuân Hòa, TP.HCM
        </p>
        <p className="text-center text-white p-10">
          Copyright © 2025 Traveloka. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
