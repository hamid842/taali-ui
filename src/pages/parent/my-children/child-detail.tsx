import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  Phone,
  BookOpen,
  School,
  User,
  ClipboardCheck,
  Award,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChildDetail } from "@/types/parent";

export default function ChildDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const childId = params.id as string;

  const [child, setChild] = useState<ChildDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/parents/children/${childId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch child details");
        }

        const data = await response.json();
        setChild(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (childId) {
      fetchChildDetail();
    }
  }, [childId]);

  if (loading) {
    return <ChildDetailSkeleton />;
  }

  if (error || !child) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Alert variant="destructive">
          <AlertDescription>{error || "Child not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{child.name}</h1>
            <p className="text-muted-foreground">Student Profile</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <ClipboardCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {child.attendanceRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Attendance
                  </div>
                </div>

                {child.averageGrade && (
                  <div className="text-center p-4 border rounded-lg">
                    <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {child.averageGrade}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Grade
                    </div>
                  </div>
                )}

                <div className="text-center p-4 border rounded-lg">
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{child.grade}</div>
                  <div className="text-sm text-muted-foreground">
                    Grade Level
                  </div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <School className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium truncate">
                    {child.className}
                  </div>
                  <div className="text-sm text-muted-foreground">Class</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* School Information */}
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <School className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{child.schoolName}</div>
                  <div className="text-sm text-muted-foreground">School</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{child.teacherName}</div>
                  <div className="text-sm text-muted-foreground">
                    Class Teacher
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {new Date(child.enrollmentDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Enrollment Date
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {child.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {child.birthDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {new Date(child.birthDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Birth Date
                    </div>
                  </div>
                </div>
              )}

              {child.emergencyContact && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {child.emergencyContact}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Emergency Contact
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href={`/parent/children-attendance?childId=${child.id}`}>
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  View Attendance
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href={`/parent/children-grades?childId=${child.id}`}>
                  <Award className="h-4 w-4 mr-2" />
                  View Grades
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Medical Notes */}
          {child.medicalNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Medical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {child.medicalNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ChildDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-9 w-20" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="text-center p-4 border rounded-lg space-y-2"
                  >
                    <Skeleton className="h-8 w-8 mx-auto" />
                    <Skeleton className="h-7 w-12 mx-auto" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-24 mx-auto rounded-full" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
