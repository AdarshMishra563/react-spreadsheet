"use client"
import axios from "axios";
import Spreadsheet from "./Spreadsheet";
import { Suspense, useEffect } from "react";

export default function Page() {
const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <div className="w-12 h-12 border-4 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
    </div>
  );
};

  return (
    <main>
      
      <Suspense fallback={<Spinner />}>
        <Spreadsheet />
      </Suspense>
    </main>
  );
}
