import { useLanguage } from "@/hooks/use-language";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type {
  ClassSchedule,
  CreateClassScheduleRequest,
  DayOfWeek,
} from "@/types/schedule";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Lesson } from "@/types/lesson";
import type { ClassTimestamp } from "@/types/timestamp";
import type { TeacherListResponse } from "@/types/teacher";
import { cn } from "@/lib/utils";

type ScheduleFormDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  editingSchedule: ClassSchedule | null;
  setEditingSchedule: Dispatch<SetStateAction<ClassSchedule | null>>;
  handleSubmit: (e: FormEvent<Element>) => Promise<void>;
  formData: CreateClassScheduleRequest;
  setFormData: Dispatch<SetStateAction<CreateClassScheduleRequest>>;
  daysOrder: DayOfWeek[];
  persianDays: Record<
    | "SATURDAY"
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY",
    string
  >;
  lessons: Lesson[];
  timeSlots: ClassTimestamp[];
  teachers: TeacherListResponse[];
  resetForm: () => void;
  formatTimeDisplay: (timestamp: ClassTimestamp) => string;
};

export default function ScheduleFormDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingSchedule,
  handleSubmit,
  formData,
  setFormData,
  daysOrder,
  persianDays,
  lessons,
  timeSlots,
  teachers,
  setEditingSchedule,
  resetForm,
  formatTimeDisplay,
}: ScheduleFormDialogProps) {
  const { t, dir } = useLanguage();
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle
            className={cn("mt-6", dir === "rtl" ? "text-right" : "text-left")}
          >
            {editingSchedule
              ? t("manager.schedule.editSchedule")
              : t("manager.schedule.addSchedule")}
          </DialogTitle>
          <DialogDescription
            className={cn( dir === "rtl" ? "text-right" : "text-left")}
          >
            {t("manager.schedule.formDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">
                {t("manager.schedule.dayOfWeek")}
              </Label>
              <Select
                value={formData.dayOfWeek}
                onValueChange={(value: DayOfWeek) =>
                  setFormData((prev) => ({ ...prev, dayOfWeek: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {daysOrder.map((day) => (
                    <SelectItem key={day} value={day}>
                      {persianDays[day]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectName">
                {t("manager.schedule.subject")}
              </Label>
              <Select
                value={formData.subjectName}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subjectName: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("manager.schedule.selectSubject")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.name}>
                      {lesson.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                {t("manager.schedule.startTime")}
              </Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, startTime: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((timestamp) => (
                    <SelectItem key={timestamp.id} value={timestamp.startTime}>
                      {formatTimeDisplay(timestamp)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">{t("manager.schedule.endTime")}</Label>
              <Input
                type="text"
                value={formData.endTime}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground">
                End time is automatically set based on the selected start time
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacherId">{t("manager.schedule.teacher")}</Label>
              <Select
                value={formData.teacherId?.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    teacherId: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("manager.schedule.selectTeacher")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumber">{t("manager.schedule.room")}</Label>
              <Input
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    roomNumber: e.target.value,
                  }))
                }
                placeholder={t("manager.schedule.roomPlaceholder")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setEditingSchedule(null);
                resetForm();
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {editingSchedule
                ? t("common.save")
                : t("manager.schedule.addSchedule")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
