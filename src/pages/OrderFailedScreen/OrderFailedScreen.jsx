import { motion } from "framer-motion";
import {
  XCircle,
  RefreshCw,
  Home,
  Sparkles,
  Phone,
  Mail,
  AlertTriangle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import paymentService from "../../services/paymentService";

export default function OrderFailedScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    // Get error details from URL params if available
    const errorCode = searchParams.get("errorCode");
    const errorMessage = searchParams.get("message");
    const orderId = searchParams.get("orderId");
    const orderCode = searchParams.get("orderCode");
    const cancel = searchParams.get("cancel");
    const postWebhook = async () => {
      try {
        const requestData = {
          cancel,
          orderCode,
        };
        console.log("Posting to webhook with data:", requestData);

        const response = await paymentService.postWebhook(requestData);
        console.log("Webhook posted successfully:", response.data);
      } catch (error) {
        console.error("Error posting to webhook:", error);
      }
    };
    postWebhook();
    if (errorCode || errorMessage) {
      setErrorDetails({
        errorCode: errorCode || "PAYMENT_FAILED",
        message: errorMessage || "Thanh toán không thành công",
        orderId: orderId,
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

  const commonReasons = [
    {
      icon: CreditCard,
      title: "Số dư không đủ",
      description: "Tài khoản của bạn không đủ số dư để thực hiện giao dịch",
    },
    {
      icon: AlertTriangle,
      title: "Thông tin không hợp lệ",
      description: "Thông tin thẻ hoặc tài khoản không chính xác",
    },
    {
      icon: XCircle,
      title: "Giao dịch bị từ chối",
      description: "Ngân hàng hoặc ví điện tử đã từ chối giao dịch",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#F6F0E6] flex items-center justify-center p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl w-full"
      >
        {/* Error Icon with Animation */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
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
            <div className="absolute inset-0 bg-[#ef4444] rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-linear-to-br from-[#ef4444] to-[#dc2626] rounded-full p-6 shadow-2xl">
              <XCircle className="w-24 h-24 text-white" strokeWidth={2.5} />
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
          <Sparkles className="w-8 h-8 text-[#ef4444] opacity-40" />
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
          <Sparkles className="w-6 h-6 text-[#ef4444] opacity-30" />
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-linear-to-br from-[#C8B39A] via-[#C8B39A] to-[#C8B39A] p-8 text-center relative overflow-hidden">
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
              className="text-4xl lg:text-5xl font-bold text-[#FFFFFF] mb-3 relative z-10"
            >
              Thanh Toán Thất Bại
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-[#FFFFFF] opacity-90 relative z-10"
            >
              Đơn hàng của bạn chưa được hoàn tất
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Error Message */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-br from-[#fef2f2] to-[#fee2e2] border-2 border-[#fca5a5] rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-[#ef4444] rounded-full p-3 shrink-0">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#991b1b] mb-2">
                    {errorDetails?.message || "Giao dịch không thành công"}
                  </h3>
                  <p className="text-[#b91c1c] leading-relaxed">
                    Rất tiếc, thanh toán của bạn không được xử lý thành công.
                    Vui lòng kiểm tra lại thông tin và thử lại.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Error Details */}
            {errorDetails && (
              <motion.div
                variants={itemVariants}
                className="bg-linear-to-br from-[#FFFFFF] to-[#FAF7F2] rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-[#C8B39A] mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-[#EFE3CE]" />
                  Chi Tiết Lỗi
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#C8B39A] font-semibold">
                      Mã lỗi:
                    </span>
                    <span className="text-[#ef4444] font-bold">
                      {errorDetails.errorCode}
                    </span>
                  </div>
                  {errorDetails.orderId && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#C8B39A] font-semibold">
                        Mã tham chiếu:
                      </span>
                      <span className="text-[#C8B39A] font-medium">
                        {errorDetails.orderId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-[#C8B39A] font-semibold">
                      Thời gian:
                    </span>
                    <span className="text-[#C8B39A] font-medium">
                      {new Date().toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Common Reasons */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-[#C8B39A] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#EFE3CE]" />
                Nguyên Nhân Thường Gặp
              </h3>
              <div className="space-y-3">
                {commonReasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-[#FAF7F2] rounded-xl p-4"
                  >
                    <div className="bg-[#fca5a5] rounded-full p-2 shrink-0">
                      <reason.icon className="w-5 h-5 text-[#991b1b]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#C8B39A] mb-1">
                        {reason.title}
                      </p>
                      <p className="text-[#C8B39A] text-sm">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What to do next */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-br from-[#fef3c7] to-[#fde68a] rounded-2xl p-6 border-2 border-[#fbbf24]"
            >
              <h3 className="text-lg font-bold text-[#78350f] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                Bạn Nên Làm Gì?
              </h3>
              <ul className="space-y-2 text-[#92400e]">
                <li className="flex items-start gap-2">
                  <span className="text-[#f59e0b] font-bold">•</span>
                  <span>Kiểm tra lại thông tin thẻ hoặc tài khoản</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f59e0b] font-bold">•</span>
                  <span>Đảm bảo tài khoản có đủ số dư</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f59e0b] font-bold">•</span>
                  <span>Liên hệ ngân hàng nếu giao dịch bị từ chối</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f59e0b] font-bold">•</span>
                  <span>Thử lại với phương thức thanh toán khác</span>
                </li>
              </ul>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-br from-[#C8B39A] to-[#C8B39A] rounded-2xl p-6 text-[#FFFFFF]"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#EFE3CE]" />
                Cần Hỗ Trợ?
              </h3>
              <p className="text-sm mb-4 opacity-90">
                Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi:
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#EFE3CE]" />
                  <span>support@julia.vn</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#EFE3CE]" />
                  <span>0123 456 789</span>
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
                onClick={() => navigate(-1)}
                className="flex-1 py-4 rounded-full bg-linear-to-r from-[#EFE3CE] to-[#C8B39A] text-white text-lg font-bold shadow-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Thử Lại
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/bst")}
                className="flex-1 py-4 rounded-full bg-white border-2 border-[#C8B39A] text-[#C8B39A] text-lg font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay Lại Cửa Hàng
              </motion.button>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-full bg-[#FAF7F2] text-[#C8B39A] font-semibold flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Về Trang Chủ
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          variants={itemVariants}
          className="text-center text-[#C8B39A] mt-6 text-sm"
        >
          Không có khoản tiền nào bị trừ từ tài khoản của bạn
        </motion.p>
      </motion.div>
    </div>
  );
}


