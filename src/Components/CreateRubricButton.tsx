"use client";
import { useRouter } from "next/navigation";

export default function CreateRubricButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/rubrics/create")}
      className="relative inline-block px-4 py-2 bg-[#7D57FC] text-white font-semibold rounded-lg shadow-md hover:bg-[#6A45E0] transition"
    >
      Create Rubric
    </button>
  );
}
