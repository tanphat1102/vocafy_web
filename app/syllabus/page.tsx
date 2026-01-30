"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Target,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const jlptLevels = [
  {
    level: "N5",
    title: "Beginner",
    color: "from-emerald-400 to-teal-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    words: 800,
    kanji: 100,
    duration: "2-3 months",
    topics: [
      "Hiragana & Katakana",
      "Basic Greetings",
      "Numbers & Time",
      "Daily Conversations",
    ],
  },
  {
    level: "N4",
    title: "Elementary",
    color: "from-blue-400 to-cyan-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-600 dark:text-blue-400",
    words: 1500,
    kanji: 300,
    duration: "3-4 months",
    topics: [
      "Grammar Patterns",
      "Verb Conjugations",
      "Everyday Situations",
      "Reading Practice",
    ],
  },
  {
    level: "N3",
    title: "Intermediate",
    color: "from-purple-400 to-pink-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-600 dark:text-purple-400",
    words: 3000,
    kanji: 650,
    duration: "4-6 months",
    topics: [
      "Complex Grammar",
      "Reading Comprehension",
      "Listening Skills",
      "Essay Writing",
    ],
  },
  {
    level: "N2",
    title: "Advanced",
    color: "from-orange-400 to-red-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-600 dark:text-orange-400",
    words: 6000,
    kanji: 1000,
    duration: "6-8 months",
    topics: [
      "Business Japanese",
      "News & Articles",
      "Advanced Kanji",
      "Formal Expressions",
    ],
  },
  {
    level: "N1",
    title: "Expert",
    color: "from-rose-400 to-pink-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    textColor: "text-rose-600 dark:text-rose-400",
    words: 10000,
    kanji: 2000,
    duration: "8-12 months",
    topics: [
      "Academic Japanese",
      "Literature",
      "Professional Communication",
      "Cultural Nuances",
    ],
  },
];

const englishCourses = [
  {
    title: "TOEIC Preparation",
    description:
      "Master business English and ace your TOEIC exam with comprehensive vocabulary and practice tests.",
    color: "from-indigo-400 to-blue-400",
    features: [
      "500+ Business Terms",
      "Listening Practice",
      "Reading Strategies",
      "Mock Tests",
    ],
  },
  {
    title: "IELTS Academic",
    description:
      "Prepare for IELTS with academic vocabulary, writing techniques, and speaking practice.",
    color: "from-teal-400 to-emerald-400",
    features: [
      "Academic Vocabulary",
      "Essay Writing",
      "Speaking Practice",
      "Band Score Tips",
    ],
  },
  {
    title: "Business English",
    description: "Professional communication skills for the modern workplace.",
    color: "from-amber-400 to-orange-400",
    features: [
      "Email Writing",
      "Presentations",
      "Negotiations",
      "Meeting Skills",
    ],
  },
];

export default function SyllabusPage() {
  return (
    <div className="bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <FadeInOnScroll className="text-center max-w-4xl mx-auto space-y-6">
          <Badge className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
            <GraduationCap className="w-4 h-4 mr-2" />
            Learning Paths
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight dark:text-white">
            Structured{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Learning Syllabus
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Follow our carefully designed curriculum to master Japanese and
            English vocabulary efficiently.
          </p>
        </FadeInOnScroll>
      </section>

      {/* JLPT Section */}
      <section className="py-16  dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <FadeInOnScroll className="text-center mb-12">
            <Badge className="bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              Japanese Language
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
              JLPT Preparation Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              From complete beginner to fluent speaker, our JLPT courses cover
              all five levels.
            </p>
          </FadeInOnScroll>

          <div className="grid gap-6 md:gap-8">
            {jlptLevels.map((level, i) => (
              <FadeInOnScroll key={level.level} delay={i * 100}>
                <Card
                  className={`${level.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      {/* Level Badge */}
                      <div className="text-center md:text-left">
                        <div
                          className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br ${level.color} text-white text-3xl font-bold shadow-lg`}
                        >
                          {level.level}
                        </div>
                        <p className={`mt-2 font-semibold ${level.textColor}`}>
                          {level.title}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center md:col-span-2">
                        <div>
                          <p className="text-2xl font-bold dark:text-white">
                            {level.words.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Words
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold dark:text-white">
                            {level.kanji}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Kanji
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold dark:text-white">
                            {level.duration}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Duration
                          </p>
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="space-y-2">
                        {level.topics.map((topic) => (
                          <div
                            key={topic}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${level.textColor}`}
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              {topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* English Section */}
      <section className="py-16 bg-indigo-50 dark:bg-indigo-950/20 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <FadeInOnScroll className="text-center mb-12">
            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 mb-4">
              <Target className="w-4 h-4 mr-2" />
              English Language
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
              English Proficiency Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Boost your English skills for academic and professional success.
            </p>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {englishCourses.map((course, i) => (
              <FadeInOnScroll key={course.title} delay={i * 100}>
                <Card className=" dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 rounded-2xl bg-linear-to-br ${course.color} flex items-center justify-center text-white shadow-lg mb-4`}
                    >
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <CardTitle className="dark:text-white">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      {course.description}
                    </p>
                    <div className="space-y-2">
                      {course.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4 group">
                      Start Learning
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <FadeInOnScroll className="text-center text-white space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg text-indigo-100">
              Join thousands of learners who have achieved their language goals
              with Vocafy.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 h-14 px-8 text-lg rounded-full"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <Footer />
    </div>
  );
}
