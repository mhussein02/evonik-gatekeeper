
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Edit2, Trash2, Plus, Save } from "lucide-react";
import CSVUploader from "../components/CSVUploader";

// Mock initial data
const initialChemicals = [
  { id: 1, name: "Hydrogen Peroxide", formula: "H2O2" },
  { id: 2, name: "Sulfuric Acid", formula: "H2SO4" },
  { id: 3, name: "Nitric Acid", formula: "HNO3" },
  { id: 4, name: "Sodium Hydroxide", formula: "NaOH" },
  { id: 5, name: "Hydrochloric Acid", formula: "HCl" },
];

const initialMaterials = [
  { id: 1, name: "Aluminum", symbol: "Al" },
  { id: 2, name: "Copper", symbol: "Cu" },
  { id: 3, name: "Iron", symbol: "Fe" },
  { id: 4, name: "Lead", symbol: "Pb" },
  { id: 5, name: "Zinc", symbol: "Zn" },
];

const EditMasterData = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chemicals, setChemicals] = useState(initialChemicals);
  const [materials, setMaterials] = useState(initialMaterials);
  const [activeTab, setActiveTab] = useState("chemicals");
  
  // Edit states
  const [editingChemicalId, setEditingChemicalId] = useState<number | null>(null);
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
  const [newChemical, setNewChemical] = useState({ name: "", formula: "" });
  const [newMaterial, setNewMaterial] = useState({ name: "", symbol: "" });
  const [editedChemical, setEditedChemical] = useState({ name: "", formula: "" });
  const [editedMaterial, setEditedMaterial] = useState({ name: "", symbol: "" });
  const [showAddChemical, setShowAddChemical] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);

  const goBack = () => {
    navigate("/dashboard");
  };

  // Chemical management
  const handleEditChemical = (chemical: typeof chemicals[0]) => {
    setEditingChemicalId(chemical.id);
    setEditedChemical({ name: chemical.name, formula: chemical.formula });
  };

  const handleSaveChemicalEdit = (id: number) => {
    if (!editedChemical.name || !editedChemical.formula) {
      toast.error("Name and formula are required");
      return;
    }
    
    const updatedChemicals = chemicals.map(chemical => 
      chemical.id === id ? { ...chemical, ...editedChemical } : chemical
    );
    setChemicals(updatedChemicals);
    setEditingChemicalId(null);
    toast.success("Chemical updated successfully");
  };

  const handleDeleteChemical = (id: number) => {
    if (window.confirm("Are you sure you want to delete this chemical?")) {
      setChemicals(chemicals.filter(chemical => chemical.id !== id));
      toast.success("Chemical deleted successfully");
    }
  };

  const handleAddChemical = () => {
    if (!newChemical.name || !newChemical.formula) {
      toast.error("Name and formula are required");
      return;
    }
    
    const newId = Math.max(...chemicals.map(c => c.id), 0) + 1;
    setChemicals([...chemicals, { id: newId, ...newChemical }]);
    setNewChemical({ name: "", formula: "" });
    setShowAddChemical(false);
    toast.success("Chemical added successfully");
  };

  // Material management
  const handleEditMaterial = (material: typeof materials[0]) => {
    setEditingMaterialId(material.id);
    setEditedMaterial({ name: material.name, symbol: material.symbol });
  };

  const handleSaveMaterialEdit = (id: number) => {
    if (!editedMaterial.name || !editedMaterial.symbol) {
      toast.error("Name and symbol are required");
      return;
    }
    
    const updatedMaterials = materials.map(material => 
      material.id === id ? { ...material, ...editedMaterial } : material
    );
    setMaterials(updatedMaterials);
    setEditingMaterialId(null);
    toast.success("Material updated successfully");
  };

  const handleDeleteMaterial = (id: number) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      setMaterials(materials.filter(material => material.id !== id));
      toast.success("Material deleted successfully");
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.symbol) {
      toast.error("Name and symbol are required");
      return;
    }
    
    const newId = Math.max(...materials.map(m => m.id), 0) + 1;
    setMaterials([...materials, { id: newId, ...newMaterial }]);
    setNewMaterial({ name: "", symbol: "" });
    setShowAddMaterial(false);
    toast.success("Material added successfully");
  };

  // CSV Import handlers
  const handleChemicalsImport = (importedChemicals: any[]) => {
    // Generate new IDs to avoid conflicts
    const highestId = Math.max(...chemicals.map(c => c.id), 0);
    const newChemicals = importedChemicals.map((chemical, index) => ({
      ...chemical,
      id: highestId + index + 1
    }));
    
    setChemicals([...chemicals, ...newChemicals]);
  };

  const handleMaterialsImport = (importedMaterials: any[]) => {
    // Generate new IDs to avoid conflicts
    const highestId = Math.max(...materials.map(m => m.id), 0);
    const newMaterials = importedMaterials.map((material, index) => ({
      ...material,
      id: highestId + index + 1
    }));
    
    setMaterials([...materials, ...newMaterials]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-evonik-700">Edit Chemical-Material Affinity Master Data</h1>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-evonik-300 text-evonik-700 rounded-md hover:bg-evonik-400 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <p className="text-evonik-600">
              Welcome, <span className="font-bold">{user?.name}</span>. As an admin, you can edit the chemical and material master data.
            </p>
          </div>

          <div className="flex border-b border-evonik-300 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "chemicals" 
                  ? "border-b-2 border-evonik-600 text-evonik-700" 
                  : "text-evonik-400 hover:text-evonik-600"
              }`}
              onClick={() => setActiveTab("chemicals")}
            >
              Chemicals
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "materials" 
                  ? "border-b-2 border-evonik-600 text-evonik-700" 
                  : "text-evonik-400 hover:text-evonik-600"
              }`}
              onClick={() => setActiveTab("materials")}
            >
              Materials
            </button>
          </div>

          {/* Chemicals Tab */}
          {activeTab === "chemicals" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold text-evonik-600">Chemical List</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <CSVUploader type="chemical" onDataImported={handleChemicalsImport} />
                  <button
                    onClick={() => setShowAddChemical(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-evonik-600 text-white rounded-md hover:bg-evonik-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Chemical
                  </button>
                </div>
              </div>

              {showAddChemical && (
                <div className="mb-6 p-4 bg-evonik-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Add New Chemical</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Chemical Name"
                      value={newChemical.name}
                      onChange={(e) => setNewChemical({ ...newChemical, name: e.target.value })}
                      className="p-2 border border-evonik-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Chemical Formula"
                      value={newChemical.formula}
                      onChange={(e) => setNewChemical({ ...newChemical, formula: e.target.value })}
                      className="p-2 border border-evonik-300 rounded"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddChemical}
                      className="px-4 py-2 bg-evonik-600 text-white rounded hover:bg-evonik-700"
                    >
                      Add Chemical
                    </button>
                    <button
                      onClick={() => setShowAddChemical(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-evonik-200">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Formula</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chemicals.map(chemical => (
                      <tr key={chemical.id} className="border-b border-evonik-200 hover:bg-evonik-100">
                        <td className="px-4 py-3">{chemical.id}</td>
                        <td className="px-4 py-3">
                          {editingChemicalId === chemical.id ? (
                            <input
                              type="text"
                              value={editedChemical.name}
                              onChange={(e) => setEditedChemical({ ...editedChemical, name: e.target.value })}
                              className="p-1 border border-evonik-300 rounded w-full"
                            />
                          ) : (
                            chemical.name
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingChemicalId === chemical.id ? (
                            <input
                              type="text"
                              value={editedChemical.formula}
                              onChange={(e) => setEditedChemical({ ...editedChemical, formula: e.target.value })}
                              className="p-1 border border-evonik-300 rounded w-full"
                            />
                          ) : (
                            chemical.formula
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            {editingChemicalId === chemical.id ? (
                              <button
                                onClick={() => handleSaveChemicalEdit(chemical.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <Save size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditChemical(chemical)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteChemical(chemical.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold text-evonik-600">Material List</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <CSVUploader type="material" onDataImported={handleMaterialsImport} />
                  <button
                    onClick={() => setShowAddMaterial(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-evonik-600 text-white rounded-md hover:bg-evonik-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Material
                  </button>
                </div>
              </div>

              {showAddMaterial && (
                <div className="mb-6 p-4 bg-evonik-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Add New Material</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Material Name"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      className="p-2 border border-evonik-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Material Symbol"
                      value={newMaterial.symbol}
                      onChange={(e) => setNewMaterial({ ...newMaterial, symbol: e.target.value })}
                      className="p-2 border border-evonik-300 rounded"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddMaterial}
                      className="px-4 py-2 bg-evonik-600 text-white rounded hover:bg-evonik-700"
                    >
                      Add Material
                    </button>
                    <button
                      onClick={() => setShowAddMaterial(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-evonik-200">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Symbol</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map(material => (
                      <tr key={material.id} className="border-b border-evonik-200 hover:bg-evonik-100">
                        <td className="px-4 py-3">{material.id}</td>
                        <td className="px-4 py-3">
                          {editingMaterialId === material.id ? (
                            <input
                              type="text"
                              value={editedMaterial.name}
                              onChange={(e) => setEditedMaterial({ ...editedMaterial, name: e.target.value })}
                              className="p-1 border border-evonik-300 rounded w-full"
                            />
                          ) : (
                            material.name
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingMaterialId === material.id ? (
                            <input
                              type="text"
                              value={editedMaterial.symbol}
                              onChange={(e) => setEditedMaterial({ ...editedMaterial, symbol: e.target.value })}
                              className="p-1 border border-evonik-300 rounded w-full"
                            />
                          ) : (
                            material.symbol
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            {editingMaterialId === material.id ? (
                              <button
                                onClick={() => handleSaveMaterialEdit(material.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <Save size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditMaterial(material)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMaterial(material.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMasterData;
