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
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  console.log("Cart Items in CartScreen:", cartItems);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 0;
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

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
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] to-[#EDD5E8] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-[#723F53] mb-4">
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-lg text-[#8B6B7A]">
            {cartItems.length} sản phẩm đang chờ bạn
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <ShoppingBag className="w-24 h-24 text-[#D97BA8] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#723F53] mb-4">
              Giỏ Hàng Trống
            </h2>
            <p className="text-[#8B6B7A] mb-8">
              Hãy khám phá bộ sưu tập của chúng tôi và thêm sản phẩm yêu thích!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#D97BA8] to-[#C94F89] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg inline-flex items-center gap-2"
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
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  layout
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-6 p-6">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#EDD5E8]">
                      <img
                        src={item.imageLink}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.brand && (
                        <div className="absolute top-2 right-2 bg-[#723F53]/80 backdrop-blur-sm text-[#FFFFFF] px-2 py-1 rounded-full text-xs font-semibold">
                          {item.brand}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#723F53] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#8B6B7A] mb-3 line-clamp-2">
                          {item.shortDescription}
                        </p>
                        <div className="flex gap-4 text-sm text-[#8B6B7A] mb-4">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            Size: {item.size}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {item.rentalDays} ngày
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => decrementQuantity(item._id)}
                            className="w-8 h-8 rounded-full bg-[#FFFFFF] border-2 border-[#D97BA8] text-[#723F53] flex items-center justify-center hover:bg-[#D97BA8] hover:text-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="text-lg font-bold text-[#723F53] min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => incrementQuantity(item._id)}
                            className="w-8 h-8 rounded-full bg-[#FFFFFF] border-2 border-[#D97BA8] text-[#723F53] flex items-center justify-center hover:bg-[#D97BA8] hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#D97BA8]">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-xs text-[#8B6B7A]">
                              {formatPrice(item.price)} / {item.rentalDays} ngày
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item._id)}
                            className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
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
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-[#723F53] mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-[#D97BA8]" />
                  Tổng Đơn Hàng
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b-2 border-[#D97BA8]/20">
                  <div className="flex justify-between text-[#8B6B7A]">
                    <span>Tạm tính</span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#8B6B7A]">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[#8B6B7A] italic">
                      Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-[#723F53]">
                    Tổng Cộng
                  </span>
                  <span className="text-3xl font-bold text-[#D97BA8]">
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
                  className="w-full bg-gradient-to-r from-[#D97BA8] to-[#C94F89] text-white py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  Thanh Toán Ngay
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#8B6B7A]">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
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
