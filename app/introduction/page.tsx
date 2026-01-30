"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Target,
  Layers,
  Brain,
  Calendar,
  Sparkles,
  Flame,
  Crown,
  ChevronRight,
  X,
  Minus,
  Maximize2,
} from "lucide-react";

// Prism/Rainbow colors for books
const prismColors = {
  indigo: {
    gradient: "from-indigo-500 to-indigo-700",
    bg: "bg-indigo-500",
    text: "text-indigo-600",
  },
  purple: {
    gradient: "from-purple-500 to-purple-700",
    bg: "bg-purple-500",
    text: "text-purple-600",
  },
  emerald: {
    gradient: "from-emerald-500 to-emerald-700",
    bg: "bg-emerald-500",
    text: "text-emerald-600",
  },
  amber: {
    gradient: "from-amber-500 to-amber-700",
    bg: "bg-amber-500",
    text: "text-amber-600",
  },
  cyan: {
    gradient: "from-cyan-500 to-cyan-700",
    bg: "bg-cyan-500",
    text: "text-cyan-600",
  },
  rose: {
    gradient: "from-rose-500 to-rose-700",
    bg: "bg-rose-500",
    text: "text-rose-600",
  },
  yellow: {
    gradient: "from-yellow-500 to-yellow-700",
    bg: "bg-yellow-500",
    text: "text-yellow-600",
  },
  violet: {
    gradient: "from-violet-500 to-violet-700",
    bg: "bg-violet-500",
    text: "text-violet-600",
  },
};

// Book data for the bookshelf
const books = [
  {
    id: 1,
    title: "Mục Tiêu",
    spine: "I. MỤC TIÊU",
    prism: prismColors.indigo,
    icon: Target,
    content: {
      title: "Mục Tiêu Hệ Thống",
      rows: [
        {
          label: "Nền tảng",
          value: "Học từ vựng đa ngôn ngữ: Anh – Nhật – Việt",
        },
        {
          label: "Phương pháp",
          value: "Học theo Syllabus → Course → Vocabulary",
        },
        {
          label: "Công cụ",
          value: "Flashcard + Ôn tập theo lịch spaced repetition",
        },
        { label: "Theo dõi", value: "Tracking tiến độ theo ngày chi tiết" },
        { label: "AI", value: "Hỗ trợ học tập thông minh với AI Tutor" },
      ],
    },
  },
  {
    id: 2,
    title: "Cấu Trúc",
    spine: "II. CẤU TRÚC",
    prism: prismColors.purple,
    icon: Layers,
    content: {
      title: "Cấu Trúc Nội Dung",
      rows: [
        {
          label: "Syllabus",
          value: "Lộ trình học hoàn chỉnh với timeline theo ngày",
        },
        { label: "Course", value: "Mỗi course = 1 chủ đề, gắn với ngày học" },
        {
          label: "Vocabulary",
          value: "Từ vựng có nghĩa, phiên âm, ví dụ, audio",
        },
        { label: "Trạng thái", value: "Public / Private / AI-generated" },
        {
          label: "Tracking",
          value: "Theo dõi tiến độ user theo từng syllabus",
        },
      ],
    },
  },
  {
    id: 3,
    title: "Flashcard",
    spine: "III. FLASHCARD",
    prism: prismColors.emerald,
    icon: BookOpen,
    content: {
      title: "Flashcard & Học Tập",
      rows: [
        { label: "Mặt trước", value: "Từ vựng (Kanji / English / Tiếng Việt)" },
        { label: "Mặt sau", value: "Nghĩa + Ví dụ + Audio phát âm" },
        { label: "Tương tác", value: "Lật thẻ để học và ghi nhớ từ vựng" },
        {
          label: "Đánh giá",
          value: "Easy / Medium / Hard - điều chỉnh lịch ôn",
        },
        { label: "Tự động", value: "Lên lịch ôn tập dựa trên đánh giá" },
      ],
    },
  },
  {
    id: 4,
    title: "Ôn Tập",
    spine: "IV. ÔN TẬP",
    prism: prismColors.amber,
    icon: Calendar,
    content: {
      title: "Spaced Repetition",
      rows: [
        { label: "Thuật toán", value: "Áp dụng SM-2 để tối ưu việc ôn tập" },
        { label: "Lên lịch", value: "Tự động dựa trên độ khó và kết quả học" },
        { label: "Nhắc nhở", value: "Thông báo học tập hàng ngày" },
        { label: "Thống kê", value: "Tracking tiến độ từng từ chi tiết" },
        { label: "Biểu đồ", value: "Tiến độ trực quan theo ngày/tuần/tháng" },
      ],
    },
  },
  {
    id: 5,
    title: "AI Tutor",
    spine: "V. AI TUTOR",
    prism: prismColors.cyan,
    icon: Brain,
    content: {
      title: "AI Tutor (Premium)",
      rows: [
        { label: "Tạo Syllabus", value: "AI tự động tạo lộ trình học phù hợp" },
        { label: "Giải thích", value: "Phân tích từ vựng chi tiết và sâu sắc" },
        { label: "Ví dụ", value: "Đặt câu theo ngữ cảnh thực tế" },
        { label: "Chat", value: "Luyện tập giao tiếp với AI thông minh" },
        { label: "Phân tích", value: "Nhận diện lỗi sai và gợi ý cải thiện" },
      ],
    },
  },
  {
    id: 6,
    title: "Streak",
    spine: "VI. STREAK",
    prism: prismColors.rose,
    icon: Flame,
    content: {
      title: "Streak & Gamification",
      rows: [
        { label: "Streak", value: "Chuỗi ngày học liên tục - giữ động lực" },
        {
          label: "Huy hiệu",
          value: "Thành tích và phần thưởng khi đạt mục tiêu",
        },
        { label: "Xếp hạng", value: "Bảng xếp hạng cộng đồng người học" },
        { label: "Thử thách", value: "Challenge hàng tuần với phần thưởng" },
        { label: "Level", value: "Hệ thống kinh nghiệm và level up" },
      ],
    },
  },
  {
    id: 7,
    title: "Premium",
    spine: "VII. PREMIUM",
    prism: prismColors.yellow,
    icon: Crown,
    content: {
      title: "Gói Premium",
      rows: [
        { label: "Syllabus", value: "Tạo không giới hạn số lượng lộ trình" },
        { label: "AI Tutor", value: "Sử dụng AI không giới hạn lượt" },
        { label: "Offline", value: "Tải xuống học mọi lúc mọi nơi" },
        { label: "Ads-free", value: "Trải nghiệm không quảng cáo" },
        { label: "Priority", value: "Hỗ trợ ưu tiên 24/7 từ team" },
      ],
    },
  },
  {
    id: 8,
    title: "Tương Lai",
    spine: "VIII. TƯƠNG LAI",
    prism: prismColors.violet,
    icon: Sparkles,
    content: {
      title: "Định Hướng Phát Triển",
      rows: [
        { label: "Ngôn ngữ", value: "Mở rộng: Hàn, Trung, Pháp, Đức..." },
        { label: "Game", value: "Game hóa việc học thú vị hơn" },
        { label: "Cộng đồng", value: "Chia sẻ Syllabus giữa người dùng" },
        { label: "Extension", value: "Plugin trình duyệt học mọi lúc" },
        { label: "Tích hợp", value: "Kết nối với các ứng dụng học tập khác" },
      ],
    },
  },
];

