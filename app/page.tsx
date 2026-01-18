import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import {
  Sparkles,
  Languages,
  RefreshCcw,
  Globe,
  Star,
  ArrowRight,
  Smartphone,
  QrCode,
  Download,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeInOnScroll className="space-y-6">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-indigo-600 hover:bg-blue-100 px-4 py-1.5"
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              AI-Powered Vocabulary Learning
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Master Vocabulary{" "}
              <span className="text-indigo-600">with Intelligent</span>{" "}
              <span className="text-emerald-500">AI</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Learn Japanese for JLPT success and professional English for your
              career. Smart repetition, AI tutoring, and personalized learning
              paths.
            </p>

            <div>
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 text-base font-medium"
              >
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 border-2 border-white flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {String.fromCharCode(65 + i - 1)}
                  </div>
                ))}
              </div>
              <div className="border-l pl-6">
                <p className="text-sm text-gray-600">1.2K+ learners</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <Star
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  strokeWidth={1.5}
                />
                <span className="ml-1 text-sm text-gray-600">4.5 rating</span>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={200} className="relative">
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-xl"></div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Why Choose VOCAFY Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeInOnScroll className="text-center mb-12">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-indigo-600 hover:bg-blue-100 mb-4"
            >
              About VOCAFY
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="text-indigo-600">VOCAFY</span>?
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Experience a smarter way to build your vocabulary with
              cutting-edge technology and proven learning methodologies.
            </p>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <FadeInOnScroll delay={0}>
              <Card className="border-2 hover:border-indigo-200 transition-all hover:shadow-lg h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-lg">AI-Powered Learning</h3>
                  <p className="text-gray-600 text-sm">
                    Smart algorithms adapt to your learning pace and style for
                    maximum retention.
                  </p>
                </CardContent>
              </Card>
            </FadeInOnScroll>

            {/* Feature 2 */}
            <FadeInOnScroll delay={100}>
              <Card className="border-2 hover:border-indigo-200 transition-all hover:shadow-lg h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Languages className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">Japanese & English</h3>
                  <p className="text-gray-600 text-sm">
                    Master JLPT vocabulary and professional English for your
                    career growth.
                  </p>
                </CardContent>
              </Card>
            </FadeInOnScroll>

            {/* Feature 3 */}
            <FadeInOnScroll delay={200}>
              <Card className="border-2 hover:border-indigo-200 transition-all hover:shadow-lg h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <RefreshCcw className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg">Smart Repetition</h3>
                  <p className="text-gray-600 text-sm">
                    Spaced repetition system ensures long-term memory and
                    efficient learning.
                  </p>
                </CardContent>
              </Card>
            </FadeInOnScroll>

            {/* Feature 4 */}
            <FadeInOnScroll delay={300}>
              <Card className="border-2 hover:border-indigo-200 transition-all hover:shadow-lg h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg">Learn Anywhere</h3>
                  <p className="text-gray-600 text-sm">
                    Access on web or mobile. Sync progress across all your devices
                    seamlessly.
                  </p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Building the Future Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInOnScroll className="space-y-6">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-indigo-600 hover:bg-blue-100"
              >
                About us
              </Badge>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Building the Future of{" "}
                <span className="text-indigo-600">Language Learning</span>
              </h2>

              <p className="text-gray-600 leading-relaxed">
                We combine cutting-edge AI technology with proven language
                learning methodologies to create an unparalleled learning
                experience. Our platform adapts to your unique learning style
                and helps you achieve your language goals faster than ever
                before.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/introduction">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Learn More
                  </Button>
                </Link>
                <Button variant="outline">Contact Us</Button>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={200} className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-xl"></div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Download App Section - Grab-inspired design with Vocafy colors */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        {/* Background decorations - Grab style */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/10 to-transparent rounded-full" />
          {/* Decorative shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/10 rounded-full" />
          <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-white/10 rounded-2xl rotate-45" />
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <FadeInOnScroll className="text-white space-y-6">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30 backdrop-blur-sm">
                <Smartphone className="w-4 h-4 mr-2" />
                Tải App Ngay
              </Badge>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Học Mọi Lúc,{" "}
                <span className="text-blue-200">Mọi Nơi</span>
              </h2>

              <p className="text-lg text-indigo-100 leading-relaxed max-w-lg">
                Tải ứng dụng Vocafy trên điện thoại để học từ vựng hiệu quả hơn. 
                Đồng bộ tiến độ giữa các thiết bị và học offline mọi lúc mọi nơi.
              </p>

              {/* Features list */}
              <div className="space-y-3 pt-2">
                {[
                  "Học offline - không cần internet",
                  "Đồng bộ tiến độ tự động",
                  "Nhắc nhở học tập thông minh",
                  "Giao diện thân thiện, dễ sử dụng"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-200" />
                    </div>
                    <span className="text-indigo-50">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Download Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-white">10K+</p>
                  <p className="text-sm text-blue-200">Lượt tải</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold text-white">4.8</p>
                  <p className="text-sm text-blue-200">Đánh giá</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold text-white">#1</p>
                  <p className="text-sm text-blue-200">Education App</p>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Right Content - App Store Cards */}
            <FadeInOnScroll delay={200} className="space-y-6">
              {/* QR Code Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Google Play Card */}
                <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 hover:bg-white">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-current">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tải về từ</p>
                      <p className="font-bold text-lg text-gray-800">Google Play</p>
                    </div>
                    
                    {/* QR Code Placeholder */}
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center">
                      <QrCode className="w-12 h-12 text-indigo-400" />
                      <p className="text-xs text-indigo-400 mt-2">QR Code</p>
                    </div>

                    <a 
                      href="#" 
                      className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Hoặc nhấn để tải
                    </a>
                  </CardContent>
                </Card>

                {/* App Store Card */}
                <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 hover:bg-white">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-current">
                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tải về từ</p>
                      <p className="font-bold text-lg text-gray-800">App Store</p>
                    </div>
                    
                    {/* QR Code Placeholder */}
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center">
                      <QrCode className="w-12 h-12 text-purple-400" />
                      <p className="text-xs text-purple-400 mt-2">QR Code</p>
                    </div>

                    <a 
                      href="#" 
                      className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Hoặc nhấn để tải
                    </a>
                  </CardContent>
                </Card>
              </div>

              {/* Phone Mockup - Grab inspired */}
              <div className="hidden lg:flex justify-center pt-4">
                <div className="relative">
                  {/* Main Phone */}
                  <div className="w-48 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border-4 border-gray-700 relative overflow-hidden">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full" />
                    <div className="absolute inset-2 top-8 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-5xl font-bold mb-2">V</div>
                        <div className="text-sm font-medium">Vocafy</div>
                        <div className="text-xs text-indigo-200 mt-1">Learn Smart</div>
                      </div>
                    </div>
                    {/* Decorative dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                      <div className="w-2 h-2 bg-white/40 rounded-full" />
                      <div className="w-2 h-2 bg-white/80 rounded-full" />
                      <div className="w-2 h-2 bg-white/40 rounded-full" />
                    </div>
                  </div>
                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-8 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold">4.8</span>
                  </div>
                  <div className="absolute -bottom-4 -left-8 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold">10K+</span>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
