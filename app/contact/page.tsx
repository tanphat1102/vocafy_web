"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  Crown,
  Code,
  Palette,
  Megaphone,
  Smartphone,
  BookOpen,
} from "lucide-react";

// Team member data - Fill in your information
const mentor = {
  name: "Nguyễn Văn A",
  role: "Mentor",
  mssv: "Giảng viên hướng dẫn",
  avatar: "/images/team/mentor.jpg",
  email: "mentor@fpt.edu.vn",
  color: "slate",
};

const teamMembers = [
  {
    name: "Trần Văn B",
    role: "CEO",
    mssv: "SE170001",
    avatar: "/images/team/ceo.jpg",
    description: "Founder & Chief Executive Officer",
    color: "indigo",
    icon: Crown,
  },
  {
    name: "Lê Thị C",
    role: "Tech Lead",
    mssv: "SE170002",
    avatar: "/images/team/techlead.jpg",
    description: "Technical Lead & Backend Developer",
    color: "blue",
    icon: Code,
  },
  {
    name: "Phạm Văn D",
    role: "UX/UI Designer",
    mssv: "SE170003",
    avatar: "/images/team/designer.jpg",
    description: "User Experience & Interface Designer",
    color: "purple",
    icon: Palette,
  },
  {
    name: "Hoàng Thị E",
    role: "Marketing",
    mssv: "SE170004",
    avatar: "/images/team/marketing.jpg",
    description: "Marketing & Communications",
    color: "pink",
    icon: Megaphone,
  },
  {
    name: "Ngô Văn F",
    role: "Mobile Developer",
    mssv: "SE170005",
    avatar: "/images/team/mobile1.jpg",
    description: "iOS & Android Developer",
    color: "emerald",
    icon: Smartphone,
  },
  {
    name: "Đỗ Văn G",
    role: "Mobile Developer",
    mssv: "SE170006",
    avatar: "/images/team/mobile2.jpg",
    description: "iOS & Android Developer",
    color: "teal",
    icon: Smartphone,
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, url: "https://facebook.com/vocafy", color: "blue" },
  { name: "Instagram", icon: Instagram, url: "https://instagram.com/vocafy", color: "pink" },
  { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/vocafy", color: "sky" },
  { name: "GitHub", icon: Github, url: "https://github.com/vocafy", color: "gray" },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; light: string }> = {
  indigo: { bg: "bg-indigo-500", text: "text-indigo-600", border: "border-indigo-300", light: "bg-indigo-100" },
  blue: { bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-300", light: "bg-blue-100" },
  purple: { bg: "bg-purple-500", text: "text-purple-600", border: "border-purple-300", light: "bg-purple-100" },
  pink: { bg: "bg-pink-500", text: "text-pink-600", border: "border-pink-300", light: "bg-pink-100" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-300", light: "bg-emerald-100" },
  teal: { bg: "bg-teal-500", text: "text-teal-600", border: "border-teal-300", light: "bg-teal-100" },
  slate: { bg: "bg-slate-500", text: "text-slate-600", border: "border-slate-300", light: "bg-slate-100" },
  sky: { bg: "bg-sky-500", text: "text-sky-600", border: "border-sky-300", light: "bg-sky-100" },
  gray: { bg: "bg-gray-700", text: "text-gray-600", border: "border-gray-300", light: "bg-gray-100" },
};

export default function ContactPage() {
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
            <Users className="w-4 h-4 mr-2 inline" />
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Đội Ngũ{" "}
            <span className="text-indigo-600">Vocafy</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">
            Chúng tôi là nhóm sinh viên FPT University đam mê công nghệ và giáo dục
          </p>
        </FadeInOnScroll>
      </section>

      {/* Mentor Section */}
      <section className="container mx-auto px-4 pb-12">
        <FadeInOnScroll>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Mentor Hướng Dẫn</h2>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={100}>
          <Card className="max-w-md mx-auto border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50">
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-slate-200">
                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                <AvatarFallback className="bg-slate-500 text-white text-2xl">
                  {mentor.name.split(" ").map(n => n[0]).join("").slice(-2)}
                </AvatarFallback>
              </Avatar>
              <Badge className="bg-slate-500 hover:bg-slate-600 mb-2">
                <GraduationCap className="w-3 h-3 mr-1" />
                {mentor.role}
              </Badge>
              <h3 className="text-xl font-bold mt-2">{mentor.name}</h3>
              <p className="text-sm text-gray-500">{mentor.mssv}</p>
              <p className="text-sm text-gray-600 mt-2">{mentor.email}</p>
            </CardContent>
          </Card>
        </FadeInOnScroll>
      </section>

      {/* Team Structure */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Cấu Trúc Công Ty</h2>
            </div>
          </FadeInOnScroll>

          {/* Desktop Hierarchy View */}
          <div className="hidden md:block">
            {/* CEO - Top */}
            <div className="flex justify-center mb-4">
              <FadeInOnScroll delay={0}>
                <MemberCard member={teamMembers[0]} />
              </FadeInOnScroll>
            </div>

            {/* Connecting line from CEO */}
            <div className="flex justify-center mb-4">
              <div className="w-px h-8 bg-gray-300" />
            </div>

            {/* Horizontal line */}
            <div className="flex justify-center mb-4">
              <div className="w-2/3 max-w-2xl h-px bg-gray-300" />
            </div>

            {/* Level 2: Tech Lead, UX/UI, Marketing */}
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Tech Lead Column */}
              <div className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-300 mb-4" />
                <FadeInOnScroll delay={80}>
                  <MemberCard member={teamMembers[1]} />
                </FadeInOnScroll>
                {/* Connector down to Mobile Devs row (rendered below grid) */}
                <div className="w-px h-6 bg-gray-300 mt-4" />
              </div>

              {/* UX/UI Designer Column */}
              <div className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-300 mb-4" />
                <FadeInOnScroll delay={160}>
                  <MemberCard member={teamMembers[2]} />
                </FadeInOnScroll>
              </div>

              {/* Marketing Column */}
              <div className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-300 mb-4" />
                <FadeInOnScroll delay={240}>
                  <MemberCard member={teamMembers[3]} />
                </FadeInOnScroll>
              </div>
            </div>

            {/* Horizontal connector under Tech Lead to Mobile Devs */}
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-40 h-px bg-gray-300" />
              </div>
              <div />
              <div />
            </div>

            {/* Mobile Developers - full width row to match card sizes */}
            <div className="max-w-4xl mx-auto mt-4">
              <div className="grid grid-cols-2 gap-6">
                <FadeInOnScroll delay={320}>
                  <MemberCard member={teamMembers[4]} />
                </FadeInOnScroll>
                <FadeInOnScroll delay={400}>
                  <MemberCard member={teamMembers[5]} />
                </FadeInOnScroll>
              </div>
            </div>
          </div>

          {/* Mobile View - Simple list */}
          <div className="md:hidden space-y-4">
            {/* CEO */}
            <FadeInOnScroll delay={0}>
              <MemberCard member={teamMembers[0]} />
            </FadeInOnScroll>
            
            {/* Divider */}
            <div className="flex items-center gap-2 py-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">Báo cáo trực tiếp</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Tech Lead */}
            <FadeInOnScroll delay={80}>
              <MemberCard member={teamMembers[1]} />
            </FadeInOnScroll>

            {/* Mobile Devs under Tech Lead */}
            <div className="pl-4 border-l-2 border-blue-200 space-y-3">
              <p className="text-xs text-gray-500 font-medium">Dưới quyền Tech Lead:</p>
              <FadeInOnScroll delay={320}>
                <MemberCard member={teamMembers[4]} />
              </FadeInOnScroll>
              <FadeInOnScroll delay={400}>
                <MemberCard member={teamMembers[5]} />
              </FadeInOnScroll>
            </div>

            {/* Other members */}
            <FadeInOnScroll delay={160}>
              <MemberCard member={teamMembers[2]} />
            </FadeInOnScroll>
            <FadeInOnScroll delay={240}>
              <MemberCard member={teamMembers[3]} />
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="container mx-auto px-4 py-12">
        <FadeInOnScroll>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Thông Tin Liên Hệ</h2>
          </div>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Email */}
          <FadeInOnScroll delay={0}>
            <Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="mailto:vocafy.exesp26@gmail.com" className="block text-gray-600 hover:text-blue-600 transition-colors">
                  vocafy.exesp26@gmail.com
                </a>
                <a href="mailto:vocafy.exesp26@gmail.com" className="block text-gray-600 hover:text-blue-600 transition-colors">
                  vocafy.exesp26@gmail.com
                </a>
              </CardContent>
            </Card>
          </FadeInOnScroll>

          {/* Phone */}
          <FadeInOnScroll delay={100}>
            <Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-t-emerald-500">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-600">Điện Thoại</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-600">+84 000 363 363</p>
                <p className="text-sm text-gray-400">Thứ 2 - Thứ 6: 9:00 - 17:00</p>
              </CardContent>
            </Card>
          </FadeInOnScroll>

          {/* Address */}
          <FadeInOnScroll delay={200}>
            <Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-t-purple-500">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600">Địa Chỉ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  FPT University<br />
                  Khu Công nghệ cao Hồ Chí Minh<br />
                  XaVaLo
                </p>
              </CardContent>
            </Card>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Social Media */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Mạng Xã Hội</h2>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map((social, i) => (
              <FadeInOnScroll key={social.name} delay={i * 80}>
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-white">
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 ${colorClasses[social.color]?.light || "bg-gray-100"} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <social.icon className={`w-7 h-7 ${colorClasses[social.color]?.text || "text-gray-600"}`} />
                      </div>
                      <p className="font-semibold">{social.name}</p>
                      <p className="text-sm text-gray-500">@vocafy</p>
                    </CardContent>
                  </Card>
                </a>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* About Project */}
      <section className="container mx-auto px-4 py-12">
        <FadeInOnScroll>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Về Dự Án</h2>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={100}>
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-none">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-amber-700">Vocafy - EXE201</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Vocafy là dự án khởi nghiệp của nhóm sinh viên FPT University, 
                    được phát triển trong khuôn khổ môn học EXE201 - Experiential Entrepreneurship 1.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Mục tiêu của chúng tôi là xây dựng một nền tảng học từ vựng thông minh, 
                    giúp người dùng Việt Nam học tiếng Anh và tiếng Nhật một cách hiệu quả 
                    thông qua công nghệ AI và phương pháp Spaced Repetition.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="border-amber-300">FPT University</Badge>
                    <Badge variant="outline" className="border-amber-300">EXE201</Badge>
                    <Badge variant="outline" className="border-amber-300">Spring 2026</Badge>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl flex items-center justify-center">
                    <span className="text-6xl">🎓</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInOnScroll>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <FadeInOnScroll>
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Sẵn sàng bắt đầu học cùng Vocafy?
              </h3>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                Đăng ký ngay để trải nghiệm phương pháp học từ vựng hiệu quả với AI
              </p>
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                Bắt đầu miễn phí
              </Button>
            </CardContent>
          </Card>
        </FadeInOnScroll>
      </section>

      <Footer />
    </div>
  );
}

// Member Card Component
function MemberCard({ member, isSmall = false }: { member: typeof teamMembers[0]; isSmall?: boolean }) {
  const colors = colorClasses[member.color] || colorClasses.indigo;
  const Icon = member.icon;

  if (isSmall) {
    return (
      <Card className={`hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 overflow-hidden ${colors.border.replace("border", "border-l")}`}>
        <CardContent className="p-3 flex items-center gap-3">
          <Avatar className={`w-10 h-10 ring-2 ${colors.light} shrink-0`}>
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className={`${colors.bg} text-white text-xs`}>
              {member.name.split(" ").map(n => n[0]).join("").slice(-2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm break-words">{member.name}</h3>
              <Badge className={`${colors.bg} hover:${colors.bg} text-[10px] px-1.5 py-0`}>
                {member.role}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 font-mono break-words">{member.mssv}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-full hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 overflow-hidden ${colors.border.replace("border", "border-l")}`}>
      <CardContent className="p-4 flex items-start gap-4">
        <Avatar className={`w-14 h-14 ring-2 ${colors.light} shrink-0`}>
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className={`${colors.bg} text-white text-sm`}>
            {member.name.split(" ").map(n => n[0]).join("").slice(-2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="min-w-0 flex-1">
          <Badge className={`${colors.bg} hover:${colors.bg} mb-1.5`}>
            <Icon className="w-3 h-3 mr-1" />
            {member.role}
          </Badge>
          
          <h3 className="font-bold break-words">{member.name}</h3>
          <p className="text-xs text-gray-500 font-mono break-words">{member.mssv}</p>
          <p className="text-sm text-gray-600 mt-1 break-words">{member.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

