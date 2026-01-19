export default function TripSearchButton({ status, handleSearchClick }) {
  return (
    <div className="flex justify-center sm:justify-start">
      <button
        onClick={handleSearchClick}
        className="mt-4 bg-[#5376f6] hover:bg-[#5376f6a0] px-7 text-white rounded-md cursor-pointer"
      >
        {status.setting?.lang === "en" ? "Search" : "ፈልግ"}
      </button>
    </div>
  );
}
