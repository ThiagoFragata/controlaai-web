import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <div className="flex">
      <Sidebar />
      <main
        className={cn(
          "flex-1 min-h-screen bg-[#F5F5F7] p-6 transition-all duration-300 ease-[cubic-bezier(.32,.72,0,1)]",
          "lg:ml-[70px]", // espaço padrão quando compacto
          "group-[.sidebar-expanded]:lg:ml-64" // espaço quando expandido
        )}
      >
        {children}
      </main>
    </div>
  );
}
