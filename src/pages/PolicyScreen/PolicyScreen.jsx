import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Clock,
  AlertTriangle,
  Package,
  Sparkles,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Lock,
  Truck,
  RefreshCw,
  DollarSign,
  Calendar,
  Users,
  Award,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function PolicyScreen() {
  const [activeSection, setActiveSection] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Animation variants
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

  const scaleVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Rental process steps
  const rentalProcess = [
    {
      step: "01",
      title: "Chọn Sản Phẩm",
      icon: <Package className="w-10 h-10" />,
      description: "Duyệt bộ sưu tập và chọn trang phục yêu thích",
      details: [
        "Xem chi tiết sản phẩm với mô tả đầy đủ",
        "Kiểm tra kích thước, chất liệu, và phụ kiện",
        "Đọc đánh giá từ khách hàng trước",
        "Xem ảnh thực tế và hướng dẫn sử dụng",
      ],
    },
    {
      step: "02",
      title: "Đặt Lịch & Thanh Toán",
      icon: <CreditCard className="w-10 h-10" />,
      description: "Chọn ngày thuê và hoàn tất thanh toán",
      details: [
        "Chọn thời gian thuê trên lịch (tối thiểu 3 ngày)",
        "Thanh toán qua thẻ, chuyển khoản hoặc ví điện tử",
        "Đặt cọc tự động (50-100% giá trị sản phẩm)",
        "Nhận xác nhận đơn hàng qua email/SMS",
      ],
    },
    {
      step: "03",
      title: "Nhận Đồ",
      icon: <Truck className="w-10 h-10" />,
      description: "Giao hàng tận nơi hoặc nhận tại cửa hàng",
      details: [
        "Giao hàng miễn phí trong nội thành (đơn >500k)",
        "Kiểm tra sản phẩm trước khi nhận",
        "Ký xác nhận tình trạng ban đầu",
        "Nhận túi trả hàng và hướng dẫn bảo quản",
      ],
    },
    {
      step: "04",
      title: "Sử Dụng & Trả Đồ",
      icon: <RefreshCw className="w-10 h-10" />,
      description: "Tận hưởng và trả đồ đúng hạn",
      details: [
        "Sử dụng theo hướng dẫn, tránh làm hỏng",
        "Trả đồ đúng hạn (có thể gia hạn trước 24h)",
        "Gửi lại qua bưu điện hoặc giao tại cửa hàng",
        "Hoàn cọc sau 3-5 ngày kiểm tra",
      ],
    },
  ];

  // Pricing policies
  const pricingPolicies = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Giá Thuê Thường",
      description: "Áp dụng cho khách hàng lẻ",
      details: [
        "3 ngày đầu: Giá niêm yết",
        "Mỗi ngày thêm: +20% giá ngày đầu",
        "Giảm 10% cho đơn thuê từ 3 sản phẩm",
        "Miễn phí vệ sinh cơ bản",
      ],
      highlight: false,
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Giá Membership",
      description: "Dành cho hội viên VIP",
      details: [
        "Giảm 15-30% mọi đơn hàng",
        "Ưu tiên đặt hàng trước",
        "Miễn phí giao hàng không giới hạn",
        "Tích điểm đổi quà hấp dẫn",
      ],
      highlight: true,
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Chính Sách Đặt Cọc",
      description: "Bảo đảm cho cả hai bên",
      details: [
        "Đặt cọc 50% giá trị (sản phẩm <5 triệu)",
        "Đặt cọc 70% giá trị (sản phẩm ≥5 triệu)",
        "Hoàn cọc 100% nếu trả đúng hạn, không hư hỏng",
        "Hoàn qua tài khoản trong 3-5 ngày làm việc",
      ],
      highlight: false,
    },
  ];

  // Damage & penalty policies
  const penaltyPolicies = [
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Hư Hỏng Nhẹ",
      color: "text-warning",
      bgColor: "bg-warning-bg",
      examples: "Vết bẩn nhỏ, sờn vải, mất nút nhỏ",
      penalty: "Giữ lại 10-30% tiền cọc để sửa chữa",
      coverage: "Bảo hiểm cơ bản có thể bù một phần",
    },
    {
      icon: <XCircle className="w-8 h-8" />,
      title: "Hư Hỏng Nặng",
      color: "text-warning",
      bgColor: "bg-warning-bg",
      examples: "Rách lớn, vết bẩn không tẩy được, hỏng cấu trúc",
      penalty: "Giữ lại 50-100% tiền cọc",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Mất Mát Sản Phẩm",
      color: "text-error",
      bgColor: "bg-error-bg",
      examples: "Mất toàn bộ hoặc một phần sản phẩm/phụ kiện",
      penalty: "Bồi thường 70-100% giá trị sản phẩm",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Trả Trễ Hạn",
      color: "text-body",
      bgColor: "bg-background-alt",
      examples: "Trả muộn hơn ngày đã đặt",
      penalty: "Phạt 30% giá thuê/ngày + giữ cọc nếu quá 7 ngày",
    },
  ];

  // Delivery & cleaning process
  const deliveryProcess = [
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Giao Nhận Tận Nơi",
      description: "Dịch vụ giao hàng chuyên nghiệp",
      points: [
        "Giao hàng trong 2-4h (nội thành)",
        "Đóng gói cẩn thận, kín đáo",
        "Nhân viên hướng dẫn kiểm tra",
        "Miễn phí với đơn >500k",
      ],
    },
    {
      icon: <RefreshCw className="w-12 h-12" />,
      title: "Quy Trình Vệ Sinh",
      description: "Vệ sinh chuyên nghiệp sau mỗi lần thuê",
      points: [
        "Giặt khô/giặt ướt chuyên biệt theo chất liệu",
        "Khử trùng, hấp, ủi chuyên nghiệp",
        "Kiểm tra 5 lần trước khi cho thuê tiếp",
        "Đảm bảo 99% như mới",
      ],
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Kiểm Tra Chất Lượng",
      description: "Quy trình kiểm soát nghiêm ngặt",
      points: [
        "Kiểm tra tình trạng khi nhận lại",
        "Chụp ảnh và lưu hồ sơ",
        "Thông báo cho khách hàng nếu có vấn đề",
        "Xử lý và hoàn cọc trong 3-5 ngày",
      ],
    },
  ];

  // Security & privacy
  const securityFeatures = [
    {
      icon: <Lock className="w-10 h-10" />,
      title: "Bảo Mật Thanh Toán",
      description: "Hệ thống thanh toán an toàn tuyệt đối",
      features: [
        "Mã hóa SSL 256-bit cho mọi giao dịch",
        "Không lưu trữ thông tin thẻ khách hàng",
        "Tích hợp cổng thanh toán quốc tế (Stripe, PayPal)",
        "Xác thực 2 lớp cho giao dịch lớn",
      ],
    },
    {
      icon: <ShieldCheck className="w-10 h-10" />,
      title: "Chính Sách Bảo Mật",
      description: "Cam kết bảo vệ thông tin cá nhân",
      features: [
        "Tuân thủ GDPR và luật bảo vệ dữ liệu Việt Nam",
        "Không chia sẻ thông tin cho bên thứ ba",
        "Khách hàng có quyền xóa dữ liệu bất kỳ lúc nào",
      ],
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: "Điều Khoản Dịch Vụ",
      description: "Quyền và trách nhiệm rõ ràng",
      features: [
        "Hợp đồng thuê chi tiết, minh bạch",
        "Quy định rõ về quyền lợi và nghĩa vụ",
        "Giải quyết tranh chấp theo pháp luật VN",
        "Hỗ trợ khách hàng 24/7 qua hotline/chat",
      ],
    },
  ];

  // FAQs
  const faqs = [
    {
      question: "Tôi có thể thuê sản phẩm trong bao lâu?",
      answer:
        "Thời gian thuê tối thiểu là 3 ngày. Bạn có thể gia hạn thêm với phí 20%/ngày. Liên hệ trước 24h nếu muốn gia hạn.",
    },
    {
      question: "Nếu sản phẩm không vừa, tôi có thể đổi không?",
      answer:
        "Có, bạn có thể đổi size trong vòng 4h sau khi nhận hàng (nếu còn hàng). Chúng tôi sẽ giao size mới và lấy lại sản phẩm cũ miễn phí.",
    },
    {
      question: "Tôi có thể hủy đơn hàng không?",
      answer:
        "Có thể hủy miễn phí trước 48h. Hủy trong vòng 24-48h sẽ mất 30% phí. Hủy trong vòng 24h sẽ mất 50% phí đặt cọc.",
    },
    {
      question: "Làm sao biết sản phẩm đã được vệ sinh sạch sẽ?",
      answer:
        "Mỗi sản phẩm đều có tem 'Đã vệ sinh' với ngày tháng. Chúng tôi cam kết giặt khô/ủi chuyên nghiệp sau mỗi lần thuê với quy trình 5 bước kiểm tra.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-surface to-background-alt">
      {/* Hero Section */}
      <section className="relative w-full bg-linear-to-br from-primary via-primary to-primary py-24 lg:py-32 text-center text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%]"
        >
          <ShieldCheck className="w-8 h-8 text-muted opacity-60" />
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
          <Lock className="w-6 h-6 text-muted opacity-40" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-bold mb-6 drop-shadow-lg"
          >
            Chính Sách & Điều Khoản
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl lg:text-2xl mb-10 opacity-95 leading-relaxed max-w-4xl mx-auto"
          >
            Minh bạch, rõ ràng và bảo vệ quyền lợi của bạn
          </motion.p>
        </motion.div>
      </section>

      {/* Quick Navigation */}
      <section className="w-full bg-surface py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { id: "process", label: "Quy Trình Thuê", icon: Package },
              { id: "pricing", label: "Chính Sách Giá", icon: DollarSign },
              { id: "penalty", label: "Hư Hỏng & Phạt", icon: AlertTriangle },
              { id: "delivery", label: "Giao Nhận", icon: Truck },
              { id: "security", label: "Bảo Mật", icon: Lock },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                  setActiveSection(item.id);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-secondary text-body shadow-lg"
                    : "bg-surface text-body hover:bg-secondary hover:text-body"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Process Section */}
      <section
        id="process"
        className="w-full bg-surface py-20 lg:py-28 px-6 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl text-center mb-6 text-heading font-bold"
          >
            Quy Trình Cho Thuê Đơn Giản
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-body text-lg mb-16 max-w-3xl mx-auto"
          >
            4 bước đơn giản để trải nghiệm thời trang cao cấp
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {rentalProcess.map((step, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-surface rounded-3xl p-8 shadow-xl cursor-pointer group relative overflow-hidden"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 bg-linear-to-br from-primary to-primary text-body w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  {step.icon}
                </motion.div>

                <h3 className="text-2xl mb-3 text-heading font-bold text-center group-hover:text-muted transition-colors">
                  {step.title}
                </h3>
                <p className="text-heading mb-4 text-center leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-body"
                    >
                      <CheckCircle className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Policy Section */}
      <section
        id="pricing"
        className="w-full bg-surface py-20 lg:py-28 px-6 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl text-center mb-6 text-heading font-bold"
          >
            Chính Sách Giá & Đặt Cọc
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-body text-lg mb-16 max-w-3xl mx-auto"
          >
            Giá cả minh bạch, nhiều lựa chọn phù hợp với nhu cầu của bạn
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pricingPolicies.map((policy, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`rounded-3xl p-8 shadow-2xl relative overflow-hidden ${
                  policy.highlight
                    ? "bg-linear-to-br from-secondary to-primary text-body"
                    : "bg-surface"
                }`}
              >
                {policy.highlight && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -top-10 -right-10 w-40 h-40 bg-surface/10 rounded-full"
                  ></motion.div>
                )}

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                      policy.highlight
                        ? "bg-surface text-muted"
                        : "bg-secondary text-body"
                    }`}
                  >
                    {policy.icon}
                  </motion.div>

                  <h3
                    className={`text-2xl mb-3 font-bold text-center ${
                      policy.highlight ? "text-white" : "text-body"
                    }`}
                  >
                    {policy.title}
                  </h3>
                  <p
                    className={`text-center mb-6 ${
                      policy.highlight ? "text-white/90" : "text-body"
                    }`}
                  >
                    {policy.description}
                  </p>

                  <ul className="space-y-3">
                    {policy.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle
                          className={`w-5 h-5 shrink-0 mt-0.5 ${
                            policy.highlight ? "text-white" : "text-muted"
                          }`}
                        />
                        <span
                          className={
                            policy.highlight ? "text-white" : "text-body"
                          }
                        >
                          {detail}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Penalty Policy Section */}
      <section
        id="penalty"
        className="w-full bg-linear-to-b from-secondary to-background-alt py-20 lg:py-28 px-6 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl text-center mb-6 text-heading font-bold"
          >
            Chính Sách Hư Hỏng & Phạt
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-body text-lg mb-16 max-w-3xl mx-auto"
          >
            Quy định rõ ràng về trách nhiệm và mức phạt để bảo vệ cả hai bên
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {penaltyPolicies.map((policy, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.03 }}
                className={`${policy.bgColor} rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-current transition-all duration-300 ${policy.color}`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`p-4 rounded-2xl bg-surface shadow-lg`}
                  >
                    {policy.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{policy.title}</h3>
                    <p className="text-muted italic">{policy.examples}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-surface/70 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-bold text-muted">Mức phạt:</span>
                    </div>
                    <p className="text-muted font-semibold">{policy.penalty}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Delivery & Cleaning Section */}
      <section
        id="delivery"
        className="w-full bg-surface py-20 lg:py-28 px-6 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl text-center mb-6 text-heading font-bold"
          >
            Giao Nhận & Vệ Sinh Chuyên Nghiệp
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-body text-lg mb-16 max-w-3xl mx-auto"
          >
            Quy trình giao hàng nhanh chóng và vệ sinh đạt chuẩn 5 sao
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {deliveryProcess.map((process, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-surface rounded-3xl p-8 shadow-xl group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-linear-to-br from-secondary to-primary text-body w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  {process.icon}
                </motion.div>

                <h3 className="text-2xl mb-3 text-heading font-bold text-center group-hover:text-muted transition-colors">
                  {process.title}
                </h3>
                <p className="text-heading mb-6 text-center">
                  {process.description}
                </p>

                <ul className="space-y-3">
                  {process.points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-body"
                    >
                      <CheckCircle className="w-5 h-5 text-muted shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section
        id="security"
        className="w-full bg-linear-to-br from-primary via-primary to-primary text-body py-20 lg:py-28 px-6 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl text-center mb-6 font-bold"
          >
            Bảo Mật & An Toàn
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/80 text-lg mb-16 max-w-3xl mx-auto"
          >
            Cam kết bảo vệ thông tin và quyền lợi của bạn với công nghệ tiên
            tiến
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {securityFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{
                  scale: 1.05,
                  borderColor: "var(--color-secondary)",
                }}
                className="bg-surface/10 backdrop-blur-lg rounded-3xl p-8 border border-text-inverse/20 shadow-2xl"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-secondary text-heading w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-2xl mb-3 font-bold text-center text-muted">
                  {feature.title}
                </h3>
                <p className="text-center mb-6 text-white/90">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <ShieldCheck className="w-5 h-5 text-muted shrink-0 mt-0.5" />
                      <span className="text-white/90">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap justify-center gap-8 items-center"
          >
            {["SSL Secured", "GDPR Compliant", "PCI DSS", "ISO 27001"].map(
              (badge, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  className="bg-surface/20 backdrop-blur px-6 py-3 rounded-full border border-secondary flex items-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-muted" />
                  <span className="font-bold">{badge}</span>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="w-full bg-surface py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl text-center mb-6 text-heading font-bold"
          >
            Câu Hỏi Thường Gặp
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-body text-lg mb-16"
          >
            Giải đáp những thắc mắc phổ biến nhất
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-4"
          >
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-surface rounded-2xl shadow-lg overflow-hidden"
              >
                <motion.button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === idx ? null : idx)
                  }
                  whileHover={{ backgroundColor: "var(--color-surface)" }}
                  className="w-full px-8 py-6 flex items-center justify-between text-left transition-colors"
                >
                  <span className="text-lg font-bold text-body pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFAQ === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-muted shrink-0" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedFAQ === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-body leading-relaxed border-t border-background-alt pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-linear-to-br from-primary via-primary to-primary py-20 lg:py-28 px-6 lg:px-12 text-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-16 h-16 text-muted" />
            </motion.div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl mb-6 font-bold"
          >
            Còn Thắc Mắc?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl mb-10 text-white leading-relaxed"
          >
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp 24/7
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 60px var(--color-btn-glow)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-heading px-8 py-4 rounded-full text-lg font-bold shadow-xl"
            >
              Liên Hệ Hỗ Trợ
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#FFFFFF",
                color: "var(--color-primary)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-bold border-2 border-text-inverse transition-all"
            >
              Xem Bộ Sưu Tập
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
