import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginOrCreate = () => {
  return (
    <div className="w-[80%] mx-auto!">
      <form action="" className="my-2!">
        <label htmlFor="email" className="w-full text-sm">
          Địa chỉ email
        </label>
        <input
          type="text"
          name="email"
          placeholder="Ví dụ: yourname@email.com"
          className="w-full text-md outline border-gray-300 rounded-lg h-10 px-3! my-2! "
        />
      </form>
      <button className="text-white text-md font-semibold text-center w-full py-3.5! my-2! rounded-full bg-sky-600 shadow-md cursor-pointer hover:shadow-lg hover:bg-sky-500 transition-shadow">
        Tiếp tục
      </button>
      <div className="relative my-8!">
        <hr className="border-gray-300" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4! text-sm text-gray-500 font-medium">
          Hoặc
        </span>
      </div>
      <div className="flex items-center gap-4 justify-between my-4!">
        <div className="flex w-full justify-around items-center bg-white rounded-full border border-gray-200 shadow-md p-2! cursor-pointer hover:shadow-lg transition-shadow px-5!">
          <FontAwesomeIcon icon={faGoogle} className="border-r pr-2!" />
          <span>Google</span>
        </div>
        <div className="flex w-full justify-around items-center bg-white rounded-full border border-gray-200 shadow-md p-2! cursor-pointer hover:shadow-lg transition-shadow px-5!">
          <FontAwesomeIcon icon={faFacebook} className="border-r pr-2!" />
          <span>Facebook</span>
        </div>
      </div>

      <div className="my-8!">
        <p className="text-sm text-center">
          Bằng cách tiếp tục, bạn đồng ý với
          <a href="#" className="text-sky-600">
            Điều khoản và Điều kiện
          </a>{" "}
          này và bạn đã được thông báo về{" "}
          <a href="" className="text-sky-600">
            Chính sách bảo vệ dữ liệu
          </a>{" "}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
};

export default LoginOrCreate;
