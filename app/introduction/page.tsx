"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import {
  BookOpen,
  Target,
  Layers,
  GraduationCap,
  Brain,
  Calendar,
  Flame,
  Sparkles,
  Check,
  Crown,
} from "lucide-react";

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <FadeInOnScroll className="text-center max-w-3xl mx-auto">
          <Badge
            variant="secondary"
            className="bg-indigo-100 text-indigo-600 hover:bg-indigo-100 mb-4"
          >
            <BookOpen className="w-4 h-4 mr-2 inline" />
            About Vocafy
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Hệ Thống Học Từ Vựng{" "}
            <span className="text-indigo-600">Anh – Nhật – Việt</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">
            Nền tảng học từ vựng thông minh với Flashcard, AI và Spaced Repetition
          </p>
        </FadeInOnScroll>
      </section>

      {/* I. MỤC TIÊU HỆ THỐNG */}
      <section className="container mx-auto px-4 pb-12">
        <FadeInOnScroll>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">I. Mục Tiêu Hệ Thống</h2>
          </div>
        </FadeInOnScroll>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, text: "Nền tảng học từ vựng Anh – Nhật – Việt", color: "indigo" },
            { icon: Layers, text: "Học theo Syllabus → Course → Vocabulary", color: "blue" },
            { icon: GraduationCap, text: "Flashcard + Ôn tập theo lịch", color: "emerald" },
            { icon: Calendar, text: "Tracking theo ngày", color: "purple" },
            { icon: Sparkles, text: "AI hỗ trợ (tính phí)", color: "amber" },
          ].map((item, i) => (
            <FadeInOnScroll key={i} delay={i * 80}>
              <Card className={`border-l-4 border-l-${item.color}-500 hover:shadow-md transition-shadow`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                  </div>
                  <p className="font-medium">{item.text}</p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          ))}
        </div>
      </section>

      {/* II. CẤU TRÚC NỘI DUNG */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">II. Cấu Trúc Nội Dung</h2>
            </div>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Syllabus */}
            <FadeInOnScroll delay={0}>
              <Card className="h-full border-t-4 border-t-indigo-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-indigo-600">1. Syllabus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Là lộ trình học hoàn chỉnh, có timeline theo ngày và tracking tiến độ theo user.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-800">Thuộc tính:</p>
                    {["Tên, mô tả", "Tổng số ngày học", "Ngôn ngữ", "Trạng thái (public / private / AI-generated)"].map((attr, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-indigo-500" />
                        <span>{attr}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInOnScroll>

            {/* Course */}
            <FadeInOnScroll delay={100}>
              <Card className="h-full border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-600">2. Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    1 course = 1 chủ đề, gắn với ngày học trong syllabus.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-800">Thuộc tính:</p>
                    {["Tên, mô tả", "Thứ tự", "Ngày học dự kiến"].map((attr, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-blue-500" />
                        <span>{attr}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInOnScroll>

            {/* Vocabulary */}
            <FadeInOnScroll delay={200}>
              <Card className="h-full border-t-4 border-t-emerald-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-emerald-600">3. Vocabulary (Flashcard)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    1 từ = 1 flashcard, dùng chung cho EN / JP / VI.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-700 mb-1">🇯🇵 Tiếng Nhật</p>
                      <p className="text-xs text-gray-600">Kanji • Hiragana/Katakana • Romaji</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1">🇬🇧 Tiếng Anh</p>
                      <p className="text-xs text-gray-600">English word • IPA (optional)</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-700 mb-1">📝 Nghĩa & Media</p>
                      <p className="text-xs text-gray-600">Nghĩa VI/EN/JP • Hình ảnh • Audio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* III. HỌC FLASHCARD */}
      <section className="container mx-auto px-4 py-12">
        <FadeInOnScroll>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">III. Học Flashcard</h2>
          </div>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeInOnScroll delay={0}>
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-none">
              <CardHeader>
                <CardTitle className="text-lg">Mặt Trước</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Kanji", "English", "Audio", "Image"].map((item, i) => (
                    <Badge key={i} variant="secondary" className="bg-white">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeInOnScroll>

          <FadeInOnScroll delay={100}>
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-none">
              <CardHeader>
                <CardTitle className="text-lg">Mặt Sau</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Toàn bộ nghĩa + phiên âm + hình ảnh</p>
              </CardContent>
            </Card>
          </FadeInOnScroll>
        </div>

        <FadeInOnScroll delay={200} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Người dùng tự đánh giá</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 px-4 py-2">❌ Quên</Badge>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 px-4 py-2">😓 Khó</Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2">✅ Nhớ</Badge>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-4 py-2">🎉 Rất dễ</Badge>
              </div>
            </CardContent>
          </Card>
        </FadeInOnScroll>
      </section>

      {/* IV. TRACKING TRÍ NHỚ */}
      <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">IV. Tracking Trí Nhớ</h2>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={100}>
            <p className="text-gray-600 mb-6">Mỗi user – mỗi vocabulary theo dõi:</p>
          </FadeInOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Trạng thái học", icon: "📊" },
              { label: "Mức độ nhớ", icon: "🧠" },
              { label: "Ngày học gần nhất", icon: "📅" },
              { label: "Ngày ôn tiếp theo", icon: "⏰" },
              { label: "Số lần học", icon: "🔢" },
              { label: "Số lần quên", icon: "❌" },
            ].map((item, i) => (
              <FadeInOnScroll key={i} delay={i * 50}>
                <Card className="text-center hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-sm font-medium mt-2">{item.label}</p>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* V. ÔN TẬP & LỊCH HỌC */}
      <section className="container mx-auto px-4 py-12">
        <FadeInOnScroll>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">V. Ôn Tập & Lịch Học</h2>
          </div>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeInOnScroll delay={0}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-600">Nguyên tắc Spaced Repetition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { status: "Quên", action: "ôn ngay", color: "red" },
                  { status: "Khó", action: "ôn sớm", color: "amber" },
                  { status: "Nhớ", action: "giãn cách", color: "blue" },
                  { status: "Rất dễ", action: "giãn dài", color: "emerald" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Badge className={`bg-${item.color}-100 text-${item.color}-700 hover:bg-${item.color}-100`}>
                      {item.status}
                    </Badge>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium">{item.action}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeInOnScroll>

          <FadeInOnScroll delay={100}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">Mỗi ngày học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { text: "Course mới (nếu tới lịch)", icon: "📚" },
                  { text: "Từ đến hạn ôn", icon: "🔔" },
                  { text: "Từ yếu cần củng cố", icon: "💪" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeInOnScroll>
        </div>
      </section>

      {/* VI. STREAK & TRACKING */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">VI. Streak & Tracking</h2>
            </div>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeInOnScroll delay={0}>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Giữ streak bằng cách mỗi ngày:</p>
                  <div className="space-y-2">
                    {["Học ≥ 1 flashcard / ngày", "Hoặc ôn ≥ 1 từ", "Hoặc làm quiz"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInOnScroll>

            <FadeInOnScroll delay={100}>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    📈 Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-indigo-300 text-indigo-600">Theo Syllabus</Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-600">Theo Course</Badge>
                    <Badge variant="outline" className="border-emerald-300 text-emerald-600">Theo Từ vựng</Badge>
                  </div>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* VII. AI & TÍNH PHÍ */}
      <section className="container mx-auto px-4 py-12">
        <FadeInOnScroll>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">VII. AI & Tính Phí</h2>
          </div>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <FadeInOnScroll delay={0}>
            <Card className="h-full border-2 border-gray-200">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-3xl">🆓</span>
                </div>
                <CardTitle className="text-2xl">Free</CardTitle>
                <p className="text-gray-500">Miễn phí mãi mãi</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Syllabus có sẵn", "Flashcard cơ bản", "Ôn tập tự động"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeInOnScroll>

          {/* Paid */}
          <FadeInOnScroll delay={100}>
            <Card className="h-full border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Crown className="w-8 h-8 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl text-indigo-600">Premium</CardTitle>
                <p className="text-gray-500">Mở khóa toàn bộ tính năng</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {["AI phân tích học tập", "AI tạo syllabus cá nhân", "Tracking nâng cao"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeInOnScroll>
        </div>
      </section>

      <Footer />
    </div>
  );
}
