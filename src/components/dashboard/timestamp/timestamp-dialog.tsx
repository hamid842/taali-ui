import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppTextField } from "@/components/common/app-text-field";
import AppSelect from "@/components/common/app-select-field";
import { useLanguage } from "@/hooks/use-language";
import type { ClassTimestamp, TimestampTypeInfo } from "@/types/timestamp";
import { useCreateTimestamp, useUpdateTimestamp } from "@/hooks/use-timestamp";
import { toast } from "sonner";

const timestampSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  type: z.enum(["REGULAR", "LAUNCH", "PENSION"]),
  orderIndex: z.number().min(0).max(100),
  description: z.string().max(500).optional(),
});

interface TimestampDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTimestamp: ClassTimestamp | null;
  availableTypes: TimestampTypeInfo[];
  schoolId: number;
}

export default function TimestampDialog({
    open, onOpenChange, editingTimestamp, availableTypes, schoolId,
}: TimestampDialogProps) {
    const { t } = useLanguage();
    const createMutation = useCreateTimestamp(schoolId);
    const updateMutation = useUpdateTimestamp();

    const form = useForm<z.infer<typeof timestampSchema>>({
        resolver: zodResolver(timestampSchema),
        defaultValues: {
            name: "",
            startTime: "07:30",
            endTime: "08:45",
            type: "REGULAR",
            orderIndex: 0,
            description: "",
        },
    });

    useEffect(() => {
        if (editingTimestamp) {
            form.reset({
                name: editingTimestamp.name,
                startTime: editingTimestamp.startTime,
                endTime: editingTimestamp.endTime,
                type: editingTimestamp.type,
                orderIndex: editingTimestamp.orderIndex,
                description: editingTimestamp.description || "",
            });
        } else {
            form.reset({
                name: "",
                startTime: "07:30",
                endTime: "08:45",
                type: "REGULAR",
                orderIndex: 0,
                description: "",
            });
        }
    }, [editingTimestamp, form]);

    const onSubmit = (data: z.infer<typeof timestampSchema>) => {
        if (editingTimestamp) {
            updateMutation.mutate(
                { timestampId: editingTimestamp.id, data },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                    onError: (error: unknown) => {
                        toast.error(
                            error instanceof Error
                                ? error.message
                                : t("school.timestamps.error")
                        );
                    },
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error: unknown) => {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : t("school.timestamps.error")
                    );
                },
            });
        }
    };

    const typeOptions = availableTypes
        .filter((t) => t.enabled)
        .map((t) => ({
            value: t.type,
            label: t.label,
        }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingTimestamp
                            ? t("school.timestamps.edit")
                            : t("school.timestamps.create")}
                    </DialogTitle>
                    <DialogDescription>
                        {editingTimestamp
                            ? t("school.timestamps.editDesc")
                            : t("school.timestamps.createDesc")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <AppTextField
                        label={t("school.timestamps.name")}
                        {...form.register("name")}
                        error={form.formState.errors.name?.message}
                        placeholder={t("school.timestamps.namePlaceholder")} />

                    <div className="grid grid-cols-2 gap-4">
                        <AppTextField
                            label={t("school.timestamps.startTime")}
                            type="time"
                            {...form.register("startTime")}
                            error={form.formState.errors.startTime?.message} />
                        <AppTextField
                            label={t("school.timestamps.endTime")}
                            type="time"
                            {...form.register("endTime")}
                            error={form.formState.errors.endTime?.message} />
                    </div>

                    <AppSelect
                        label={t("school.timestamps.type")}
                        {...form.register("type")}
                        error={form.formState.errors.type?.message}
                        options={typeOptions} />

                    <AppTextField
                        label={t("school.timestamps.order")}
                        type="number"
                        min={0}
                        max={100}
                        {...form.register("orderIndex", { valueAsNumber: true })}
                        error={form.formState.errors.orderIndex?.message} />

                    <AppTextField
                        label={t("school.timestamps.description")}
                        {...form.register("description")}
                        error={form.formState.errors.description?.message}
                        placeholder={t("school.timestamps.descriptionPlaceholder")} />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingTimestamp
                                ? t("common.save")
                                : t("school.timestamps.create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
