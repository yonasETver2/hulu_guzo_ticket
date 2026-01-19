import { LABELS } from "@/tools/languages";

type Language = "en" | "am";

interface AuthHeaderProps {
  sign: boolean;
  lang: Language;
}
export function AuthHeader({ sign, lang }: AuthHeaderProps) {
  return (
    <p className="text-center font-bold text-xl">
      {sign ? LABELS.logIn[lang] : LABELS.signUp[lang]}
    </p>
  );
}
