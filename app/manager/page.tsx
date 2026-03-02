"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Library, Languages, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalSyllabuses: number;
  totalTopics: number;
  totalCourses: number;
  totalVocabularies: number;
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSyllabuses: 0,
    totalTopics: 0,
    totalCourses: 0,
    totalVocabularies: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch stats from API
    setTimeout(() => {
      setStats({
        totalSyllabuses: 45,
        totalTopics: 234,
        totalCourses: 567,
        totalVocabularies: 15678,
      });
      setIsLoading(false);
    }, 500);
  }, []);

  // Chart data for content creation
  const contentCreationData = [
    { month: "Jan", syllabuses: 3, topics: 15, courses: 2 },
    { month: "Feb", syllabuses: 2, topics: 18, courses: 3 },
    { month: "Mar", syllabuses: 5, topics: 22, courses: 4 },
    { month: "Apr", syllabuses: 4, topics: 20, courses: 3 },
    { month: "May", syllabuses: 6, topics: 25, courses: 5 },
    { month: "Jun", syllabuses: 3, topics: 16, courses: 2 },
    { month: "Jul", syllabuses: 7, topics: 28, courses: 6 },
  ];

  // Chart data for vocabulary growth
  const vocabularyGrowthData = [
    { month: "Jan", words: 1000 },
    { month: "Feb", words: 2200 },
    { month: "Mar", words: 3900 },
    { month: "Apr", words: 5200 },
    { month: "May", words: 7100 },
    { month: "Jun", words: 9300 },
    { month: "Jul", words: 15678 },
  ];

  const statsCards = [
    {
      name: "Syllabuses",
      value: stats.totalSyllabuses.toLocaleString(),
      icon: Library,
      bgColor: "bg-chart-1/10",
      iconColor: "text-chart-1",
      change: "+5%",
    },
    {
      name: "Topics",
      value: stats.totalTopics.toLocaleString(),
      icon: TrendingUp,
      bgColor: "bg-chart-2/10",
      iconColor: "text-chart-2",
      change: "+12%",
    },
    {
      name: "Courses",
      value: stats.totalCourses.toLocaleString(),
      icon: BookOpen,
      bgColor: "bg-chart-3/10",
      iconColor: "text-chart-3",
      change: "+8%",
    },
    {
      name: "Vocabularies",
      value: stats.totalVocabularies.toLocaleString(),
      icon: Languages,
      bgColor: "bg-chart-4/10",
      iconColor: "text-chart-4",
      change: "+18%",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Content Manager Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage syllabuses, topics, courses, and vocabularies
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card
            key={stat.name}
            className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-card"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-primary/80 font-medium">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Creation Chart */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Content Creation</CardTitle>
            <CardDescription>Monthly content production</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentCreationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                  cursor={{ fill: "var(--primary)/10" }}
                />
                <Legend />
                <Bar
                  dataKey="syllabuses"
                  fill="var(--color-chart-1)"
                  name="Syllabuses"
                />
                <Bar
                  dataKey="topics"
                  fill="var(--color-chart-2)"
                  name="Topics"
                />
                <Bar
                  dataKey="courses"
                  fill="var(--color-chart-3)"
                  name="Courses"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vocabulary Growth Chart */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Vocabulary Growth</CardTitle>
            <CardDescription>Total words added over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={vocabularyGrowthData}>
                <defs>
                  <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                  cursor={{ fill: "var(--primary)/10" }}
                />
                <Area
                  type="monotone"
                  dataKey="words"
                  stroke="var(--color-primary)"
                  fillOpacity={1}
                  fill="url(#colorWords)"
                  name="Total Words"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Recent Updates
          </h2>
          <div className="space-y-4">
            {[
              {
                action: "Syllabus updated",
                item: "English for Beginners",
                time: "5 minutes ago",
              },
              {
                action: "New topic created",
                item: "Daily Conversations",
                time: "15 minutes ago",
              },
              {
                action: "Course updated",
                item: "Business English",
                time: "1 hour ago",
              },
              {
                action: "Vocabulary added",
                item: "50 new words to Basic Course",
                time: "2 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.item}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
