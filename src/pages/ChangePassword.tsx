import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }

      await api.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-evonik-700">Change Password</h1>
          <p className="text-evonik-600 mt-2">Update your account password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-evonik-700 mb-1">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-evonik-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evonik-500"
              placeholder="Enter your current password"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-evonik-700 mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-evonik-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evonik-500"
              placeholder="Enter your new password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-evonik-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-evonik-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evonik-500"
              placeholder="Confirm your new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-evonik-600 text-white rounded-md hover:bg-evonik-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword; 