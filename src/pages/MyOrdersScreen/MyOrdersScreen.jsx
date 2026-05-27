import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  CreditCard,
  RefreshCcw,
  ArrowLeft,
  ShoppingBag,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import { useUserStore } from "../../stores/userStore";

export default function MyOrdersScreen() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const imgSrc = (item) => {
    if (!item?.product) return "/images/placeholder.png";
    const p = item.product;
    return p.images?.[0] || p.imageLink || "/images/placeholder.png";
  };

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-800" };
      case "paid":
        return { label: "Đã thanh toán", color: "bg-green-100 text-green-800" };
      case "cancelled":
        return { label: "Đã huỷ", color: "bg-red-100 text-red-800" };
      case "completed":
        return { label: "Đã hoàn thành", color: "bg-blue-100 text-blue-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-background-alt flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-background-alt">
      <section className="relative w-full bg-gradient-to-br from-primary via-primary to-primary pt-32 pb-16 text-center text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Xem lại lịch sử thuê và số tiền hoàn lại dự kiến
          </p>
        </div>
      </section>

      <section className="w-full py-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-8 inline-flex items-center gap-2 text-text-primary hover:text-text-secondary font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại trang chủ
          </button>

          {error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center shadow-sm">
              <p>{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-4 px-6 py-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
              <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Chưa có đơn hàng nào
              </h2>
              <p className="text-text-primary mb-8">
                Bạn chưa thực hiện giao dịch thuê nào trên hệ thống.
              </p>
              <button
                onClick={() => navigate("/bst")}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Khám phá bộ sưu tập
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {orders.map((order) => {
                const statusInfo = translateStatus(order.status);
                
                return (
                  <motion.div
                    key={order._id}
                    variants={itemVariants}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden border border-background-alt/50"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#F9F7F0] to-white p-6 border-b border-background-alt/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-text-primary font-semibold flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4" />
                          Mã đơn: #{order.orderCode}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-4 p-4 bg-[#F9F7F0] rounded-2xl"
                          >
                            <img
                              src={imgSrc(item)}
                              alt={item.product?.title || "Product"}
                              className="w-20 h-20 object-cover rounded-xl shadow-sm"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-text-primary">
                                {item.product?.title || "Sản phẩm không còn tồn tại"}
                              </h3>
                              <p className="text-sm text-text-primary mb-2">
                                Thời gian thuê: {item.rentalDays} ngày
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                Phí thuê: <span className="font-semibold text-gray-700">{formatPrice(item.price)}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer / Summary */}
                    <div className="bg-gradient-to-r from-primary to-primary p-6 text-white grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
                      
                      <div className="flex flex-col justify-center">
                        <p className="text-sm opacity-80 mb-1">Đã thanh toán (Cọc + Thuê)</p>
                        <p className="text-xl font-bold">
                          {formatPrice(order.amount + (order.totalDepositAmount || 0))}
                        </p>
                      </div>
                      
                      <div className="flex flex-col justify-center sm:pl-6 pt-4 sm:pt-0">
                        <p className="text-sm opacity-80 mb-1">Tổng phí thuê</p>
                        <p className="text-xl font-bold">
                          {formatPrice(order.amount)}
                        </p>
                      </div>

                      <div className="flex flex-col justify-center sm:pl-6 pt-4 sm:pt-0">
                        <div className="flex items-center gap-2 opacity-90 mb-1">
                          <RefreshCcw className="w-4 h-4" />
                          <p className="text-sm font-semibold">Số tiền hoàn lại (dự kiến)</p>
                        </div>
                        <p className="text-3xl font-black text-text-surface">
                          {formatPrice(order.returnAmount)}
                        </p>
                        <p className="text-[10px] mt-1 opacity-70 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Hoàn trả khi trả đồ thành công
                        </p>
                      </div>
                      
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}


