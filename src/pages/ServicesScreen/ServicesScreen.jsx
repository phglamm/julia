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
      color: "from-[#D97BA8] to-[#C94F89]",
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
    <div className="min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#EDD5E8]">
      {/* Hero Section */}
      <section className="relative w-full bg-linear-to-br from-[#723F53] via-[#8B6B7A] to-[#723F53] py-24 lg:py-32 text-center text-[#FFFFFF] overflow-hidden">
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
          <Crown className="w-6 h-6 text-[#D97BA8] opacity-40" />
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

      <section className="w-full bg-[#FFFFFF] py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl text-center mb-16 text-[#723F53] font-bold"
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
                className="bg-linear-to-br from-white to-[#f9f3e8] p-10 rounded-3xl text-center shadow-xl cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="text-[#D97BA8] mb-4 flex justify-center"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl mb-3 text-[#723F53] font-bold group-hover:text-[#D97BA8] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#8B6B7A] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="w-full bg-[#FFFFFF] py-20 lg:py-28 px-6 lg:px-12 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl  text-[#723F53] text-center mb-6 font-bold"
          >
            Gói Membership
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[#723F53] text-lg mb-16 max-w-3xl mx-auto"
          >
            Chọn gói phù hợp và tận hưởng đặc quyền cao cấp
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {membershipPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
                  plan.popular ? "ring-4 ring-[#D97BA8]" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-linear-to-r from-[#D97BA8] to-[#C94F89] text-white text-center py-2 font-bold">
                    <Star className="w-4 h-4 inline mr-1" />
                    PHỔ BIẾN NHẤT
                  </div>
                )}
                <div
                  className={`bg-linear-to-br ${plan.color} p-8 text-white text-center`}
                >
                  <Crown className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                  <div className="text-sm opacity-90">{plan.period}</div>
                </div>
                <div className="p-8 flex flex-col grow">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-[#723F53]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 rounded-full font-bold bg-linear-to-r from-[#D97BA8] to-[#C94F89] text-white"
                    >
                      Đăng Ký Ngay
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <section className="w-full bg-[#FFFFFF] py-20 lg:py-28 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl lg:text-5xl text-center mb-16 text-[#723F53] font-bold"
              >
                Đặc Quyền Thành Viên
              </motion.h2>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {membershipBenefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    variants={scaleVariants}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="bg-white rounded-3xl p-8 text-center shadow-xl group"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={` text-[#D97BA8] w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto`}
                    >
                      {benefit.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[#723F53] mb-4 group-hover:text-[#D97BA8] transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-[#8B6B7A] leading-relaxed">
                      {benefit.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
          {/* Membership Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-3xl p-10 max-w-2xl mx-auto"
          >
            <h3 className="text-3xl font-bold text-[#723F53] mb-6 text-center">
              Đăng Ký Thành Viên
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[#723F53] font-semibold mb-2">
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  value={membershipForm.name}
                  onChange={(e) =>
                    setMembershipForm({
                      ...membershipForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EDD5E8] focus:border-[#D97BA8] outline-none transition-colors text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[#723F53] font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={membershipForm.email}
                  onChange={(e) =>
                    setMembershipForm({
                      ...membershipForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EDD5E8] focus:border-[#D97BA8] outline-none transition-colors text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[#723F53] font-semibold mb-2">
                  Số Điện Thoại *
                </label>
                <input
                  type="tel"
                  value={membershipForm.phone}
                  onChange={(e) =>
                    setMembershipForm({
                      ...membershipForm,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EDD5E8] focus:border-[#D97BA8] outline-none transition-colors text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[#723F53] font-semibold mb-2">
                  Chọn Gói Thành Viên *
                </label>
                <select
                  value={membershipForm.plan}
                  onChange={(e) =>
                    setMembershipForm({
                      ...membershipForm,
                      plan: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EDD5E8] focus:border-[#D97BA8] outline-none transition-colors text-gray-900"
                >
                  <option value="basic">Basic - 499.000đ/năm</option>
                  <option value="premium">Premium - 999.000đ/năm</option>
                  <option value="vip">VIP - 1.999.000đ/năm</option>
                </select>
              </div>

              <motion.button
                type="button"
                onClick={handleMembershipSubmit}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 40px rgba(212, 175, 55, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-linear-to-r from-[#D97BA8] to-[#C94F89] text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
              >
                <Crown className="w-5 h-5" />
                Đăng Ký Ngay
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits of Membership */}

      {/* CTA Section */}
      <section className="w-full bg-linear-to-br from-[#723F53] via-[#8B6B7A] to-[#723F53] py-20 lg:py-28 px-6 lg:px-12 text-center text-white">
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
              <Sparkles className="w-16 h-16 text-[#D97BA8]" />
            </motion.div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl mb-6 font-bold"
          >
            Bắt Đầu Trải Nghiệm Ngay Hôm Nay
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl mb-10 text-[#FFFFFF] leading-relaxed"
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
                boxShadow: "0 20px 60px rgba(212, 175, 55, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#D97BA8] text-[#723F53] px-8 py-4 rounded-full text-lg font-bold shadow-xl flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Hotline: +84 xxx xxx xxx
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#FFFFFF",
                color: "#723F53",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent text-[#FFFFFF] px-8 py-4 rounded-full text-lg font-bold border-2 border-[#FFFFFF] transition-all flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email: hello@thecaprieux.vn
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
