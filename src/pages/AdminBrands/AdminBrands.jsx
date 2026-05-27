import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, Save, Tag, ToggleLeft, ToggleRight, LayoutGrid } from "lucide-react";
import brandService from "../../services/brandService";
import toast from "react-hot-toast";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await brandService.getAllBrands();
      setBrands(resp.data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Lỗi khi tải thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  /* ─── Modal Openers ─────────────────────────────────────── */
  const openCreateModal = () => {
    setSelectedBrand(null);
    setIsCreating(true);
    setFormValues({ name: "", description: "", isActive: true });
    setShowFormModal(true);
  };

  const openEditModal = (b) => {
    setSelectedBrand(b);
    setIsCreating(false);
    setFormValues({
      name: b.name || "",
      description: b.description || "",
      isActive: b.isActive !== undefined ? b.isActive : true,
    });
    setShowFormModal(true);
  };

  const openDeleteModal = (b) => {
    setSelectedBrand(b);
    setShowDeleteModal(true);
  };

  /* ─── Close / Reset ─────────────────────────────────────── */
  const closeFormModal = () => {
    setShowFormModal(false);
    setIsCreating(false);
    setSelectedBrand(null);
    setFormValues({ name: "", description: "", isActive: true });
  };

  /* ─── CRUD Actions ──────────────────────────────────────── */
  const handleSave = async () => {
    if (!formValues.name.trim()) {
      toast.error("Tên thương hiệu không được để trống");
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        const resp = await brandService.createBrand(formValues);
        setBrands((prev) => [...prev, resp.data]);
        toast.success("Tạo thương hiệu thành công");
      } else {
        const resp = await brandService.updateBrand(selectedBrand._id, formValues);
        setBrands((prev) =>
          prev.map((c) => (c._id === selectedBrand._id ? resp.data : c))
        );
        toast.success("Cập nhật thương hiệu thành công");
      }
      closeFormModal();
    } catch (err) {
      toast.error(
        (isCreating ? "Tạo" : "Cập nhật") +
          " thất bại: " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBrand) return;
    try {
      await brandService.deleteBrand(selectedBrand._id);
      setBrands((prev) => prev.filter((c) => c._id !== selectedBrand._id));
      setShowDeleteModal(false);
      setSelectedBrand(null);
      toast.success("Xoá thương hiệu thành công");
    } catch (err) {
      toast.error("Xoá thất bại: " + (err.response?.data?.error || err.message));
    }
  };

  const toggleActive = async (b) => {
    try {
      const resp = await brandService.updateBrand(b._id, {
        isActive: !b.isActive,
      });
      setBrands((prev) =>
        prev.map((c) => (c._id === b._id ? resp.data : c))
      );
      toast.success(resp.data.isActive ? "Đã kích hoạt" : "Đã vô hiệu hoá");
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  const inputCls =
    "w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  /* ─── Render ────────────────────────────────────────────── */
  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-admin-surface rounded-2xl shadow-sm border border-admin-border p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-admin-muted">Quản lý thương hiệu</h1>
              <p className="text-xs text-admin-muted mt-0.5">{brands.length} thương hiệu</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm thương hiệu
          </button>
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────── */}
      {loading && (
        <div className="bg-admin-surface rounded-2xl shadow-sm border border-admin-border p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-admin-border border-t-rose-600"></div>
          <p className="mt-3 text-admin-muted text-sm">Đang tải thương hiệu...</p>
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
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-admin-muted uppercase tracking-wider">STT</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-admin-muted uppercase tracking-wider">Tên thương hiệu</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-admin-muted uppercase tracking-wider">Mô tả</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-admin-muted uppercase tracking-wider">Trạng thái</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-admin-muted uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-admin-muted uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {brands.map((b, idx) => (
                  <tr key={b._id} className="hover:bg-admin-bg/50">
                    <td className="px-5 py-3 text-sm text-admin-muted">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-admin-surface flex items-center justify-center shrink-0">
                          <LayoutGrid className="w-3.5 h-3.5 text-rose-600" />
                        </div>
                        <span className="text-sm font-medium text-admin-muted">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-admin-muted line-clamp-2 max-w-xs">
                        {b.description || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(b)}
                        className="inline-flex items-center gap-1.5 cursor-pointer"
                        title={b.isActive ? "Nhấn để vô hiệu hoá" : "Nhấn để kích hoạt"}
                      >
                        {b.isActive ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-500" />
                            <span className="px-2 py-0.5 text-xs font-medium bg-admin-bg text-green-600 rounded">
                              Hoạt động
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-admin-muted" />
                            <span className="px-2 py-0.5 text-xs font-medium bg-admin-bg text-admin-muted rounded">
                              Vô hiệu
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-sm text-admin-muted">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded-md text-admin-muted hover:text-admin-primary hover:bg-admin-surface"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(b)}
                          className="p-1.5 rounded-md text-admin-muted hover:text-red-600 hover:bg-red-50"
                          title="Xoá"
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
          {brands.length === 0 && !loading && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-admin-bg rounded-xl mb-3">
                <LayoutGrid className="w-6 h-6 text-admin-muted" />
              </div>
              <h3 className="text-base font-semibold text-admin-muted mb-1">Chưa có thương hiệu</h3>
              <p className="text-admin-muted text-sm mb-5">Bắt đầu tạo thương hiệu cho cửa hàng của bạn</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Thêm thương hiệu đầu tiên
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ CREATE / EDIT MODAL ═══════════════ */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-inverse/40" onClick={closeFormModal} />
          <div className="relative bg-admin-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-admin-border">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-rose-600 rounded-md">
                  <LayoutGrid className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-admin-muted">
                  {isCreating ? "Thêm thương hiệu" : "Chỉnh sửa thương hiệu"}
                </h3>
              </div>
              <button onClick={closeFormModal} className="p-1.5 hover:bg-admin-bg rounded-md">
                <X className="w-5 h-5 text-admin-muted" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-admin-muted mb-1">
                  Tên thương hiệu <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="VD: Zara, H&M..."
                  value={formValues.name}
                  onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-muted mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder="Mô tả ngắn về thương hiệu..."
                  value={formValues.description}
                  onChange={(e) => setFormValues((v) => ({ ...v, description: e.target.value }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-admin-bg rounded-lg border border-admin-border">
                <div>
                  <p className="text-sm font-medium text-admin-muted">Trạng thái hoạt động</p>
                  <p className="text-xs text-admin-muted mt-0.5">
                    Thương hiệu sẽ hiển thị khi ở trạng thái hoạt động
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormValues((v) => ({ ...v, isActive: !v.isActive }))}
                  className="shrink-0"
                >
                  {formValues.isActive ? (
                    <ToggleRight className="w-7 h-7 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-admin-muted" />
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-admin-border bg-admin-bg">
              <button
                onClick={closeFormModal}
                className="px-4 py-2 text-sm font-medium text-admin-muted bg-admin-surface border border-admin-border rounded-lg hover:bg-admin-bg"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-text-inverse/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isCreating ? "Tạo thương hiệu" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ DELETE MODAL ═══════════════════════ */}
      {showDeleteModal && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-inverse/40"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedBrand(null);
            }}
          />
          <div className="relative bg-admin-surface rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-admin-muted">Xoá thương hiệu</h3>
              <p className="mt-2 text-sm text-admin-muted">
                Bạn có chắc muốn xoá thương hiệu{" "}
                <span className="font-semibold text-admin-muted">"{selectedBrand.name}"</span>?
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-2 px-6 pb-5">
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-admin-muted bg-admin-bg hover:bg-admin-bg rounded-lg"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBrand(null);
                }}
              >
                Huỷ
              </button>
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-error hover:bg-red-700 rounded-lg"
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

