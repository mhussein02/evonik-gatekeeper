import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Key } from "lucide-react";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  // Handle tile click
  const handleTileClick = (optionName: string) => {
    setSelectedOption(optionName);
    toast.info(`Selected: ${optionName}`);
    
    // Navigate to the appropriate page
    if (optionName === "Create Matrix") {
      navigate("/create-matrix");
    } else if (optionName === "View User Created Matrix") {
      navigate("/view-user-matrix");
    } else if (optionName === "Maintain Authorizations") {
      if (isAdmin) {
        navigate("/maintain-authorizations");
      } else {
        toast.error("You don't have permission to access this page");
      }
    } else if (optionName === "Edit Chemical-Material Affinity Master Data") {
      if (isAdmin) {
        navigate("/edit-master-data");
      } else {
        toast.error("You don't have permission to access this page");
      }
    } else {
      // For other options, just log for now
      console.log(`Navigate to ${optionName}`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-evonik-700 animate-fadeIn">
          Evonik Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-evonik-700">
            Welcome, <span className="font-bold">{user?.name}</span>
            <div className="text-sm text-evonik-600">Role: {user?.role}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/change-password")}
              className="flex items-center gap-2 px-4 py-2 bg-evonik-400 text-evonik-700 rounded-md hover:bg-evonik-500 transition-colors"
            >
              <Key size={18} />
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-evonik-300 text-evonik-700 rounded-md hover:bg-evonik-400 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

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
              Build new chemical-material affinity matrices for various applications 
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
          onClick={() => handleTileClick("Edit Chemical-Material Affinity Master Data")}
          className={`${
            isAdmin 
              ? "bg-evonik-400 text-evonik-700" 
              : "bg-gray-300 text-gray-500"
          } p-8 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer animate-fadeIn hover:scale-105 transform`} 
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-col h-52 justify-between">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold mb-4">Edit Chemical-Material Affinity Master Data</h2>
              {!isAdmin && <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded">Admin Only</div>}
            </div>
            <p className={`${isAdmin ? "text-evonik-600" : "text-gray-500"} text-sm`}>
              Modify the underlying data relationships between chemical compounds 
              and materials.
            </p>
            <div className="text-right mt-4">
              <span className={`${isAdmin ? "text-evonik-600" : "text-gray-500"} text-sm`}>
                {isAdmin ? "Click to open →" : "Restricted Access"}
              </span>
            </div>
          </div>
        </div>

        {/* Maintain Authorizations */}
        <div 
          onClick={() => handleTileClick("Maintain Authorizations")}
          className={`${
            isAdmin 
              ? "bg-evonik-300 text-evonik-700" 
              : "bg-gray-300 text-gray-500"
          } p-8 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer animate-fadeIn hover:scale-105 transform`} 
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex flex-col h-52 justify-between">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold mb-4">Maintain Authorizations</h2>
              {!isAdmin && <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded">Admin Only</div>}
            </div>
            <p className={`${isAdmin ? "text-evonik-600" : "text-gray-500"} text-sm`}>
              Manage user roles, permissions, and access controls for the 
              matrix management system.
            </p>
            <div className="text-right mt-4">
              <span className={`${isAdmin ? "text-evonik-600" : "text-gray-500"} text-sm`}>
                {isAdmin ? "Click to open →" : "Restricted Access"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
