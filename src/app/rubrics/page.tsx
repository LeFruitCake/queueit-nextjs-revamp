"use client";
import React from "react";
import BaseComponent from '@/Components/BaseComponent';
import RubricHeader from "@/Components/RubricHeader";
import CreateRubricButton from "@/Components/CreateRubricButton";
import RubricCard from "@/Components/RubricCard";

const rubricData = [
  {
    id: 1,
    title: "Rubric Title",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typese been the industry's standard.",
    createdBy: "Create by the system",
  },
  {
    id: 2,
    title: "Another Rubric2",
    description:
      "A second rubric example Lorem Ipsum is simply dummy text.",
    createdBy: "Admin",
  },
  {
    id: 3,
    title: "Another Rubric3",
    description:
      "A Lorem Ipsum is simply dummy text of the industry 1500s.",
    createdBy: "Admin",
  },
  {
    id: 4,
    title: "Another Rubric4",
    description: "A Lorem Ipsum is simply dummy text of the printing.",
    createdBy: "Admin",
  },
];

export default function Page() {
  
  return ( 
    <BaseComponent> 
      <div className="bg-white w-full min-h-screen flex flex-col relative rounded-md px-10 py-6 border-2 border-black">

        {/* Header and Button */}
        <div className="flex justify-between items-center w-full">
          <RubricHeader />
          <CreateRubricButton />
        </div> 
        
        {/* RubricCard below with margin for spacing */}
        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> 
          {rubricData.map((rubric, index) => (
              <RubricCard key={index} rubric={rubric} />
            ))}
          </div> 
      </div>
    </BaseComponent> 
  );
}
