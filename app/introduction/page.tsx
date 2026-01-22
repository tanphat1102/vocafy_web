"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import { FloatingElements } from "@/components/ui/floating-elements";
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

// Prism/Rainbow colors for books (light refraction spectrum)
const prismColors = {
  red: { gradient: "from-red-500 to-red-700", bg: "bg-red-500", text: "text-red-600", accent: "red" },
  orange: { gradient: "from-orange-500 to-orange-700", bg: "bg-orange-500", text: "text-orange-600", accent: "orange" },
  yellow: { gradient: "from-yellow-500 to-yellow-600", bg: "bg-yellow-500", text: "text-yellow-600", accent: "yellow" },
  green: { gradient: "from-green-500 to-green-700", bg: "bg-green-500", text: "text-green-600", accent: "green" },
  cyan: { gradient: "from-cyan-500 to-cyan-700", bg: "bg-cyan-500", text: "text-cyan-600", accent: "cyan" },
  blue: { gradient: "from-blue-500 to-blue-700", bg: "bg-blue-500", text: "text-blue-600", accent: "blue" },
  indigo: { gradient: "from-indigo-500 to-indigo-700", bg: "bg-indigo-500", text: "text-indigo-600", accent: "indigo" },
  violet: { gradient: "from-violet-500 to-purple-700", bg: "bg-violet-500", text: "text-violet-600", accent: "violet" },
};

// Book data for the bookshelf
const books = [
  {
    id: 1,
    title: "Mục Tiêu",
    spine: "I. MỤC TIÊU",
    prism: prismColors.red,
    icon: Target,
    content: {
      title: "Mục Tiêu Hệ Thống",
      rows: [
        { label: "Nền tảng", value: "Học từ vựng đa ngôn ngữ: Anh – Nhật – Việt" },
        { label: "Phương pháp", value: "Học theo Syllabus → Course → Vocabulary" },
        { label: "Công cụ", value: "Flashcard + Ôn tập theo lịch spaced repetition" },
        { label: "Theo dõi", value: "Tracking tiến độ theo ngày chi tiết" },
        { label: "AI", value: "Hỗ trợ học tập thông minh với AI Tutor" },
      ]
    }
  },
  {
    id: 2,
    title: "Cấu Trúc",
    spine: "II. CẤU TRÚC",
    prism: prismColors.orange,
    icon: Layers,
    content: {
      title: "Cấu Trúc Nội Dung",
      rows: [
        { label: "Syllabus", value: "Lộ trình học hoàn chỉnh với timeline theo ngày" },
        { label: "Course", value: "Mỗi course = 1 chủ đề, gắn với ngày học" },
        { label: "Vocabulary", value: "Từ vựng có nghĩa, phiên âm, ví dụ, audio" },
        { label: "Trạng thái", value: "Public / Private / AI-generated" },
        { label: "Tracking", value: "Theo dõi tiến độ user theo từng syllabus" },
      ]
    }
  },
  {
    id: 3,
    title: "Flashcard",
    spine: "III. FLASHCARD",
    prism: prismColors.yellow,
    icon: BookOpen,
    content: {
      title: "Flashcard & Học Tập",
      rows: [
        { label: "Mặt trước", value: "Từ vựng (Kanji / English / Tiếng Việt)" },
        { label: "Mặt sau", value: "Nghĩa + Ví dụ + Audio phát âm" },
        { label: "Tương tác", value: "Lật thẻ để học và ghi nhớ từ vựng" },
        { label: "Đánh giá", value: "Easy / Medium / Hard - điều chỉnh lịch ôn" },
        { label: "Tự động", value: "Lên lịch ôn tập dựa trên đánh giá" },
      ]
    }
  },
  {
    id: 4,
    title: "Ôn Tập",
    spine: "IV. ÔN TẬP",
    prism: prismColors.green,
    icon: Calendar,
    content: {
      title: "Spaced Repetition",
      rows: [
        { label: "Thuật toán", value: "Áp dụng SM-2 để tối ưu việc ôn tập" },
        { label: "Lên lịch", value: "Tự động dựa trên độ khó và kết quả học" },
        { label: "Nhắc nhở", value: "Thông báo học tập hàng ngày" },
        { label: "Thống kê", value: "Tracking tiến độ từng từ chi tiết" },
        { label: "Biểu đồ", value: "Tiến độ trực quan theo ngày/tuần/tháng" },
      ]
    }
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
      ]
    }
  },
  {
    id: 6,
    title: "Streak",
    spine: "VI. STREAK",
    prism: prismColors.blue,
    icon: Flame,
    content: {
      title: "Streak & Gamification",
      rows: [
        { label: "Streak", value: "Chuỗi ngày học liên tục - giữ động lực" },
        { label: "Huy hiệu", value: "Thành tích và phần thưởng khi đạt mục tiêu" },
        { label: "Xếp hạng", value: "Bảng xếp hạng cộng đồng người học" },
        { label: "Thử thách", value: "Challenge hàng tuần với phần thưởng" },
        { label: "Level", value: "Hệ thống kinh nghiệm và level up" },
      ]
    }
  },
  {
    id: 7,
    title: "Premium",
    spine: "VII. PREMIUM",
    prism: prismColors.indigo,
    icon: Crown,
    content: {
      title: "Gói Premium",
      rows: [
        { label: "Syllabus", value: "Tạo không giới hạn số lượng lộ trình" },
        { label: "AI Tutor", value: "Sử dụng AI không giới hạn lượt" },
        { label: "Offline", value: "Tải xuống học mọi lúc mọi nơi" },
        { label: "Ads-free", value: "Trải nghiệm không quảng cáo" },
        { label: "Priority", value: "Hỗ trợ ưu tiên 24/7 từ team" },
      ]
    }
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
      ]
    }
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
  accent: string;
}

