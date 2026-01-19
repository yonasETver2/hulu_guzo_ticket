interface Props {
  tripType: string;
  handleClickInfo: () => void;
  status: any;
}

const ResultHeaderAction = ({ tripType, handleClickInfo, status }: Props) => {
  return (
    <div className="flex justify-end">
      <button
        onClick={handleClickInfo}
        className="px-2 bg-[#5376f6] text-white py-1 rounded-md font-semibold cursor-pointer mx-2 my-1 text-[13px] md:text-[16px]"
      >
        {tripType === "one-way"
          ? status.setting.lang === "en"
            ? "Continue with Selected Trip"
            : "በተመረጠው ጉዞ ይቀጥሉ"
          : status.setting.lang === "en"
          ? "Continue with Round Trip"
          : "በደርሶ መልስ ጉዞ ይቀጥሉ"}
      </button>
    </div>
  );
};

export default ResultHeaderAction;
