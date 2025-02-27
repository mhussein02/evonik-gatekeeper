
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration purposes
const chemicalsData = [
  { id: 1, name: "Hydrogen Peroxide" },
  { id: 2, name: "Sulfuric Acid" },
  { id: 3, name: "Nitric Acid" },
  { id: 4, name: "Sodium Hydroxide" },
  { id: 5, name: "Hydrochloric Acid" },
  { id: 6, name: "Ammonia" },
  { id: 7, name: "Acetic Acid" },
  { id: 8, name: "Phosphoric Acid" },
  { id: 9, name: "Methanol" },
  { id: 10, name: "Ethanol" },
  { id: 11, name: "Acetone" },
  { id: 12, name: "Benzene" },
  { id: 13, name: "Toluene" },
  { id: 14, name: "Chloroform" },
  { id: 15, name: "Formaldehyde" },
  { id: 16, name: "Ethylene Glycol" },
  { id: 17, name: "Hexane" },
  { id: 18, name: "Ethyl Acetate" },
  { id: 19, name: "Methylene Chloride" },
  { id: 20, name: "Tetrahydrofuran" },
];

const metalsData = [
  { id: 1, name: "Aluminum" },
  { id: 2, name: "Copper" },
  { id: 3, name: "Iron" },
  { id: 4, name: "Lead" },
  { id: 5, name: "Zinc" },
  { id: 6, name: "Nickel" },
  { id: 7, name: "Titanium" },
  { id: 8, name: "Silver" },
  { id: 9, name: "Gold" },
  { id: 10, name: "Platinum" },
  { id: 11, name: "Magnesium" },
  { id: 12, name: "Tin" },
  { id: 13, name: "Cobalt" },
  { id: 14, name: "Chromium" },
  { id: 15, name: "Manganese" },
  { id: 16, name: "Molybdenum" },
  { id: 17, name: "Tungsten" },
  { id: 18, name: "Vanadium" },
  { id: 19, name: "Stainless Steel" },
  { id: 20, name: "Brass" },
];

// Mock function to generate affinity values
const getAffinityValue = (chemicalId: number, metalId: number) => {
  // In a real application, this would come from a database
  // For now, we'll generate a random value between 1-5
  return Math.floor(Math.random() * 5) + 1;
};

