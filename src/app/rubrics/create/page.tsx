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
  Typography,
  Divider,
  IconButton,
  colors,
  Tooltip,
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle'; 
import WestIcon from '@mui/icons-material/West';
import CancelIcon from '@mui/icons-material/Cancel'; 
import { dpurple, QUEUEIT_URL, RubricDTO } from "@/Utils/Global_variables";
import { toast } from "react-toastify";
import IndexEnumerator from "@/Components/IndexEnumerator";
import { useUserContext } from "@/Contexts/AuthContext";
import { capitalizeFirstLetter } from "@/Utils/Utility_functions";

export default function page() {
  const user = useUserContext().user
  const router = useRouter();
  const [rubric, setRubric] = useState<RubricDTO|null>({
    title: "",
    description: "",
    criteria: [],
    isPrivate:true,
  });

  const [isPrivate, setIsPrivate] = useState(true);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);

  const handleChange = (field, value) => {
    setRubric((prev) => ({ ...prev, [field]: value }));
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...rubric.criteria];
    updatedCriteria[index][field] = value;
    setRubric((prev) => ({ ...prev, criteria: updatedCriteria }));
  };

  const handleRemoveCriterion = (index: number) => {
    setRubric((prev: RubricDTO) => {
      const updatedCriteria = prev.criteria.filter((_, i) => i !== index);
      return { ...prev, criteria: updatedCriteria };
    });
  };

  const handleAddCriterion = () => {
    if(rubric?.criteria.length != 0 && rubric?.criteria[rubric.criteria.length-1].title == ""){
      toast.error("Criterion title must not be empty.")
    }else{
      setRubric((prev) => ({
        ...prev,
        criteria: [...prev.criteria, { title: "", description: "" }],
      }));
    }
    
  };

  const handleSaveTemplateOpen = () => setSaveTemplateOpen(true);
  const handleSaveTemplateClose = () => setSaveTemplateOpen(false);

  const handleSaveRubric = () => {
    if(rubric?.title == "" || rubric?.title == null || rubric?.title == undefined){
      toast.error("Rubric title must not be empty.")
    }else if(rubric.criteria.length == 0){
      toast.error("Criteria must atleast contain one criterion.")
    }else if(rubric?.criteria[rubric.criteria.length-1].title == ""){
      toast.error("Please remove the empty criterion.")
    }
    else{
      console.log("Rubric Saved:", rubric);
      // toast.success("Rubric saved.")
      

      fetch(`${QUEUEIT_URL}/rubrics/create`,{
        method:'POST',
        body:JSON.stringify({
          "title":rubric.title,
          "description":rubric.description,
          "criteria":rubric.criteria,
          "isPrivate":isPrivate,
          "userID":user?.uid,
          "facultyName":`${capitalizeFirstLetter(user?.firstname)} ${capitalizeFirstLetter(user?.lastname)}`
        }),
        headers:{
          'Content-Type':'application/json'
        },
        
      })
      .then((res)=>{
        setSaveTemplateOpen(false);
        router.push("/rubrics");
        toast.success("received a response")
        console.log(res)
      })
      .catch((err)=>{
        toast.error("caught an error")
        console.log(err)
      })
    }
  };

  return (
    <BaseComponent>
      <div className="bg-white w-full min-h-screen flex flex-col relative rounded-md px-10 py-6 border-2 border-black overflow-auto">
        <div className="flex items-center gap-x-10">
          <div className="flex items-start h-full">
            <IconButton onClick={()=>{router.back()}} sx={{backgroundColor:'black','&:hover':{backgroundColor:'#333'}}}><WestIcon sx={{color:'white'}}/></IconButton>
          </div>
          <div className="flex flex-col h-full gap-3 items-start justify-start w-full">
            <input
              value={rubric.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Rubric Title"
              style={{fontSize:'2.5em', fontWeight:'bold', color:'black', width:'100%'}}
            />
            <TextField
            value={rubric.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            variant="standard"
            multiline
            placeholder="Description"
            InputProps={{ disableUnderline: true }}
            className="text-gray-500 ml-12"
          />
          </div>
        </div>

        

        <div className="p-6 rounded-lg mt-10">
          <Typography variant="h5" fontWeight={"bold"}>Criteria</Typography>
          {/* <Divider/> */}
          {rubric.criteria.map((criterion, index) => (
            <div key={index} className="border-b p-4 mb-2 flex gap-5 w-full items-center">
              <IndexEnumerator index={index+1}/>
              <div className="flex flex-1 flex-col gap-2">
                <TextField
                  value={criterion.title}
                  onChange={(e) => handleCriteriaChange(index, "title", e.target.value)}
                  variant="standard"
                  placeholder="Insert Criterion"
                  InputProps={{ disableUnderline: true, sx:{fontSize:'1.5em'} }}
                  className="font-semibold"
                />
                <TextField
                  value={criterion.description}
                  onChange={(e) => handleCriteriaChange(index, "description", e.target.value)}
                  multiline
                  variant="standard"
                  placeholder="Insert criterion description"
                  InputProps={{ disableUnderline: true }}
                  className="text-gray-600"
                />
              </div>
              <div>
              <Tooltip title="Remove Criterion" arrow>
                <IconButton onClick={() => handleRemoveCriterion(index)}>
                  <CancelIcon sx={{ color: "black" }} />
                </IconButton>
              </Tooltip> 
              </div>
            </div>
          ))}

          <button
            onClick={handleAddCriterion}
            className="mt-4 px-4 py-2 bg-[black] text-white rounded-md hover:bg-[#353535] transition flex gap-3"
          >
            <AddCircleIcon/> Add Criterion
          </button>
        </div>

        <div className="flex justify-center w-full gap-5 mt-6">
          <Button sx={{textTransform:'none'}} onClick={() => router.push("/rubrics")} style={{ color: "#000" }}>
            Cancel
          </Button>
          <Button sx={{textTransform:'none'}}
            onClick={handleSaveTemplateOpen}
            style={{ background: dpurple, color: "#fff", padding:'0.5em 2.5em' }}
          >
            Save
          </Button>
        </div>

        <Dialog open={saveTemplateOpen} onClose={handleSaveTemplateClose} fullWidth maxWidth="sm">
          <DialogTitle className="text-[#7D57FC] font-bold">Save New Rubric</DialogTitle>
          <DialogContent>
            <p className="text-gray-600">Would you like to make this rubric template public?</p>
            <FormControlLabel
              control={<Checkbox checked={!isPrivate} onChange={(e) => setIsPrivate(false)} />}
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
