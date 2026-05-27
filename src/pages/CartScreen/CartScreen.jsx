import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Package,
  Calendar,
  CreditCard,
  Gift,
  Tag,
  X,
} from "lucide-react";
import { useCartStore } from "../../stores/cartStore";
import { useNavigate } from "react-router-dom";
import { route } from "../../router";

// Mock cart data based on your product structure

const CartScreen = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal()); // Total Rent Fee
  const upfrontTotal = useCartStore((state) => state.getTotalUpfront()); // Total Deposit (Retail Price)

  console.log("Cart Items in CartScreen:", cartItems);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const discount = 0;
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = upfrontTotal - discount + shipping;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-background-alt py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-lg text-text-primary">
            {cartItems.length} sản phẩm đang chờ bạn
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-none shadow-md border border-background-alt/50 p-12 text-center"
          >
            <ShoppingBag className="w-24 h-24 text-text-secondary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Giỏ Hàng Trống
            </h2>
            <p className="text-text-primary mb-8">
              Hãy khám phá bộ sưu tập của chúng tôi và thêm sản phẩm yêu thích!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-secondary to-primary text-white px-8 py-4 rounded-none font-bold text-lg shadow-lg inline-flex items-center gap-2"
            >
              Khám Phá Ngay
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="lg:col-span-2 space-y-4"
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={`${item._id}-${index}`}
                  variants={itemVariants}
                  layout
                  className="relative bg-white rounded-none shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-6 p-5">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-background-alt shadow-inner">
                      <img
                        src={item.images?.[0] || item.imageLink}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.brand && (
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-text-primary px-2 py-1 rounded-md text-[10px] font-bold shadow-sm uppercase">
                          {typeof item.brand === "object"
                            ? item.brand?.name
                            : item.brand}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-center pr-8">
                      <h3 className="text-xl font-bold text-text-primary mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-primary mb-3 line-clamp-1 opacity-80">
                        {item.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-2 text-sm font-semibold text-text-primary mb-3">
                        <span className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-background-alt/50">
                          <Package className="w-4 h-4 text-text-secondary" />
                          Size: {item.size}
                        </span>
                        <span className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-background-alt/50">
                          <Calendar className="w-4 h-4 text-text-secondary" />
                          {item.rentalDays} ngày
                        </span>
                      </div>

                      <div className="mt-auto">
                        <p className="text-sm font-semibold text-text-primary">
                          Giá trị cọc:{" "}
                          <span className="font-bold text-text-secondary">
                            {formatPrice(item.depositAmount)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right side (Price & Actions) */}
                    <div className="flex flex-row items-center justify-between sm:justify-end sm:pl-6 sm:border-l border-background-alt/40 gap-6 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold text-text-primary whitespace-nowrap mb-1">
                          {formatPrice(
                            item.rentFee || item.rentalPrice * item.rentalDays,
                          )}
                        </p>
                        <p className="text-xs font-semibold text-text-primary uppercase tracking-wider bg-surface inline-block px-3 py-1 rounded-full">
                          Tổng phí thuê
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item._id)}
                        className="w-10 h-10 rounded-full bg-red-50 text-red-400 hover:text-white hover:bg-red-500 flex items-center justify-center transition-all shadow-sm shrink-0"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-none shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-text-secondary" />
                  Tổng Đơn Hàng
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b-2 border-secondary/20">
                  <div className="flex justify-between text-text-primary">
                    <span>Tổng phí thuê</span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-text-primary">
                    <span>Tổng giá trị sản phẩm</span>
                    <span className="font-semibold">
                      {formatPrice(upfrontTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-text-primary">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-text-primary italic">
                      Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-text-primary">
                    Tổng Cộng
                  </span>
                  <span className="text-3xl font-bold text-text-secondary">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(route.payment)}
                  className="w-full bg-gradient-to-r from-secondary to-primary text-white py-4 rounded-none font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  Thanh Toán Ngay
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-text-primary">
                  <div className="w-6 h-6 bg-green-100 rounded-none flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;


