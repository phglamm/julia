import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, Save, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import categoryService from "../../services/categoryService";
import toast from "react-hot-toast";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await categoryService.getAllCategories();
      setCategories(resp.data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ─── Modal Openers ─────────────────────────────────────── */
  const openCreateModal = () => {
    setSelectedCategory(null);
    setIsCreating(true);
    setFormValues({ name: "", description: "", isActive: true });
    setShowFormModal(true);
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setIsCreating(false);
    setFormValues({
      name: cat.name || "",
      description: cat.description || "",
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setShowFormModal(true);
  };

  const openDeleteModal = (cat) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  /* ─── Close / Reset ─────────────────────────────────────── */
  const closeFormModal = () => {
    setShowFormModal(false);
    setIsCreating(false);
    setSelectedCategory(null);
    setFormValues({ name: "", description: "", isActive: true });
  };

  /* ─── CRUD Actions ──────────────────────────────────────── */
  const handleSave = async () => {
    if (!formValues.name.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        const resp = await categoryService.createCategory(formValues);
        setCategories((prev) => [...prev, resp.data]);
        toast.success("Tạo danh mục thành công");
      } else {
        const resp = await categoryService.updateCategory(selectedCategory._id, formValues);
        setCategories((prev) =>
          prev.map((c) => (c._id === selectedCategory._id ? resp.data : c))
        );
        toast.success("Cập nhật danh mục thành công");
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
    if (!selectedCategory) return;
    try {
      await categoryService.deleteCategory(selectedCategory._id);
      setCategories((prev) => prev.filter((c) => c._id !== selectedCategory._id));
      setShowDeleteModal(false);
      setSelectedCategory(null);
      toast.success("Xoá danh mục thành công");
    } catch (err) {
      toast.error("Xoá thất bại: " + (err.response?.data?.error || err.message));
    }
  };

  const toggleActive = async (cat) => {
    try {
      const resp = await categoryService.updateCategory(cat._id, {
        isActive: !cat.isActive,
      });
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? resp.data : c))
      );
      toast.success(resp.data.isActive ? "Đã kích hoạt" : "Đã vô hiệu hoá");
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  const inputCls =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  /* ─── Render ────────────────────────────────────────────── */
  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-600 rounded-lg">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quản lý danh mục</h1>
              <p className="text-xs text-gray-500 mt-0.5">{categories.length} danh mục</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────── */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-violet-600"></div>
          <p className="mt-3 text-gray-500 text-sm">Đang tải danh mục...</p>
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
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat, idx) => (
                  <tr key={cat._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-sm text-gray-400">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
                          <Tag className="w-3.5 h-3.5 text-violet-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                        {cat.description || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(cat)}
                        className="inline-flex items-center gap-1.5 cursor-pointer"
                        title={cat.isActive ? "Nhấn để vô hiệu hoá" : "Nhấn để kích hoạt"}
                      >
                        {cat.isActive ? (
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
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(cat)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
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
          {categories.length === 0 && !loading && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl mb-3">
                <Tag className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Chưa có danh mục</h3>
              <p className="text-gray-500 text-sm mb-5">Bắt đầu tạo danh mục cho cửa hàng của bạn</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Thêm danh mục đầu tiên
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ CREATE / EDIT MODAL ═══════════════ */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeFormModal} />
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-violet-600 rounded-md">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {isCreating ? "Thêm danh mục" : "Chỉnh sửa danh mục"}
                </h3>
              </div>
              <button onClick={closeFormModal} className="p-1.5 hover:bg-gray-100 rounded-md">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="VD: Áo dài, Váy cưới..."
                  value={formValues.name}
                  onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder="Mô tả ngắn về danh mục..."
                  value={formValues.description}
                  onChange={(e) => setFormValues((v) => ({ ...v, description: e.target.value }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-700">Trạng thái hoạt động</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Danh mục sẽ hiển thị khi ở trạng thái hoạt động
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
                    <ToggleLeft className="w-7 h-7 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
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
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isCreating ? "Tạo danh mục" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ DELETE MODAL ═══════════════════════ */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedCategory(null);
            }}
          />
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Xoá danh mục</h3>
              <p className="mt-2 text-sm text-gray-600">
                Bạn có chắc muốn xoá danh mục{" "}
                <span className="font-semibold text-gray-900">"{selectedCategory.name}"</span>?
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-2 px-6 pb-5">
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCategory(null);
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

