// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        
        <Link href="/dashboard/devices">
          <button className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
            <span>Open Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>

        
      </div>
    </div>
  );
}