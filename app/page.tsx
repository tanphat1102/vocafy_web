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

      <Footer />
    </div>
  );
}
