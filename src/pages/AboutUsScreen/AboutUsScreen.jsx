import { useState } from "react";
import { motion } from "framer-motion";
// ensure linter recognizes `motion` usage in JSX
void motion;
import {
  Heart,
  Users,
  Target,
  Sparkles,
  Award,
  TrendingUp,
  Leaf,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

export default function AboutUsScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);

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

  // Core values
  const coreValues = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Đam Mê Thời Trang",
      description:
        "Chúng tôi tin rằng thời trang là một hình thức nghệ thuật và tự thể hiện. Mỗi sản phẩm được chọn lọc với tình yêu và sự tỉ mỉ.",
    },
    {
      icon: <Leaf className="w-12 h-12" />,
      title: "Bền Vững",
      description:
        "Cam kết với nền kinh tế tuần hoàn, giảm thiểu lãng phí thời trang và bảo vệ môi trường cho thế hệ tương lai.",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Cộng Đồng",
      description:
        "Xây dựng cộng đồng những người yêu thời trang, nơi mọi người có thể chia sẻ phong cách và trải nghiệm độc đáo.",
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Chất Lượng Cao Cấp",
      description:
        "Chỉ mang đến những thiết kế cao cấp từ các thương hiệu uy tín, được kiểm tra và vệ sinh chuyên nghiệp.",
    },
  ];

  // Contact info
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Địa Chỉ",
      details: [
        "141 Điện Biên Phủ, Phường Gia Định",
        "TP. Hồ Chí Minh, Việt Nam",
      ],
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Điện Thoại",
      details: ["+84 xxx xxx xxx"],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["hello@thejulia.vn"],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Giờ Làm Việc",
      details: ["Thứ 2 - Thứ 6: 9:00 - 21:00", "Thứ 7 - CN: 10:00 - 20:00"],
    },
  ];

  // Social media
  const socialMedia = [
    { icon: <Instagram className="w-6 h-6" />, name: "Instagram", link: "#" },
    { icon: <Facebook className="w-6 h-6" />, name: "Facebook", link: "#" },
    { icon: <MessageCircle className="w-6 h-6" />, name: "Zalo", link: "#" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus("loading");
    setTimeout(() => {
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setFormStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background-alt to-background-alt">
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
          <Heart className="w-8 h-8 text-muted opacity-60" />
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
          <Sparkles className="w-6 h-6 text-muted opacity-40" />
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
            Giới thiệu "Julia"
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl lg:text-2xl mb-10 opacity-95 leading-relaxed max-w-4xl mx-auto"
          >
            Nơi trải nghiệm trang phục thiết kế cao cấp không giới hạn
          </motion.p>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="w-full bg-surface py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-heading font-bold mb-6">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-heading leading-relaxed">
              <p>
                Julia biến thời trang cao cấp thành trải nghiệm gần gũi và dễ
                tiếp cận, giúp khách hàng tự tin tỏa sáng trong từng khoảnh khắc
                đặc biệt.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
          >
            {[
              { number: "5,000+", label: "Khách Hàng Hài Lòng" },
              { number: "1,000+", label: "Thiết Kế Cao Cấp" },
              { number: "50+", label: "Tấn Rác Giảm Thiểu" },
              { number: "4.9/5", label: "Đánh Giá Trung Bình" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-surface rounded-none p-8 text-center shadow-xl"
              >
                <div className="text-4xl lg:text-5xl font-bold text-muted mb-2">
                  {stat.number}
                </div>
                <div className="text-body font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full bg-linear-to-b from-[#F5D7E8] to-background-alt py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className=" text-4xl lg:text-5xl text-center mb-6 text-heading font-bold"
          >
            Giá Trị Cốt Lõi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-body text-lg mb-16 max-w-3xl mx-auto"
          >
            Sáng tạo trong xu hướng, tận tâm với khách hàng, bền vững và uy tín
            trong từng trải nghiệm chia sẻ
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {coreValues.map((value, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.03, y: -10 }}
                className="bg-surface rounded-none p-8 shadow-xl group"
              >
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={` text-muted w-20 h-20 rounded-none flex items-center justify-center mb-6`}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-heading mb-4 group-hover:text-muted transition-colors">
                    {value.title}
                  </h3>
                </div>
                <p className="text-heading leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full bg-background-alt py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className=" text-4xl lg:text-5xl text-center mb-6 text-heading font-bold"
          >
            Liên Hệ Với Chúng Tôi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-body text-lg mb-16 max-w-3xl mx-auto"
          >
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="space-y-8"
            >
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-surface rounded-none p-6 shadow-xl flex items-start gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-btn-primary hover:bg-btn-hover text-body p-4 rounded-none shrink-0"
                  >
                    {info.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-heading mb-2">
                      {info.title}
                    </h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-heading">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Social Media */}
              <motion.div
                variants={itemVariants}
                className="bg-surface rounded-none p-6 shadow-xl"
              >
                <h3 className="text-xl font-bold text-heading mb-4">
                  Theo Dõi Chúng Tôi
                </h3>
                <div className="flex gap-4">
                  {socialMedia.map((social, idx) => (
                    <motion.a
                      key={idx}
                      href={social.link}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-btn-primary hover:bg-btn-hover text-heading p-4 rounded-none shadow-lg"
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-surface rounded-none p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-heading mb-6">
                Gửi Tin Nhắn
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-heading font-semibold mb-2">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-none border-2 border-background-alt focus:border-secondary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-body font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-none border-2 border-background-alt focus:border-secondary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-body font-semibold mb-2">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-none border-2 border-background-alt focus:border-secondary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-body font-semibold mb-2">
                    Chủ Đề *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-none border-2 border-background-alt focus:border-secondary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-body font-semibold mb-2">
                    Nội Dung *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-none border-2 border-background-alt focus:border-secondary outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 40px rgba(217, 123, 168, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={formStatus === "loading"}
                  className="w-full bg-btn-primary hover:bg-btn-hover text-body py-4 rounded-none font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
                >
                  {formStatus === "loading" ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Đang Gửi...
                    </>
                  ) : formStatus === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Đã Gửi Thành Công!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Gửi Tin Nhắn
                    </>
                  )}
                </motion.button>

                {formStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-success-bg border-2 border-success rounded-none p-4 flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-success" />
                    <p className="text-success font-semibold">
                      Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất có thể.
                    </p>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
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
            Sẵn Sàng Bắt Đầu Hành Trình Thời Trang?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl mb-10 text-white leading-relaxed"
          >
            Khám phá bộ sưu tập độc quyền và trải nghiệm thời trang cao cấp ngay
            hôm nay
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(217, 123, 168, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-heading px-8 py-4 rounded-none text-lg font-bold shadow-xl"
            >
              Xem Bộ Sưu Tập
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#FFFFFF",
                color: "var(--color-primary)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent text-white px-8 py-4 rounded-none text-lg font-bold border-2 border-text-inverse transition-all"
            >
              Đặt Lịch Tư Vấn
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
