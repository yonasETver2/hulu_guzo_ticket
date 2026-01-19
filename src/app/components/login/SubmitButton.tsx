import { LABELS } from "@/tools/languages";

type Language = "en" | "am";

export function SubmitButton({
  sign,
  showOTP,
  isSignupOtp,
  loading,
  lang,
}: {
  sign: boolean;
  showOTP: boolean;
  isSignupOtp: boolean;
  loading: boolean;
  lang: string;
}) {
  const typedLang: Language = lang as Language;
  return (
    <button
      type="submit"
      disabled={loading}
      className="bg-[#5376f6] w-full border-0 rounded-md p-1 text-white cursor-pointer hover:bg-[#5376f6a0]"
    >
      {showOTP
        ? isSignupOtp
          ? loading
            ? lang === "en"
              ? "Signing up..."
              : "እየመዘገበ ነው..."
            : lang === "en"
            ? "Complete Signup"
            : "መመዝገብ አስቀጥል"
          : loading
          ? lang === "en"
            ? "Resetting..."
            : "እየቀየረ..."
          : lang === "en"
          ? "Reset Password"
          : "የይለፍ ቃል መቀየር"
        : sign
        ? loading
          ? lang === "en"
            ? "Logging in..."
            : "እየገባ ነው..."
          : LABELS.logIn[typedLang]
        : loading
        ? lang === "en"
          ? "Signing up..."
          : "እየመዘገበ ነው..."
        : LABELS.signUp[typedLang]}
    </button>
  );
}
