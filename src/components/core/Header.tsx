// "use client";
// import { useState, useEffect } from "react";
// import ModalUser from "../ModalUser";
// import Image from "next/image";

// interface UserType {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string;
//   role: string;
// }

// interface HeaderProps {
//   user: UserType | null;
// }

// const Header = ({ user }: HeaderProps) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentDate, setCurrentDate] = useState<string>("");

//   useEffect(() => {
//     const now = new Date();
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       timeZone: "Asia/Jakarta",
//     };
//     setCurrentDate(now.toLocaleDateString("id-ID", options));
//   }, []);

//   const handleAvatarClick = () => {
//     setIsModalOpen((prev) => !prev);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   if (!user) {
//     return (
//       <header className="flex justify-between items-center bg-white shadow-md p-4 relative">
//         <div className="text-gray-700 font-medium">
//           {currentDate || "Memuat tanggal..."}
//         </div>
//         <div className="flex items-center gap-2 relative">
//           <span className="hidden md:block text-gray-800 font-normal">
//             Argya Dwi
//           </span>
//           <div className="relative">
//             <Image
//               src={"/assets/images/user_img.png"}
//               alt="User Avatar"
//               width={32}
//               height={32}
//               className="rounded-full cursor-pointer"
//               onClick={handleAvatarClick}
//             />
//             {isModalOpen && (
//               <ModalUser
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 user={{
//                   name: "Argya Dwi",
//                   email: "argyadwi@pens.ac.id",
//                   avatarUrl: "/assets/images/user_img.png",
//                   role: "Admin",
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="flex justify-between items-center bg-white shadow-md p-4 relative">
//       <div className="text-gray-700 font-medium">
//         {currentDate || "Memuat tanggal..."}
//       </div>
//       <div className="flex items-center gap-2 relative">
//         <span className="hidden md:block text-gray-800 font-normal">
//           {user.name}
//         </span>
//         <div className="relative">
//           <Image
//             src={user.avatarUrl || "/assets/images/user_img.png"}
//             alt="User Avatar"
//             width={32}
//             height={32}
//             className="rounded-full cursor-pointer"
//             onClick={handleAvatarClick}
//           />
//           {isModalOpen && (
//             <ModalUser
//               isOpen={isModalOpen}
//               onClose={handleCloseModal}
//               user={{
//                 name: user.name || "User Name",
//                 email: user.email,
//                 avatarUrl: user.avatarUrl || "/assets/images/user_img.png",
//                 role: user.role,
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
"use client";
import { useState, useEffect } from "react";
import ModalUser from "../fragment/ModalUser";
import Image from "next/image";
import { Menu } from "lucide-react";

interface UserType {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

interface HeaderProps {
  user: UserType | null;
  onMenuClick?: () => void;
}

const Header = ({ user, onMenuClick }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    };
    setCurrentDate(now.toLocaleDateString("id-ID", options));
  }, []);

  const handleAvatarClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <header className="flex justify-between items-center bg-white shadow-md p-4 relative">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
        >
          <Menu size={24} color="black" />
        </button>

        <div className="text-gray-700 font-medium text-sm md:text-base">
          {currentDate || "Memuat tanggal..."}
        </div>
        <div className="flex items-center gap-2 relative">
          <span className="hidden md:block text-gray-800 font-normal">
            Argya Dwi
          </span>
          <div className="relative">
            <Image
              src={"/assets/images/user_img.png"}
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full cursor-pointer"
              onClick={handleAvatarClick}
            />
            {isModalOpen && (
              <ModalUser
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                user={{
                  name: "Argya Dwi",
                  email: "argyadwi@pens.ac.id",
                  avatarUrl: "/assets/images/user_img.png",
                  role: "Admin",
                }}
              />
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center bg-white shadow-md p-4 relative">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
      >
        <Menu size={24} color="black" />
      </button>

      <div className="text-gray-700 font-medium text-sm md:text-base">
        {currentDate || "Memuat tanggal..."}
      </div>
      <div className="flex items-center gap-2 relative">
        <span className="hidden md:block text-gray-800 font-normal">
          {user.name}
        </span>
        <div className="relative">
          <Image
            src={user.avatarUrl || "/assets/images/user_img.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full cursor-pointer"
            onClick={handleAvatarClick}
          />
          {isModalOpen && (
            <ModalUser
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              user={{
                name: user.name || "User Name",
                email: user.email,
                avatarUrl: user.avatarUrl || "/assets/images/user_img.png",
                role: user.role,
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
