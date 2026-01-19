import Image from "next/image";
import { LABELS } from "@/tools/languages";
type Language = "en" | "am";

interface AuthInputsProps {
  sign: boolean;
  showOTP?: boolean;
  isSignupOtp?: boolean;
  email: string;
  setEmail: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  inputTypeOne: string;
  inputTypeTwo: string;
  handelEyeOne: () => void;
  handelEyeTwo: () => void;
  passEyeOne: boolean;
  passEyeTwo: boolean;
  theme: "light" | "dark";
  lang: Language;
}

export function AuthInputs({
  sign,
  showOTP,
  isSignupOtp,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  inputTypeOne,
  inputTypeTwo,
  handelEyeOne,
  handelEyeTwo,
  passEyeOne,
  passEyeTwo,
  theme,
  lang,
}: AuthInputsProps) {
  return (
    <>
      {(sign || !sign || showOTP || isSignupOtp) && (
        <input
          className="block border border-gray-400 rounded-md w-full p-1"
          type="text"
          placeholder={sign ? LABELS.userName[lang] : LABELS.emailAdress[lang]}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      {(!sign || (!sign && isSignupOtp)) && (
        <input
          className="block border border-gray-400 rounded-md w-full p-1"
          type="text"
          placeholder={LABELS.userNameOnly[lang]}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}

      {(sign || !sign || showOTP || isSignupOtp) && (
        <div className="flex justify-between border border-gray-400 rounded-md pr-1 w-full">
          <input
            className="w-full p-1 mr-1"
            type={inputTypeOne}
            placeholder={LABELS.passWord[lang]}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Image
            onClick={handelEyeOne}
            className="cursor-pointer"
            src={
              !passEyeOne
                ? theme === "light"
                  ? "/assets/icons/eye_slash_fill.svg"
                  : "/assets/icons/eye_slash_fill_white.svg"
                : theme === "light"
                ? "/assets/icons/eye_fill.svg"
                : "/assets/icons/eye_fill_white.svg"
            }
            alt="eye"
            width={16}
            height={16}
          />
        </div>
      )}

      {(!sign || (!sign && isSignupOtp) || (sign && showOTP)) && (
        <div className="flex justify-between border border-gray-400 rounded-md w-full pr-1">
          <input
            className="w-full p-1 mr-1"
            type={inputTypeTwo}
            placeholder={LABELS.confirmPassWord[lang]}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Image
            onClick={handelEyeTwo}
            className="cursor-pointer"
            src={
              !passEyeTwo
                ? theme === "light"
                  ? "/assets/icons/eye_slash_fill.svg"
                  : "/assets/icons/eye_slash_fill_white.svg"
                : theme === "light"
                ? "/assets/icons/eye_fill.svg"
                : "/assets/icons/eye_fill_white.svg"
            }
            alt="eye"
            width={16}
            height={16}
          />
        </div>
      )}
    </>
  );
}
