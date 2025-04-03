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
import MergeCancelButtons from "@/Components/MergeCancelButtons"; 
import { toast } from "react-toastify";

export default function Page() {
  const { Rubrics: rubrics, setRubrics } = useRubricsContext();
  const { user } = useUserContext();
  const { setRubric } = useRubricContext();
  const router = useRouter();
  const [filter, setFilter] = useState("All Templates");
  const [loading, setLoading] = useState(true);
  const [isMerging, setIsMerging] = useState(false);
  const [selectedRubricIds, setSelectedRubricIds] = useState(new Set()); 

  useEffect(() => {
    if (user) {
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
    }
  }, [user?.uid, setRubrics]);

  const RubricCardAction = (rubric) => {
    if (isMerging) {
      window.open("/rubrics/details");
    } else {
      setRubric(rubric);
      router.push("/rubrics/details");
    }
  };

  const handleSelectAndMergeRubrics = () => {
    setIsMerging(true);
  };

  const handleMerge = () => {
    const selectedRubrics = rubrics.filter(rubric => selectedRubricIds.has(rubric.id));
    
    const mergedRubric = {
      title: selectedRubrics.map(r => r.title).join(' + '),
      description: selectedRubrics.map(r => r.description).join(' | '),
      criteria: selectedRubrics.flatMap(r => r.criteria),
      isPrivate: true,
      isWeighted: selectedRubrics.some(r => r.isWeighted),
    };
  
    // Construct the URL with query parameters
    const mergedRubricQuery = encodeURIComponent(JSON.stringify(mergedRubric));
    const createPageUrl = `/rubrics/create?mergedRubric=${mergedRubricQuery}`;
  
    // Navigate to the create page with the merged rubric data
    router.push(createPageUrl);
  
    setIsMerging(false);
  };
  

  const handleCancel = () => {
    setIsMerging(false);
    setSelectedRubricIds(new Set());
  };

  const handleCheckboxChange = (rubricId) => {
    setSelectedRubricIds((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(rubricId)) {
        newSelected.delete(rubricId);
      } else {
        newSelected.add(rubricId);
      }
      return newSelected;
    });
  };

  // Filter rubrics based on selected header status
  const filteredRubrics = rubrics?.filter((rubric) => {
    if (filter === "Public Templates") return rubric.isPrivate == false;
    if (filter === "Private Templates") return rubric.isPrivate == true;
    return true; // Show all if "All Templates" is selected
  });

  return (
    <BaseComponent>
      <div className="bg-white w-full flex flex-col relative rounded-md px-10 py-6 border-2 border-black h-fit">
        <div className="flex justify-between items-center w-full">
          <RubricHeader onFilterChange={setFilter} />
          {isMerging ? (
            <MergeCancelButtons onMerge={handleMerge} onCancel={handleCancel} />
          ) : (
            <CreateRubricButton onSelectAndMerge={handleSelectAndMergeRubrics} />
          )}
        </div>

        <div className="relative pt-10 flex flex-wrap gap-10 p-5">
          {filteredRubrics?.length > 0 ? (
            filteredRubrics.map((rubric) => (
              <div key={rubric.id} className="flex items-start">
                {isMerging && (
                  <input
                    type="checkbox"
                    checked={selectedRubricIds.has(rubric.id)}
                    onChange={() => handleCheckboxChange(rubric.id)}
                    className="mr-2"
                  />
                )}
                <RubricCard onClickAction={RubricCardAction} rubric={rubric} />
              </div>
            ))
          ) : (
            <p>No rubric found</p>
          )}
        </div>
      </div>
    </BaseComponent>
  );
}