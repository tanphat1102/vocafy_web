"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Library, Languages, TrendingUp } from "lucide-react";

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

  const statsCards = [
    {
      name: "Syllabuses",
      value: stats.totalSyllabuses.toLocaleString(),
      icon: Library,
      color: "bg-purple-500",
      change: "+5%",
    },
    {
      name: "Topics",
      value: stats.totalTopics.toLocaleString(),
      icon: TrendingUp,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      name: "Courses",
      value: stats.totalCourses.toLocaleString(),
      icon: BookOpen,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      name: "Vocabularies",
      value: stats.totalVocabularies.toLocaleString(),
      icon: Languages,
      color: "bg-amber-500",
      change: "+18%",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Content Manager Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage syllabuses, topics, courses, and vocabularies
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.item}
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
