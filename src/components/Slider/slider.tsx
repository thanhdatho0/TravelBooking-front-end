const Slider = () => {
  return (
    <div
      id="slider"
      className="w-full h-[33vh] bg-linear-to-b from-sky-300 to-sky-600"
    >
      <div className="picture-wrapper flex gap-4 px-10 py-4 overflow-x-hidden h-full items-baseline justify-around pt-2!">
        <img
          src="https://ik.imagekit.io/tvlk/image/imageResource/2025/10/28/1761624765134-50ba7774e771378e25e59119fa8953ba.jpeg?tr=h-230,q-75,w-472"
          alt=""
        />
        <img
          src="https://ik.imagekit.io/tvlk/image/imageResource/2025/07/09/1752036510252-61e121867314d3e385fb91d0fb67c371.jpeg?tr=h-230,q-75,w-472"
          alt=""
        />
        <img
          src="https://ik.imagekit.io/tvlk/image/imageResource/2025/07/05/1751708958506-132cf418fce3ce80a12b4584b436acff.jpeg?tr=h-230,q-75,w-472"
          alt=""
        />
        <img
          src="https://ik.imagekit.io/tvlk/image/imageResource/2025/09/08/1757326785628-d3a65dbe61bad7b1e94f4790da81f7ba.jpeg?tr=h-230,q-75,w-472"
          alt=""
        />
      </div>
    </div>
  );
};

export default Slider;
