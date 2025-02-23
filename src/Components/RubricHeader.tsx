import { useState } from "react";

export default function RubricHeader() {
    const [selected, setSelected] = useState("All Templates");
    const [isOpen, setIsOpen] = useState(false);
    
    const options = ["All Templates", "Public Templates", "Private Templates"];
  
  return (
    <div>
      <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 rounded-sm hover:bg-gray-300 focus:outline-none "
          >
           <h2 className="text-lg font-bold mb-0">{selected}<span>{isOpen ? "▲" : "▼"}</span></h2>
          </button>
          {isOpen && (
            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-lg">
              {options.map((option) => (
                <button
                  key={option}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div> 
    </div>
  )
}
