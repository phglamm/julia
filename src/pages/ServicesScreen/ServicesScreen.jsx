import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Crown,
  Calendar,
  CheckCircle,
  Star,
  Package,
  Camera,
  ChevronRight,
  Sparkles,
  Heart,
  Clock,
  Shield,
  Gift,
  Zap,
  Award,
  TrendingUp,
  Phone,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ServicesScreen() {
  const [membershipForm, setMembershipForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "basic",
  });

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

  // Try-on process

  // Membership plans
  const membershipPlans = [
    {
      name: "Basic",
      price: "499.000đ",
      period: "/ năm",
      color: "from-gray-400 to-gray-600",
      features: [
        "Giảm 10% mọi đơn hàng",
        "Miễn phí ship từ 500k",
        "1 buổi tư vấn stylist/năm",
        "Tích điểm đổi quà",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "999.000đ",
      period: "/ năm",
      color: "from-secondary to-primary",
      features: [
        "Giảm 20% mọi đơn hàng",
        "Miễn phí ship không giới hạn",
        "3 buổi tư vấn stylist/năm",
        "Ưu tiên đặt hàng mới",
        "Tích điểm x2",
      ],
      popular: true,
    },
    {
      name: "VIP",
      price: "1.999.000đ",
      period: "/ năm",
      color: "from-purple-600 to-pink-600",
      features: [
        "Giảm 30% mọi đơn hàng",
        "Miễn phí ship không giới hạn",
        "Tư vấn stylist không giới hạn",
        "Ưu tiên tuyệt đối",
        "Tích điểm x3",
        "Quà tặng sinh nhật cao cấp",
        "Mời tham gia sự kiện VIP",
      ],
      popular: false,
    },
  ];

  // Membership benefits
  const membershipBenefits = [
    {
      icon: <Gift className="w-12 h-12" />,
      title: "Ưu Đãi Độc Quyền",
      desc: "Giảm giá đặc biệt và ưu tiên đặt hàng các sản phẩm mới nhất",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Dịch Vụ Ưu Tiên",
      desc: "Xử lý đơn hàng nhanh chóng và chăm sóc khách hàng 24/7",
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Tích Điểm Thưởng",
      desc: "Tích điểm với mọi đơn hàng, đổi quà hấp dẫn",
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Bảo Hiểm Sản Phẩm",
      desc: "Bảo vệ sản phẩm miễn phí trong thời gian thuê",
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Nâng Cấp Miễn Phí",
      desc: "Cơ hội nâng cấp lên các mẫu cao cấp hơn",
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Sự Kiện Đặc Biệt",
      desc: "Mời tham gia các sự kiện thời trang độc quyền",
      color: "from-red-500 to-pink-500",
    },
  ];

  const handleMembershipSubmit = (e) => {
    e.preventDefault();
    toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.");
    setMembershipForm({ name: "", email: "", phone: "", plan: "basic" });
  };

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
        />

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%]"
        >
          <Sparkles className="w-8 h-8 text-muted opacity-60" />
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
          <Crown className="w-6 h-6 text-muted opacity-40" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className=" text-5xl lg:text-7xl font-bold mb-6 "
          >
            Dịch Vụ Của Chúng Tôi
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl lg:text-2xl mb-10 opacity-95 leading-relaxed max-w-4xl mx-auto"
          >
            Trải nghiệm hoàn hảo với đặc quyền thành viên VIP
          </motion.p>
        </motion.div>
      </section>

      <section className="w-full bg-surface py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className=" text-4xl lg:text-5xl text-center mb-16 text-heading font-bold"
          >
            Dịch Vụ Nổi Bật
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Crown className="w-12 h-12" />,
                title: "Stylish Online",
                desc: "Tư vấn phong cách cá nhân hóa bởi chuyên gia thời trang",
              },
              {
                icon: <Package className="w-12 h-12" />,
                title: "Try-on Tại Nhà",
                desc: "Thử đồ thoải mái ngay tại nhà trước khi quyết định",
              },
              {
                icon: <Crown className="w-12 h-12" />,
                title: "Đăng Ký Thành Viên",
                desc: "Trở thành thành viên VIP để nhận ưu đãi và dịch vụ cao cấp",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-linear-to-br from-surface to-surface p-10 rounded-none text-center shadow-xl cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="text-muted mb-4 flex justify-center"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl mb-3 text-heading font-bold group-hover:text-muted transition-colors">
                  {feature.title}
                </h3>
                <p className="text-heading leading-relaxed">
                  {feature.desc}
                </p>
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
            className=" text-4xl lg:text-5xl mb-6 font-bold"
          >
            Bắt Đầu Trải Nghiệm Ngay Hôm Nay
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl mb-10 text-white leading-relaxed"
          >
            Liên hệ với chúng tôi để được tư vấn chi tiết về các dịch vụ
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
              className="bg-secondary text-heading px-8 py-4 rounded-none text-lg font-bold shadow-xl flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Hotline: +84 xxx xxx xxx
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#FFFFFF",
                color: "var(--color-primary)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent text-white px-8 py-4 rounded-none text-lg font-bold border-2 border-text-inverse transition-all flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email: hello@thejulia.vn
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
