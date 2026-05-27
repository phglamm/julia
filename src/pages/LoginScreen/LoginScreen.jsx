import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useUserStore } from "../../stores/userStore";
import { route } from "../../router";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const response = await authService.login(formData);
      console.log("Login successful:", response.data);
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
      console.error("Login error:", error);
      setError("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
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
          <p className="text-lg text-body">Chào mừng trở lại</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="bg-surface rounded-none shadow-md border border-background-alt/50 overflow-hidden border border-background-alt/30"
        >
          <div className="bg-gradient-to-r from-primary via-primary to-primary p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Đăng Nhập</h2>
            <p className="text-white/80 mt-2">
              Truy cập vào tài khoản của bạn
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
                  placeholder="Nhập mật khẩu"
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

            {/* Remember Me & Forgot Password */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-8"
            >
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-muted border-background-alt rounded focus:ring-secondary cursor-pointer"
                />
                <span className="ml-2 text-sm text-body group-hover:text-body transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-muted hover:text-body font-semibold transition-colors"
              >
                Quên mật khẩu?
              </a>
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
                  <LogIn className="w-5 h-5" />
                  <span>Đăng Nhập</span>
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

            {/* Sign Up Link */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-body">
                Chưa có tài khoản?{" "}
                <a
                  href={route.register}
                  className="text-muted hover:text-body font-bold transition-colors"
                >
                  Đăng ký ngay
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
          Bằng việc đăng nhập, bạn đồng ý với{" "}
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


