"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseComponent from "@/Components/BaseComponent";
import BackButton from "@/Components/BackButton";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export default function page() {
  const router = useRouter();
  const [rubric, setRubric] = useState({
    title: "",
    description: "",
    criteria: [{ title: "", description: "" }],
  });

  const [isPublic, setIsPublic] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);

  const handleChange = (field, value) => {
    setRubric((prev) => ({ ...prev, [field]: value }));
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...rubric.criteria];
    updatedCriteria[index][field] = value;
    setRubric((prev) => ({ ...prev, criteria: updatedCriteria }));
  };

  const handleAddCriterion = () => {
    setRubric((prev) => ({
      ...prev,
      criteria: [...prev.criteria, { title: "", description: "" }],
    }));
  };

  const handleSaveTemplateOpen = () => setSaveTemplateOpen(true);
  const handleSaveTemplateClose = () => setSaveTemplateOpen(false);

  const handleSaveRubric = () => {
    console.log("Rubric Saved:", rubric);
    setSaveTemplateOpen(false);
    router.push("/rubrics"); // Redirect back to the rubric list page
  };

  return (
    <BaseComponent>
      <div className="bg-white w-full min-h-screen flex flex-col relative rounded-md px-10 py-6 border-2 border-black">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <TextField
            value={rubric.title}
            onChange={(e) => handleChange("title", e.target.value)}
            fullWidth
            variant="standard"
            placeholder="Enter Rubric Title"
            InputProps={{ disableUnderline: true }}
            className="text-2xl font-bold"
          />
        </div>

        <TextField
          value={rubric.description}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
          variant="standard"
          multiline
          placeholder="Enter Rubric Description"
          InputProps={{ disableUnderline: true }}
          sx={{
            "& .MuiInputBase-input": {
              paddingLeft: "24px", 
            } 
          }}
          className="text-gray-500 ml-12" 
        />

        <div className="bg-gray-100 p-6 mt-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4 border-b pb-4">Criteria</h2>
          {rubric.criteria.map((criterion, index) => (
            <div key={index} className="border-b pb-2 mb-2">
              <TextField
                value={criterion.title}
                onChange={(e) => handleCriteriaChange(index, "title", e.target.value)}
                fullWidth
                variant="standard"
                placeholder="Criterion Title"
                InputProps={{ disableUnderline: true }}
                className="font-semibold"
              />
              <TextField
                value={criterion.description}
                onChange={(e) => handleCriteriaChange(index, "description", e.target.value)}
                fullWidth
                multiline
                variant="standard"
                placeholder="Criterion Description"
                InputProps={{ disableUnderline: true }}
                className="text-gray-600"
              />
            </div>
          ))}

          <button
            onClick={handleAddCriterion}
            className="mt-4 px-4 py-2 bg-[#7D57FC] text-white rounded-md hover:bg-[#5a3dcf] transition"
          >
            + Add Criterion
          </button>
        </div>

        <div className="flex justify-center w-full mt-6">
          <Button onClick={() => router.push("/rubrics")} style={{ color: "#000", fontWeight: "bold" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveTemplateOpen}
            style={{ background: "rgba(125,87,252,0.9)", color: "#fff", fontWeight: "bold", marginLeft: "10px" }}
          >
            Save Rubric
          </Button>
        </div>

        <Dialog open={saveTemplateOpen} onClose={handleSaveTemplateClose} fullWidth maxWidth="sm">
          <DialogTitle className="text-[#7D57FC] font-bold">Save New Rubric</DialogTitle>
          <DialogContent>
            <p className="text-gray-600">Would you like to make this rubric template public?</p>
            <FormControlLabel
              control={<Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
              label="Make this template public"
            />
          </DialogContent>
          <DialogActions className="flex justify-center w-full">
            <Button onClick={handleSaveTemplateClose} style={{ color: "#000", fontWeight: "bold" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveRubric}
              style={{ background: "rgba(125,87,252,0.9)", color: "#fff", fontWeight: "bold" }}
            >
              Save Rubric
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </BaseComponent>
  );
}
