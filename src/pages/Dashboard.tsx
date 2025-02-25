
import { useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Handle tile click
  const handleTileClick = (optionName: string) => {
    setSelectedOption(optionName);
    toast.info(`Selected: ${optionName}`);
    // In a real app, we would navigate to the respective page
    console.log(`Navigate to ${optionName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 p-8">
      <h1 className="text-4xl font-bold text-evonik-700 mb-8 animate-fadeIn">
        Evonik Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Create Matrix */}
        <div 
          onClick={() => handleTileClick("Create Matrix")}
          className="bg-evonik-600 text-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer animate-fadeIn hover:scale-105 transform" 
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-col h-52 justify-between">
            <h2 className="text-2xl font-semibold mb-4">Create Matrix</h2>
            <p className="text-evonik-100 text-sm">
              Build new chemical-metal affinity matrices for various applications 
              and specifications.
            </p>
            <div className="text-right mt-4">
              <span className="text-evonik-100 text-sm">Click to open →</span>
            </div>
          </div>
        </div>

        {/* View Matrix */}
        <div 
          onClick={() => handleTileClick("View User Created Matrix")}
          className="bg-evonik-500 text-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer animate-fadeIn hover:scale-105 transform" 
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-col h-52 justify-between">
            <h2 className="text-2xl font-semibold mb-4">View User Created Matrix</h2>
            <p className="text-evonik-100 text-sm">
              Access and analyze previously created matrices and their 
              performance data.
            </p>
            <div className="text-right mt-4">
              <span className="text-evonik-100 text-sm">Click to open →</span>
            </div>
          </div>
        </div>

        {/* Edit Master Data */}
        <div 
          onClick={() => handleTileClick("Edit Chemical-Metal Affinity Master Data")}
          className="bg-evonik-400 text-evonik-700 p-8 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer animate-fadeIn hover:scale-105 transform" 
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-col h-52 justify-between">
            <h2 className="text-2xl font-semibold mb-4">Edit Chemical-Metal Affinity Master Data</h2>
            <p className="text-evonik-600 text-sm">
              Modify the underlying data relationships between chemical compounds 
              and metallic elements.
            </p>
            <div className="text-right mt-4">
              <span className="text-evonik-600 text-sm">Click to open →</span>
            </div>
          </div>
        </div>

        {/* Maintain Authorizations */}
        <div 
          onClick={() => handleTileClick("Maintain Authorizations")}
          className="bg-evonik-300 text-evonik-700 p-8 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer animate-fadeIn hover:scale-105 transform" 
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex flex-col h-52 justify-between">
            <h2 className="text-2xl font-semibold mb-4">Maintain Authorizations</h2>
            <p className="text-evonik-600 text-sm">
              Manage user roles, permissions, and access controls for the 
              matrix management system.
            </p>
            <div className="text-right mt-4">
              <span className="text-evonik-600 text-sm">Click to open →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
