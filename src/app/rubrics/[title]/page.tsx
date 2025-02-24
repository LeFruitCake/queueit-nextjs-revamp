"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import BaseComponent from '@/Components/BaseComponent';
import BackButton from '@/Components/BackButton';
import { 
  TextField, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Checkbox, 
  FormControlLabel 
} from "@mui/material";

  
const rubricData = [
  {
    id: 1,
    title: "Consultation Rubric",
    description: "Evaluates individual preparedness, participation, contribution quality, responsiveness to feedback, and collaboration during weekly consultations.",
    createdBy: "Created by the system",
    criteria: [
      { title: "Preparation", description: "Student comes to the consultation well-prepared with assigned tasks completed or progress to report." },
      { title: "Active Participation", description: "Student actively engages in the discussion, asks relevant questions, and provides meaningful input." },
      { title: "Quality of Contributions", description: "Suggestions and insights are clear, relevant, and contribute to the group's overall progress." },
      { title: "Collaboration and Communication", description: "Demonstrates good teamwork by respecting peers’ opinions and communicating effectively within the group." },
    ],
  },
  {
    id: 2,
    title: "Another Rubric2",
    description: "Evaluates individual preparedness, participation, contribution quality, responsiveness to feedback, and collaboration during weekly consultations.",
    createdBy: "Created by the system",
    criteria: [
      { title: "Preparation", description: "Student comes to the consultation well-prepared with assigned tasks completed or progress to report." },
      { title: "Active Participation", description: "Student actively engages in the discussion, asks relevant questions, and provides meaningful input." },
      { title: "Quality of Contributions", description: "Suggestions and insights are clear, relevant, and contribute to the group's overall progress." },
      { title: "Collaboration and Communication", description: "Demonstrates good teamwork by respecting peers’ opinions and communicating effectively within the group." },
    ],
  },
  {
    id: 3,
    title: "Another Rubric3",
    description: "Evaluates individual preparedness, participation, contribution quality, responsiveness to feedback, and collaboration during weekly consultations.",
    createdBy: "Created by the system",
    criteria: [
      { title: "Preparation", description: "Student comes to the consultation well-prepared with assigned tasks completed or progress to report." },
      { title: "Active Participation", description: "Student actively engages in the discussion, asks relevant questions, and provides meaningful input." },
      { title: "Quality of Contributions", description: "Suggestions and insights are clear, relevant, and contribute to the group's overall progress." },
      { title: "Collaboration and Communication", description: "Demonstrates good teamwork by respecting peers’ opinions and communicating effectively within the group." },
    ],
  },
  {
    id: 4,
    title: "Another Rubric4",
    description: "Evaluates individual preparedness, participation, contribution quality, responsiveness to feedback, and collaboration during weekly consultations.",
    createdBy: "Created by the system",
    criteria: [
      { title: "Preparation", description: "Student comes to the consultation well-prepared with assigned tasks completed or progress to report." },
      { title: "Active Participation", description: "Student actively engages in the discussion, asks relevant questions, and provides meaningful input." },
      { title: "Quality of Contributions", description: "Suggestions and insights are clear, relevant, and contribute to the group's overall progress." },
      { title: "Collaboration and Communication", description: "Demonstrates good teamwork by respecting peers’ opinions and communicating effectively within the group." },
    ],
  },
];

