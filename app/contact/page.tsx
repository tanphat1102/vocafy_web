"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import { ParticleField } from "@/components/ui/floating-elements";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  GraduationCap,
  Crown,
  Code,
  Palette,
  Megaphone,
  Smartphone,
  X,
} from "lucide-react";

// Team member data
const mentor = {
  name: "Nguyễn Văn A",
  role: "Mentor",
  title: "Giảng viên hướng dẫn",
  avatar: "/images/team/mentor.jpg",
  email: "mentor@fpt.edu.vn",
  description: "Giảng viên Khoa Công nghệ Thông tin, FPT University. Chuyên gia về AI và Machine Learning với hơn 10 năm kinh nghiệm.",
};

const teamMembers = [
  {
    name: "Lê Trần Gia Bảo",
    role: "CEO",
    mssv: "SE182138",
    avatar: "/images/team/ceo.jpg",
    description: "Founder & Chief Executive Officer. Định hướng chiến lược và phát triển sản phẩm Vocafy.",
    color: "from-amber-400 to-orange-500",
    icon: Crown,
  },
  {
    name: "Trần Tấn Phát",
    role: "Tech Lead",
    mssv: "SE182221",
    avatar: "/images/team/techlead.jpg",
    description: "Technical Lead & Backend Developer. Kiến trúc hệ thống và phát triển API.",
    color: "from-blue-400 to-indigo-500",
    icon: Code,
  },
  {
    name: "Nguyễn Gia Khiêm",
    role: "Developer",
    mssv: "SE182188",
    avatar: "/images/team/mobile1.jpg",
    description: "iOS & Android Developer. Phát triển ứng dụng mobile cho Vocafy.",
    color: "from-emerald-400 to-teal-500",
    icon: Smartphone,
  },
  {
    name: "Lê Trúc Ân",
    role: "Developer",
    mssv: "SE184186",
    avatar: "/images/team/mobile2.jpg",
    description: "iOS & Android Developer. Phát triển tính năng và tối ưu hiệu suất app.",
    color: "from-cyan-400 to-blue-500",
    icon: Smartphone,
  },
  {
    name: "Đặng Tuấn Sơn",
    role: "UX/UI Designer",
    mssv: "SE183892",
    avatar: "/images/team/designer.jpg",
    description: "User Experience & Interface Designer. Thiết kế giao diện và trải nghiệm người dùng.",
    color: "from-purple-400 to-pink-500",
    icon: Palette,
  },
  {
    name: "Đào Phương Thảo",
    role: "Trưởng phòng Marketing",
    mssv: "SS170172",
    avatar: "/images/team/marketing.jpg",
    description: "Marketing & Communications. Chiến lược marketing và phát triển cộng đồng.",
    color: "from-pink-400 to-rose-500",
    icon: Megaphone,
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, url: "#", color: "hover:text-blue-500" },
  { name: "Instagram", icon: Instagram, url: "#", color: "hover:text-pink-500" },
  { name: "LinkedIn", icon: Linkedin, url: "#", color: "hover:text-sky-500" },
  { name: "GitHub", icon: Github, url: "#", color: "hover:text-gray-900 dark:hover:text-white" },
];

interface TeamMember {
  name: string;
  role: string;
  mssv?: string;
  avatar: string;
  description: string;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  email?: string;
}

