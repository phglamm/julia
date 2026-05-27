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
import { useUserStore } from "../../stores/userStore";
import toast from "react-hot-toast";

export default function PaymentScreen() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotalUpfront = useCartStore((state) => state.getTotalUpfront);
  const user = useUserStore((state) => state.user);

  const formatAddress = (addressObj) => {
    if (!addressObj || typeof addressObj === "string") return addressObj || "";
    const parts = [addressObj.street, addressObj.ward, addressObj.district, addressObj.city].filter(Boolean);
    return parts.join(", ");
  };

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

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.username || "",
        phoneNumber: user.phone || "",
        address: formatAddress(user.address),
      });
    }
  }, [user]);

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
          quantity: 1, // rentals are always 1
          rentalDays: item.rentalDays,
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

  const rentFee = getSubtotal(); // This is the rent fee (total of rentalPrice * quantity)
  const shipping = rentFee > 500000 ? 0 : 30000;
  const upfrontTotal = getTotalUpfront(); // This is the retail price of all items
  const total = upfrontTotal + shipping; // PayOS amount

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
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] to-[#F6F0E6]">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-[#C8B39A] via-[#C8B39A] to-[#C8B39A] py-20 lg:py-28 text-center text-[#FFFFFF] overflow-hidden">
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
          <Sparkles className="w-8 h-8 text-[#EFE3CE] opacity-60" />
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
          <Sparkles className="w-6 h-6 text-[#EFE3CE] opacity-40" />
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
            className="mb-6 inline-flex items-center gap-2 text-[#FFFFFF] hover:text-[#EFE3CE] transition-colors"
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
          <form onSubmit={handleSubmit}>
            {/* Terms (Full width at top) */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#FAF7F2] rounded-2xl p-6 border border-[#F6F0E6] shadow-md">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#EFE3CE] shrink-0 mt-1" />
                  <div className="text-[#C8B39A] text-sm leading-relaxed">
                    <p className="font-semibold mb-2 text-base text-[#C8B39A]">Điều khoản thuê sản phẩm:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Thời gian thuê phụ thuộc vào từng sản phẩm</li>
                      <li>Bạn cần thanh toán 100% giá trị sản phẩm như một khoản cọc</li>
                      <li>Sau khi trả đồ, chúng tôi sẽ hoàn lại: <br/> <b>Giá trị sản phẩm - Phí thuê</b></li>
                      <li>Miễn phí vận chuyển cho phí thuê trên 500.000đ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Form (Left) */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-6">
                  <div className="bg-gradient-to-br from-[#C8B39A] to-[#C8B39A] p-6">
                    <h2 className="text-2xl font-bold text-[#FFFFFF] flex items-center gap-2">
                      <User className="w-6 h-6 text-[#EFE3CE]" />
                      Thông Tin Khách Hàng
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="flex items-center gap-2 text-[#C8B39A] font-semibold mb-2">
                        Họ và Tên <span className="text-red-500">*</span>
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
                            : "border-[#F6F0E6] bg-[#FAF7F2]"
                        } focus:outline-none focus:border-[#EFE3CE] transition-colors text-[#C8B39A]`}
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="flex items-center gap-2 text-[#C8B39A] font-semibold mb-2">
                        Số Điện Thoại <span className="text-red-500">*</span>
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
                            : "border-[#F6F0E6] bg-[#FAF7F2]"
                        } focus:outline-none focus:border-[#EFE3CE] transition-colors text-[#C8B39A]`}
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="flex items-center gap-2 text-[#C8B39A] font-semibold mb-2">
                        Địa Chỉ <span className="text-red-500">*</span>
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
                            : "border-[#F6F0E6] bg-[#FAF7F2]"
                        } focus:outline-none focus:border-[#EFE3CE] transition-colors text-[#C8B39A] resize-none`}
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Order Summary (Right) */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-6">
                  <div className="bg-gradient-to-br from-[#C8B39A] to-[#C8B39A] p-6">
                    <h2 className="text-2xl font-bold text-[#FFFFFF] flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6 text-[#EFE3CE]" />
                      Đơn Hàng Của Bạn
                      <span className="ml-auto text-lg">
                        ({cartItems.length} sản phẩm)
                      </span>
                    </h2>
                  </div>

                  <div className="p-6 max-h-[400px] overflow-y-auto">
                    {/* Cart Items List */}
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-4 p-4 bg-gradient-to-br from-[#FFFFFF] to-[#FAF7F2] rounded-2xl border border-[#F6F0E6]/50"
                        >
                          {/* Product Image */}
                          <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#F6F0E6]">
                            <img
                              src={imgSrc(item.images?.[0] || item.imageLink)}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="text-md font-bold text-[#C8B39A] mb-1 line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#C8B39A] mb-1">
                              Size: {item.size || "N/A"} • {item.rentalDays} ngày
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-sm font-bold text-[#EFE3CE]">
                                Cọc: {formatPrice(item.depositAmount || 0)}
                              </span>
                              <span className="text-sm font-bold text-[#C8B39A]">
                                Thuê: {formatPrice(item.rentFee || (item.rentalPrice || item.price || 0) * item.rentalDays)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-6 border-t-2 border-[#F6F0E6] bg-[#F9F7F0]">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center text-[#C8B39A]">
                        <span className="font-semibold text-sm">Tổng phí thuê</span>
                        <span className="font-bold text-[#C8B39A]">
                          {formatPrice(rentFee)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[#C8B39A]">
                        <span className="font-semibold text-sm">Tổng giá trị sản phẩm (để thu cọc)</span>
                        <span className="font-bold text-[#C8B39A]">
                          {formatPrice(upfrontTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[#C8B39A]">
                        <span className="font-semibold text-sm">Phí vận chuyển</span>
                        <span className="font-bold">
                          {shipping === 0 ? (
                            <span className="text-green-600">Miễn phí</span>
                          ) : (
                            <span className="text-[#C8B39A]">{formatPrice(shipping)}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="border-t-2 border-[#F6F0E6]/50 pt-4 mb-6">
                      <div className="flex justify-between items-end">
                        <span className="text-xl font-bold text-[#C8B39A]">
                          Tổng thanh toán
                        </span>
                        <div className="text-right">
                          <span className="text-3xl font-black text-[#EFE3CE] leading-none">
                            {formatPrice(total)}
                          </span>
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
                          : "bg-gradient-to-r from-[#EFE3CE] to-[#C8B39A] shadow-lg"
                      } text-white text-xl font-bold flex items-center justify-center gap-2`}
                    >
                      {submitting ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-6 h-6" />
                          Thanh Toán Ngay
                        </>
                      )}
                    </motion.button>
                    
                    <p className="text-center text-[#C8B39A] text-xs mt-4">
                      Bạn sẽ được chuyển đến trang thanh toán an toàn PayOS
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}


