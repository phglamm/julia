import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Calendar,
  Package,
  Sparkles,
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import brandService from "../../services/brandService";
import banner3 from "../../assets/banner3.png";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "unisex", label: "Unisex" },
];
const CONDITION_OPTIONS = [
  { value: "new", label: "Mới" },
  { value: "like_new", label: "Như mới" },
  { value: "good", label: "Tốt" },
  { value: "fair", label: "Khá" },
];

export default function BstScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    brand: "",
    size: "",
    gender: "",
    condition: "",
  });

  // Read searchTerm from query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get("searchTerm") || "";
    if (term) {
      setFilters((prev) => ({ ...prev, searchTerm: term }));
    }
  }, [location.search]);

  // Fetch options (Categories, Brands)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catResp, brandResp] = await Promise.all([
          categoryService.getAllCategories(),
          brandService.getAllBrands(),
        ]);
        setCategories(catResp.data || []);
        setBrands(brandResp.data || []);
      } catch (err) {
        console.error("Failed to fetch filter options", err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Remove empty filters
        const activeFilters = Object.entries(filters).reduce(
          (acc, [key, val]) => {
            if (val) acc[key] = val;
            return acc;
          },
          {},
        );

        const resp = await productService.getAllProducts(activeFilters);
        setProducts(resp.data?.products || []);
      } catch (err) {
        setError(err.message || "Lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    // Debounce to prevent rapid API calls on typing
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      category: "",
      brand: "",
      size: "",
      gender: "",
      condition: "",
    });
    navigate("/bst"); // clear URL query params if any
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const imgSrc = (link) => {
    if (!link) return "/images/placeholder.png";
    return link;
  };

  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-background-alt">
      {/* Hero Section */}
      <section className="relative w-full h-[100vh] text-center text-white overflow-hidden">
        <img
          src={banner3}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-fitt z-0"
        />
        <div className="absolute inset-0 bg-black/40 z-5"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="px-6 lg:px-12 max-w-7xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className=" text-5xl lg:text-7xl font-bold mb-6"
            >
              Sản Phẩm Của Chúng Tôi
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl lg:text-2xl mb-10 opacity-95 leading-relaxed max-w-4xl mx-auto"
            >
              Khám phá những trang phục cao cấp, được tuyển chọn kỹ lưỡng
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="w-full bg-white py-20 lg:py-28 px-6 lg:px-12">
        <div className=" flex flex-col lg:flex-row gap-12">
          {/* LEFT SIDEBAR (FILTERS) */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white rounded-none border border-background-alt/50 shadow-sm p-8 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-text-primary">Bộ Lọc</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-text-secondary hover:text-text-primary font-semibold flex items-center gap-2 text-sm"
                  >
                    <X className="w-4 h-4" />
                    Xóa
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-bold text-text-primary mb-2 block">
                    Tìm kiếm
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Tên, mô tả..."
                      value={filters.searchTerm}
                      onChange={(e) =>
                        handleFilterChange("searchTerm", e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-3 border border-background-alt/50 rounded-none bg-white text-text-primary focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-bold text-text-primary mb-2 block">
                    Danh mục
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-3 border border-background-alt/50 rounded-none bg-white text-text-primary focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="">Tất cả</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-bold text-text-primary mb-2 block">
                    Thương hiệu
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) =>
                      handleFilterChange("brand", e.target.value)
                    }
                    className="w-full px-3 py-3 border border-background-alt/50 rounded-none bg-white text-text-primary focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="">Tất cả</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="text-sm font-bold text-text-primary mb-3 block">
                    Kích cỡ
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          handleFilterChange(
                            "size",
                            filters.size === size ? "" : size,
                          )
                        }
                        className={`px-3 py-2 rounded-full font-semibold transition-all text-sm ${
                          filters.size === size
                            ? "bg-secondary text-text-primary"
                            : "bg-white text-text-primary hover:bg-background-alt border border-background-alt"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-bold text-text-primary mb-2 block">
                    Giới tính
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) =>
                      handleFilterChange("gender", e.target.value)
                    }
                    className="w-full px-3 py-3 border border-background-alt/50 rounded-none bg-white text-text-primary focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="">Tất cả</option>
                    {GENDER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-sm font-bold text-text-primary mb-2 block">
                    Tình trạng
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) =>
                      handleFilterChange("condition", e.target.value)
                    }
                    className="w-full px-3 py-3 border border-background-alt/50 rounded-none bg-white text-text-primary focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="">Tất cả</option>
                    {CONDITION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT (PRODUCTS) */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary">
                {products.length} sản phẩm
              </h2>
            </div>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-2xl text-text-primary font-semibold"
              >
                <Package className="w-16 h-16 mx-auto mb-4 text-text-secondary animate-pulse" />
                Đang tải sản phẩm...
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 text-red-600 text-xl"
              >
                <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 max-w-md mx-auto">
                  <p className="font-bold mb-2">Lỗi tải dữ liệu</p>
                  <p className="text-base">{error}</p>
                </div>
              </motion.div>
            )}

            {!loading && !error && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="bg-surface border-2 border-background-alt rounded-3xl p-8 max-w-md mx-auto">
                  <Package className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
                  <p className="text-2xl font-bold text-text-primary mb-2">
                    Không tìm thấy sản phẩm
                  </p>
                  <p className="text-text-primary">
                    Hãy thử thay đổi bộ lọc để xem nhiều kết quả hơn
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-6 px-6 py-2 bg-secondary text-white rounded-full font-bold hover:bg-primary transition-colors"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {!loading && !error && products.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-white rounded-none border border-background-alt/50 shadow-sm overflow-hidden cursor-pointer group flex flex-col"
                  >
                    <div className="h-80 bg-gradient-to-br from-white to-background-alt flex items-center justify-center overflow-hidden relative">
                      <img
                        src={imgSrc(product.images?.[0] || product.imageLink)}
                        alt={product.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300"></div>

                      {/* Tags */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {product.condition === "new" && (
                          <span className="px-2 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-none shadow-sm">
                            Mới
                          </span>
                        )}
                        {product.brand && (
                          <span className="px-2 py-1 bg-white/90 text-text-primary text-[10px] font-bold uppercase rounded-none shadow-sm backdrop-blur-sm border border-background-alt/50">
                            {typeof product.brand === "object"
                              ? product.brand.name
                              : product.brand}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-text-secondary transition-colors line-clamp-1">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-text-primary mb-4">
                        <span className="px-2 py-1 bg-surface rounded-none">
                          {product.size}
                        </span>
                        <span>•</span>
                        <span className="capitalize">
                          {product.gender === "male"
                            ? "Nam"
                            : product.gender === "female"
                              ? "Nữ"
                              : "Unisex"}
                        </span>
                      </div>

                      <div className="mt-auto pt-4 border-t border-background-alt/30">
                        <div className="flex flex-col gap-1 mb-4">
                          <p className="text-sm font-bold text-text-primary">
                            Giá trị:{" "}
                            {formatPrice(
                              product.depositAmount || product.price,
                            )}
                          </p>
                          <p className="text-xs text-text-primary">
                            Phí thuê:{" "}
                            <span className="font-bold text-text-secondary text-base">
                              {formatPrice(
                                product.rentalPrice || product.price,
                              )}
                            </span>{" "}
                            / Ngày
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-bold shadow-lg flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-5 h-5" />
                          Xem Chi Tiết
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
