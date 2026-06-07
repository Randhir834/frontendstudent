import StudentDashboardLayout from '@/components/layouts/StudentDashboardLayout';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentDashboardLayout>{children}</StudentDashboardLayout>;
}
