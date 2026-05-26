import { NavLink } from "react-router-dom";
import {
  Box,
  FileText,
  Settings,
  X,
  ChevronRight,
  Tag,
} from "lucide-react";
import logo from "../../assets/logo.png";

const nav = [
  {
    name: "Sản phẩm",
    to: "/admin",
    icon: <Box className="w-5 h-5" />,
  },
  {
    name: "Danh mục",
    to: "/admin/categories",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    name: "Đơn hàng",
    to: "/admin/orders",
    icon: <FileText className="w-5 h-5" />,
    badge: "5",
    badgeColor: "bg-rose-500",
  },
  {
    name: "Cài đặt",
    to: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <img
              src={logo}
              className="relative w-9 h-9 bg-black rounded-xl border border-slate-700 p-0.5"
              alt="Julia Logo"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white leading-tight tracking-wider font-mono">
              JULIA
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md w-fit mt-0.5">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Mobile Header Close Controls */}
        <div className="lg:hidden flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/20">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Điều hướng</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          <div className="mb-3 px-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Menu chính
            </p>
          </div>
          {nav.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => onClose()}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40 hover:translate-x-1.5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left Active Edge Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span>
                  )}

                  <div className="flex items-center gap-3 flex-1 relative z-10">
                    <span
                      className={`transition-all duration-300 ${
                        isActive
                          ? "scale-110 text-white"
                          : "text-slate-400 group-hover:text-indigo-400 group-hover:scale-105"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-semibold">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2 relative z-10">
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : `${item.badgeColor} text-white shadow-sm shadow-rose-500/20`
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive ? (
                      <ChevronRight className="w-4 h-4 text-white/80 animate-pulse" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-300" />
                    )}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/30 border border-slate-800/50">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                Admin Portal
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                Đang hoạt động
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

