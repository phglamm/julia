import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  Package,
  Sparkles,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import productService from "../../services/productService";
import { useCartStore } from "../../stores/cartStore";
import toast from "react-hot-toast";
import rentalDiscountRuleService from "../../services/rentalDiscountRuleService";

export default function ProductDetailScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rental Calculation State
  const [rentalDays, setRentalDays] = useState(3);
  const [calculatedRentFee, setCalculatedRentFee] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  console.log("Cart Items:", items);
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const response = await productService.getProducts(productId);
        console.log("Product details:", response.data);
        if (mounted) {
          setProduct(response.data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load product");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [productId]);

  // Calculate rental discount when days or product change
  useEffect(() => {
    let mounted = true;

    const calculateDiscount = async () => {
      if (!product || !product.rentalPrice) return;

      setIsCalculating(true);
      try {
        const response = await rentalDiscountRuleService.calculateDiscount({
          days: rentalDays,
          basePrice: product.rentalPrice,
        });
        if (mounted) {
          setCalculatedRentFee(response.data.finalPrice);
          setDiscountInfo(response.data);
        }
      } catch (err) {
        console.error("Error calculating discount:", err);
        if (mounted) {
          // Fallback to basic calculation if API fails
          setCalculatedRentFee(product.rentalPrice * rentalDays);
          setDiscountInfo(null);
        }
      } finally {
        if (mounted) setIsCalculating(false);
      }
    };

    calculateDiscount();
    return () => {
      mounted = false;
    };
  }, [product, rentalDays]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const imgSrc = (link) => {
    if (!link) return "/images/placeholder.png";
    return link;
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-white to-background-alt flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Package className="w-16 h-16 mx-auto mb-4 text-text-secondary animate-pulse" />
          <p className="text-2xl text-text-primary font-semibold">
            Đang tải sản phẩm...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-white to-background-alt flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 max-w-md mx-auto">
            <p className="text-xl font-bold text-red-600 mb-4">
              Không thể tải thông tin sản phẩm
            </p>
            <p className="text-red-500 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/bst")}
              className="px-6 py-3 bg-secondary text-white rounded-full font-bold"
            >
              Quay lại bộ sưu tập
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-background-alt">
      {/* Hero Section */}
      <section className="relative w-full bg-linear-to-br from-primary via-primary to-primary py-20 lg:py-28 text-center text-white overflow-hidden">
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
          <Sparkles className="w-8 h-8 text-text-secondary opacity-60" />
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
          <Sparkles className="w-6 h-6 text-text-secondary opacity-40" />
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
            onClick={() => navigate("/bst")}
            className="mb-6 inline-flex items-center gap-2 text-white hover:text-text-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-semibold">Quay lại</span>
          </motion.button>

          <motion.h1
            variants={itemVariants}
            className=" text-4xl lg:text-6xl font-bold mb-4 "
          >
            Chi Tiết Sản Phẩm
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg lg:text-xl opacity-95 leading-relaxed max-w-3xl mx-auto"
          >
            Khám phá thông tin chi tiết về sản phẩm
          </motion.p>
        </motion.div>
      </section>

      {/* Product Details Section */}
      <section className="w-full bg-white py-16 lg:py-20 px-6 lg:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-none shadow-sm border border-background-alt/50 overflow-hidden sticky top-6">
                <div className="bg-linear-to-br from-white to-background-alt w-full h-[700px] flex items-center justify-center">
                  <img
                    src={imgSrc(product.images?.[0])}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.png";
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Product Information */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Title & Rating */}
              <div className="bg-white rounded-none shadow-sm border border-background-alt/50 p-8">
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl mb-4 text-text-primary font-bold"
                >
                  {product.title}
                </motion.h2>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-4 mb-6"
                >
                  <div>
                    <div className="text-xl font-bold text-text-primary mb-1">
                      Giá trị sản phẩm (để thu cọc):
                    </div>
                    <div className="text-4xl font-bold text-text-secondary">
                      {formatPrice(product.depositAmount)}
                    </div>
                  </div>

                  <div className="border-t border-background-alt/50 pt-4">
                    <div className="text-lg font-bold text-text-primary mb-3">
                      Chọn thời gian thuê:
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <select
                        value={rentalDays}
                        onChange={(e) => setRentalDays(Number(e.target.value))}
                        className="px-4 py-2 border-2 border-secondary rounded-none bg-white text-text-primary font-bold focus:outline-none"
                      >
                        {[1, 2, 3, 5].map((days) => (
                          <option key={days} value={days}>
                            {days} ngày
                          </option>
                        ))}
                      </select>
                      <span className="text-text-primary">
                        ({formatPrice(product.rentalPrice)} / ngày)
                      </span>
                    </div>

                    <div className="bg-surface p-4 rounded-none border border-background-alt">
                      {isCalculating ? (
                        <div className="text-text-primary animate-pulse font-bold">
                          Đang tính phí thuê...
                        </div>
                      ) : (
                        <div>
                          <div className="text-lg text-text-primary">
                            Tổng phí thuê ({rentalDays} ngày):
                          </div>
                          <div className="text-3xl font-bold text-text-primary">
                            {formatPrice(
                              calculatedRentFee ||
                                product.rentalPrice * rentalDays,
                            )}
                          </div>
                          {discountInfo && discountInfo.discountAmount > 0 && (
                            <div className="text-sm font-bold text-emerald-600 mt-1">
                              ✓ Tiết kiệm{" "}
                              {formatPrice(discountInfo.discountAmount)} (
                              {discountInfo.discountRuleName})
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 40px rgba(212, 175, 55, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    addItem(
                      product,
                      rentalDays,
                      calculatedRentFee || product.rentalPrice * rentalDays,
                    );
                    toast.success(`Đã thêm vào giỏ hàng (${rentalDays} ngày)`);
                  }}
                  className="w-full py-5 rounded-full bg-linear-to-r from-secondary to-primary text-white text-xl font-bold flex items-center justify-center gap-2 shadow-xl"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Chọn Thuê Ngay
                </motion.button>
              </div>

              {/* Short Description */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-none shadow-sm border border-background-alt/50 p-8"
              >
                <h3 className="text-2xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-text-secondary" />
                  Mô Tả
                </h3>
                <p className="text-text-primary leading-relaxed text-lg">
                  {product.shortDescription}
                </p>
              </motion.div>

              {/* Product Details */}
              {product && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-none shadow-sm border border-background-alt/50 p-8 space-y-6"
                >
                  <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Package className="w-6 h-6 text-text-secondary" />
                    Thông Tin Chi Tiết
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="bg-linear-to-br from-white to-surface p-6 rounded-none">
                      <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5 text-text-secondary" />
                        Đặc điểm
                      </h4>
                      <p className="text-text-primary leading-relaxed">
                        Tình trạng:{" "}
                        {product.condition === "new"
                          ? "Mới"
                          : product.condition === "like_new"
                            ? "Như mới"
                            : product.condition === "good"
                              ? "Tốt"
                              : "Khá"}{" "}
                        <br />
                        Giới tính:{" "}
                        {product.gender === "male"
                          ? "Nam"
                          : product.gender === "female"
                            ? "Nữ"
                            : "Unisex"}
                      </p>
                    </div>

                    {/* Sizes */}
                    <div className="bg-linear-to-br from-white to-surface p-6 rounded-none">
                      <h4 className="text-xl font-bold text-text-primary mb-3">
                        Kích Cỡ
                      </h4>
                      <p className="text-text-primary text-2xl font-bold">
                        {product.size}
                      </p>
                    </div>

                    {/* Material */}
                    <div className="bg-linear-to-br from-white to-surface p-6 rounded-none">
                      <h4 className="text-xl font-bold text-text-primary mb-3">
                        Chất Liệu & Màu
                      </h4>
                      <p className="text-text-primary leading-relaxed">
                        Chất liệu: {product.material || "Chưa cập nhật"} <br />
                        Màu sắc: {product.color || "Chưa cập nhật"}
                      </p>
                    </div>

                    {/* Brand */}
                    <div className="bg-linear-to-br from-white to-surface p-6 rounded-none">
                      <h4 className="text-xl font-bold text-text-primary mb-3">
                        Thương Hiệu
                      </h4>
                      <p className="text-text-primary leading-relaxed">
                        {typeof product.brand === "object"
                          ? product.brand?.name
                          : product.brand || "Chưa cập nhật"}
                      </p>
                    </div>

                    {/* Description */}
                    {product.description && (
                      <div className="bg-linear-to-br from-white to-surface p-6 rounded-none md:col-span-2">
                        <h4 className="text-xl font-bold text-text-primary mb-4">
                          Mô tả chi tiết
                        </h4>
                        <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                          {product.description}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
