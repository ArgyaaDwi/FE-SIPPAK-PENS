import Image from "next/image";
import Link from "next/link";
interface ModalUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
  };
}
const ModalUser = ({ isOpen, onClose, user }: ModalUserProps) => {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout gagal");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <>
      <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg  w-64 z-50">
        <div className="flex items-center gap-2 p-4">
          <Image
            src={user.avatarUrl || "/assets/images/user_img.png"}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
          />
          <div>
            <p className="text-black font-semibold">
              {user.name || "User Name"}
            </p>
            <p className="text-gray-500 text-xs">
              {user.email || "User Email"}
            </p>
          </div>
        </div>
        <hr />
        <p className="text-gray-700 text-sm font-thin text-center mx-4 mt-2">
          {user.role || "User Role"}
        </p>
        <div className="flex flex-row gap-2 p-4">
          <Link
            href="/"
            className="w-full border border-blue-300 text-blue-300 px-3 py-1 rounded-md hover:text-white hover:bg-blue-600 transition-all duration-300 text-center block"
          >
            Beranda
          </Link>
          <button
            className="w-full bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-all duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      ></div>
    </>
  );
};

export default ModalUser;
