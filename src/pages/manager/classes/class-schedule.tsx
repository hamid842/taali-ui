import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Plus,
  Clock,
  MapPin,
  User,
  Edit,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react";
import { classApi } from "@/lib/api/class-api";
import { scheduleApi } from "@/lib/api/schedule-api";
import { teacherApi } from "@/lib/api/teacher-api";
import { lessonApi } from "@/lib/api/lesson-api";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useTimestamps } from "@/hooks/use-timestamp";
import type { ClassSchedule, SchoolClassDetail } from "@/types/class";
import type { TeacherListResponse } from "@/types/teacher";
import { DayOfWeek, type CreateClassScheduleRequest } from "@/types/schedule";
import type { Lesson } from "@/types/lesson";
import type { ClassTimestamp } from "@/types/timestamp";
import ScheduleFormDialog from "@/components/forms/schedule-form-dialog";
import { useGradeLevels } from "@/hooks/use-grade-levels";

export default function ClassSchedule() {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { mapSchoolLevelsToLessonLevels } = useGradeLevels();

  const [classDetail, setClassDetail] = useState<SchoolClassDetail | null>(
    null
  );
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [teachers, setTeachers] = useState<TeacherListResponse[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(
    null
  );

  const [formData, setFormData] = useState<CreateClassScheduleRequest>({
    classId: parseInt(classId || "0"),
    dayOfWeek: DayOfWeek.SUNDAY,
    startTime: "08:00",
    endTime: "08:45",
    subjectName: "",
    teacherId: undefined,
    roomNumber: "",
  });

  // Use the timestamps hook
  const {
    data: timestamps,
    isLoading: isLoadingTimestamps,
    error: timestampsError,
  } = useTimestamps(user?.currentSchool?.id);

  // Color palette for different subjects
  const subjectColors: Record<string, string> = {
    ریاضی: "bg-blue-100 text-blue-800 border-blue-200",
    علوم: "bg-green-100 text-green-800 border-green-200",
    ادبیات: "bg-purple-100 text-purple-800 border-purple-200",
    "زبان انگلیسی": "bg-red-100 text-red-800 border-red-200",
    تاریخ: "bg-amber-100 text-amber-800 border-amber-200",
    جغرافیا: "bg-emerald-100 text-emerald-800 border-emerald-200",
    هنر: "bg-pink-100 text-pink-800 border-pink-200",
    ورزش: "bg-orange-100 text-orange-800 border-orange-200",
    دینی: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  const getSubjectColor = (subject: string): string => {
    return (
      subjectColors[subject] || "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  // Load all data
  const loadData = useCallback(async () => {
    if (!classId) {
      setError("Class ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Loading data for class:", classId);

      // Load class details first
      const classData = await classApi.getClassById(+classId);
      console.log("Class data:", classData);
      setClassDetail(classData);

      // Then load schedules, teachers, and lessons in parallel
      const [schedulesData, teachersData] = await Promise.all([
        scheduleApi.getByClass(classId).catch((err) => {
          console.error("Error loading schedules:", err);
          return [];
        }),
        user?.currentSchool?.id
          ? teacherApi.getBySchool(user.currentSchool.id).catch((err) => {
              console.error("Error loading teachers:", err);
              return [];
            })
          : Promise.resolve([]),
      ]);

      console.log("Schedules data:", schedulesData);
      console.log("Teachers data:", teachersData);

      setSchedules(schedulesData);
      setTeachers(teachersData);

      // Load lessons based on grade level
      if (classData.gradeLevel) {
        try {
          console.log("Loading lessons for grade level:", classData.gradeLevel);
          console.log(
            "Encoded grade level:",
            encodeURIComponent(classData.gradeLevel)
          );

          if (user?.currentSchool?.educationalLevels) {
            const lessonGradeLevels = mapSchoolLevelsToLessonLevels(
              user.currentSchool.educationalLevels
            );
            const lessonsData = await lessonApi.getByGradeLevels(
              lessonGradeLevels,
              user?.currentSchool?.id
            );
            console.log("Lessons API response:", lessonsData);
            setLessons(lessonsData);
          }
        } catch (error) {
          console.error("Error loading lessons:", error);
          console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            gradeLevel: classData.gradeLevel,
            encodedGradeLevel: encodeURIComponent(classData.gradeLevel),
          });

          // Fallback to default lessons if API not available
          const defaultLessons = getDefaultLessons(classData.gradeLevel);
          console.log("Using default lessons:", defaultLessons);
          setLessons(defaultLessons);
        }
      } else {
        console.log("No grade level found for class");
        setLessons(getDefaultLessons("ابتدایی دوره اول")); // Default fallback
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError(
        `Failed to load class data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [classId, user?.currentSchool]);

  // Default lessons fallback
  const getDefaultLessons = (gradeLevel: string): Lesson[] => {
    const commonLessons = [
      { id: 1, name: "ریاضی", gradeLevel, color: "blue" },
      { id: 2, name: "علوم", gradeLevel, color: "green" },
      { id: 3, name: "ادبیات", gradeLevel, color: "purple" },
      { id: 4, name: "زبان انگلیسی", gradeLevel, color: "red" },
      { id: 5, name: "تاریخ", gradeLevel, color: "amber" },
      { id: 6, name: "جغرافیا", gradeLevel, color: "emerald" },
      { id: 7, name: "هنر", gradeLevel, color: "pink" },
      { id: 8, name: "ورزش", gradeLevel, color: "orange" },
      { id: 9, name: "دینی", gradeLevel, color: "indigo" },
    ];

    if (gradeLevel.includes("ابتدایی")) {
      return commonLessons.filter(
        (lesson) => !["تاریخ", "جغرافیا"].includes(lesson.name)
      );
    }

    return commonLessons;
  };

  useEffect(() => {
    console.log("ClassSchedule component mounted with classId:", classId);
    loadData();
  }, [classId, loadData]);

  // Use timestamps instead of static timeSlots
  const timeSlots = timestamps || [];

  // Persian day names
  const persianDays = {
    [DayOfWeek.SATURDAY]: "شنبه",
    [DayOfWeek.SUNDAY]: "یکشنبه",
    [DayOfWeek.MONDAY]: "دوشنبه",
    [DayOfWeek.TUESDAY]: "سه‌شنبه",
    [DayOfWeek.WEDNESDAY]: "چهارشنبه",
    [DayOfWeek.THURSDAY]: "پنجشنبه",
    [DayOfWeek.FRIDAY]: "جمعه",
  };

  const daysOrder = [
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ];

  // Get schedule for a specific day and timestamp
  const getSchedule = (
    day: DayOfWeek,
    timestamp: ClassTimestamp
  ): ClassSchedule | undefined => {
    return schedules.find((schedule) => {
      // Check day
      if (schedule.dayOfWeek !== day) return false;

      // Normalize times by removing seconds for comparison
      const normalizeTime = (time: string): string => {
        // Handle both "HH:MM:SS" and "HH:MM" formats
        return time.split(":").slice(0, 2).join(":");
      };

      const scheduleStart = normalizeTime(schedule.startTime);
      const scheduleEnd = normalizeTime(schedule.endTime);
      const timestampStart = normalizeTime(timestamp.startTime);
      const timestampEnd = normalizeTime(timestamp.endTime);

      return scheduleStart === timestampStart && scheduleEnd === timestampEnd;
    });
  };

  // Add this debugging function
  const debugScheduleData = () => {
    console.log("=== DEBUG SCHEDULE DATA ===");
    console.log("Schedules:", schedules);
    console.log("Time slots:", timeSlots);

    // Check one specific time slot
    if (timeSlots.length > 0 && schedules.length > 0) {
      const testTimestamp = timeSlots[0];
      const testDay = daysOrder[0];
      const foundSchedule = getSchedule(testDay, testTimestamp);

      console.log("Testing with:", {
        day: testDay,
        timestamp: testTimestamp,
        foundSchedule: foundSchedule,
      });

      // Log all schedules for this day to see what's available
      const daySchedules = schedules.filter((s) => s.dayOfWeek === testDay);
      console.log(`Schedules for ${testDay}:`, daySchedules);
    }
  };

  // Call it when schedules or timeSlots change
  useEffect(() => {
    if (schedules.length > 0 && timeSlots.length > 0) {
      debugScheduleData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules, timeSlots]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSchedule) {
        await scheduleApi.updateSchedule(
          editingSchedule.id.toString(),
          formData
        );
      } else {
        await scheduleApi.createSchedule(formData);
      }

      setIsDialogOpen(false);
      setEditingSchedule(null);
      resetForm();
      loadData(); // Reload schedules
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert(t("manager.schedule.errors.saveFailed"));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      classId: parseInt(classId || "0"),
      dayOfWeek: DayOfWeek.SUNDAY,
      startTime: "08:00",
      endTime: "08:45",
      subjectName: "",
      teacherId: undefined,
      roomNumber: "",
    });
  };

  // Edit schedule
  const handleEdit = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      classId: schedule.classId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      subjectName: schedule.subjectName,
      teacherId: schedule.teacher?.id,
      roomNumber: schedule.roomNumber || "",
    });
    setIsDialogOpen(true);
  };

  // Add new schedule for a specific timestamp
  const handleAddSchedule = (day: DayOfWeek, timestamp: ClassTimestamp) => {
    setEditingSchedule(null);
    setFormData((prev) => ({
      ...prev,
      dayOfWeek: day,
      startTime: timestamp.startTime,
      endTime: timestamp.endTime,
    }));
    setIsDialogOpen(true);
  };

  // Format time for display
  const formatTimeDisplay = (timestamp: ClassTimestamp): string => {
    return `${timestamp.name}`;
  };

  // Combine loading states
  const isLoading = loading || isLoadingTimestamps;
  const hasError = error || timestampsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            {error || timestampsError?.message}
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={() => loadData()}>Retry</Button>
          <Link to="/classes">
            <Button variant="outline">Back to Classes</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          {t("manager.schedule.errors.classNotFound")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/classes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {t("manager.schedule.title")}
            </h1>
            <p className="text-muted-foreground">
              {classDetail.name} - {classDetail.gradeLevel}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("manager.schedule.addSchedule")}
        </Button>
      </div>

      {/* Timetable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {t("manager.schedule.weeklyTimetable")}
          </CardTitle>
          <CardDescription>
            {t("manager.schedule.timetableDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-white dark:bg-stone-900 rounded-lg border">
              {/* Days Header */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 font-semibold border-r bg-gray-50 dark:bg-stone-900">
                  {t("manager.schedule.time")}
                </div>
                {daysOrder.map((day) => (
                  <div
                    key={day}
                    className="p-4 font-semibold text-center bg-gray-50 dark:bg-stone-900"
                  >
                    {persianDays[day]}
                  </div>
                ))}
              </div>

              {/* Time Slots using timestamps */}
              {timeSlots.map((timestamp, index) => (
                <div
                  key={timestamp.id || index}
                  className="grid grid-cols-8 border-b last:border-b-0"
                >
                  {/* Time Column */}
                  <div className="p-4 border-r bg-gray-50 dark:bg-stone-900 flex items-center justify-center">
                    <div className="text-sm font-medium">
                      {formatTimeDisplay(timestamp)}
                    </div>
                  </div>

                  {/* Day Columns */}
                  {daysOrder.map((day) => {
                    const schedule = getSchedule(day, timestamp);
                    return (
                      <div
                        key={day}
                        className="p-2 border-r last:border-r-0 min-h-20 relative group"
                        onClick={() =>
                          !schedule && handleAddSchedule(day, timestamp)
                        }
                      >
                        {schedule ? (
                          <div
                            className={`p-3 rounded-lg border-2 h-full cursor-pointer transition-all hover:shadow-md ${getSubjectColor(
                              schedule.subjectName
                            )}`}
                            onClick={() => handleEdit(schedule)}
                          >
                            <div className="font-semibold text-sm mb-1">
                              {schedule.subjectName}
                            </div>
                            {schedule.teacher && (
                              <div className="flex items-center gap-1 text-xs mb-1">
                                <User className="w-3 h-3" />
                                {schedule.teacher.firstName}{" "}
                                {schedule.teacher.lastName}
                              </div>
                            )}
                            {schedule.roomNumber && (
                              <div className="flex items-center gap-1 text-xs">
                                <MapPin className="w-3 h-3" />
                                {schedule.roomNumber}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs mt-2 text-gray-600">
                              <Clock className="w-3 h-3" />
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(schedule);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                            <Plus className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Form Dialog */}
      <ScheduleFormDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        daysOrder={daysOrder}
        persianDays={persianDays}
        lessons={lessons}
        timeSlots={timeSlots}
        teachers={teachers}
        editingSchedule={editingSchedule}
        setEditingSchedule={setEditingSchedule}
        resetForm={resetForm}
        formatTimeDisplay={formatTimeDisplay}
      />
    </div>
  );
}
