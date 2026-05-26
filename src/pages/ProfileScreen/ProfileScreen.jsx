import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Star,
  Home,
  Globe,
  Building,
  Map,
  UserCircle,
} from "lucide-react";
import userService from "../../services/userService";
import { useUserStore } from "../../stores/userStore";

/* ─── helpers ──────────────────────────────────── */
const fmt = (v) => (v && v.toString().trim() ? v : null);
const fmtDate = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
};
const genderLabel = (g) => {
  if (!g) return null;
  return { male: "Nam", female: "Nữ", other: "Khác" }[g.toLowerCase()] ?? g;
};

/* ─── shared styles ──────────────────────────────── */
const inputCls =
  "w-full px-4 py-3 border-2 border-[#ead2d8]/60 bg-white text-sm text-[#682535] outline-none focus:border-[#c599a6] focus:ring-2 focus:ring-[#c599a6]/15 transition-all placeholder:text-[#874d5f]/40 font-[inherit]";

/* ─── Display field (view mode) ──────────────────── */
function DisplayField({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#874d5f]">
        <Icon size={11} className="text-[#c599a6]" />
        {label}
      </span>
      <div className="px-4 py-3 bg-gradient-to-br from-[#fdfaf7] to-[#f6f3e6] border border-[#ead2d8]/40 text-sm font-medium text-[#682535] min-h-[46px] flex items-center">
        {value ? (
          value
        ) : (
          <span className="text-[#c5a9b1] italic text-xs">Chưa cập nhật</span>
        )}
      </div>
    </div>
  );
}

