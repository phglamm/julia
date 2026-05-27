// removed unused import 'motion' to satisfy linter
import {
  CheckCircle,
  Package,
  Home,
  Sparkles,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import paymentService from "./../../services/paymentService";
import { useCartStore } from "../../stores/cartStore";
import { motion } from "framer-motion";
export default function OrderSuccessScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const clearCart = useCartStore((state) => state.clearCart);
  useEffect(() => {
    // Get order details from URL params if available
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const orderCode = searchParams.get("orderCode");
    const cancel = searchParams.get("cancel");

    const postWebhook = async () => {
      try {
        const requestData = {
          orderCode,
          cancel,
        };
        console.log("Posting to webhook with data:", requestData);
        const response = await paymentService.postWebhook(requestData);
        console.log("Webhook posted successfully:", response.data);
        clearCart();
      } catch (error) {
        console.error("Error posting to webhook:", error);
      }
    };
    postWebhook();
    if (orderId || orderCode) {
      setOrderDetails({
        orderId: orderId || orderCode || "N/A",
        amount: amount || "N/A",
        orderCode: orderCode || orderId || "N/A",
      });
    }
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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
    <div className="min-h-screen bg-linear-to-br from-surface to-background-alt flex items-center justify-center p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl w-full"
      >
        {/* Success Icon with Animation */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-success/50 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-linear-to-br from-[#4ade80] to-[#22c55e] rounded-full p-6 shadow-2xl">
              <CheckCircle className="w-24 h-24 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Sparkles */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-[15%]"
        >
          <Sparkles className="w-8 h-8 text-muted opacity-60" />
        </motion.div>
        <motion.div
          animate={{
            y: [10, -10, 10],
            rotate: [360, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-32 right-[15%]"
        >
          <Sparkles className="w-6 h-6 text-muted opacity-40" />
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-surface rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-linear-to-br from-primary via-primary to-primary p-8 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            ></div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-bold text-white mb-3 relative z-10"
            >
              Đặt Hàng Thành Công!
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-white opacity-90 relative z-10"
            >
              Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Success Message */}
            <motion.div
              variants={itemVariants}
              className="bg-success-bg border-2 border-success/30 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-success rounded-full p-3 shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-success mb-2">
                    Thanh toán đã được xác nhận
                  </h3>
                  <p className="text-success leading-relaxed">
                    Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ với
                    bạn trong thời gian sớm nhất để xác nhận và giao hàng.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Order Details */}
            {orderDetails && (
              <motion.div
                variants={itemVariants}
                className="bg-linear-to-br from-surface to-surface rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-muted" />
                  Thông Tin Đơn Hàng
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-heading font-semibold">
                      Mã đơn hàng:
                    </span>
                    <span className="text-body font-bold text-lg">
                      {orderDetails.orderCode}
                    </span>
                  </div>
                  {orderDetails.amount && orderDetails.amount !== "N/A" && (
                    <div className="flex justify-between items-center">
                      <span className="text-body font-semibold">
                        Số tiền:
                      </span>
                      <span className="text-muted font-bold text-xl">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(orderDetails.amount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-body font-semibold">
                      Thời gian:
                    </span>
                    <span className="text-body font-medium">
                      {new Date().toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-muted" />
                Các Bước Tiếp Theo
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-surface rounded-xl p-4">
                  <div className="bg-secondary text-heading rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-body mb-1">
                      Xác nhận đơn hàng
                    </p>
                    <p className="text-body text-sm">
                      Chúng tôi sẽ gọi điện xác nhận trong vòng 24h
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-surface rounded-xl p-4">
                  <div className="bg-secondary text-body rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-body mb-1">
                      Chuẩn bị sản phẩm
                    </p>
                    <p className="text-body text-sm">
                      Sản phẩm sẽ được kiểm tra và đóng gói cẩn thận
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-surface rounded-xl p-4">
                  <div className="bg-secondary text-body rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-body mb-1">
                      Giao hàng
                    </p>
                    <p className="text-body text-sm">
                      Sản phẩm sẽ được giao đến địa chỉ của bạn trong 2-3 ngày
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-br from-primary to-primary rounded-2xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-muted" />
                Liên Hệ Hỗ Trợ
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted" />
                  <span>support@julia.vn</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted" />
                  <span>0123 456 789</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted" />
                  <span>Hồ Chí Minh, Việt Nam</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="flex-1 py-4 rounded-full bg-btn-primary hover:bg-btn-hover text-heading text-lg font-bold shadow-xl flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Về Trang Chủ
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/bst")}
                className="flex-1 py-4 rounded-full bg-surface border-2 border-secondary text-muted text-lg font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Xem Sản Phẩm Khác
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          variants={itemVariants}
          className="text-center text-body mt-6 text-sm"
        >
          Email xác nhận đã được gửi đến hộp thư của bạn
        </motion.p>
      </motion.div>
    </div>
  );
}


