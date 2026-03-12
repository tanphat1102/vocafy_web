"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AndroidDownloadDialog } from "@/components/home/android-download-dialog";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import { MouseFollowImage } from "@/components/ui/mouse-follow-image";
import {
  FloatingElements,
  ParticleField,
} from "@/components/ui/floating-elements";
import { CountingNumber } from "@/components/ui/counting-number";
import {
  Sparkles,
  Languages,
  RefreshCcw,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  BookOpen,
  Brain,
  Target,
  Zap,
} from "lucide-react";
import {
  authService,
  courseService,
  dashboardService,
  syllabusService,
  topicService,
  vocabularyService,
} from "@/services";

interface LandingMetrics {
  totalUsers: number | null;
  totalSyllabuses: number;
  totalTopics: number;
  totalCourses: number;
  totalVocabularies: number;
}

const toSafeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

export default function Home() {
  const [metrics, setMetrics] = useState<LandingMetrics>({
    totalUsers: null,
    totalSyllabuses: 0,
    totalTopics: 0,
    totalCourses: 0,
    totalVocabularies: 0,
  });
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLandingMetrics = async () => {
      try {
        const [syllabusesResponse, topicsResponse, coursesResponse, vocabResponse] =
          await Promise.all([
            syllabusService.list({ page: 0, size: 1 }),
            topicService.list({ page: 0, size: 1 }),
            courseService.list({ page: 0, size: 1 }),
            vocabularyService.list({ page: 0, size: 1 }),
          ]);

        let totalUsers: number | null = null;
        if (authService.getAccessToken()) {
          try {
            const now = new Date();
            const usersResponse = await dashboardService.getUsers({
              year: now.getFullYear(),
              month: now.getMonth() + 1,
            });
            totalUsers = toSafeNumber(usersResponse.result.count, 0);
          } catch {
            totalUsers = null;
          }
        }

        if (!isMounted) {
          return;
        }

        setMetrics({
          totalUsers,
          totalSyllabuses: toSafeNumber(
            syllabusesResponse.result.total_elements,
            0,
          ),
          totalTopics: toSafeNumber(topicsResponse.result.total_elements, 0),
          totalCourses: toSafeNumber(coursesResponse.result.total_elements, 0),
          totalVocabularies: toSafeNumber(vocabResponse.result.total_elements, 0),
        });
      } catch (error) {
        console.error("Failed to fetch landing metrics:", error);
      } finally {
        if (isMounted) {
          setIsMetricsLoading(false);
        }
      }
    };

    fetchLandingMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const sectionMetrics = [
    { value: metrics.totalSyllabuses, label: "Syllabuses" },
    { value: metrics.totalCourses, label: "Courses" },
    { value: metrics.totalVocabularies, label: "Vocabularies" },
  ];

  const mobileMetrics = [
    { value: metrics.totalTopics, label: "Topics" },
    {
      value: metrics.totalUsers ?? metrics.totalSyllabuses,
      label: metrics.totalUsers !== null ? "Active Users" : "Public Syllabuses",
    },
  ];

  const trustedMetrics = [
    {
      value: metrics.totalUsers ?? metrics.totalSyllabuses,
      label: metrics.totalUsers !== null ? "Active Users" : "Public Learners",
    },
    { value: metrics.totalSyllabuses, label: "Syllabuses" },
    { value: metrics.totalCourses, label: "Courses" },
    { value: metrics.totalVocabularies, label: "Vocabularies" },
  ];

  return (
    <div className="bg-background">
      {/* Floating background elements */}
      <FloatingElements className="opacity-30 dark:opacity-20" count={6} />

      <Navbar />

      {/* Hero Section - Centered Layout */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative">
        <FadeInOnScroll className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <Badge
            variant="secondary"
            className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1 sm:px-4 sm:py-1.5 text-sm sm:text-base animate-bounce-in"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline animate-pulse" />
            AI-Powered Vocabulary Learning
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight dark:text-white px-2">
            A powerful vocabulary learning tool{" "}
            <br className="hidden md:block" />
            that&apos;s{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              intuitive
            </span>{" "}
            and{" "}
            <span className="text-emerald-500 dark:text-emerald-400">
              simple
            </span>{" "}
            to use.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto px-2">
            With stellar AI-powered learning and unmatched support, see how
            Vocafy will make a difference in your language journey.
          </p>

          <div className="pt-4 sm:pt-6">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-medium group rounded-full"
            >
              Get started free
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </FadeInOnScroll>

        {/* Circle Images Section - Cloud-like frame */}
        <FadeInOnScroll delay={300} className="mt-8 sm:mt-12 md:mt-16">
          <div className="relative flex justify-center items-end gap-1 sm:gap-2 md:gap-4 py-6 sm:py-8 overflow-hidden">
            {/* Circle frames for images */}
            <MouseFollowImage intensity={8} className="hidden xs:block">
              <div className="w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 rounded-full overflow-hidden border-2 sm:border-4 border-white dark:border-gray-700 shadow-xl bg-linear-to-br from-indigo-200 to-blue-200 dark:from-indigo-900 dark:to-blue-900 -rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-800">
                  <BookOpen className="w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 text-indigo-600 dark:text-indigo-300" />
                </div>
              </div>
            </MouseFollowImage>

            <MouseFollowImage intensity={10}>
              <div className="w-24 sm:w-36 md:w-52 h-24 sm:h-36 md:h-52 rounded-full overflow-hidden border-2 sm:border-4 border-white dark:border-gray-700 shadow-2xl bg-linear-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 hover:scale-105 transition-all duration-500">
                <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-800">
                  <Brain className="w-10 sm:w-16 md:w-24 h-10 sm:h-16 md:h-24 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </MouseFollowImage>

            <MouseFollowImage intensity={12}>
              <div className="w-28 sm:w-40 md:w-56 h-28 sm:h-40 md:h-56 rounded-full overflow-hidden border-2 sm:border-4 border-white dark:border-gray-700 shadow-2xl bg-linear-to-br from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900 hover:scale-105 transition-all duration-500 relative">
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-800 relative">
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl md:text-7xl font-bold text-emerald-600 dark:text-emerald-300">
                      V
                    </div>
                    <div className="text-xs sm:text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-400">
                      Vocafy
                    </div>
                  </div>
                  <ParticleField particleCount={8} />
                </div>
              </div>
            </MouseFollowImage>

            <MouseFollowImage intensity={10}>
              <div className="w-24 sm:w-32 md:w-48 h-24 sm:h-32 md:h-48 rounded-full overflow-hidden border-2 sm:border-4 border-white dark:border-gray-700 shadow-xl bg-linear-to-br from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900 rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <div className="w-full h-full flex items-center justify-center bg-amber-100 dark:bg-amber-800">
                  <Target className="w-10 sm:w-14 md:w-20 h-10 sm:h-14 md:h-20 text-amber-600 dark:text-amber-300" />
                </div>
              </div>
            </MouseFollowImage>

            <MouseFollowImage intensity={8} className="hidden xs:block">
              <div className="w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 rounded-full overflow-hidden border-2 sm:border-4 border-white dark:border-gray-700 shadow-xl bg-linear-to-br from-rose-200 to-red-200 dark:from-rose-900 dark:to-red-900 -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <div className="w-full h-full flex items-center justify-center bg-rose-100 dark:bg-rose-800">
                  <Zap className="w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 text-rose-600 dark:text-rose-300" />
                </div>
              </div>
            </MouseFollowImage>
          </div>
        </FadeInOnScroll>
      </section>

      {/* Section 1: AI-Powered Learning - Text Left, Image Right */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <FadeInOnScroll className="space-y-4 sm:space-y-6">
              <Badge className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm sm:text-base">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                AI-Powered
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight dark:text-white">
                Learn Smarter with{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  Artificial Intelligence
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our AI adapts to your learning style, identifies your weak
                points, and creates personalized study paths. Experience
                learning that evolves with you.
              </p>
              <div className="flex items-center gap-4 sm:gap-6 md:gap-8 pt-2 sm:pt-4">
                {sectionMetrics.map((item, index) => (
                  <div key={item.label} className="text-center">
                    <p
                      className={`text-2xl sm:text-3xl font-bold ${
                        index === 0
                          ? "text-indigo-600 dark:text-indigo-400"
                          : index === 1
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      <CountingNumber value={item.value} suffix="+" />
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={200}>
              <MouseFollowImage intensity={12} glowEffect>
                <div className="aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-x" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center group-hover:scale-110 transition-transform duration-500">
                      <Brain className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mx-auto mb-2 sm:mb-4" />
                      <div className="text-lg sm:text-xl md:text-2xl font-bold">
                        AI Learning
                      </div>
                    </div>
                  </div>
                  <ParticleField particleCount={20} />
                </div>
              </MouseFollowImage>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Section 2: Multi-Language - Text Right, Image Left */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-blue-50 dark:bg-blue-950/30 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <FadeInOnScroll delay={200} className="md:order-1">
              <MouseFollowImage intensity={12} glowEffect>
                <div className="aspect-square max-w-md mx-auto bg-linear-to-br from-blue-400 via-cyan-400 to-teal-400 rounded-3xl shadow-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 animate-gradient-x" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center group-hover:scale-110 transition-transform duration-500">
                      <Languages className="w-24 h-24 mx-auto mb-4" />
                      <div className="text-2xl font-bold">Multi-Language</div>
                    </div>
                  </div>
                  <ParticleField particleCount={20} />
                </div>
              </MouseFollowImage>
            </FadeInOnScroll>

            <FadeInOnScroll className="space-y-4 sm:space-y-6 md:order-2">
              <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-sm sm:text-base">
                <Languages className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Multi-Language
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight dark:text-white">
                Master{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Japanese
                </span>{" "}
                &{" "}
                <span className="text-cyan-600 dark:text-cyan-400">
                  English
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you&apos;re preparing for JLPT or advancing your
                professional English, our comprehensive vocabulary system covers
                all levels from beginner to advanced.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "JLPT N5",
                  "JLPT N4",
                  "JLPT N3",
                  "JLPT N2",
                  "JLPT N1",
                  "TOEIC",
                  "IELTS",
                ].map((level) => (
                  <Badge
                    key={level}
                    variant="outline"
                    className="dark:border-gray-600 dark:text-gray-300"
                  >
                    {level}
                  </Badge>
                ))}
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Section 3: Spaced Repetition - Text Left, Image Right */}
      <section className="py-16 md:py-24 bg-emerald-50 dark:bg-emerald-950/30 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInOnScroll className="space-y-6">
              <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Smart Repetition
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight dark:text-white">
                Never Forget with{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  Spaced Repetition
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our scientifically-proven spaced repetition algorithm ensures
                you review words at the optimal time for maximum retention. Say
                goodbye to cramming!
              </p>
              <div className="space-y-3">
                {[
                  "Review at optimal intervals",
                  "Track your memory strength",
                  "Adaptive difficulty adjustment",
                  "Progress analytics dashboard",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={200}>
              <MouseFollowImage intensity={12} glowEffect>
                <div className="aspect-square max-w-md mx-auto bg-linear-to-br from-emerald-400 via-teal-400 to-green-400 rounded-3xl shadow-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-green-500/20 animate-gradient-x" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center group-hover:scale-110 transition-transform duration-500">
                      <RefreshCcw className="w-24 h-24 mx-auto mb-4" />
                      <div className="text-2xl font-bold">Smart Review</div>
                    </div>
                  </div>
                  <ParticleField particleCount={20} />
                </div>
              </MouseFollowImage>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Section 4: Mobile App - Text Right, Image Left */}
      <section className="py-16 md:py-24 bg-purple-50 dark:bg-purple-950/30 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInOnScroll delay={200} className="md:order-1">
              <MouseFollowImage intensity={12} glowEffect>
                <div className="aspect-square max-w-md mx-auto bg-linear-to-br from-purple-400 via-pink-400 to-rose-400 rounded-3xl shadow-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 animate-gradient-x" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center group-hover:scale-110 transition-transform duration-500">
                      <Smartphone className="w-24 h-24 mx-auto mb-4" />
                      <div className="text-2xl font-bold">Mobile App</div>
                    </div>
                  </div>
                  <ParticleField particleCount={20} />
                </div>
              </MouseFollowImage>
            </FadeInOnScroll>

            <FadeInOnScroll className="space-y-6 md:order-2">
              <Badge className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile App
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight dark:text-white">
                Learn Anywhere with{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  Our Mobile App
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Download our app and learn on the go. Sync your progress across
                all devices and study even when you&apos;re offline.
              </p>
              <div className="flex items-center gap-8 pt-4">
                {mobileMetrics.map((item, index) => (
                  <div key={item.label} className="text-center">
                    <p
                      className={`text-3xl font-bold ${
                        index === 0
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-pink-600 dark:text-pink-400"
                      }`}
                    >
                      <CountingNumber value={item.value} suffix="+" />
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  disabled
                  className="h-12 rounded-full bg-gray-300 text-gray-600 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  iOS Coming Soon
                </Button>
                <AndroidDownloadDialog />
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <ParticleField particleCount={30} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <FadeInOnScroll className="text-center text-white mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              Trusted by Real Platform Data
            </h2>
            <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto px-4">
              Live counters from Vocafy API.{" "}
              {isMetricsLoading
                ? "Loading latest numbers..."
                : "Updated from current database totals."}
            </p>
          </FadeInOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {trustedMetrics.map((stat, i) => (
              <FadeInOnScroll key={i} delay={i * 100}>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">
                    <CountingNumber value={stat.value} suffix="+" />
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-indigo-200">
                    {stat.label}
                  </p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <FadeInOnScroll className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white px-2">
              Ready to Start Your{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Learning Journey
              </span>
              ?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-2">
              Join thousands of learners who have already transformed their
              vocabulary skills with Vocafy.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-4 px-4">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full group w-full sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/introduction" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 w-full"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <Footer />
    </div>
  );
}
