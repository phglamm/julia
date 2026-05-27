import { useEffect, useState } from "react";
import { Eye, Package, X, Download } from "lucide-react";
import orderService from "../../services/orderService";
import toast from "react-hot-toast";

export default function AdminOrderScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await orderService.getOrders();
      setOrders(resp.data || []);
    } catch (err) {
      setError(err.message || "Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // delete action intentionally removed per request

  const formatCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);

  // Export orders to CSV (Excel-friendly with BOM)
  const exportToCSV = () => {
    if (!orders || orders.length === 0) {
      toast.error("Không có đơn hàng để xuất");
      return;
    }

    const headers = [
      "Mã đơn",
      "Khách hàng",
      "Số điện thoại",
      "Địa chỉ",
      "Sản phẩm",
      "Số lượng",
      "Tổng tiền",
      "Trạng thái",
      "Ngày tạo",
    ];

    const rows = orders.map((o) => [
      o.orderCode,
      o.fullName,
      o.phoneNumber,
      o.address,
      o.items.map((item) => `${item.product?.title || "-"}`).join(" | "),
      o.items.map((item) => `${item.quantity}`).join(" | "),
      o.amount,
      o.status,
      new Date(o.createdAt).toLocaleString("vi-VN"),
    ]);

    const csvContent = [headers, ...rows]
      .map((r) =>
        r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `don-hang-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const statusStyle = (status) => {
    const map = {
      paid: "bg-admin-bg text-green-600",
      cancelled: "bg-red-50 text-red-600",
    };
    return map[status] || "bg-amber-50 text-amber-700";
  };

  const statusLabel = (status) => {
    const map = {
      paid: "Đã thanh toán",
      pending: "Chờ xử lý",
      cancelled: "Đã huỷ",
    };
    return map[status] || status;
  };

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-admin-surface rounded-2xl shadow-sm border border-admin-border p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-admin-muted">Quản lý đơn hàng</h1>
              <p className="text-xs text-admin-muted mt-0.5">{orders.length} đơn hàng</p>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
            onClick={exportToCSV}
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────── */}
      {loading && (
        <div className="bg-admin-surface rounded-2xl shadow-sm border border-admin-border p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-admin-border border-t-blue-600"></div>
          <p className="mt-3 text-admin-muted text-sm">Đang tải đơn hàng...</p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-error rounded-xl p-4">
          <p className="text-red-600 text-sm">Lỗi: {error}</p>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="bg-admin-surface rounded-2xl shadow-sm border border-admin-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-admin-bg border-b border-admin-border">
                  {["STT","Mã đơn","Khách hàng","SĐT","Sản phẩm","Tổng tiền","Trạng thái",""].map((h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider ${
                        i === 7 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o, idx) => (
                  <tr key={o._id} className="hover:bg-admin-bg/50">
                    <td className="px-4 py-3 text-sm text-admin-muted">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-admin-muted">
                      {o.orderCode}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-admin-muted">{o.fullName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-admin-muted">
                      {o.phoneNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-admin-muted line-clamp-1 max-w-[200px]">
                        {o.items?.length > 0
                          ? o.items.map((item) => item.product?.title || "-").join(", ")
                          : "-"}
                      </p>
                      <p className="text-[11px] text-admin-muted mt-0.5">
                        {o.items?.length || 0} sản phẩm
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-admin-muted">
                      {formatCurrency(o.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${statusStyle(o.status)}`}>
                        {statusLabel(o.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          className="p-1.5 rounded-md text-admin-muted hover:text-blue-600 hover:bg-blue-50"
                          title="Xem chi tiết"
                          onClick={() => {
                            setSelectedOrder(o);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty */}
          {orders.length === 0 && !loading && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-admin-bg rounded-xl mb-3">
                <Package className="w-6 h-6 text-admin-muted" />
              </div>
              <h3 className="text-base font-semibold text-admin-muted mb-1">
                Chưa có đơn hàng
              </h3>
              <p className="text-admin-muted text-sm">
                Đơn hàng sẽ hiển thị ở đây khi có giao dịch
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ ORDER DETAIL MODAL ═══════════════ */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-inverse/40"
            onClick={() => {
              setShowModal(false);
              setSelectedOrder(null);
            }}
          />
          <div className="relative bg-admin-surface rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-admin-border">
              <h3 className="text-base font-bold text-admin-muted">Chi tiết đơn hàng</h3>
              <button
                className="p-1.5 hover:bg-admin-bg rounded-md"
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
              >
                <X className="w-5 h-5 text-admin-muted" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Info rows */}
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Mã đơn" value={selectedOrder.orderCode} />
                <InfoRow label="Trạng thái">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${statusStyle(selectedOrder.status)}`}>
                    {statusLabel(selectedOrder.status)}
                  </span>
                </InfoRow>
                <InfoRow label="Khách hàng" value={selectedOrder.fullName} />
                <InfoRow label="Số điện thoại" value={selectedOrder.phoneNumber} />
                <InfoRow label="Địa chỉ" value={selectedOrder.address} className="col-span-2" />
                <InfoRow label="Ngày tạo" value={new Date(selectedOrder.createdAt).toLocaleString("vi-VN")} />
                <InfoRow label="Tổng tiền">
                  <span className="text-sm font-semibold text-admin-muted">
                    {formatCurrency(selectedOrder.amount)}
                  </span>
                </InfoRow>
              </div>

              {/* Products table */}
              {selectedOrder.items?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-admin-muted uppercase tracking-wider mb-2">
                    Sản phẩm
                  </p>
                  <div className="border border-admin-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-admin-bg">
                          <th className="px-3 py-2 text-left text-[11px] font-semibold text-admin-muted uppercase">
                            Tên
                          </th>
                          <th className="px-3 py-2 text-left text-[11px] font-semibold text-admin-muted uppercase">
                            SL
                          </th>
                          <th className="px-3 py-2 text-left text-[11px] font-semibold text-admin-muted uppercase">
                            Đơn giá
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrder.items.map((item) => (
                          <tr key={item._id}>
                            <td className="px-3 py-2 text-sm text-admin-muted">
                              {item.product?.title || "-"}
                            </td>
                            <td className="px-3 py-2 text-sm text-admin-muted">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-2 text-sm text-admin-muted">
                              {formatCurrency(item.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-admin-border bg-admin-bg text-right">
              <button
                className="px-4 py-2 text-sm font-medium text-admin-muted bg-admin-surface border border-admin-border rounded-lg hover:bg-admin-bg"
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Info row helper ──────────────────────────────────────── */
function InfoRow({ label, value, children, className = "" }) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium text-admin-muted uppercase tracking-wider mb-0.5">
        {label}
      </p>
      {children || <p className="text-sm text-admin-muted">{value || "—"}</p>}
    </div>
  );
}