interface BookContent {
  title: string;
  rows: Array<{ label: string; value: string }>;
}

interface PrismColor {
  gradient: string;
  bg: string;
  text: string;
}

interface Book {
  id: number;
  title: string;
  spine: string;
  prism: PrismColor;
  icon: React.ComponentType<{ className?: string }>;
  content: BookContent;
}

function VerticalBook({
  book,
  isSelected,
  onClick,
  index,
}: {
  book: Book;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = book.icon;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left group
        transition-all duration-300 ease-out
        ${isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"}
      `}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Modern minimalist book button */}
      <div
        className={`
          relative px-4 py-3 rounded-xl
          transition-all duration-300
          ${
            isSelected
              ? `bg-linear-to-r ${book.prism.gradient} shadow-lg`
              : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        `}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={`
            w-9 h-9 rounded-lg flex items-center justify-center shrink-0
            transition-all duration-300
            ${
              isSelected
                ? "bg-white/20"
                : "dark:bg-gray-700 group-hover:scale-110"
            }
          `}
          >
            <Icon
              className={`w-5 h-5 ${
                isSelected
                  ? "text-white"
                  : `${book.prism.text} dark:text-gray-300`
              }`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div
              className={`
              text-sm font-semibold truncate
              ${isSelected ? "text-white" : "text-gray-900 dark:text-gray-100"}
            `}
            >
              {book.title}
            </div>
            <div
              className={`
              text-xs truncate
              ${
                isSelected
                  ? "text-white/80"
                  : "text-gray-500 dark:text-gray-400"
              }
            `}
            >
              Chương {book.id}
            </div>
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <ChevronRight className="w-4 h-4 text-white shrink-0 animate-pulse" />
          )}
        </div>
      </div>
    </button>
  );
}

function MacWindowCard({
  book,
  bookKey,
  onClose,
}: {
  book: Book;
  bookKey: number;
  onClose: () => void;
}) {
  const Icon = book.icon;

  return (
    <div key={bookKey} className="mac-window-animation">
      {/* macOS-style Window Card */}
      <div className="relative">
        {/* Window shadow */}
        <div
          className={`absolute -inset-4 bg-linear-to-br ${book.prism.gradient} opacity-20 rounded-3xl blur-2xl`}
        />

        {/* Main Window */}
        <div className="relative dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Window Title Bar (macOS style) */}
          <div
            className={`bg-linear-to-r ${book.prism.gradient} px-4 py-3 flex items-center gap-3`}
          >
            {/* Traffic lights */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
              >
                <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
              </button>
              <div className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center group cursor-pointer">
                <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center group cursor-pointer">
                <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
              </div>
            </div>

            {/* Window Title */}
            <div className="flex-1 flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {book.content.title}
              </h2>
            </div>

            {/* Spacer for centering */}
            <div className="w-13" />
          </div>

          {/* Content Area - Timeline Layout */}
          <div className="p-6 md:p-8">
            <div className="relative">
              {/* Timeline line */}
              <div
                className={`absolute left-1.75 md:left-2.25 top-2 bottom-2 w-0.5 ${book.prism.bg} opacity-30`}
              />

              <div className="space-y-6">
                {book.content.rows.map((row, i) => (
                  <div
                    key={i}
                    className="flex gap-4 md:gap-6 fade-in-item"
                    style={{ animationDelay: `${i * 80 + 150}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="shrink-0 relative z-10">
                      <div
                        className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${book.prism.bg} shadow-lg flex items-center justify-center`}
                      >
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 grid grid-cols-12 gap-3 md:gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      {/* Label (Left) */}
                      <div className="col-span-4 md:col-span-3">
                        <span
                          className={`text-lg md:text-xl font-bold ${book.prism.text} dark:text-gray-100`}
                        >
                          {row.label}
                        </span>
                      </div>

                      {/* Value (Right) */}
                      <div className="col-span-8 md:col-span-9">
                        <span className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                          {row.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with book number */}
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${book.prism.bg}`} />
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  Chương {book.id} / 8
                </span>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full ${book.prism.bg} text-white text-sm font-medium`}
              >
                {book.title}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntroductionPage() {
  const [selectedBook, setSelectedBook] = useState<Book>(books[0]);
  const [bookKey, setBookKey] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setSelectedBook((current) => {
        const currentIndex = books.findIndex((b) => b.id === current.id);
        const nextIndex = (currentIndex + 1) % books.length;
        setBookKey((prev) => prev + 1);
        return books[nextIndex];
      });
    }, 5000); // Change book every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleBookClick = (book: Book) => {
    setIsAutoPlay(false); // Stop auto-play when user clicks
    if (selectedBook?.id !== book.id) {
      setSelectedBook(book);
      setBookKey((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-6 md:pt-20 md:pb-6 relative">
        <FadeInOnScroll className="text-center max-w-3xl mx-auto">
          <Badge
            variant="secondary"
            className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-4"
          >
            <BookOpen className="w-4 h-4 mr-2 inline" />
            Giới Thiệu Vocafy
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight dark:text-white mb-4">
            Thư Viện{" "}
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kiến Thức
            </span>{" "}
            Vocafy
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Chọn sách từ kệ để mở và đọc nội dung chi tiết
          </p>
        </FadeInOnScroll>
      </section>

      {/* Main Content: Bookshelf + Window Card */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Left: Vertical Bookshelf */}
          <div className="lg:col-span-3">
            <FadeInOnScroll>
              <div className="relative lg:sticky lg:top-24">
                {/* Modern minimalist shelf */}
                <div className="dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
                  {/* Shelf title */}
                  <div className="text-center mb-6">
                    <h3 className="text-gray-900 dark:text-white font-bold text-base">
                      Nội Dung
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      8 Chương
                    </p>
                  </div>

                  {/* Books stack */}
                  <div className="space-y-2">
                    {books.map((book, index) => (
                      <VerticalBook
                        key={book.id}
                        book={book}
                        isSelected={selectedBook?.id === book.id}
                        onClick={() => handleBookClick(book)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>

          {/* Right: macOS Window Card */}
          <div className="lg:col-span-9">
            <FadeInOnScroll delay={200}>
              <MacWindowCard
                book={selectedBook}
                bookKey={bookKey}
                onClose={() => setSelectedBook(books[0])}
              />
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes mac-window-open {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mac-window-animation {
          animation: mac-window-open 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .fade-in-item {
          opacity: 0;
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>

      <Footer />
    </div>
  );
}
