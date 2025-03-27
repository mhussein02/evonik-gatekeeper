
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText, ArrowLeft } from "lucide-react";

// Mock data for demonstration - to be replaced with actual database queries
const mockAdminUsers = [
  { id: 1, name: "John Doe", email: "john.doe@evonik.com", role: "matrix_admin" },
  { id: 4, name: "Alice Brown", email: "alice.brown@evonik.com", role: "matrix_admin" },
];

const mockMatrices = {
  1: [
    { id: 1, name: "Chemical-Material Matrix A", date: "2023-06-15", chemicals: 12, materials: 8 },
    { id: 2, name: "Chemical-Material Matrix B", date: "2023-07-22", chemicals: 8, materials: 15 },
  ],
  4: [
    { id: 3, name: "Acid Resistance Matrix", date: "2023-08-05", chemicals: 5, materials: 10 },
    { id: 4, name: "Solvent Compatibility Chart", date: "2023-09-12", chemicals: 18, materials: 6 },
    { id: 5, name: "Corrosive Materials Test", date: "2023-10-10", chemicals: 7, materials: 12 },
  ],
};

const ViewUserMatrix = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [matrices, setMatrices] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get matrices when user is selected
  useEffect(() => {
    if (selectedUser) {
      const userId = parseInt(selectedUser);
      // This would be a database call in a real application
      const userMatrices = mockMatrices[userId as keyof typeof mockMatrices] || [];
      setMatrices(userMatrices);
      
      if (userMatrices.length === 0) {
        toast.info("No matrices found for this user");
      }
    } else {
      setMatrices([]);
    }
  }, [selectedUser]);

  // Filter matrices based on search query
  const filteredMatrices = matrices.filter(matrix => 
    matrix.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle viewing a specific matrix
  const handleViewMatrix = (matrixId: number) => {
    toast.info(`Viewing matrix ${matrixId}`);
    // Navigate to matrix details in a real application
    console.log(`Navigate to matrix details for matrix ${matrixId}`);
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-evonik-700">View User Created Matrix</h1>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 bg-evonik-300 text-evonik-700 rounded-md hover:bg-evonik-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <p className="text-evonik-600">
              Welcome, <span className="font-bold">{user?.name}</span>. 
              Select a matrix admin user to view their created matrices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-evonik-600 mb-2">
                Select Matrix Administrator
              </label>
              <Select onValueChange={setSelectedUser} value={selectedUser || undefined}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {mockAdminUsers.map(admin => (
                    <SelectItem key={admin.id} value={admin.id.toString()}>
                      {admin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUser && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-evonik-600 mb-2">
                  Search Matrices
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by matrix name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evonik-500"
                  />
                </div>
              </div>
            )}
          </div>

          {selectedUser && matrices.length > 0 && (
            <div className="overflow-x-auto">
              <h2 className="text-xl font-semibold text-evonik-600 mb-4">
                Matrices ({filteredMatrices.length})
              </h2>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrix Name</TableHead>
                    <TableHead>Creation Date</TableHead>
                    <TableHead>Chemicals</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatrices.map((matrix) => (
                    <TableRow key={matrix.id} className="hover:bg-evonik-50">
                      <TableCell className="font-medium">{matrix.name}</TableCell>
                      <TableCell>{matrix.date}</TableCell>
                      <TableCell>{matrix.chemicals}</TableCell>
                      <TableCell>{matrix.materials}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleViewMatrix(matrix.id)}
                          className="inline-flex items-center text-evonik-600 hover:text-evonik-800 transition-colors"
                        >
                          <FileText className="mr-1" size={16} />
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {selectedUser && matrices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-evonik-600">No matrices found for this user.</p>
            </div>
          )}
          
          {!selectedUser && (
            <div className="text-center py-12">
              <p className="text-evonik-600">Please select a matrix administrator to view their matrices.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUserMatrix;
