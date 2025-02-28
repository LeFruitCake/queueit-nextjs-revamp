"use client";
import React, { useEffect, useState } from "react";
import BaseComponent from '@/Components/BaseComponent';
import RubricHeader from "@/Components/RubricHeader";
import CreateRubricButton from "@/Components/CreateRubricButton";
import RubricCard from "@/Components/RubricCard";
import { Rubric } from "@/Utils/Global_variables";
import { useUserContext } from "@/Contexts/AuthContext";
import { useRubricsContext } from "@/Contexts/RubricsContext";
import { useQueueingManagerContext } from "@/Contexts/QueueingManagerContext";

export default function Page() {
  const rubrics = useRubricsContext().Rubrics
  const setRubrics = useRubricsContext().setRubrics
  const user = useUserContext().user

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await fetch(`http://localhost:8081/rubrics/user/${user?.uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch rubrics");
        }
        const data = await response.json();
        console.log(data)
        setRubrics(data);
      } catch (error) {
        console.error("Error fetching rubrics:", error);
      }
    };

    fetchRubrics();
  }, []);

  return (
    <BaseComponent>
      <div className="bg-white w-full min-h-screen flex flex-col relative rounded-md px-10 py-6 border-2 border-black">
        <div className="flex justify-between items-center w-full">
          <RubricHeader />
          <CreateRubricButton />
        </div>

        <div className="w-full mt-6 flex flex-wrap justify-evenly  gap-4">
          {rubrics?.length > 0 ? (
            rubrics?.map((rubric) => ( 
              <RubricCard key={rubric.id} rubric={rubric} /> 
            ))
          ) : (
            <p>No rubric found</p>
          )}
        </div>
      </div>
    </BaseComponent>
  );
}
