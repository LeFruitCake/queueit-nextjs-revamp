"use client";
import React, { useEffect, useState } from "react";
import BaseComponent from "@/Components/BaseComponent";
import RubricHeader from "@/Components/RubricHeader";
import CreateRubricButton from "@/Components/CreateRubricButton";
import RubricCard from "@/Components/RubricCard";
import { useUserContext } from "@/Contexts/AuthContext";
import { useRubricsContext } from "@/Contexts/RubricsContext";
import { useRubricContext } from "@/Contexts/RubricContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { Rubrics: rubrics, setRubrics } = useRubricsContext();
  const { user } = useUserContext();
  const { setRubric } = useRubricContext();
  const router = useRouter();
  const [filter, setFilter] = useState("All Templates");

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await fetch(`http://localhost:8081/rubrics/user/${user?.uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch rubrics");
        }
        const data = await response.json();
        setRubrics(data);
      } catch (error) {
        console.error("Error fetching rubrics:", error);
      }
    };

    fetchRubrics();
  }, [user?.uid, setRubrics]);

  const RubricCardAction = (rubric) => {
    setRubric(rubric);
    router.push("/rubrics/details");
  };

  // Filter rubrics based on selected header status
  const filteredRubrics = rubrics?.filter((rubric) => {
    if (filter === "Public Templates") return rubric.isPrivate == false;
    if (filter === "Private Templates") return rubric.isPrivate == true;
    return true; // Show all if "All Templates" is selected
  });

  return (
    <BaseComponent>
      <div className="bg-white w-full min-h-screen flex flex-col relative rounded-md px-10 py-6 border-2 border-black">
        <div className="flex justify-between items-center w-full">
          <RubricHeader onFilterChange={setFilter} />
          <CreateRubricButton />
        </div>

        <div className="relative pt-10 flex flex-wrap gap-8">
          {filteredRubrics?.length > 0 ? (
            filteredRubrics.map((rubric) => (
              <RubricCard key={rubric.id} onClickAction={RubricCardAction} rubric={rubric} />
            ))
          ) : (
            <p>No rubric found</p>
          )}
        </div>
      </div>
    </BaseComponent>
  );
}
