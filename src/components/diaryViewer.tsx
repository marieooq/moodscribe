"use client";

import React, { useState } from "react";
import { Calendar, Grid } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DiaryEntry } from "@/types/diary";

interface DiaryViewerProps {
  entries: DiaryEntry[];
}

const DiaryViewer = ({ entries }: DiaryViewerProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("card");

  const CardView = () => (
    <div>
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className="w-full mb-8 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/journal/${entry.id}`)}
        >
          <CardHeader>
            <CardTitle>
              {new Date(entry.created_at).toLocaleDateString("ja-JP")}
            </CardTitle>
            <CardDescription>
              Mood: {entry.mood === "positive" ? "😊" : "😐"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{entry.text_data}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const CalendarView = () => (
    <div className="grid grid-cols-7 gap-2">
      {/* calendar header */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-bold p-2">
          {day}
        </div>
      ))}
      {/* calendar cells */}
      {Array(35)
        .fill(null)
        .map((_, index) => {
          const entry = entries.find(
            (e) => new Date(e.created_at).getDate() === index + 1
          );
          return (
            <div key={index} className="border p-2 h-24 overflow-hidden">
              <div className="font-bold">{index + 1}</div>
              {entry && (
                <div className="text-xs">
                  {entry.text_data.substring(0, 50)}...
                </div>
              )}
            </div>
          );
        })}
    </div>
  );

  return (
    <div className="p-4 space-y-4 items-center w-full max-w-screen-md mx-auto">
      {/* switch views */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("card")}
          className={`p-2 rounded ${
            viewMode === "card" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={`p-2 rounded ${
            viewMode === "calendar" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {/* display content */}
      {viewMode === "card" && <CardView />}
      {viewMode === "calendar" && <CalendarView />}
    </div>
  );
};

export default DiaryViewer;