export default function page() {
  const { title } = useParams();
  const rubric = rubricData.find(r => r.title === decodeURIComponent(title));

  const [isEditing, setIsEditing] = useState(false);
  const [editedRubric, setEditedRubric] = useState({ ...rubric });
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  if (!rubric) {
    return <p>Rubric not found.</p>;
  }

  const handleChange = (field, value) => {
    setEditedRubric(prev => ({ ...prev, [field]: value }));
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...editedRubric.criteria];
    updatedCriteria[index][field] = value;
    setEditedRubric(prev => ({ ...prev, criteria: updatedCriteria }));
  };

  const toggleEditMode = () => setIsEditing(!isEditing);
  const handleAddCriterion = () => {
    setEditedRubric(prev => ({
      ...prev,
      criteria: [...prev.criteria, { title: "", description: "" }],
    }));
  };

  const handleSaveTemplateOpen = () => setSaveTemplateOpen(true);
  const handleSaveTemplateClose = () => setSaveTemplateOpen(false);
  const handleEditClose = () => setIsEditing(false);

  return (
    <BaseComponent>
      <div className="bg-white w-full min-h-screen flex flex-col relative rounded-md px-10 py-6 border-2 border-black overflow-hidden">
        <div className="flex items-center gap-x-2">
          <BackButton />
          {isEditing ? (
            <TextField
              value={editedRubric.title}
              onChange={(e) => handleChange("title", e.target.value)}
              fullWidth
              variant="standard"
              InputProps={{ disableUnderline: true }}
              className="text-2xl font-bold"
            />
          ) : (
            <h1 className="text-2xl font-bold">{editedRubric.title}</h1>
          )}
          {!isEditing && (
            <button
              onClick={toggleEditMode}
              className="ml-auto px-4 py-2 bg-white text-[#7D57FC] rounded-md border border-[#7D57FC] hover:bg-[#7D57FC] hover:text-white transition"
            >
              Edit Rubric
            </button>
          )} 
        </div>

        {isEditing ? (
          <TextField
            value={editedRubric.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            variant="standard"
            multiline
            InputProps={{ disableUnderline: true }}
            className="text-gray-500 ml-12"
          />
        ) : (
          <p className="text-gray-500 ml-12">{editedRubric.description}</p>
        )}

        {/* Criteria List */}
        <div className="bg-gray-100 p-6 mt-4 rounded-lg shadow overflow-y-auto max-h-[400px]">
          <h2 className="font-bold text-lg mb-4 border-b pb-4">Criteria</h2>
          {editedRubric.criteria.map((criterion, index) => (
            <div key={index} className="border-b pb-2 mb-2">
              {isEditing ? (
                <>
                  <TextField
                    value={criterion.title}
                    onChange={(e) => handleCriteriaChange(index, "title", e.target.value)}
                    fullWidth
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    className="font-semibold"
                  />
                  <TextField
                    value={criterion.description}
                    onChange={(e) => handleCriteriaChange(index, "description", e.target.value)}
                    fullWidth
                    multiline
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    className="text-gray-600"
                  />
                </>
              ) : (
                <>
                  <h3 className="font-semibold">{criterion.title}</h3>
                  <p className="text-gray-600">{criterion.description}</p>
                </>
              )}
            </div>
          ))}

          {isEditing && (
            <button
              onClick={handleAddCriterion}
              className="mt-4 px-4 py-2 bg-[#7D57FC] text-white rounded-md hover:bg-[#5a3dcf] transition"
            >
              + Add Criterion
            </button>
          )}
        </div>

        {/* Save & Cancel Buttons */}
        {isEditing && (
          <div className="flex justify-center w-full mt-6">
            <Button onClick={handleEditClose} style={{ color: "#000", fontWeight: "bold" }}>Cancel</Button>
            <Button onClick={handleSaveTemplateOpen} style={{ background: "rgba(125,87,252,0.9)", color: "#fff", fontWeight: "bold", marginLeft: "10px" }}>Save Rubric</Button>
          </div>
        )}

        {/* Save Template Dialog */}
        <Dialog open={saveTemplateOpen} onClose={handleSaveTemplateClose} fullWidth maxWidth="sm">
          <DialogTitle className="text-[#7D57FC] font-bold">Save as New Rubric Template</DialogTitle>
          <DialogContent>
            <p className="text-gray-600">
              By editing this rubric template, you will be able to use it in other subjects.
            </p>
            <FormControlLabel
              control={<Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
              label="Make this template public"
            />
            {isPublic && (
              <p className="text-gray-500 text-sm ml-7">
                By making this template public, your name will be displayed as the creator.
              </p>
            )}
          </DialogContent>
          <DialogActions className="flex justify-center w-full">
            <Button onClick={handleSaveTemplateClose} style={{ color: "#000", fontWeight: "bold" }}>Cancel</Button>
            <Button onClick={() => { handleSaveTemplateClose(); handleEditClose(); }} style={{ background: "rgba(125,87,252,0.9)", color: "#fff", fontWeight: "bold" }}>Save Rubric</Button>
          </DialogActions>
        </Dialog>

      </div>

      
    </BaseComponent>
  );
}
