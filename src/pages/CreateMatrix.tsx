
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

type CellSelection = {
  chemicalId: number | null;
  metalId: number | null;
};

const CreateMatrix = () => {
  const navigate = useNavigate();
  const [matrix, setMatrix] = useState<Array<Array<CellSelection>>>(() => {
    const initialMatrix = [];
    for (let i = 0; i < 20; i++) {
      const row = [];
      for (let j = 0; j < 20; j++) {
        row.push({ chemicalId: null, metalId: null });
      }
      initialMatrix.push(row);
    }
    return initialMatrix;
  });

  const [affinityMatrix, setAffinityMatrix] = useState<Array<Array<number | null>>>(
    Array(20).fill(Array(20).fill(null))
  );

  const handleCellChemicalChange = (rowIndex: number, colIndex: number, chemicalId: number) => {
    const newMatrix = [...matrix];
    newMatrix[rowIndex][colIndex] = {
      ...newMatrix[rowIndex][colIndex],
      chemicalId: chemicalId,
    };
    setMatrix(newMatrix);
  };

  const handleCellMetalChange = (rowIndex: number, colIndex: number, metalId: number) => {
    const newMatrix = [...matrix];
    newMatrix[rowIndex][colIndex] = {
      ...newMatrix[rowIndex][colIndex],
      metalId: metalId,
    };
    setMatrix(newMatrix);
  };

  const generateMatrix = () => {
    // Check if all cells have selections
    let isComplete = true;
    const filledCells: { row: number; col: number }[] = [];

    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.chemicalId && cell.metalId) {
          filledCells.push({ row: rowIndex, col: colIndex });
        } else if (cell.chemicalId !== null || cell.metalId !== null) {
          // If one selection is made but not both
          isComplete = false;
        }
      });
    });

    if (!isComplete && filledCells.length > 0) {
      toast.warning("Some cells have incomplete selections (chemical or metal missing)");
      return;
    }

    if (filledCells.length === 0) {
      toast.error("Please select at least one chemical-metal pair");
      return;
    }

    // Generate affinity values for selected pairs
    const newAffinityMatrix = Array(20)
      .fill(null)
      .map(() => Array(20).fill(null));

    filledCells.forEach(({ row, col }) => {
      const cell = matrix[row][col];
      if (cell.chemicalId !== null && cell.metalId !== null) {
        newAffinityMatrix[row][col] = getAffinityValue(cell.chemicalId, cell.metalId);
      }
    });

    setAffinityMatrix(newAffinityMatrix);
    toast.success("Matrix generated successfully!");
  };

  const goBack = () => {
    navigate("/dashboard");
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
            Select chemical and metal pairs to generate affinity values. You can select up to 20x20 combinations.
          </p>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-[auto_repeat(20,minmax(150px,1fr))] gap-1 mb-4">
              {/* Top left empty cell */}
              <div className="p-2 bg-evonik-200 font-bold text-evonik-700 min-w-[120px]"></div>

              {/* Column headers (1-20) */}
              {Array.from({ length: 20 }, (_, i) => (
                <div key={`col-${i}`} className="p-2 bg-evonik-200 font-bold text-evonik-700 text-center">
                  Column {i + 1}
                </div>
              ))}

              {/* Matrix cells with dropdowns */}
              {Array.from({ length: 20 }, (_, rowIndex) => (
                <>
                  {/* Row header */}
                  <div key={`row-${rowIndex}`} className="p-2 bg-evonik-200 font-bold text-evonik-700 flex items-center">
                    Row {rowIndex + 1}
                  </div>

                  {/* Row cells */}
                  {Array.from({ length: 20 }, (_, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="p-2 border border-evonik-200 bg-evonik-100"
                    >
                      <div className="flex flex-col space-y-2">
                        <select
                          value={matrix[rowIndex][colIndex].chemicalId || ""}
                          onChange={(e) => handleCellChemicalChange(rowIndex, colIndex, Number(e.target.value))}
                          className="w-full p-1 text-xs border border-evonik-300 rounded bg-white"
                        >
                          <option value="">Select Chemical</option>
                          {chemicalsData.map((chemical) => (
                            <option key={`chem-${chemical.id}`} value={chemical.id}>
                              {chemical.name}
                            </option>
                          ))}
                        </select>

                        <select
                          value={matrix[rowIndex][colIndex].metalId || ""}
                          onChange={(e) => handleCellMetalChange(rowIndex, colIndex, Number(e.target.value))}
                          className="w-full p-1 text-xs border border-evonik-300 rounded bg-white"
                        >
                          <option value="">Select Metal</option>
                          {metalsData.map((metal) => (
                            <option key={`metal-${metal.id}`} value={metal.id}>
                              {metal.name}
                            </option>
                          ))}
                        </select>

                        {affinityMatrix[rowIndex][colIndex] !== null && (
                          <div className="mt-2 p-1 bg-evonik-500 text-white text-center rounded font-bold">
                            Affinity: {affinityMatrix[rowIndex][colIndex]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
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
