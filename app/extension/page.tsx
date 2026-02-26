"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import {
  FloatingElements,
  ParticleField,
} from "@/components/ui/floating-elements";
import { MouseFollowImage } from "@/components/ui/mouse-follow-image";
import { CountingNumber } from "@/components/ui/counting-number";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Chrome,
  Puzzle,
  Zap,
  BookOpen,
  Globe,
  MousePointer2,
  Volume2,
  History,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: MousePointer2,
    title: "Instant Translation",
    description:
      "Double-click any word on any website to instantly see its translation and add it to your vocabulary list.",
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: Volume2,
    title: "Audio Pronunciation",
    description:
      "Listen to native speaker pronunciation for every word you translate.",
    color: "from-purple-400 to-pink-400",
  },
  {
    icon: BookOpen,
    title: "Context Learning",
    description:
      "Save words with the context sentence for better understanding and retention.",
    color: "from-emerald-400 to-teal-400",
  },
  {
    icon: History,
    title: "Review History",
    description:
      "Access your translation history and review saved words anytime.",
    color: "from-orange-400 to-red-400",
  },
  {
    icon: Zap,
    title: "Spaced Repetition",
    description:
      "Get smart reminders to review words using our spaced repetition algorithm.",
    color: "from-indigo-400 to-purple-400",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description:
      "Support for Japanese, English, and more languages coming soon.",
    color: "from-rose-400 to-pink-400",
  },
];

export default function ExtensionPage() {
  return (
    <div className="bg-background">
      <FloatingElements className="opacity-30 dark:opacity-20" count={6} />

      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <FadeInOnScroll className="space-y-4 sm:space-y-6">
            <Badge className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm sm:text-base">
              <Chrome className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Browser Extension
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight dark:text-white px-2">
              Learn Vocabulary{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                While Browsing
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed px-2">
              Our Chrome extension turns every website into a learning
              opportunity. Double-click any word to instantly translate and save
              it to your vocabulary list.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 px-2">
              <Button
                asChild
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full group w-full sm:w-auto"
              >
                <a href="/Vocafy-Extension.zip" download>
                  <Chrome className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Add to Chrome
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 w-full sm:w-auto"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 pt-4 px-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-300">
                <CountingNumber value={4.9} decimals={1} /> rating •{" "}
                <CountingNumber value={5000} suffix="+" /> users
              </span>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={200}>
            <MouseFollowImage intensity={12} glowEffect>
              <div className="aspect-square max-w-md mx-auto bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-x" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center group-hover:scale-110 transition-transform duration-500">
                    <Puzzle className="w-24 h-24 mx-auto mb-4" />
                    <div className="text-2xl font-bold">Vocafy Extension</div>
                    <div className="text-indigo-100 mt-2">
                      Learn anywhere on the web
                    </div>
                  </div>
                </div>
                <ParticleField particleCount={20} />
              </div>
            </MouseFollowImage>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <FadeInOnScroll className="text-center mb-12">
            <Badge className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
              Powerful Learning Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Everything you need to learn vocabulary efficiently while browsing
              the web.
            </p>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FadeInOnScroll key={feature.title} delay={i * 100}>
                <Card className="dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
