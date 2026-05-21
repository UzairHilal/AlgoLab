import StudentSidebar from "./StudentSidebar";

export default function StudentLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}