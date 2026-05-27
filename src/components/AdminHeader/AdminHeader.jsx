import { useState } from "react";
import {
  Menu,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { route } from "../../router";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
import { useCartStore } from "../../stores/cartStore";
import logo from "../../assets/logo.png";

export default function AdminHeader({ onToggleSidebar }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const clearCart = useCartStore((state) => state.clearCart);

  const notifications = [
    { id: 1, text: "Đơn hàng mới #1234", time: "5 phút trước", unread: true },
    { id: 2, text: "Sản phẩm sắp hết hàng", time: "1 giờ trước", unread: true },
    { id: 3, text: "Đánh giá mới từ khách hàng", time: "2 giờ trước", unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <img src={logo} className="w-7 h-7 rounded-lg bg-black p-0.5" alt="Julia" />
            <span className="text-sm font-bold text-gray-800 font-mono tracking-wider hidden sm:block">
              JULIA
            </span>
          </div>

          {/* Desktop greeting */}
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-gray-800">
              Xin chào, Admin! 👋
            </h1>
            <p className="text-[11px] text-gray-400">
              Chào mừng bạn quay trở lại trang quản trị.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-11 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">Thông báo</h3>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-50 text-red-600 rounded">
                      2 Mới
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${
                          n.unread ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.unread && (
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                          )}
                          <div className={n.unread ? "" : "ml-3.5"}>
                            <p className={`text-xs text-gray-700 ${n.unread ? "font-medium" : ""}`}>
                              {n.text}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="w-full text-center py-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      Xem tất cả
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg hover:bg-gray-100"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="hidden md:block text-xs font-medium text-gray-700">
                Admin
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-800">Julia Owner</p>
                    <p className="text-[10px] text-gray-400 truncate">admin@julia.com</p>
                  </div>
                  <div className="py-1 px-1.5">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-400" />
                      Hồ sơ của tôi
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg">
                      <SettingsIcon className="w-4 h-4 text-gray-400" />
                      Cài đặt hệ thống
                    </button>
                  </div>
                  <div className="border-t border-gray-100 p-1.5">
                    <button
                      onClick={() => {
                        logout();
                        clearCart();
                        navigate(route.home);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

