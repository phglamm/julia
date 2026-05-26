import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Calendar,
  Star,
  CheckCircle,
  Package,
  Shield,
  Award,
  TrendingUp,
  X,
  Sparkles,
  Heart,
  Search,
  ChevronLeft,
} from "lucide-react";
import videoBanner from "../../assets/videobanner1.mp4";
import { route } from "../../router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import productService from "../../services/productService";
import { useCartStore } from "../../stores/cartStore";
const HomeScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  console.log("Cart Items:", items);

  const testimonials = [
    {
      id: 1,
      name: "Minh Anh",
      text: "Dịch vụ tuyệt vời! Váy đẹp và chất lượng. Sẽ quay lại thuê tiếp.",
      rating: 5,
    },
    {
      id: 2,
      name: "Thanh Hà",
      text: "Giá cả hợp lý, quy trình thuê đơn giản. Rất hài lòng!",
      rating: 5,
    },
    {
      id: 3,
      name: "Phương Thảo",
      text: "Đồ đẹp như mới, giao hàng đúng hẹn. Rất đáng tin cậy!",
      rating: 5,
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // New products state (Sản phẩm mới về)
  const [newProducts, setNewProducts] = useState([]);
  const [newLoading, setNewLoading] = useState(false);
  const [newError, setNewError] = useState(null);

  // Custom Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);

  const imgSrc = (link) => {
    if (!link) return "/images/placeholder.png";
    return link;
  };

  useEffect(() => {
    const fetchNew = async () => {
      setNewLoading(true);
      setNewError(null);
      try {
        const resp = await productService.getAllProducts({
          limit: 8,
        });
        setNewProducts(resp.data || []);
      } catch (err) {
        setNewError(err.message || "Failed to load new products");
      } finally {
        setNewLoading(false);
      }
    };

    fetchNew();
  }, []);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || newProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, newProducts.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, newProducts.length, itemsPerView]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, newProducts.length - itemsPerView);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, newProducts.length - itemsPerView);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const maxIndex = Math.max(0, newProducts.length - itemsPerView);

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

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#EAD2D8]">
      {/* Hero Section */}
      <section className="relative w-full bg-linear-to-br from-[#682535] via-[#874D5F] to-[#682535] py-40 lg:py-56 text-center text-[#FFFFFF] overflow-hidden min-h-[80vh] lg:min-h-[95vh] flex items-center justify-center">
        {/* Background video (show on sm+). Keep full-bleed and cover the hero */}
        <video
          className="hidden sm:block absolute inset-0 w-full h-full object-cover z-0"
          src={videoBanner}
          // poster={posterImage}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />

        {/* dark overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/45 z-10"></div>

        <div
          className="absolute inset-0 opacity-10 z-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        {/* Floating sparkles */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-30 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-bold mb-6 drop-shadow-lg"
          >
            Julia
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl lg:text-2xl mb-10 opacity-95 leading-relaxed max-w-4xl"
          >
            Trải nghiệm trang phục thiết kế cao cấp không giới hạn
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex gap-6 justify-center flex-wrap"
          >
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0 20px 40px rgba(212, 175, 55, 0.5)",
              }}
              onClick={() => navigate(route.bst)}
              whileTap={{ scale: 0.95 }}
              className="bg-[#C599A6] text-[#682535] px-12 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 flex items-center gap-2 hover:cursor-pointer"
            >
              <span>Xem Bộ Sưu Tập</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "#FFFFFF",
                color: "#682535",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent text-[#FFFFFF] px-12 py-4 rounded-full text-lg font-bold border-2 border-[#FFFFFF] transition-all duration-300"
            >
              Cách Thuê Đồ
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-[#EAD2D8] py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl text-center mb-16 text-[#682535] font-bold"
          >
            Tại Sao Chọn Julia?
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
                icon: <Award className="w-12 h-12" />,
                title: "Chất Lượng Cao Cấp",
                desc: "Bộ sưu tập được tuyển chọn từ các thương hiệu cao cấp",
              },
              {
                icon: <Package className="w-12 h-12" />,
                title: "Giao Hàng Dễ Dàng",
                desc: "Giao hàng tận nơi & trả hàng dễ dàng",
              },
              {
                icon: <TrendingUp className="w-12 h-12" />,
                title: "Bền Vững",
                desc: "Giảm lãng phí thời trang, hướng tới nền kinh tế tuần hoàn",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={scaleVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-linear-to-br from-white to-[#F6F3E6] p-10 rounded-3xl text-center shadow-xl cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="text-[#C599A6] mb-4 flex justify-center"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl mb-3 text-[#682535] font-bold group-hover:text-[#C599A6] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#874D5F] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sản phẩm mới về - New Arrivals */}
      <section className="w-full bg-[#F6F3E6] py-20 lg:py-28 px-6 lg:px-12 relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #682535 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-[#682535] font-bold mb-4">
              Sản Phẩm Mới Về
            </h2>
            <p className="text-lg text-[#874D5F] max-w-2xl mx-auto leading-relaxed">
              Khám phá những thiết kế độc đáo và sang trọng nhất trong bộ sưu
              tập của chúng tôi
            </p>
          </motion.div>

          {newLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Sparkles className="w-12 h-12 text-[#C599A6]" />
              </motion.div>
              <p className="text-2xl text-[#874D5F] font-semibold mt-4">
                Đang tải sản phẩm mới...
              </p>
            </motion.div>
          )}

          {newError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 bg-red-50 rounded-3xl border-2 border-red-200"
            >
              <p className="text-xl text-red-600 font-semibold">
                Lỗi: {newError}
              </p>
            </motion.div>
          )}

          {!newLoading && !newError && newProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Swiper
                modules={[Autoplay, FreeMode]}
                spaceBetween={32}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 32 },
                  1280: { slidesPerView: 4, spaceBetween: 32 },
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={newProducts.length > 3}
              >
                {newProducts.map((p, index) => (
                  <SwiperSlide key={p._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -12 }}
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="bg-white rounded-3xl shadow-2xs overflow-hidden cursor-pointer h-[80%] relative"
                    >
                      {/* Image Container */}
                      <div className="h-80 bg-linear-to-br from-[#FFFFFF] to-[#EAD2D8] flex items-center justify-center overflow-hidden relative">
                        <motion.img
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          src={imgSrc(p.imageLink)}
                          alt={p.title}
                          className="object-cover w-full h-full"
                          onError={(e) =>
                            (e.currentTarget.src = "/images/placeholder.png")
                          }
                        />
                        {/* Overlay gradient on hover */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-linear-to-t from-[#682535]/60 via-transparent to-transparent"
                        >
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              whileHover={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="text-white font-semibold flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
                            >
                              <Heart className="w-4 h-4" />
                              Yêu thích
                            </motion.div>
                            <motion.div
                              initial={{ x: 20, opacity: 0 }}
                              whileHover={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="text-white font-semibold"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6 bg-linear-to-br from-white to-[#F6F3E6]">
                        <h3 className="text-xl font-bold text-[#682535] line-clamp-2 min-h-14 group-hover:text-[#C599A6] transition-colors duration-300">
                          {p.title}
                        </h3>

                        {p.shortDescription && (
                          <p className="text-sm text-[#874D5F] mb-4 line-clamp-2 leading-relaxed">
                            {p.shortDescription}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-[#EAD2D8]/30">
                          <div>
                            <div className="text-2xl font-bold text-[#682535] group-hover:text-[#C599A6] transition-colors duration-300">
                              {formatPrice(p.price)}
                            </div>
                            <div className="text-xs text-[#874D5F] mt-1">
                              / 3 ngày
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-linear-to-r from-[#C599A6] to-[#A47784] text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${p._id}`);
                            }}
                          >
                            Xem
                            <ChevronRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}

          {/* View All Button */}
          {!newLoading && !newError && newProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 40px rgba(212, 175, 55, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(route.bst)}
                className="bg-linear-to-r from-[#682535] to-[#874D5F] text-[#FFFFFF] px-10 py-4 rounded-full text-lg font-bold shadow-xl transition-all duration-300 inline-flex items-center gap-3 group"
              >
                <span>Xem Tất Cả Sản Phẩm</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full bg-[#EAD2D8] py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl mb-16 text-[#682535] font-bold"
          >
            Quy Trình Thuê Đơn Giản
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {[
              {
                step: "01",
                title: "Chọn Sản Phẩm",
                desc: "Chọn từ bộ sưu tập được tuyển chọn",
                icon: <Search className="w-10 h-10" />,
              },
              {
                step: "02",
                title: "Đặt Lịch & Thanh Toán",
                desc: "Chọn thời gian thuê trên lịch",
                icon: <Calendar className="w-10 h-10" />,
              },
              {
                step: "03",
                title: "Nhận Đồ",
                desc: "Giao hàng tận nơi cho bạn",
                icon: <Package className="w-10 h-10" />,
              },
              {
                step: "04",
                title: "Sử Dụng & Trả Đồ",
                desc: "Trả tại cửa hàng hoặc đặt lịch lấy",
                icon: <CheckCircle className="w-10 h-10" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-linear-to-br from-[#682535] to-[#874D5F] text-[#FFFFFF] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  {item.icon}
                </motion.div>
                {/* <motion.div
                  initial={{ opacity: 0.2 }}
                  whileHover={{ opacity: 0.4, scale: 1.1 }}
                  className="absolute top-2 right-[20%] text-6xl font-bold text-[#C599A6] opacity-20"
                >
                  {item.step}
                </motion.div> */}
                <h3 className="text-2xl mb-3 text-[#682535] font-bold group-hover:text-[#C599A6] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-[#874D5F] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-linear-to-br from-[#682535] via-[#874D5F] to-[#682535] text-[#FFFFFF] py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl mb-16 font-bold"
          >
            Khách Hàng Nói Gì
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={scaleVariants}
                whileHover={{ scale: 1.05, borderColor: "#C599A6" }}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 cursor-pointer"
              >
                <div className="flex gap-1 mb-4 justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Star className="w-5 h-5 text-[#C599A6] fill-[#C599A6]" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-lg mb-4 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <p className="font-bold text-[#C599A6]">— {testimonial.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#F6F3E6] py-20 lg:py-28 px-6 lg:px-12 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl mb-6 text-[#682535] font-bold"
          >
            Sẵn Sàng Nâng Tầm Phong Cách?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl mb-10 text-[#874D5F] leading-relaxed"
          >
            Tham gia cùng hàng trăm người yêu thời trang chọn sự xa xỉ bền vững
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 20px 60px rgba(212, 175, 55, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-linear-to-r from-[#C599A6] to-[#A47784] text-[#682535] px-12 py-5 rounded-full text-xl font-bold shadow-xl transition-all duration-300"
          >
            Khám Phá Bộ Sưu Tập
          </motion.button>
        </motion.div>
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-2000 p-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto relative"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 bg-[#682535] text-[#FFFFFF] rounded-full w-12 h-12 flex items-center justify-center z-10 hover:bg-[#874D5F] transition-colors"
                onClick={() => setSelectedProduct(null)}
              >
                <X className="w-6 h-6" />
              </motion.button>
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-linear-to-br from-[#FFFFFF] to-[#EAD2D8] h-96 flex items-center justify-center text-[12rem] rounded-t-3xl overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {selectedProduct.image}
                </motion.div>
              </motion.div>
              <div className="p-8">
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl mb-4 text-[#682535] font-bold"
                >
                  {selectedProduct.name}
                </motion.h2>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <Star
                          className="w-5 h-5 text-[#C599A6]"
                          fill={
                            i < Math.floor(selectedProduct.rating)
                              ? "#C599A6"
                              : "none"
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-[#874D5F]">
                    {selectedProduct.rating} ({selectedProduct.reviews} đánh
                    giá)
                  </span>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold text-[#682535] mb-2"
                >
                  {formatPrice(selectedProduct.price)}{" "}
                  <span className="text-lg font-normal">/ 3 ngày</span>
                </motion.div>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-[#874D5F] mb-8 leading-relaxed text-lg"
                >
                  Bộ trang phục thanh lịch hoàn hảo cho mọi dịp đặc biệt. Được
                  tuyển chọn cẩn thận và vệ sinh chuyên nghiệp sau mỗi lần thuê.
                  Có sẵn nhiều kích cỡ.
                </motion.p>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{
                    scale: selectedProduct.available ? 1.05 : 1,
                    boxShadow: selectedProduct.available
                      ? "0 10px 40px rgba(212, 175, 55, 0.4)"
                      : undefined,
                  }}
                  whileTap={{ scale: selectedProduct.available ? 0.95 : 1 }}
                  className={`w-full py-5 rounded-full text-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedProduct.available
                      ? "bg-linear-to-r from-[#C599A6] to-[#A47784] text-white"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                  disabled={!selectedProduct.available}
                >
                  <Calendar className="w-6 h-6" />
                  {selectedProduct.available
                    ? "Đặt Trang Phục Này"
                    : "Hiện Không Có Sẵn"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeScreen;
