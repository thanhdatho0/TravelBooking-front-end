const BackBtn = () => {
  return (
    <div className="back-btn flex text-sky-600 w-full mx-auto items-center justify-center gap-2 hover:cursor-pointer my-8!">
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
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
      <button className="hover:cursor-pointer">Quay lại</button>
    </div>
  );
};

export default BackBtn;
