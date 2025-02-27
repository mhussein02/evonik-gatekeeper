
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Edit2, Trash2, Plus, Save } from "lucide-react";

// Mock initial data
const initialChemicals = [
  { id: 1, name: "Hydrogen Peroxide", formula: "H2O2" },
  { id: 2, name: "Sulfuric Acid", formula: "H2SO4" },
  { id: 3, name: "Nitric Acid", formula: "HNO3" },
  { id: 4, name: "Sodium Hydroxide", formula: "NaOH" },
  { id: 5, name: "Hydrochloric Acid", formula: "HCl" },
];

const initialMetals = [
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
  const [metals, setMetals] = useState(initialMetals);
  const [activeTab, setActiveTab] = useState("chemicals");
  
  // Edit states
  const [editingChemicalId, setEditingChemicalId] = useState<number | null>(null);
  const [editingMetalId, setEditingMetalId] = useState<number | null>(null);
  const [newChemical, setNewChemical] = useState({ name: "", formula: "" });
  const [newMetal, setNewMetal] = useState({ name: "", symbol: "" });
  const [editedChemical, setEditedChemical] = useState({ name: "", formula: "" });
  const [editedMetal, setEditedMetal] = useState({ name: "", symbol: "" });
  const [showAddChemical, setShowAddChemical] = useState(false);
  const [showAddMetal, setShowAddMetal] = useState(false);

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

  // Metal management
  const handleEditMetal = (metal: typeof metals[0]) => {
    setEditingMetalId(metal.id);
    setEditedMetal({ name: metal.name, symbol: metal.symbol });
  };

  const handleSaveMetalEdit = (id: number) => {
    if (!editedMetal.name || !editedMetal.symbol) {
      toast.error("Name and symbol are required");
      return;
    }
    
    const updatedMetals = metals.map(metal => 
      metal.id === id ? { ...metal, ...editedMetal } : metal
    );
    setMetals(updatedMetals);
    setEditingMetalId(null);
    toast.success("Metal updated successfully");
  };

  const handleDeleteMetal = (id: number) => {
    if (window.confirm("Are you sure you want to delete this metal?")) {
      setMetals(metals.filter(metal => metal.id !== id));
      toast.success("Metal deleted successfully");
    }
  };

  const handleAddMetal = () => {
    if (!newMetal.name || !newMetal.symbol) {
      toast.error("Name and symbol are required");
      return;
    }
    
    const newId = Math.max(...metals.map(m => m.id), 0) + 1;
    setMetals([...metals, { id: newId, ...newMetal }]);
    setNewMetal({ name: "", symbol: "" });
    setShowAddMetal(false);
    toast.success("Metal added successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-evonik-700">Edit Chemical-Metal Affinity Master Data</h1>
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
              Welcome, <span className="font-bold">{user?.name}</span>. As an admin, you can edit the chemical and metal master data.
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
                activeTab === "metals" 
                  ? "border-b-2 border-evonik-600 text-evonik-700" 
                  : "text-evonik-400 hover:text-evonik-600"
              }`}
              onClick={() => setActiveTab("metals")}
            >
              Metals
            </button>
          </div>

          {/* Chemicals Tab */}
          {activeTab === "chemicals" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-evonik-600">Chemical List</h2>
                <button
                  onClick={() => setShowAddChemical(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-evonik-600 text-white rounded-md hover:bg-evonik-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Chemical
                </button>
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

          {/* Metals Tab */}
          {activeTab === "metals" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-evonik-600">Metal List</h2>
                <button
                  onClick={() => setShowAddMetal(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-evonik-600 text-white rounded-md hover:bg-evonik-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Metal
                </button>
              </div>

              {showAddMetal && (
                <div className="mb-6 p-4 bg-evonik-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Add New Metal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Metal Name"
                      value={newMetal.name}
                      onChange={(e) => setNewMetal({ ...newMetal, name: e.target.value })}
                      className="p-2 border border-evonik-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Metal Symbol"
                      value={newMetal.symbol}
                      onChange={(e) => setNewMetal({ ...newMetal, symbol: e.target.value })}
                      className="p-2 border border-evonik-300 rounded"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddMetal}
                      className="px-4 py-2 bg-evonik-600 text-white rounded hover:bg-evonik-700"
                    >
                      Add Metal
                    </button>
                    <button
                      onClick={() => setShowAddMetal(false)}
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
                    {metals.map(metal => (
                      <tr key={metal.id} className="border-b border-evonik-200 hover:bg-evonik-100">
                        <td className="px-4 py-3">{metal.id}</td>
                        <td className="px-4 py-3">
                          {editingMetalId === metal.id ? (
                            <input
                              type="text"
                              value={editedMetal.name}
                              onChange={(e) => setEditedMetal({ ...editedMetal, name: e.target.value })}
                              className="p-1 border border-evonik-300 rounded w-full"
                            />
                          ) : (
                            metal.name
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingMetalId === metal.id ? (
                            <input
                              type="text"
                              value={editedMetal.symbol}
                              onChange={(e) => setEditedMetal({ ...editedMetal, symbol: e.target.value })}
                              className="p-1 border border-evonik-300 rounded w-full"
                            />
                          ) : (
                            metal.symbol
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            {editingMetalId === metal.id ? (
                              <button
                                onClick={() => handleSaveMetalEdit(metal.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <Save size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditMetal(metal)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMetal(metal.id)}
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