const CreateMatrix = () => {
  const navigate = useNavigate();
  const [selectedChemicals, setSelectedChemicals] = useState<Array<number | null>>(Array(20).fill(null));
  const [selectedMetals, setSelectedMetals] = useState<Array<number | null>>(Array(20).fill(null));
  const [affinityMatrix, setAffinityMatrix] = useState<Array<Array<number | null>>>(
    Array(20).fill(null).map(() => Array(20).fill(null))
  );

  const handleChemicalChange = (index: number, chemicalId: number | null) => {
    const newSelectedChemicals = [...selectedChemicals];
    newSelectedChemicals[index] = chemicalId;
    setSelectedChemicals(newSelectedChemicals);
    
    // Update affinity values for this row
    if (chemicalId !== null) {
      updateAffinityValues(index, chemicalId, true);
    } else {
      // Clear affinity values for this row
      const newAffinityMatrix = [...affinityMatrix];
      for (let j = 0; j < 20; j++) {
        newAffinityMatrix[index][j] = null;
      }
      setAffinityMatrix(newAffinityMatrix);
    }
  };

  const handleMetalChange = (index: number, metalId: number | null) => {
    const newSelectedMetals = [...selectedMetals];
    newSelectedMetals[index] = metalId;
    setSelectedMetals(newSelectedMetals);
    
    // Update affinity values for this column
    if (metalId !== null) {
      updateAffinityValues(index, metalId, false);
    } else {
      // Clear affinity values for this column
      const newAffinityMatrix = [...affinityMatrix];
      for (let i = 0; i < 20; i++) {
        newAffinityMatrix[i][index] = null;
      }
      setAffinityMatrix(newAffinityMatrix);
    }
  };

  const updateAffinityValues = (index: number, id: number, isChemical: boolean) => {
    const newAffinityMatrix = [...affinityMatrix];
    
    if (isChemical) {
      // Update row
      for (let j = 0; j < 20; j++) {
        if (selectedMetals[j] !== null) {
          newAffinityMatrix[index][j] = getAffinityValue(id, selectedMetals[j]!);
        }
      }
    } else {
      // Update column
      for (let i = 0; i < 20; i++) {
        if (selectedChemicals[i] !== null) {
          newAffinityMatrix[i][index] = getAffinityValue(selectedChemicals[i]!, id);
        }
      }
    }
    
    setAffinityMatrix(newAffinityMatrix);
  };

  const generateMatrix = () => {
    let hasSelections = false;
    
    // Check if there are any selections
    for (let i = 0; i < 20; i++) {
      if (selectedChemicals[i] !== null) {
        for (let j = 0; j < 20; j++) {
          if (selectedMetals[j] !== null) {
            hasSelections = true;
            break;
          }
        }
        if (hasSelections) break;
      }
    }
    
    if (!hasSelections) {
      toast.error("Please select at least one chemical and one metal");
      return;
    }
    
    // Generate affinity values for all selected pairs
    const newAffinityMatrix = [...affinityMatrix];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (selectedChemicals[i] !== null && selectedMetals[j] !== null) {
          newAffinityMatrix[i][j] = getAffinityValue(selectedChemicals[i]!, selectedMetals[j]!);
        }
      }
    }
    
    setAffinityMatrix(newAffinityMatrix);
    toast.success("Matrix generated successfully!");
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  const getChemicalName = (id: number | null) => {
    if (id === null) return "";
    const chemical = chemicalsData.find(c => c.id === id);
    return chemical ? chemical.name : "";
  };
  
  const getMetalName = (id: number | null) => {
    if (id === null) return "";
    const metal = metalsData.find(m => m.id === id);
    return metal ? metal.name : "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-evonik-700">Create Chemical-Metal Affinity Matrix</h1>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-evonik-300 text-evonik-700 rounded-md hover:bg-evonik-400 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <p className="text-evonik-600 mb-4">
            Select chemicals from rows and metals from columns to generate affinity values at their intersections.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 bg-evonik-200 font-bold text-evonik-700"></th>
                  {Array.from({ length: 20 }, (_, i) => (
                    <th key={`col-${i}`} className="p-2 bg-evonik-200 font-bold text-evonik-700 min-w-[150px]">
                      <div className="text-center mb-2">Metal {i+1}</div>
                      <select
                        value={selectedMetals[i] || ""}
                        onChange={(e) => handleMetalChange(i, e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-1 text-xs border border-evonik-300 rounded bg-white"
                      >
                        <option value="">Select Metal</option>
                        {metalsData.map((metal) => (
                          <option key={`metal-${metal.id}`} value={metal.id}>
                            {metal.name}
                          </option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 20 }, (_, i) => (
                  <tr key={`row-${i}`}>
                    <td className="p-2 bg-evonik-200 font-bold text-evonik-700 min-w-[150px]">
                      <div className="text-center mb-2">Chemical {i+1}</div>
                      <select
                        value={selectedChemicals[i] || ""}
                        onChange={(e) => handleChemicalChange(i, e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-1 text-xs border border-evonik-300 rounded bg-white"
                      >
                        <option value="">Select Chemical</option>
                        {chemicalsData.map((chemical) => (
                          <option key={`chem-${chemical.id}`} value={chemical.id}>
                            {chemical.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    
                    {Array.from({ length: 20 }, (_, j) => (
                      <td 
                        key={`cell-${i}-${j}`} 
                        className="p-2 border border-evonik-200 bg-evonik-100 text-center"
                      >
                        {selectedChemicals[i] !== null && selectedMetals[j] !== null ? (
                          <div>
                            {affinityMatrix[i][j] !== null ? (
                              <div className="p-1 bg-evonik-500 text-white text-center rounded font-bold">
                                {affinityMatrix[i][j]}
                              </div>
                            ) : (
                              <div className="p-1 text-gray-400">-</div>
                            )}
                            <div className="mt-1 text-xs">
                              <div className="font-semibold">{getChemicalName(selectedChemicals[i])}</div>
                              <div className="font-semibold">{getMetalName(selectedMetals[j])}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-1 text-gray-400">-</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={generateMatrix}
              className="px-6 py-3 bg-evonik-600 text-white font-semibold rounded-lg hover:bg-evonik-700 transition-colors"
            >
              Generate Affinity Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMatrix;
