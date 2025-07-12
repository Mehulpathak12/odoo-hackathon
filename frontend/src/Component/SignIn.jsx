import {
  Card, CardBody, CardHeader, CardFooter,
  Input, Checkbox, Button, Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; 

export function SignIn() {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { success, message } = await login(formData);
    setLoading(false);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError(message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-blue-100 to-cyan-100 px-4">
      <Card className="w-full max-w-md backdrop-blur-md bg-white/80 shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader floated={false} shadow={false} className="text-center p-6">
            <Typography variant="h4" color="blue-gray">Welcome Back</Typography>
            <Typography color="gray" className="mt-1 text-sm">Sign in to continue your skill swapping journey</Typography>
          </CardHeader>

          <CardBody className="flex flex-col gap-5 px-6">
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <div className="-ml-2.5">
              <Checkbox label="Remember Me" />
            </div>
            {error && <Typography color="red" className="text-sm">{error}</Typography>}
          </CardBody>

          <CardFooter className="px-6 pb-6 pt-0">
            <Button fullWidth className="bg-blue-600 text-white text-base" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </Button>
            <Typography variant="small" className="mt-4 text-center text-blue-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
