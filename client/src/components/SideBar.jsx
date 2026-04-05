import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import userService from "../services/userService";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SideBar = ({ selectedUser, setSelectedUser, unreadCounts }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-x1 overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />

            <div
              className={`absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 ${menuOpen ? "block" : "hidden"}`}
            >
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="cursor-pointer text-sm"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filteredUsers.map((user) => (
          <div
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?.id === user.id && "bg-[#282142]/50"}`}
            key={user.id}
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="profilepic"
              className="w-8.75 aspect-square rounded-full"
            />
            <div className="flex flex-col leading-5">
              <div className="flex items-center gap-2">
                <p>{user.fullName}</p>
                {unreadCounts[user.id] > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {unreadCounts[user.id]}
                  </span>
                )}
              </div>
              <span className="text-green-400 text-xs">Online</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
