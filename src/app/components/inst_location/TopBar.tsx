// components/TopBar.tsx
import ActionButtons from "../commonComponent/TopActionBar/ActionButtons";

interface TopBarProps {
  status: any;
}

export default function TopBar({ status }: TopBarProps) {
  return (
    <div
      className={`fixed top-16 left-0 w-full p-4 shadow-md ${
        status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-700"
      } flex justify-between items-center z-30`}
    >
      <ActionButtons status={status} />
    </div>
  );
}
