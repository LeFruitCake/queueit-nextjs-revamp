import { CircularProgress, Modal, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import RubricHeader from './RubricHeader'
import { useRubricContext } from '@/Contexts/RubricContext'
import { useRubricsContext } from '@/Contexts/RubricsContext'
import { useUserContext } from '@/Contexts/AuthContext'
import RubricCard from './RubricCard'
import { Rubric } from '@/Utils/Global_variables'

interface SelectRubricModalProps{
    open:boolean
    setOpen:Function
}

const SelectRubricModal:React.FC<SelectRubricModalProps> = ({open=true,setOpen}) => {
    const {Rubric,setRubric} = useRubricContext();
    const {Rubrics,setRubrics} = useRubricsContext();
    const user = useUserContext().user
    useEffect(()=>{
        if(!Rubrics){
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
        }
    },[])

    const RubricCardAction = (rubric:Rubric)=>{
        setRubric(rubric);
        setOpen(false);
    }
    return (
        <Modal open={open} onClose={()=>{setOpen(false)}}>
            <div className='bg-white rounded-md absolute w-2/3 flex flex-col p-10 h-2/3 overflow-auto gap-3' style={{top:'50%',left:'50%',transform:'translate(-50%, -50%)'}}>
                <Typography textAlign={"center"} variant='h4' fontWeight={"bold"}>Choose a rubric that best fits the evaluation.</Typography>
                <RubricHeader/>
                {Rubrics?
                    <div className='relative flex flex-wrap gap-8 justify-around'>
                        {Rubrics.map((rubric,index)=>(
                            <RubricCard onClickAction={RubricCardAction} key={index} rubric={rubric}/>
                        ))}
                    </div>
                    :
                    <CircularProgress/>
                }
            </div>  
        </Modal>
    )
}

export default SelectRubricModal