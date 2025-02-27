"use client";
import React, { useEffect, useState } from "react";
import BaseComponent from '@/Components/BaseComponent';
import RubricHeader from "@/Components/RubricHeader";
import CreateRubricButton from "@/Components/CreateRubricButton";
import RubricCard from "@/Components/RubricCard";

export default function Page() {
  const [rubrics, setRubrics] = useState([]);
  const userID = 2;  

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await fetch(`http://localhost:8081/rubrics/user/${userID}`);
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
  }, []);

  return (
    <BaseComponent>
      <div className="bg-white w-full min-h-screen flex flex-col relative rounded-md px-10 py-6 border-2 border-black">
        <div className="flex justify-between items-center w-full">
          <RubricHeader />
          <CreateRubricButton />
        </div>

        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rubrics.length > 0 ? (
            rubrics.map((rubric) => ( 
              <RubricCard key={rubric.id} rubric={rubric} currentUserID={userID} /> 
            ))
          ) : (
            <p>No rubrics found</p>
          )}
        </div>
      </div>
    </BaseComponent>
  );
}
