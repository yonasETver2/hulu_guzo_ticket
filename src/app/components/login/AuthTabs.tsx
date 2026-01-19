import { LABELS } from "@/tools/languages";
type Language = "en" | "am";

interface AuthTabsProps {
  sign: boolean;
  lang: Language;
}

export function AuthTabs({ sign, lang }: AuthTabsProps) {
  return (
    <div className="flex w-full">
      <div
        className={`w-[50%] ${
          sign
            ? "bg-[#5376f6] text-white"
            : "bg-white text-black border-1 w-[53%]"
        } border-0 border-gray-400 rounded-md z-10 p-1`}
      >
        <p className="text-center text-xl">{LABELS.logIn[lang]}</p>
      </div>

      <p
        className={`border-1 border-gray-400 rounded-md -ml-2 p-1 text-center ${
          sign
            ? "bg-white w-[53%] text-black"
            : "bg-[#5376f6] text-white border-0 z-20 w-[50%]"
        }`}
      >
        {LABELS.signUp[lang]}
      </p>
    </div>
  );
}