function MemberCard({ member, onClick, index }: { member: TeamMember; onClick: () => void; index: number }) {
  const Icon = member.icon || GraduationCap;
  
  return (
    <FadeInOnScroll delay={index * 100}>
      <div 
        onClick={onClick}
        className="group cursor-pointer"
      >
        {/* Avatar Container */}
        <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 mb-4">
          {/* Gradient Ring */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.color || 'from-slate-400 to-slate-600'} p-1 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105`}>
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              <Icon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          
          {/* Hover Glow Effect */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.color || 'from-slate-400 to-slate-600'} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
        </div>
        
        {/* Info */}
        <div className="text-center">
          <h3 className="font-bold text-lg text-white drop-shadow-lg group-hover:text-indigo-200 transition-colors">
            {member.name}
          </h3>
          <p className="text-indigo-200 text-sm font-medium">{member.role}</p>
        </div>
      </div>
    </FadeInOnScroll>
  );
}

function MemberModal({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  if (!member) return null;
  
  const Icon = member.icon || GraduationCap;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${member.color || 'from-slate-400 to-slate-600'} p-1 shadow-xl`}>
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              <Icon className="w-16 h-16 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold dark:text-white">{member.name}</h2>
          <p className={`inline-block px-4 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${member.color || 'from-slate-400 to-slate-600'}`}>
            {member.role}
          </p>
          {member.mssv && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">MSSV: {member.mssv}</p>
          )}
          {member.title && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{member.title}</p>
          )}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed pt-2">
            {member.description}
          </p>
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mt-4"
            >
              <Mail className="w-4 h-4" />
              {member.email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const ceo = teamMembers.find((m) => m.role === "CEO");
  const techLead = teamMembers.find((m) => m.role === "Tech Lead");
  const marketingLead = teamMembers.find((m) => m.role === "Trưởng phòng Marketing");
  const developers = teamMembers.filter((m) => m.role === "Developer");
  const designer = teamMembers.find((m) => m.role === "UX/UI Designer");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 relative overflow-hidden">
      <Navbar />

      {/* Full Screen Team Section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/50 via-gray-900/80 to-gray-900" />
          <ParticleField particleCount={50} />
          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Header */}
          <FadeInOnScroll className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              ĐỘI NGŨ{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VOCAFY
              </span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              Những con người đam mê công nghệ và giáo dục, cùng nhau xây dựng 
              nền tảng học từ vựng thông minh cho cộng đồng.
            </p>
          </FadeInOnScroll>

          {/* Mentor */}
          <FadeInOnScroll delay={100} className="flex justify-center mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <GraduationCap className="w-6 h-6 text-amber-400" />
                <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Mentor Hướng Dẫn</span>
              </div>
              <MemberCard 
                member={{...mentor, color: 'from-amber-400 to-orange-600'}} 
                onClick={() => setSelectedMember({...mentor, color: 'from-amber-400 to-orange-600'})}
                index={0}
              />
            </div>
          </FadeInOnScroll>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <Users className="w-6 h-6 text-indigo-400" />
            <span className="text-indigo-400 font-semibold tracking-wider uppercase text-sm">Thành Viên</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-indigo-500/50" />
          </div>

          {/* Team Org Tree */}
          <div className="max-w-6xl mx-auto">
            {/* CEO (under Mentor) */}
            {ceo && (
              <div className="text-center">
                {/* Connector (desktop) */}
                <div className="hidden md:flex flex-col items-center -mt-2 mb-4">
                  <div className="w-px h-8 bg-indigo-500/40" />
                </div>

                <div className="flex justify-center">
                  <MemberCard
                    member={ceo}
                    onClick={() => setSelectedMember(ceo)}
                    index={1}
                  />
                </div>
              </div>
            )}

            {/* Level 2: Tech Lead + Marketing Head */}
            <div className="mt-10">
              {/* Branch connectors (desktop) */}
              <div className="hidden md:flex flex-col items-center mb-6">
                <div className="w-px h-10 bg-indigo-500/35" />
                <div className="w-full max-w-3xl h-px bg-indigo-500/25" />
              </div>

              <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                {/* Tech Lead branch */}
                <div className="relative">
                  <div className="hidden md:block absolute left-1/2 -top-6 -translate-x-1/2 w-px h-6 bg-indigo-500/35" />

                  {techLead && (
                    <div className="flex justify-center">
                      <MemberCard
                        member={techLead}
                        onClick={() => setSelectedMember(techLead)}
                        index={2}
                      />
                    </div>
                  )}

                  {/* Level 3: Developers + Designer under Tech Lead */}
                  <div className="mt-10">
                    {/* Sub-branch connector (desktop) */}
                    <div className="hidden md:flex flex-col items-center mb-6">
                      <div className="w-px h-8 bg-indigo-500/30" />
                      <div className="w-full max-w-md h-px bg-indigo-500/20" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                      {developers.map((dev, idx) => (
                        <div key={dev.mssv} className="relative">
                          <div className="hidden md:block absolute left-1/2 -top-6 -translate-x-1/2 w-px h-6 bg-indigo-500/25" />
                          <MemberCard
                            member={dev}
                            onClick={() => setSelectedMember(dev)}
                            index={3 + idx}
                          />
                        </div>
                      ))}
                      {designer && (
                        <div className="relative">
                          <div className="hidden md:block absolute left-1/2 -top-6 -translate-x-1/2 w-px h-6 bg-indigo-500/25" />
                          <MemberCard
                            member={designer}
                            onClick={() => setSelectedMember(designer)}
                            index={3 + developers.length}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Marketing Head branch */}
                <div className="relative">
                  <div className="hidden md:block absolute left-1/2 -top-6 -translate-x-1/2 w-px h-6 bg-indigo-500/35" />

                  {marketingLead && (
                    <div className="flex justify-center">
                      <MemberCard
                        member={marketingLead}
                        onClick={() => setSelectedMember(marketingLead)}
                        index={10}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <FadeInOnScroll delay={400} className="mt-16">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-indigo-200">
              <a href="mailto:contact@vocafy.app" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>contact@vocafy.app</span>
              </a>
              <a href="tel:+84123456789" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>+84 123 456 789</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>FPT University, HCMC</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 ${social.color} transition-all hover:scale-110 hover:bg-white/20`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Modal */}
      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      <Footer />
    </div>
  );
}

