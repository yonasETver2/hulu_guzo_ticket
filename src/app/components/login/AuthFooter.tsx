import Image from "next/image";
import { LABELS } from "@/tools/languages";
import { signIn } from "next-auth/react";

type Language = "en" | "am";
type Theme = "light" | "dark";

interface AuthFooterProps {
  sign: boolean;
  isSignupOtp: boolean;
  showOTP: boolean;
  change_sign: () => void;
  sendOtp: () => void;
  theme: Theme;
  lang: Language;
}

export function AuthFooter({
  sign,
  isSignupOtp,
  showOTP,
  change_sign,
  sendOtp,
  theme,
  lang,
}: AuthFooterProps) {
  return (
    <>
      {(!sign || (!sign && isSignupOtp)) && (
        <button
          onClick={() => signIn("google")}
          className="flex justify-center items-center gap-2 w-full mt-3 bg-[#5376f6] font-bold cursor-pointer hover:bg-[#5376f6a0] p-1 rounded-md"
        >
          <Image
            src="/assets/icons/google_icon.png"
            alt="google"
            width={18}
            height={10}
            className="w-[16px] h-[16px]"
          />
          {LABELS.signUpGoogle[lang]}
        </button>
      )}

      {sign && !showOTP && (
        <p
          className={`flex justify-center italic text-md ${
            theme === "light" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {lang === "en" ? "Forgot your password?" : "የይለፍ ቃሎን ረሱ?"}
          <span
            className={`font-bold cursor-pointer ml-1 ${
              theme === "light"
                ? "text-[#7490f6] hover:text-[#7490f6ee]"
                : "text-[#6d82d0] hover:text-[#6d82d0ec]"
            }`}
            onClick={sendOtp}
          >
            {lang === "en" ? "Reset" : "ይቀይሩ"}
          </span>
        </p>
      )}

      <p className="text-center">
        {sign ? LABELS.notMember[lang] : LABELS.haveAccount[lang]}
        <span
          onClick={change_sign}
          className="text-[#5376f6] font-bold cursor-pointer hover:text-[#5376f6a0] ml-1"
        >
          {sign ? LABELS.signUpNow[lang] : LABELS.logIn[lang]}
        </span>
      </p>
    </>
  );
}