interface Book {
  id: number;
  title: string;
  spine: string;
  prism: PrismColor;
  icon: React.ComponentType<{ className?: string }>;
  content: BookContent;
}

function VerticalBook({ book, isSelected, onClick, index }: { 
  book: Book; 
  isSelected: boolean;
  onClick: () => void; 
  index: number;
}) {
  const Icon = book.icon;
  
  return (
    <div 
      onClick={onClick}
      className={`
        group cursor-pointer relative
        transition-all duration-500 ease-out
        ${isSelected ? 'translate-x-6 md:translate-x-10' : 'hover:translate-x-3'}
      `}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Book */}
      <div 
        className={`
          relative h-11 md:h-12 w-full
          bg-gradient-to-r ${book.prism.gradient}
          rounded-r-lg rounded-l-sm
          shadow-lg
          transition-all duration-300
          ${isSelected ? 'shadow-2xl scale-[1.02]' : 'group-hover:shadow-xl'}
        `}
        style={{
          boxShadow: isSelected ? `0 10px 40px -10px var(--tw-shadow-color, rgba(0,0,0,0.3))` : undefined
        }}
      >
        {/* Book spine (left edge) */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/30 rounded-l-sm" />
        
        {/* Book pages (top/bottom edge) */}
        <div className="absolute top-0 left-2 right-1 h-1 bg-gradient-to-b from-gray-100 to-gray-200" />
        <div className="absolute bottom-0 left-2 right-1 h-1 bg-gradient-to-t from-gray-100 to-gray-200" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center px-4 gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide drop-shadow-lg truncate">
            {book.spine}
          </span>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <ChevronRight className="w-5 h-5 text-white animate-pulse" />
          </div>
        )}
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-r-lg" />
      </div>
    </div>
  );
}

function MacWindowCard({ book, bookKey, onClose }: { book: Book; bookKey: number; onClose: () => void }) {
  const Icon = book.icon;
  
  return (
    <div key={bookKey} className="mac-window-animation">
      {/* macOS-style Window Card */}
      <div className="relative">
        {/* Window shadow */}
        <div className={`absolute -inset-4 bg-gradient-to-br ${book.prism.gradient} opacity-20 rounded-3xl blur-2xl`} />
        
        {/* Main Window */}
        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          
          {/* Window Title Bar (macOS style) */}
          <div className={`bg-gradient-to-r ${book.prism.gradient} px-4 py-3 flex items-center gap-3`}>
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
            <div className="w-[52px]" />
          </div>
          
          {/* Content Area - Timeline Layout */}
          <div className="p-6 md:p-8">
            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-[7px] md:left-[9px] top-2 bottom-2 w-0.5 ${book.prism.bg} opacity-30`} />
              
              <div className="space-y-6">
                {book.content.rows.map((row, i) => (
                  <div 
                    key={i}
                    className="flex gap-4 md:gap-6 fade-in-item"
                    style={{ animationDelay: `${i * 80 + 150}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${book.prism.bg} shadow-lg flex items-center justify-center`}>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 grid grid-cols-12 gap-3 md:gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      {/* Label (Left) */}
                      <div className="col-span-4 md:col-span-3">
                        <span className={`text-lg md:text-xl font-bold ${book.prism.text} dark:text-white`}>
                          {row.label}
                        </span>
                      </div>
                      
                      {/* Value (Right) */}
                      <div className="col-span-8 md:col-span-9">
                        <span className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
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
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Chương {book.id} / 8
                </span>
              </div>
              <div className={`px-4 py-1.5 rounded-full ${book.prism.bg} text-white text-sm font-medium`}>
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

  const handleBookClick = (book: Book) => {
    if (selectedBook?.id !== book.id) {
      setSelectedBook(book);
      setBookKey(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-500">
      <FloatingElements className="opacity-20 dark:opacity-10" count={4} />
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-6 md:pt-20 md:pb-6 relative">
        <FadeInOnScroll className="text-center max-w-3xl mx-auto">
          <Badge
            variant="secondary"
            className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 mb-4"
          >
            <BookOpen className="w-4 h-4 mr-2 inline" />
            About Vocafy
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight dark:text-white mb-4">
            Thư Viện{" "}
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
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
          
          {/* Left: Vertical Bookshelf (Wood/Default color) */}
          <div className="lg:col-span-3">
            <FadeInOnScroll>
              <div className="relative lg:sticky lg:top-24">
                {/* Shelf background - Wood color */}
                <div 
                  className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl p-4 shadow-2xl"
                  style={{
                    boxShadow: '10px 0 30px rgba(0,0,0,0.3), inset -4px 0 0 rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Wood grain texture */}
                  <div className="absolute inset-0 opacity-10 rounded-2xl"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.1) 2px,
                        rgba(0,0,0,0.1) 4px
                      )`
                    }}
                  />
                  
                  {/* Shelf title */}
                  <div className="text-center mb-4 pb-3 border-b border-amber-600/50 relative z-10">
                    <h3 className="text-amber-200 font-semibold text-sm uppercase tracking-wider">
                      Kệ Sách Vocafy
                    </h3>
                  </div>
                  
                  {/* Books stack */}
                  <div className="space-y-2 relative z-10">
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
                  
                  {/* Shelf bottom decoration */}
                  <div className="mt-4 pt-3 border-t border-amber-600/50 text-center relative z-10">
                    <p className="text-amber-300/70 text-xs">
                      Click để mở sách →
                    </p>
                  </div>
                </div>
                
                {/* Shelf shadow */}
                <div className="h-4 bg-gradient-to-b from-amber-900/30 to-transparent rounded-b-3xl mx-2" />
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
