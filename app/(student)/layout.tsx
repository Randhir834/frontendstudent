import RoleGuard from '@/components/layouts/RoleGuard';

export default function StudentGroupLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['student', 'admin', 'instructor']}>{children}</RoleGuard>;
}
