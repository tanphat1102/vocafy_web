"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Library,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { dashboardService } from "@/services";

interface Stats {
  totalUsers: number;
  totalSyllabuses: number;
  totalVocabularies: number;
  activeEnrollments: number;
  totalRevenue: number;
  growthRate: number;
  usersGrowthRate: number;
  syllabusesGrowthRate: number;
  vocabulariesGrowthRate: number;
  activeEnrollmentsGrowthRate: number;
  revenueGrowthRate: number;
  reportYear: number;
  reportMonth: number;
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(() => {
    const now = new Date();
    return {
      totalUsers: 0,
      totalSyllabuses: 0,
      totalVocabularies: 0,
      activeEnrollments: 0,
      totalRevenue: 0,
      growthRate: 0,
      usersGrowthRate: 0,
      syllabusesGrowthRate: 0,
      vocabulariesGrowthRate: 0,
      activeEnrollmentsGrowthRate: 0,
      revenueGrowthRate: 0,
      reportYear: now.getFullYear(),
      reportMonth: now.getMonth() + 1,
    };
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const params = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      };

      try {
        const [
          vocabulariesResponse,
          usersResponse,
          syllabiResponse,
          revenueResponse,
          growthRatesResponse,
          activeEnrollmentsResponse,
        ] = await Promise.all([
          dashboardService.getVocabularies(params),
          dashboardService.getUsers(params),
          dashboardService.getSyllabi(params),
          dashboardService.getRevenue(params),
          dashboardService.getGrowthRates(params),
          dashboardService.getActiveEnrollments(params),
        ]);

        setStats({
          totalUsers: toSafeNumber(usersResponse?.result?.count),
          totalSyllabuses: toSafeNumber(syllabiResponse?.result?.count),
          totalVocabularies: toSafeNumber(vocabulariesResponse?.result?.count),
          activeEnrollments: toSafeNumber(
            activeEnrollmentsResponse?.result?.count,
          ),
          totalRevenue: toSafeNumber(revenueResponse?.result?.count),
          growthRate: toSafeNumber(growthRatesResponse?.result?.growth_rate),
          usersGrowthRate: toSafeNumber(usersResponse?.result?.growth_rate),
          syllabusesGrowthRate: toSafeNumber(
            syllabiResponse?.result?.growth_rate,
          ),
          vocabulariesGrowthRate: toSafeNumber(
            vocabulariesResponse?.result?.growth_rate,
          ),
          activeEnrollmentsGrowthRate: toSafeNumber(
            activeEnrollmentsResponse?.result?.growth_rate,
          ),
          revenueGrowthRate: toSafeNumber(revenueResponse?.result?.growth_rate),
          reportYear: toSafeNumber(
            growthRatesResponse?.result?.year,
            params.year,
          ),
          reportMonth: toSafeNumber(
            growthRatesResponse?.result?.month,
            params.month,
          ),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatChange = (value: unknown): string => {
    const numberValue = toSafeNumber(value);
    const sign = numberValue > 0 ? "+" : "";
    return `${sign}${numberValue.toFixed(1)}%`;
  };

  const formatVndCurrency = (value: unknown): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(toSafeNumber(value));
  };

  const statsCards = [
    {
      name: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      bgColor: "bg-chart-1/10",
      iconColor: "text-chart-1",
      change: formatChange(stats.usersGrowthRate),
    },
    {
      name: "Syllabuses",
      value: stats.totalSyllabuses.toLocaleString(),
      icon: Library,
      bgColor: "bg-chart-2/10",
      iconColor: "text-chart-2",
      change: formatChange(stats.syllabusesGrowthRate),
    },
    {
      name: "Vocabularies",
      value: stats.totalVocabularies.toLocaleString(),
      icon: BookOpen,
      bgColor: "bg-chart-3/10",
      iconColor: "text-chart-3",
      change: formatChange(stats.vocabulariesGrowthRate),
    },
    {
      name: "Active Enrollments",
      value: stats.activeEnrollments.toLocaleString(),
      icon: Activity,
      bgColor: "bg-chart-4/10",
      iconColor: "text-chart-4",
      change: formatChange(stats.activeEnrollmentsGrowthRate),
    },
    {
      name: "Total Revenue",
      value: formatVndCurrency(stats.totalRevenue),
      icon: DollarSign,
      bgColor: "bg-chart-5/10",
      iconColor: "text-chart-5",
      change: formatChange(stats.revenueGrowthRate),
    },
    {
      name: "Growth Rate",
      value: `${toSafeNumber(stats.growthRate).toFixed(1)}%`,
      icon: TrendingUp,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      change: formatChange(stats.growthRate),
    },
  ];

  // Chart data for revenue by month
  const revenueData = [
    { month: "Jan", revenue: 4000, users: 240 },
    { month: "Feb", revenue: 3000, users: 221 },
    { month: "Mar", revenue: 2000, users: 229 },
    { month: "Apr", revenue: 2780, users: 200 },
    { month: "May", revenue: 1890, users: 229 },
    { month: "Jun", revenue: 2390, users: 200 },
    { month: "Jul", revenue: 3490, users: 210 },
  ];

  // Chart data for user distribution
  const userDistributionData = [
    { name: "Active Users", value: 892, fill: "var(--color-chart-1)" },
    { name: "Inactive Users", value: 342, fill: "var(--color-chart-2)" },
  ];

  // Chart data for content distribution
  const contentData = [
    { name: "Syllabuses", value: 45, fill: "var(--color-chart-3)" },
    { name: "Topics", value: 234, fill: "var(--color-chart-4)" },
    { name: "Vocabularies", value: 15678, fill: "var(--color-chart-5)" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Dashboard report for {stats.reportMonth}/{stats.reportYear}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        {/* Revenue Chart */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Revenue & User Growth</CardTitle>
            <CardDescription>Monthly revenue and new users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
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
                  dataKey="revenue"
                  fill="var(--color-chart-1)"
                  name="Revenue ($)"
                />
                <Bar
                  dataKey="users"
                  fill="var(--color-chart-2)"
                  name="New Users"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Trend Chart */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle>User Activity Trend</CardTitle>
            <CardDescription>User engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="var(--color-primary)"
                  name="Active Users"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle>User Status</CardTitle>
            <CardDescription>Active vs Inactive users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Distribution */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Breakdown of learning materials</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                action: "New user registered",
                user: "john@example.com",
                time: "5 minutes ago",
              },
              {
                action: "Syllabus created",
                user: "admin@vocafy.com",
                time: "15 minutes ago",
              },
              {
                action: "Payment received",
                user: "user@example.com",
                time: "1 hour ago",
              },
              {
                action: "New enrollment",
                user: "student@example.com",
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
                    {activity.user}
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
