import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  Percent,
} from "lucide-react";
import rentalDiscountRuleService from "../../services/rentalDiscountRuleService";
import toast from "react-hot-toast";

export default function AdminRentalRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    minDays: 1,
    discountType: "percentage",
    discountValue: 0,
    isActive: true,
  });

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await rentalDiscountRuleService.getAllRules();
      setRules(resp.data || []);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Lỗi khi tải luật giảm giá",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  /* ─── Modal Openers ─────────────────────────────────────── */
  const openCreateModal = () => {
    setSelectedRule(null);
    setIsCreating(true);
    setFormValues({
      name: "",
      minDays: 1,
      discountType: "percentage",
      discountValue: 0,
      isActive: true,
    });
    setShowFormModal(true);
  };

  const openEditModal = (r) => {
    setSelectedRule(r);
    setIsCreating(false);
    setFormValues({
      name: r.name || "",
      minDays: r.minDays || 1,
      discountType: r.discountType || "percentage",
      discountValue: r.discountValue || 0,
      isActive: r.isActive !== undefined ? r.isActive : true,
    });
    setShowFormModal(true);
  };

  const openDeleteModal = (r) => {
    setSelectedRule(r);
    setShowDeleteModal(true);
  };

  /* ─── Close / Reset ─────────────────────────────────────── */
  const closeFormModal = () => {
    setShowFormModal(false);
    setIsCreating(false);
    setSelectedRule(null);
    setFormValues({
      name: "",
      minDays: 1,
      discountType: "percentage",
      discountValue: 0,
      isActive: true,
    });
  };

  /* ─── CRUD Actions ──────────────────────────────────────── */
  const handleSave = async () => {
    if (
      !formValues.name.trim() ||
      formValues.minDays < 1 ||
      formValues.discountValue <= 0
    ) {
      toast.error(
        "Vui lòng điền đủ thông tin hợp lệ (tên, số ngày tối thiểu > 0, giá trị giảm > 0)",
      );
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        const resp = await rentalDiscountRuleService.createRule(formValues);
        setRules((prev) => [...prev, resp.data]);
        toast.success("Tạo luật giảm giá thành công");
      } else {
        const resp = await rentalDiscountRuleService.updateRule(
          selectedRule._id,
          formValues,
        );
        setRules((prev) =>
          prev.map((c) => (c._id === selectedRule._id ? resp.data : c)),
        );
        toast.success("Cập nhật luật giảm giá thành công");
      }
      closeFormModal();
    } catch (err) {
      toast.error(
        (isCreating ? "Tạo" : "Cập nhật") +
          " thất bại: " +
          (err.response?.data?.error || err.message),
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRule) return;
    try {
      await rentalDiscountRuleService.deleteRule(selectedRule._id);
      setRules((prev) => prev.filter((c) => c._id !== selectedRule._id));
      setShowDeleteModal(false);
      setSelectedRule(null);
      toast.success("Xoá luật giảm giá thành công");
    } catch (err) {
      toast.error(
        "Xoá thất bại: " + (err.response?.data?.error || err.message),
      );
    }
  };

  const toggleActive = async (r) => {
    try {
      const resp = await rentalDiscountRuleService.updateRule(r._id, {
        isActive: !r.isActive,
      });
      setRules((prev) => prev.map((c) => (c._id === r._id ? resp.data : c)));
      toast.success(resp.data.isActive ? "Đã kích hoạt" : "Đã vô hiệu hoá");
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  const inputCls =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";
  const selectCls = `${inputCls} bg-white`;

  const fmt = (val, type) => {
    if (type === "percentage") return `${val}%`;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  /* ─── Render ────────────────────────────────────────────── */
  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-lg">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Luật giảm giá thuê
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {rules.length} quy tắc
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm luật mới
          </button>
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────── */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-orange-500"></div>
          <p className="mt-3 text-gray-500 text-sm">
            Đang tải luật giảm giá...
          </p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">Lỗi: {error}</p>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Tên luật
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Số ngày tối thiểu
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Giảm giá
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rules
                  .sort((a, b) => b.minDays - a.minDays)
                  .map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
                            <Percent className="w-3.5 h-3.5 text-orange-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 block">
                              {r.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {r.minDays} ngày
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded">
                          Giảm {fmt(r.discountValue, r.discountType)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleActive(r)}
                          className="inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          {r.isActive ? (
                            <>
                              <ToggleRight className="w-5 h-5 text-emerald-500" />
                              <span className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded">
                                Hoạt động
                              </span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 rounded">
                                Vô hiệu
                              </span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => openEditModal(r)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(r)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {rules.length === 0 && !loading && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl mb-3">
                <Percent className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Chưa có luật giảm giá
              </h3>
              <p className="text-gray-500 text-sm mb-5">
                Tạo các luật giảm giá khuyến khích thuê nhiều ngày
              </p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Thêm luật đầu tiên
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ CREATE / EDIT MODAL ═══════════════ */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeFormModal}
          />
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-orange-500 rounded-md">
                  <Percent className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {isCreating ? "Thêm luật giảm giá" : "Chỉnh sửa luật"}
                </h3>
              </div>
              <button
                onClick={closeFormModal}
                className="p-1.5 hover:bg-gray-100 rounded-md"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên luật <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="VD: Thuê 5 ngày giảm 10%"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số ngày tối thiểu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={inputCls}
                    value={formValues.minDays}
                    onChange={(e) =>
                      setFormValues((v) => ({
                        ...v,
                        minDays: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giảm giá <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={selectCls}
                    value={formValues.discountType}
                    onChange={(e) =>
                      setFormValues((v) => ({
                        ...v,
                        discountType: e.target.value,
                      }))
                    }
                  >
                    <option value="percentage">Theo %</option>
                    <option value="fixed_amount">Số tiền cố định</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị giảm <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className={inputCls}
                  placeholder={
                    formValues.discountType === "percentage"
                      ? "VD: 10"
                      : "VD: 50000"
                  }
                  value={formValues.discountValue}
                  onChange={(e) =>
                    setFormValues((v) => ({
                      ...v,
                      discountValue: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Trạng thái hoạt động
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormValues((v) => ({ ...v, isActive: !v.isActive }))
                  }
                  className="shrink-0"
                >
                  {formValues.isActive ? (
                    <ToggleRight className="w-7 h-7 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeFormModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isCreating ? "Tạo luật" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ DELETE MODAL ═══════════════════════ */}
      {showDeleteModal && selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedRule(null);
            }}
          />
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Xoá luật giảm giá
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Bạn có chắc muốn xoá luật{" "}
                <span className="font-semibold text-gray-900">
                  "{selectedRule.name}"
                </span>
                ? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-2 px-6 pb-5">
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRule(null);
                }}
              >
                Huỷ
              </button>
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                onClick={confirmDelete}
              >
                Xác nhận xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

