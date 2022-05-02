import loaderGif from "../assets/videos/256x256.gif";

const Loader = () => {
  return (
    <div id="loader" className="text-center">
      <img src={loaderGif} alt="Loading..." />
    </div>
  );
};

export default Loader;
