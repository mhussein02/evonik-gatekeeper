
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus } from "lucide-react";

// Mock data for initial users
const initialUsers = [
  { id: 1, name: "John Doe", email: "john.doe@evonik.com", role: "matrix_admin" },
  { id: 2, name: "Jane Smith", email: "jane.smith@evonik.com", role: "data_admin" },
  { id: 3, name: "Bob Wilson", email: "bob.wilson@evonik.com", role: "role_admin" },
  { id: 4, name: "Alice Brown", email: "alice.brown@evonik.com", role: "matrix_admin" },
  { id: 5, name: "Charlie Davis", email: "charlie.davis@evonik.com", role: "data_admin" },
];

// Available roles
const roles = ["matrix_admin", "data_admin", "role_admin"];

const MaintainAuthorizations = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  const handleEdit = (userId: number) => {
    setEditingUser(userId);
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    setEditingUser(null);
    toast.success("User role updated successfully");
  };

  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      toast.success("User deleted successfully");
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error("Please fill in all fields");
      return;
    }

    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers([...users, { ...newUser, id: newId }]);
    setNewUser({ name: "", email: "", role: "" });
    setShowAddForm(false);
    toast.success("New user added successfully");
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-evonik-700">Maintain Authorizations</h1>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-evonik-300 text-evonik-700 rounded-md hover:bg-evonik-400 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-evonik-600">User Management</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-evonik-600 text-white rounded-md hover:bg-evonik-700 transition-colors"
            >
              <Plus size={18} />
              Add New User
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 p-4 bg-evonik-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="p-2 border border-evonik-300 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="p-2 border border-evonik-300 rounded"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="p-2 border border-evonik-300 rounded"
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-evonik-600 text-white rounded hover:bg-evonik-700"
                >
                  Add User
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
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
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-evonik-200 hover:bg-evonik-100">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {editingUser === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="p-1 border border-evonik-300 rounded"
                        >
                          {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
      </div>
    </div>
  );
};

export default MaintainAuthorizations;
