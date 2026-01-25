"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Library,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalSyllabuses: number;
  totalVocabularies: number;
  activeEnrollments: number;
  totalRevenue: number;
  growthRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSyllabuses: 0,
    totalVocabularies: 0,
    activeEnrollments: 0,
    totalRevenue: 0,
    growthRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch stats from API
    // For now, using mock data
    setTimeout(() => {
      setStats({
        totalUsers: 1234,
        totalSyllabuses: 45,
        totalVocabularies: 15678,
        activeEnrollments: 892,
        totalRevenue: 25000,
        growthRate: 12.5,
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const statsCards = [
    {
      name: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      name: "Syllabuses",
      value: stats.totalSyllabuses.toLocaleString(),
      icon: Library,
      color: "bg-purple-500",
      change: "+5%",
    },
    {
      name: "Vocabularies",
      value: stats.totalVocabularies.toLocaleString(),
      icon: BookOpen,
      color: "bg-green-500",
      change: "+18%",
    },
    {
      name: "Active Enrollments",
      value: stats.activeEnrollments.toLocaleString(),
      icon: Activity,
      color: "bg-yellow-500",
      change: "+8%",
    },
    {
      name: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      change: "+15%",
    },
    {
      name: "Growth Rate",
      value: `${stats.growthRate}%`,
      icon: TrendingUp,
      color: "bg-rose-500",
      change: "+2.5%",
    },
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to the admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => (
          <Card
            key={stat.name}
            className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
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
                className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.user}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-500">
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
