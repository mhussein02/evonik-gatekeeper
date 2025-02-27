
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

// Mock user data
const users = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john.doe@evonik.com", 
    password: "password", 
    role: "matrix_admin" 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane.smith@evonik.com", 
    password: "password123", 
    role: "data_admin" 
  }
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Use the login function from AuthContext
        login({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
        
        toast.success(`Welcome back, ${user.name}!`);
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-evonik-100 to-evonik-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-evonik-700">Evonik Matrix Manager</h1>
          <p className="text-evonik-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-evonik-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-evonik-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evonik-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-evonik-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-evonik-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evonik-500"
              placeholder="Enter your password"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Demo credentials:</p>
            <p>Email: john.doe@evonik.com</p>
            <p>Password: password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
