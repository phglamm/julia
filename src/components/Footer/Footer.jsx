import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="w-full bg-primary text-body py-16 px-6 lg:px-12 border-t border-text-inverse/10">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
        <div className="space-y-4">
          <h3 className="text-3xl text-surface font-bold tracking-widest uppercase">
            Julia
          </h3>
          <p className="text-sm opacity-90 leading-relaxed">
            Tiên phong trong cho thuê thời trang xa xỉ bền vững tại TP. Hồ Chí
            Minh từ năm 2025
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl text-surface font-semibold tracking-wider uppercase mb-6">
            Khám Phá
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:text-muted transition-colors text-sm"
              >
                Điều Khoản Thuê
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-muted transition-colors text-sm"
              >
                Chính Sách Bảo Mật
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-muted transition-colors text-sm"
              >
                Chính Sách Hư Hỏng
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl text-surface font-semibold tracking-wider uppercase mb-6">
            Liên Hệ
          </h4>
          <ul className="space-y-3 text-sm leading-relaxed">
            <li>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted" aria-hidden />
                <span>141 Điện Biên Phủ, Phường Gia Định,</span>
              </div>
              <span className="ml-[12%]">TP Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted" aria-hidden />
              <a href="mailto:hello@thejulia.vn" className="hover:text-muted">
                hello@thejulia.vn
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted" aria-hidden />
              <a href="tel:+84" className="hover:text-muted">
                +84 xxx xxx xxx
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl text-surface font-semibold tracking-wider uppercase mb-6">
            Theo Dõi
          </h4>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-muted transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 pt-8 border-t border-text-inverse/20">
        <p>© 2025 Julia</p>
      </div>
    </div>
  </footer>
);

export default Footer;
