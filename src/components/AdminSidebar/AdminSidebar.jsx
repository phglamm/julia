import { NavLink } from "react-router-dom";
import { Box, FileText, Settings, X, Tag } from "lucide-react";
import logo from "../../assets/logo.png";

const nav = [
  { name: "Sản phẩm", to: "/admin", icon: <Box className="w-5 h-5" /> },
  { name: "Danh mục", to: "/admin/categories", icon: <Tag className="w-5 h-5" /> },
  { name: "Thương hiệu", to: "/admin/brands", icon: <Tag className="w-5 h-5" /> },
  { name: "Đơn hàng", to: "/admin/orders", icon: <FileText className="w-5 h-5" /> },
  { name: "Giảm giá thuê", to: "/admin/rental-rules", icon: <Tag className="w-5 h-5" /> },
  { name: "Cài đặt", to: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 h-screen w-60 bg-slate-900 z-50 flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800">
          <img
            src={logo}
            className="w-8 h-8 rounded-lg bg-black p-0.5"
            alt="Julia"
          />
          <div>
            <span className="font-bold text-white tracking-wider text-sm font-mono">
              JULIA
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              Admin
            </span>
          </div>
        </div>

        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-between px-5 py-2.5 border-b border-slate-800">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Menu chính
          </p>
          {nav.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={onClose}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Admin</p>
              <p className="text-[10px] text-slate-500">Đang hoạt động</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          </div>
        </div>
      </aside>
    </>
  );
}

