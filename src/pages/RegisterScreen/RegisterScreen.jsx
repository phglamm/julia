import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  UserPlus,
  Sparkles,
  Mail,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useUserStore } from "../../stores/userStore";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useUserStore((state) => state.login);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.register(registerData);
      console.log("Register successful:", response.data);

      // Auto login after registration
      Cookies.set("token", response.data.token, { expires: 1 });
      const user = jwtDecode(response.data.token);
      console.log("Decoded user:", user);
      login(user);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Register error:", error);
      setError(
        error.response?.data?.message ||
          "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface to-surface flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating sparkles decoration */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 text-muted opacity-20"
      >
        <Sparkles className="w-16 h-16" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 text-muted opacity-20"
      >
        <Sparkles className="w-20 h-20" />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Brand Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1
            className="text-5xl font-bold text-heading mb-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Julia
          </motion.h1>
          <p className="text-lg text-body">Tạo tài khoản mới</p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          variants={itemVariants}
          className="bg-surface rounded-none shadow-md border border-background-alt/50 overflow-hidden border border-background-alt/30"
        >
          <div className="bg-gradient-to-r from-primary via-primary to-primary p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Đăng Ký</h2>
            <p className="text-white/80 mt-2">
              Tạo tài khoản để trải nghiệm
            </p>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-error-bg border border-error rounded-none text-error text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username Field */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-heading font-semibold mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-body w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-surface/30 to-background-alt/20 border-2 border-background-alt/40 rounded-none focus:outline-none focus:border-secondary transition-all text-body placeholder-primary/50"
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-body font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-body w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email"
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-surface/30 to-background-alt/20 border-2 border-background-alt/40 rounded-none focus:outline-none focus:border-secondary transition-all text-body placeholder-primary/50"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-body font-semibold mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-body w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  className="w-full pl-12 pr-12 py-4 bg-gradient-to-br from-surface/30 to-background-alt/20 border-2 border-background-alt/40 rounded-none focus:outline-none focus:border-secondary transition-all text-body placeholder-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-body hover:text-muted transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-body font-semibold mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-body w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-12 pr-12 py-4 bg-gradient-to-br from-surface/30 to-background-alt/20 border-2 border-background-alt/40 rounded-none focus:outline-none focus:border-secondary transition-all text-body placeholder-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-body hover:text-muted transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div variants={itemVariants} className="mb-8">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-muted border-background-alt rounded focus:ring-secondary cursor-pointer"
                  required
                />
                <span className="ml-2 text-sm text-body group-hover:text-body transition-colors">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-muted hover:underline">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-muted hover:underline">
                    Chính sách bảo mật
                  </a>
                </span>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-none font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
                loading
                  ? "bg-text-secondary cursor-not-allowed"
                  : "bg-btn-primary hover:bg-btn-hover text-body hover:shadow-xl"
              }`}
            >
              {loading ? (
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
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Đăng Ký</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-background-alt/40"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface text-body">hoặc</span>
              </div>
            </motion.div>

            {/* Login Link */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-body">
                Đã có tài khoản?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                  className="text-muted hover:text-body font-bold transition-colors"
                >
                  Đăng nhập ngay
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          variants={itemVariants}
          className="text-center mt-8 text-sm text-body"
        >
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <a href="#" className="text-muted hover:underline">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="#" className="text-muted hover:underline">
            Chính sách bảo mật
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}


