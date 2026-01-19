// components/RouteHeader.tsx
import Image from "next/image";

interface RouteHeaderProps {
  status: any;
  destination: string;
}
export default function RouteHeader({ status, destination }: RouteHeaderProps) {
  return (
    <div className="text-center mt-2">
      <h1 className="text-md font-bold">
        {status.setting?.lang === "en" ? "Navigate" : "ምራኝ"} →{" "}
        {status.setting?.lang === "en" ? destination : "ጎንደር ከተማ"}
      </h1>

      <div className="flex justify-center items-center space-x-2 mt-1">
        <p>2{status.setting?.lang === "en" ? "h" : "ሰ"}</p>
        <Image src="/assets/icons/road.svg" alt="road" width={40} height={10} />
        <p>10{status.setting?.lang === "en" ? "km" : "ኪሜ"}</p>
      </div>
    </div>
  );
}
