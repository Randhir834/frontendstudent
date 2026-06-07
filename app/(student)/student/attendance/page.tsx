'use client';

import { useEffect, useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, CheckCircle2, XCircle, Clock, BarChart3, Loader2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { attendanceService } from '@/services/attendanceService';
import { enrollmentService } from '@/services/enrollmentService';
import type { Course } from '@/types';

interface AttendanceRecord {
  id: number;
  course_id: number;
  course_title: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export default function StudentAttendancePage() {
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const enrollmentData = await enrollmentService.getEnrollments();
        
        // Extract courses from enrollments
        const courses = enrollmentData.enrollments?.map((enrollment: any) => enrollment.course) || [];
        setEnrolledCourses(courses);
        
        // Fetch attendance history for all courses initially
        if (courses && courses.length > 0) {
          const attendanceData = await attendanceService.getStudentAttendanceHistory();
          setAttendanceHistory(attendanceData.attendance || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredAttendance = async () => {
      if (!selectedCourse) {
        // Fetch all attendance
        try {
          const attendanceData = await attendanceService.getStudentAttendanceHistory();
          setAttendanceHistory(attendanceData.attendance || []);
        } catch (error) {
          console.error('Failed to fetch attendance:', error);
        }
      } else {
        // Fetch attendance for specific course
        try {
          const attendanceData = await attendanceService.getStudentAttendanceHistory(parseInt(selectedCourse));
          setAttendanceHistory(attendanceData.attendance || []);
        } catch (error) {
          console.error('Failed to fetch course attendance:', error);
        }
      }
    };

    if (enrolledCourses.length > 0) {
      fetchFilteredAttendance();
    }
  }, [selectedCourse, enrolledCourses.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-[#1E88E5] bg-[#C5E1A5]';
      case 'absent': return 'text-[#EC407A] bg-[#FEE2E2]';
      case 'late': return 'text-[#D97706] bg-[#FEF3C7]';
      default: return 'text-[#78909C] bg-[#FAFAFA]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="size-4" />;
      case 'absent': return <XCircle className="size-4" />;
      case 'late': return <Clock className="size-4" />;
      default: return null;
    }
  };

  // Calculate statistics
  const stats = {
    totalRecords: attendanceHistory.length,
    presentCount: attendanceHistory.filter(record => record.status === 'present').length,
    absentCount: attendanceHistory.filter(record => record.status === 'absent').length,
    lateCount: attendanceHistory.filter(record => record.status === 'late').length,
  };

  const attendanceRate = stats.totalRecords > 0 
    ? ((stats.presentCount + stats.lateCount) / stats.totalRecords * 100).toFixed(1)
    : '0';

  // Group attendance by course for course-wise stats
  const courseStats = enrolledCourses.map(course => {
    const courseAttendance = attendanceHistory.filter(record => record.course_id === course.id);
    const present = courseAttendance.filter(record => record.status === 'present').length;
    const total = courseAttendance.length;
    const percentage = total > 0 ? ((present + courseAttendance.filter(record => record.status === 'late').length) / total * 100) : 0;
    
    return {
      ...course,
      totalClasses: total,
      presentCount: present,
      absentCount: courseAttendance.filter(record => record.status === 'absent').length,
      lateCount: courseAttendance.filter(record => record.status === 'late').length,
      attendancePercentage: percentage
    };
  });

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1E3A5F]">My Attendance</h1>
        <p className="text-sm text-[#78909C] mt-1">
          Track your attendance across all enrolled courses
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="size-5 text-[#78909C] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#1E3A5F]">{stats.totalRecords}</div>
              <div className="text-sm text-[#78909C]">Total Classes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle2 className="size-5 text-[#1E88E5] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#1E88E5]">{stats.presentCount}</div>
              <div className="text-sm text-[#78909C]">Present</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <XCircle className="size-5 text-[#EC407A] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#EC407A]">{stats.absentCount}</div>
              <div className="text-sm text-[#78909C]">Absent</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Clock className="size-5 text-[#D97706] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#D97706]">{stats.lateCount}</div>
              <div className="text-sm text-[#78909C]">Late</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="size-5 text-[#AB47BC] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#AB47BC]">{attendanceRate}%</div>
              <div className="text-sm text-[#78909C]">Attendance Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course-wise Statistics */}
      {courseStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Course-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseStats.map((course) => (
                <div key={course.id} className="p-4 border border-[#E0E0E0] rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-[#1E3A5F] line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-[#78909C]">{course.category_name}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#78909C]">Attendance</span>
                      <span className={`px-2 py-1 text-sm font-bold rounded-full ${
                        course.attendancePercentage >= 90 ? 'text-[#1E88E5] bg-[#C5E1A5]' :
                        course.attendancePercentage >= 75 ? 'text-[#0891B2] bg-[#CFFAFE]' :
                        course.attendancePercentage >= 60 ? 'text-[#D97706] bg-[#FEF3C7]' :
                        'text-[#EC407A] bg-[#FEE2E2]'
                      }`}>
                        {course.attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-[#1E88E5] font-medium">{course.presentCount}</div>
                        <div className="text-[#78909C]">Present</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#EC407A] font-medium">{course.absentCount}</div>
                        <div className="text-[#78909C]">Absent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#D97706] font-medium">{course.lateCount}</div>
                        <div className="text-[#78909C]">Late</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#374151]">Filter by Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
            >
              <option value="">All Courses</option>
              {enrolledCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceHistory.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="size-12 text-[#E0E0E0] mx-auto mb-3" />
              <p className="text-sm text-[#78909C]">
                {selectedCourse ? 'No attendance records found for this course.' : 'No attendance records found.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E0E0E0]">
                      <th className="text-left py-3 px-4 font-medium text-[#374151]">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-[#374151]">Course</th>
                      <th className="text-center py-3 px-4 font-medium text-[#374151]">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-[#374151]">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record, index) => (
                      <tr key={index} className="border-b border-[#FAFAFA] hover:bg-[#FAFAFA]">
                        <td className="py-3 px-4 text-sm text-[#1E3A5F]">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-[#1E3A5F]">
                          {record.course_title}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#78909C]">
                          {record.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {attendanceHistory
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record, index) => (
                    <div key={index} className="p-4 border border-[#E0E0E0] rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#1E3A5F] text-sm mb-1">{record.course_title}</h4>
                          <p className="text-xs text-[#78909C]">
                            {new Date(record.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                      {record.notes && (
                        <div className="pt-2 border-t border-[#FAFAFA]">
                          <p className="text-xs text-[#78909C]">
                            <span className="font-medium">Notes:</span> {record.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {stats.totalRecords > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-[#1E88E5]" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {parseFloat(attendanceRate) >= 90 && (
                <div className="p-3 bg-[#C5E1A5] text-[#1E88E5] rounded-lg">
                  🎉 Excellent attendance! You're maintaining {attendanceRate}% attendance rate.
                </div>
              )}
              
              {parseFloat(attendanceRate) >= 75 && parseFloat(attendanceRate) < 90 && (
                <div className="p-3 bg-[#CFFAFE] text-[#0891B2] rounded-lg">
                  👍 Good attendance! You have {attendanceRate}% attendance rate. Try to improve to reach 90%.
                </div>
              )}
              
              {parseFloat(attendanceRate) >= 60 && parseFloat(attendanceRate) < 75 && (
                <div className="p-3 bg-[#FEF3C7] text-[#D97706] rounded-lg">
                  ⚠️ Average attendance. Your {attendanceRate}% attendance rate needs improvement for better learning outcomes.
                </div>
              )}
              
              {parseFloat(attendanceRate) < 60 && (
                <div className="p-3 bg-[#FEE2E2] text-[#EC407A] rounded-lg">
                  🚨 Low attendance alert! Your {attendanceRate}% attendance rate is concerning. Please attend classes regularly.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 border border-[#E0E0E0] rounded-lg">
                  <h4 className="font-medium text-[#1E3A5F] mb-2">Best Performing Course</h4>
                  {courseStats.length > 0 && (
                    <div>
                      {(() => {
                        const bestCourse = courseStats.reduce((prev, current) => 
                          (prev.attendancePercentage > current.attendancePercentage) ? prev : current
                        );
                        return (
                          <div>
                            <p className="text-sm text-[#78909C]">{bestCourse.title}</p>
                            <p className="text-lg font-bold text-[#1E88E5]">{bestCourse.attendancePercentage.toFixed(1)}%</p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="p-3 border border-[#E0E0E0] rounded-lg">
                  <h4 className="font-medium text-[#1E3A5F] mb-2">Needs Attention</h4>
                  {courseStats.length > 0 && (
                    <div>
                      {(() => {
                        const worstCourse = courseStats.reduce((prev, current) => 
                          (prev.attendancePercentage < current.attendancePercentage) ? prev : current
                        );
                        return worstCourse.attendancePercentage < 75 ? (
                          <div>
                            <p className="text-sm text-[#78909C]">{worstCourse.title}</p>
                            <p className="text-lg font-bold text-[#EC407A]">{worstCourse.attendancePercentage.toFixed(1)}%</p>
                          </div>
                        ) : (
                          <p className="text-sm text-[#1E88E5]">All courses performing well! 🎉</p>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}