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

  /* ─── Render ────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* ── Header Card ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-200">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {categories.length} danh mục
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* ── Loading ────────────────────────────────────────── */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-violet-600"></div>
          <p className="mt-4 text-gray-500 text-sm">Đang tải danh mục...</p>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
            <p className="text-red-700 text-sm font-medium">Lỗi: {error}</p>
          </div>
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Tên danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat, idx) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-gray-50/60 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center shrink-0">
                          <Tag className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                        {cat.description || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(cat)}
                        className="group inline-flex items-center gap-2 cursor-pointer"
                        title={cat.isActive ? "Nhấn để vô hiệu hoá" : "Nhấn để kích hoạt"}
                      >
                        {cat.isActive ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600" />
                            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full">
                              Hoạt động
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
                            <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-500 rounded-full">
                              Vô hiệu
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(cat)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
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

          {/* Empty State */}
          {categories.length === 0 && !loading && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl mb-4">
                <Tag className="w-7 h-7 text-violet-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Chưa có danh mục
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Bắt đầu tạo danh mục cho cửa hàng của bạn
              </p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-200"
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
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeFormModal}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {isCreating ? "Thêm danh mục" : "Chỉnh sửa danh mục"}
                </h3>
              </div>
              <button
                onClick={closeFormModal}
                className="p-2 hover:bg-white/80 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                  placeholder="VD: Áo dài, Váy cưới..."
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, name: e.target.value }))
                  }
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all resize-none"
                  placeholder="Mô tả ngắn về danh mục..."
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, description: e.target.value }))
                  }
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Trạng thái hoạt động
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Danh mục sẽ hiển thị khi ở trạng thái hoạt động
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
                    <ToggleRight className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={closeFormModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl transition-all shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedCategory(null);
            }}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Xoá danh mục</h3>
              <p className="mt-2 text-sm text-gray-600">
                Bạn có chắc muốn xoá danh mục{" "}
                <span className="font-semibold text-gray-900">
                  "{selectedCategory.name}"
                </span>
                ? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCategory(null);
                }}
              >
                Huỷ
              </button>
              <button
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
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
