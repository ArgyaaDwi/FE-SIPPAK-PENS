import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CardProps {
  icon: React.ReactNode;
  text: string;
  count: number | string;
  color: string;
  url: string;
  isDetail?: boolean; // Props baru dengan default true
}

const Card = ({
  icon,
  text,
  count,
  color,
  url,
  isDetail = true, // Default true
}: CardProps) => {
  return (
    <div className="flex items-center bg-white shadow-lg rounded-md overflow-hidden">
      <div className="h-full w-2" style={{ backgroundColor: color }}></div>
      <div className="p-4 flex flex-col ml-2 items-start justify-start w-full">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="mt-2 text-sm font-normal text-gray-600">{text}</h3>
        <p className="mt-2 text-2xl font-semibold text-black">{count}</p>

        {/* Hanya tampilkan jika isDetail = true */}
        {isDetail && (
          <Link href={url} className="mt-2">
            <div className="flex items-center space-x-1">
              <p className="text-sm font-normal text-blue-700 hover:underline">
                More Info
              </p>
              <ChevronRight size={15} className="text-blue-700" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Card;
