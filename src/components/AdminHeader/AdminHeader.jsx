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
    {
      id: 3,
      text: "Đánh giá mới từ khách hàng",
      time: "2 giờ trước",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo on Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <img
              src={logo}
              className="w-8 h-8 bg-black rounded-xl p-0.5 shadow-sm"
              alt="Julia"
            />
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-slate-800 font-mono tracking-wider">JULIA</h1>
            </div>
          </div>

          {/* Welcoming Title on Desktop */}
          <div className="hidden lg:flex flex-col">
            <h1 className="text-sm font-semibold text-slate-800">Xin chào, Admin! 👋</h1>
            <p className="text-[11px] text-slate-400">Chào mừng bạn quay trở lại trang quản trị.</p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-300 hover:scale-105"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white ring-2 ring-rose-500/20"></span>
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm">Thông báo</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 rounded-full">
                      2 Mới
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-slate-50/80 cursor-pointer transition-colors relative group ${
                          notif.unread ? "bg-slate-50/40" : ""
                        }`}
                      >
                        {notif.unread && (
                          <span className="absolute left-2 top-4 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                        )}
                        <p className={`text-xs text-slate-800 ${notif.unread ? "font-medium" : ""}`}>
                          {notif.text}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100">
                    <button className="w-full text-center py-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">Admin</span>
                <span className="text-[9px] text-slate-400">Chủ cửa hàng</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-300" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">
                      Julia Owner
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">admin@julia.com</p>
                  </div>
                  <div className="py-1.5 px-2 space-y-0.5">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                      <User className="w-4 h-4 text-slate-400" />
                      Hồ sơ của tôi
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                      <SettingsIcon className="w-4 h-4 text-slate-400" />
                      Cài đặt hệ thống
                    </button>
                  </div>
                  <div className="border-t border-slate-100 pt-1.5 px-2">
                    <button
                      onClick={() => {
                        logout();
                        clearCart();
                        navigate(route.home);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
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
