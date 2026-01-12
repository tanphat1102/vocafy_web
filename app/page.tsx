import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Languages,
  RefreshCcw,
  Globe,
  Star,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logoFull.png"
              alt="Vocafy"
              width={100}
              height={32}
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/courses"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Courses
            </Link>
            <Link
              href="/topic"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Topic
            </Link>
            <Link
              href="/ai-tutor"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              AI Tutor
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
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
          </div>

          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-xl"></div>
          </div>
        </div>
      </section>

      {/* Why Choose VOCAFY Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
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
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="border-2 hover:border-indigo-200 transition-all hover:shadow-lg">
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

            {/* Feature 2 */}
            <Card className="border-2 hover:border-indigo-200 transition-all hover:shadow-lg">
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

            {/* Feature 3 */}
            <Card className="border-2 hover:border-indigo-200 transition-all hover:shadow-lg">
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

            {/* Feature 4 */}
            <Card className="border-2 hover:border-indigo-200 transition-all hover:shadow-lg">
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
          </div>
        </div>
      </section>

      {/* Building the Future Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
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
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Learn More
                </Button>
                <Button variant="outline">Contact Us</Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Image
              src="/images/logoWhite.png"
              alt="Vocafy"
              width={100}
              height={32}
              className="mx-auto mb-4"
            />
            <p className="text-gray-400">© 2026 Vocafy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
