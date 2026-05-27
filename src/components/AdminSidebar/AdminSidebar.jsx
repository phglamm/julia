import { NavLink } from "react-router-dom";
import { Box, FileText, Settings, X, Tag } from "lucide-react";
import logo from "../../assets/logo.png";

const nav = [
  { name: "Sản phẩm", to: "/admin", icon: <Box className="w-5 h-5" /> },
  {
    name: "Danh mục",
    to: "/admin/categories",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    name: "Thương hiệu",
    to: "/admin/brands",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    name: "Đơn hàng",
    to: "/admin/orders",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: "Giảm giá thuê",
    to: "/admin/rental-rules",
    icon: <Tag className="w-5 h-5" />,
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
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-inverse/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 h-screen w-60 bg-admin-surface border-r border-admin-border z-50 flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-admin-border">
          <img
            src={logo}
            className="w-8 h-8 rounded-lg bg-admin-primary p-0.5"
            alt="Julia"
          />
          <div>
            <span className="font-bold text-admin-heading tracking-wider text-sm ">
              JULIA
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-admin-primary">
              Admin
            </span>
          </div>
        </div>

        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-between px-5 py-2.5 border-b border-admin-border">
          <span className="text-[10px] font-semibold text-admin-muted uppercase tracking-wider">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-admin-muted hover:text-admin-body hover:bg-admin-bg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold text-admin-muted uppercase tracking-widest">
            Menu chính
          </p>
          {nav.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={onClose}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-admin-primary/10 text-admin-primary"
                    : "text-admin-body hover:text-admin-primary hover:bg-admin-bg"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-admin-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-admin-bg cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-admin-primary/20 flex items-center justify-center">
              <span className="text-admin-primary text-xs font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-admin-heading truncate">Admin</p>
              <p className="text-[10px] text-admin-muted">Đang hoạt động</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 ring-2 ring-white"></span>
          </div>
        </div>
      </aside>
    </>
  );
}