/* ─── Editable field (edit mode) ─────────────────── */
function EditField({ icon: Icon, label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#874d5f]">
        <Icon size={11} className="text-[#c599a6]" />
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Section divider ────────────────────────────── */
function SectionDivider({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#874d5f] col-span-full mt-1 mb-1 pb-2 border-b border-dashed border-[#ead2d8]">
      <Icon size={12} className="text-[#c599a6]" />
      {children}
    </div>
  );
}

/* ─── Main component ─────────────────────────────── */
export default function ProfileScreen() {
  const updateUser = useUserStore((s) => s.updateUser);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    dob: "",
    gender: "",
    address: {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "Vietnam",
    },
  });

  /* ── fetch on mount ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await userService.getProfile();
        const data = res.data;
        setProfile(data);
        syncForm(data);
      } catch (err) {
        setFetchError("Không thể tải thông tin. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const syncForm = (data) => {
    setForm({
      fullName: data.fullName ?? "",
      phone: data.phone ?? "",
      dob: data.dob ? data.dob.slice(0, 10) : "",
      gender: data.gender ?? "",
      address: {
        street: data.address?.street ?? "",
        ward: data.address?.ward ?? "",
        district: data.address?.district ?? "",
        city: data.address?.city ?? "",
        country: data.address?.country ?? "Vietnam",
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleCancel = () => {
    if (profile) syncForm(profile);
    setSaveError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const res = await userService.updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        dob: form.dob || null,
        gender: form.gender,
        address: form.address,
      });
      const updated = res.data;
      setProfile(updated);
      updateUser(updated);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setSaveError(
        err?.response?.data?.message ?? "Cập nhật thất bại. Vui lòng thử lại.",
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-[#f6f3e6] to-[#ead2d8] px-4 sm:px-6 py-14">
        <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
          <div className="h-7 w-48 mx-auto bg-[#ead2d8] rounded" />
          <div className="h-36 bg-[#ead2d8]" />
          <div className="h-72 bg-[#ead2d8]" />
        </div>
      </div>
    );
  }

  /* ── Fetch error ── */
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-[#f6f3e6] to-[#ead2d8] px-4 sm:px-6 py-14">
        <div className="max-w-3xl mx-auto flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          <AlertCircle size={18} />
          {fetchError}
        </div>
      </div>
    );
  }

  const addr = profile?.address ?? {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-[#f6f3e6] to-[#ead2d8] px-4 sm:px-6 py-14 relative overflow-hidden">
      {/* dot grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle,#682535 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* page title */}
      <motion.div
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#682535] tracking-tight">
          Tài Khoản Của Tôi
        </h1>
        <p className="text-[#874d5f] mt-1 text-sm">
          Thông tin cá nhân và địa chỉ của bạn
        </p>
      </motion.div>

      {/* alerts */}
      <div className="max-w-3xl mx-auto relative z-10">
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle size={16} />
              Cập nhật thông tin thành công!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Card ── */}
      <motion.div
        className="max-w-3xl mx-auto bg-white border border-[#ead2d8]/50 shadow-[0_8px_40px_rgba(104,37,53,0.08)] overflow-hidden relative z-10"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* ── Hero strip ── */}
        <div className="bg-gradient-to-r from-[#682535] via-[#874d5f] to-[#682535] px-6 py-7 flex items-center justify-between gap-5">
          <div className="flex items-center gap-5 min-w-0">
            <motion.div
              className="relative shrink-0"
              whileHover={{ scale: 1.07 }}
            >
              <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center text-white">
                <User size={36} />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#c599a6] border-2 border-white flex items-center justify-center text-white">
                <Star size={11} fill="currentColor" />
              </div>
            </motion.div>

            <div className="min-w-0">
              <div className="text-xl font-bold text-white leading-tight truncate">
                {fmt(profile?.fullName) ??
                  profile?.username ??
                  "Người dùng Julia"}
              </div>
              <div className="text-white/65 text-sm mt-0.5 truncate">
                {profile?.email}
              </div>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#c599a6] to-[#a47784] text-white text-[11px] font-bold shadow">
                  <Sparkles size={11} />
                  {profile?.points ?? 0} điểm
                </span>
              </div>
            </div>
          </div>

          {/* Edit button — only shown in view mode */}
          {!isEditing && (
            <motion.button
              id="btn-enable-edit"
              onClick={() => setIsEditing(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 border border-white/40 text-white text-sm font-semibold hover:bg-white/25 transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              Chỉnh sửa
            </motion.button>
          )}
        </div>

        {/* ── Content body ── */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* ════════════ VIEW MODE ════════════ */}
            {!isEditing && (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* personal info */}
                <SectionDivider icon={UserCircle}>
                  Thông tin cá nhân
                </SectionDivider>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <DisplayField
                    icon={User}
                    label="Họ và tên"
                    value={fmt(profile?.fullName)}
                  />
                  <DisplayField
                    icon={Mail}
                    label="Email"
                    value={profile?.email}
                  />
                  <DisplayField
                    icon={Phone}
                    label="Số điện thoại"
                    value={fmt(profile?.phone)}
                  />
                  <DisplayField
                    icon={Calendar}
                    label="Ngày sinh"
                    value={fmtDate(profile?.dob)}
                  />
                  <DisplayField
                    icon={UserCircle}
                    label="Giới tính"
                    value={genderLabel(profile?.gender)}
                  />
                  <DisplayField
                    icon={User}
                    label="Tên đăng nhập"
                    value={profile?.username}
                  />
                </div>

                {/* address */}
                <SectionDivider icon={MapPin}>Địa chỉ</SectionDivider>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <DisplayField
                    icon={Home}
                    label="Số nhà / Đường"
                    value={fmt(addr.street)}
                  />
                  <DisplayField
                    icon={Map}
                    label="Phường / Xã"
                    value={fmt(addr.ward)}
                  />
                  <DisplayField
                    icon={Building}
                    label="Quận / Huyện"
                    value={fmt(addr.district)}
                  />
                  <DisplayField
                    icon={MapPin}
                    label="Thành phố"
                    value={fmt(addr.city)}
                  />
                  <DisplayField
                    icon={Globe}
                    label="Quốc gia"
                    value={fmt(addr.country)}
                  />
                </div>

                {/* footer */}
                <p className="mt-6 text-[11px] text-[#874d5f]/50 text-right">
                  Cập nhật lần cuối:{" "}
                  {profile?.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString("vi-VN")
                    : "—"}
                </p>
              </motion.div>
            )}

            {/* ════════════ EDIT MODE ════════════ */}
            {isEditing && (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {saveError && (
                  <div className="flex items-center gap-2 px-4 py-3 mb-5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    <AlertCircle size={16} />
                    {saveError}
                  </div>
                )}

                {/* personal info */}
                <SectionDivider icon={UserCircle}>
                  Thông tin cá nhân
                </SectionDivider>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <EditField icon={User} label="Họ và tên">
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                      className={inputCls}
                    />
                  </EditField>

                  <EditField icon={Mail} label="Email">
                    <input
                      type="text"
                      value={profile?.email ?? ""}
                      disabled
                      className={`${inputCls} bg-[#fdf6f8] text-[#874d5f] cursor-not-allowed`}
                    />
                  </EditField>

                  <EditField icon={Phone} label="Số điện thoại">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className={inputCls}
                    />
                  </EditField>

                  <EditField icon={Calendar} label="Ngày sinh">
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </EditField>

                  <EditField icon={UserCircle} label="Giới tính">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </EditField>

                  <EditField icon={User} label="Tên đăng nhập">
                    <input
                      type="text"
                      value={profile?.username ?? ""}
                      disabled
                      className={`${inputCls} bg-[#fdf6f8] text-[#874d5f] cursor-not-allowed`}
                    />
                  </EditField>
                </div>

                {/* address */}
                <SectionDivider icon={MapPin}>Địa chỉ</SectionDivider>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <EditField icon={Home} label="Số nhà / Đường">
                    <input
                      type="text"
                      name="street"
                      value={form.address.street}
                      onChange={handleAddressChange}
                      placeholder="VD: 123 Nguyễn Huệ"
                      className={inputCls}
                    />
                  </EditField>

                  <EditField icon={Map} label="Phường / Xã">
                    <input
                      type="text"
                      name="ward"
                      value={form.address.ward}
                      onChange={handleAddressChange}
                      placeholder="VD: Bến Nghé"
                      className={inputCls}
                    />
                  </EditField>

                  <EditField icon={Building} label="Quận / Huyện">
                    <input
                      type="text"
                      name="district"
                      value={form.address.district}
                      onChange={handleAddressChange}
                      placeholder="VD: Quận 1"
                      className={inputCls}
                    />
                  </EditField>

                  <EditField icon={MapPin} label="Thành phố">
                    <input
                      type="text"
                      name="city"
                      value={form.address.city}
                      onChange={handleAddressChange}
                      placeholder="VD: Hồ Chí Minh"
                      className={inputCls}
                    />
                  </EditField>

                  <EditField icon={Globe} label="Quốc gia">
                    <input
                      type="text"
                      name="country"
                      value={form.address.country}
                      onChange={handleAddressChange}
                      placeholder="VD: Vietnam"
                      className={inputCls}
                    />
                  </EditField>
                </div>

                {/* action bar */}
                <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-[#ead2d8]">
                  <motion.button
                    id="btn-cancel-edit"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#ead2d8] text-[#874d5f] text-sm font-semibold hover:border-[#c599a6] hover:text-[#682535] transition-all cursor-pointer"
                  >
                    <X size={14} />
                    Hủy
                  </motion.button>

                  <motion.button
                    id="btn-save-profile"
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={!saving ? { scale: 1.03 } : {}}
                    whileTap={!saving ? { scale: 0.97 } : {}}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#682535] to-[#874d5f] text-white text-sm font-bold shadow hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Sparkles size={14} />
                        </motion.div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Lưu thay đổi
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
