import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Package,
  User,
  Phone,
  MapPin,
  CreditCard,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import paymentService from "../../services/paymentService";
import { useCartStore } from "../../stores/cartStore";
import toast from "react-hot-toast";

export default function PaymentScreen() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/bst");
    }
  }, [cartItems, navigate]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const imgSrc = (link) => {
    if (!link) return "/images/placeholder.png";
    return link;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!formData.address.trim()) {
      errors.address = "Vui lòng nhập địa chỉ";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const requestBody = {
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        fullName: formData.fullName,
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      };
      console.log("Request Body:", requestBody);
      const response = await paymentService.processPayment(requestBody);

      if (response.data && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Không nhận được link thanh toán từ server");
      }
    } catch (err) {
      toast.error(
        "Có lỗi xảy ra khi tạo đơn hàng: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = getSubtotal();
  const shipping = subtotal > 500000 ? 0 : 30000;
  const deposit = subtotal * 0.3; // 30% deposit
  const total = subtotal + shipping;

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

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] to-[#EDD5E8]">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-[#723F53] via-[#8B6B7A] to-[#723F53] py-20 lg:py-28 text-center text-[#FFFFFF] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        {/* Floating sparkles */}
        <motion.div
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%]"
        >
          <Sparkles className="w-8 h-8 text-[#D97BA8] opacity-60" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-40 right-[15%]"
        >
          <Sparkles className="w-6 h-6 text-[#D97BA8] opacity-40" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/cart")}
            className="mb-6 inline-flex items-center gap-2 text-[#FFFFFF] hover:text-[#D97BA8] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-semibold">Quay lại giỏ hàng</span>
          </motion.button>

          <motion.h1
            variants={itemVariants}
            className="text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
          >
            Hoàn Tất Đơn Hàng
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg lg:text-xl opacity-95 leading-relaxed max-w-3xl mx-auto"
          >
            Vui lòng điền thông tin để hoàn tất đặt thuê
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="w-full bg-[#FFFFFF] py-16 lg:py-20 px-6 lg:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary - Cart Items */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-6">
                <div className="bg-gradient-to-br from-[#723F53] to-[#8B6B7A] p-6">
                  <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-[#D97BA8]" />
                    Đơn Hàng Của Bạn
                    <span className="ml-auto text-lg">
                      ({cartItems.length} sản phẩm)
                    </span>
                  </h2>
                </div>

                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {/* Cart Items List */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 p-4 bg-gradient-to-br from-[#FFFFFF] to-[#f9f3e8] rounded-2xl"
                      >
                        {/* Product Image */}
                        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#EDD5E8]">
                          <img
                            src={imgSrc(item.imageLink)}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-bold text-[#723F53] mb-1 line-clamp-2">
                              {item.title}
                            </h3>
                            {item.brand && (
                              <div className="inline-block bg-gradient-to-r from-[#723F53] to-[#8B6B7A] text-[#FFFFFF] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                                {item.brand}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[#8B6B7A] mb-2">
                            Size: {item.details?.sizes || "N/A"} •{" "}
                            {item.rentalDays} ngày
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#8B6B7A]">
                              SL: x{item.quantity}
                            </span>
                            <span className="text-lg font-bold text-[#D97BA8]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t-2 border-[#EDD5E8] pt-6 space-y-4">
                    <div className="flex justify-between items-center text-[#8B6B7A]">
                      <span className="font-semibold">Tạm tính</span>
                      <span className="text-xl font-bold text-[#723F53]">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[#8B6B7A]">
                      <span className="font-semibold">Phí vận chuyển</span>
                      <span className="text-lg font-semibold">
                        {shipping === 0 ? (
                          <span className="text-green-600">Miễn phí</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <p className="text-xs text-[#8B6B7A] italic">
                        Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                      </p>
                    )}

                    {/* <div className="flex justify-between items-center text-[#8B6B7A]">
                      <span className="font-semibold">Đặt cọc (30%)</span>
                      <span className="text-lg font-semibold text-orange-600">
                        {formatPrice(deposit)}
                      </span>
                    </div> */}

                    <div className="border-t-2 border-[#EDD5E8] pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-[#723F53]">
                          Tổng cộng
                        </span>
                        <span className="text-3xl font-bold text-[#D97BA8]">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#723F53] to-[#8B6B7A] p-6">
                  <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-[#D97BA8]" />
                    Thông Tin Khách Hàng
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-[#723F53] font-semibold mb-2">
                      <User className="w-5 h-5 text-[#D97BA8]" />
                      Họ và Tên
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        formErrors.fullName
                          ? "border-red-300 bg-red-50"
                          : "border-[#EDD5E8] bg-[#f9f3e8]"
                      } focus:outline-none focus:border-[#D97BA8] transition-colors text-[#723F53]`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="flex items-center gap-2 text-[#723F53] font-semibold mb-2">
                      <Phone className="w-5 h-5 text-[#D97BA8]" />
                      Số Điện Thoại
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="0912345678"
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        formErrors.phoneNumber
                          ? "border-red-300 bg-red-50"
                          : "border-[#EDD5E8] bg-[#f9f3e8]"
                      } focus:outline-none focus:border-[#D97BA8] transition-colors text-[#723F53]`}
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="flex items-center gap-2 text-[#723F53] font-semibold mb-2">
                      <MapPin className="w-5 h-5 text-[#D97BA8]" />
                      Địa Chỉ
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      rows="3"
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        formErrors.address
                          ? "border-red-300 bg-red-50"
                          : "border-[#EDD5E8] bg-[#f9f3e8]"
                      } focus:outline-none focus:border-[#D97BA8] transition-colors text-[#723F53] resize-none`}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="bg-gradient-to-br from-[#FFFFFF] to-[#f9f3e8] rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#D97BA8] shrink-0 mt-1" />
                      <div className="text-[#8B6B7A] text-sm leading-relaxed">
                        <p className="font-semibold mb-2">
                          Điều khoản thuê sản phẩm:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Thời gian thuê: 3 ngày</li>
                          <li>Cọc trước: 30% giá trị đơn hàng</li>
                          <li>Hoàn trả sản phẩm trong tình trạng ban đầu</li>
                          <li>Miễn phí vận chuyển cho đơn từ 500.000đ</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={!submitting ? { scale: 1.02 } : {}}
                    whileTap={!submitting ? { scale: 0.98 } : {}}
                    className={`w-full py-4 rounded-full ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#D97BA8] to-[#C94F89]"
                    } text-white text-xl font-bold shadow-xl flex items-center justify-center gap-2`}
                  >
                    {submitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6" />
                        {/* Thanh Toán {formatPrice(deposit)} */}
                        Thanh Toán
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-[#8B6B7A] text-sm">
                    Bạn sẽ được chuyển đến trang thanh toán an toàn
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
