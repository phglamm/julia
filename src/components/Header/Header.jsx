import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { route } from "../../router";
import { useNavigate } from "react-router-dom";
import { Search, X, Menu, ShoppingCart, User, LogOut } from "lucide-react";
import logo from "../../assets/logo.png";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/userStore";
import { useCartStore } from "../../stores/cartStore";
const navigationItems = [
  { name: "Trang Chủ", href: route.home },
  { name: "Sản Phẩm", href: route.bst },
  { name: "Dịch Vụ", href: route.service },
  { name: "Chính Sách", href: route.policy },
  { name: "Về Chúng Tôi", href: route.aboutUs },
];

const Header = ({ scrolled }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const clearCart = useCartStore((state) => state.clearCart);
  console.log("Header user:", user);
  const countCart = useCartStore((state) => state.getItemCount());

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#723F53]/95 shadow-2xl backdrop-blur-md border-b border-[#D97BA8]/20"
          : "bg-gradient-to-r from-[#723F53] via-[#7a5461] to-[#8B6B7A] shadow-lg"
      }`}
    >
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(route.home)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="The Caprieux"
                className="h-12 w-12 lg:h-14 lg:w-14 object-contain transition-transform duration-300 group-hover:rotate-6"
              />
              <div className="absolute inset-0 bg-[#D97BA8]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#FFFFFF] text-2xl lg:text-3xl font-bold tracking-wider uppercase">
                The Caprieux
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              {navigationItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className="relative px-4 py-2 text-[#FFFFFF] text-sm font-medium transition-colors duration-300 hover:text-[#D97BA8] group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#D97BA8] to-transparent group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>

            {/* Action Icons Group */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#D97BA8]/30">
              {/* Search Bar */}
              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = (query || "").trim();
                  if (trimmed) {
                    navigate(
                      `${route.bst}?searchTerm=${encodeURIComponent(trimmed)}`,
                    );
                  } else {
                    navigate(route.bst);
                  }
                }}
                onMouseEnter={() => setIsSearchExpanded(true)}
                onMouseLeave={() => {
                  if (!query) setIsSearchExpanded(false);
                }}
                onFocus={() => setIsSearchExpanded(true)}
                className="relative overflow-hidden"
                aria-label="site search"
              >
                <motion.div
                  animate={{
                    width: isSearchExpanded ? "280px" : "48px",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative h-12"
                >
                  <motion.div
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                    animate={{
                      left: isSearchExpanded ? "16px" : "12px",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Search
                      className={`w-5 h-5 ${
                        isSearchExpanded ? "text-[#723F53]" : "text-[#FFFFFF]"
                      }`}
                    />
                  </motion.div>
                  <motion.input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full h-full pl-12 pr-4 rounded-full bg-[#FAE8F0] text-[#723F53] placeholder-[#8B6B7A]/60 focus:outline-none focus:ring-2 focus:ring-[#D97BA8] shadow-lg text-sm"
                    animate={{
                      opacity: isSearchExpanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  {!isSearchExpanded && (
                    <div className="absolute inset-0 rounded-full bg-transparent" />
                  )}
                </motion.div>
              </motion.form>

              {/* Cart Icon */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 rounded-full bg-gradient-to-br from-[#D97BA8]/20 to-[#D97BA8]/10 backdrop-blur-sm border border-[#D97BA8]/40 text-[#FFFFFF] hover:bg-[#D97BA8]/30 hover:border-[#D97BA8] hover:text-white transition-all duration-300 shadow-lg"
                aria-label="Shopping cart"
                onClick={() => navigate(route.cart)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D97BA8] text-[#723F53] text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  {countCart}
                </span>
              </motion.button>

              {/* Login Icon */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className=" flex p-3 rounded-full bg-gradient-to-br from-[#D97BA8]/20 to-[#D97BA8]/10 backdrop-blur-sm border border-[#D97BA8]/40 text-[#FFFFFF] hover:bg-[#D97BA8]/30 hover:border-[#D97BA8] hover:text-white transition-all duration-300 shadow-lg"
                aria-label="User account"
                onClick={() => {
                  if (user) {
                    return;
                  } else {
                    navigate(route.login);
                  }
                }}
              >
                <User className="w-5 h-5" />
                {user ? (
                  <span className="ml-2 text-sm font-medium">
                    {user.username}
                  </span>
                ) : (
                  <span className="ml-2 text-sm font-medium">Đăng Nhập</span>
                )}
              </motion.button>

              {/* Logout Icon - Only show when user is logged in */}
              {user && (
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-red-500/10 backdrop-blur-sm border border-red-500/40 text-[#FFFFFF] hover:bg-red-500/30 hover:border-red-500 hover:text-white transition-all duration-300 shadow-lg"
                  aria-label="Logout"
                  onClick={() => {
                    logout();
                    clearCart();
                    toast.success("Đăng xuất thành công");
                    navigate(route.home);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Cart Icon */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-[#D97BA8]/30 text-[#FFFFFF] hover:bg-white/20 hover:border-[#D97BA8]/60 transition-all duration-300"
              aria-label="Shopping cart"
              onClick={() =>
                user
                  ? navigate(route.cart)
                  : toast.error("Vui lòng đăng nhập để xem giỏ hàng")
              }
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D97BA8] text-[#723F53] text-[10px] font-bold rounded-full flex items-center justify-center">
                {countCart}
              </span>
            </motion.button>

            {/* Mobile Login Icon */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-[#D97BA8]/30 text-[#FFFFFF] hover:bg-white/20 hover:border-[#D97BA8]/60 transition-all duration-300"
              aria-label="User account"
              onClick={() => {
                if (!user) {
                  navigate(route.login);
                }
              }}
            >
              <User className="w-5 h-5" />
            </motion.button>

            {/* Mobile Logout Icon */}
            {user && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-lg bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-[#FFFFFF] hover:bg-red-500/20 hover:border-red-500/60 transition-all duration-300"
                aria-label="Logout"
                onClick={() => {
                  logout();
                  toast.success("Đăng xuất thành công");
                  navigate(route.home);
                }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-[#D97BA8]/30 text-[#FFFFFF] hover:bg-white/20 hover:border-[#D97BA8]/60 transition-all duration-300"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-[#723F53] to-[#5a2d3a] shadow-2xl"
            >
              {/* Close Button */}
              <div className="flex justify-between items-center p-6 border-b border-[#D97BA8]/20">
                <span className="text-[#D97BA8] text-lg font-semibold tracking-wider">
                  MENU
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full bg-white/10 text-[#FFFFFF] hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-6 border-b border-[#D97BA8]/20">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const trimmed = (query || "").trim();
                    if (trimmed) {
                      navigate(
                        `${route.bst}?searchTerm=${encodeURIComponent(trimmed)}`,
                      );
                      setOpen(false);
                    } else {
                      navigate(route.bst);
                      setOpen(false);
                    }
                  }}
                  className="relative"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D97BA8]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-white backdrop-blur-sm border border-[#D97BA8]/30 text-[#723F53] placeholder-[#8B6B7A]/60 focus:outline-none focus:ring-2 focus:ring-[#D97BA8]/50 transition-all text-sm"
                  />
                </form>
              </div>

              {/* Navigation Links */}
              <nav className="p-6 space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block px-4 py-3 text-[#FFFFFF] text-lg font-medium rounded-lg hover:bg-white/10 hover:text-[#D97BA8] transition-all duration-300 border border-transparent hover:border-[#D97BA8]/30"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
