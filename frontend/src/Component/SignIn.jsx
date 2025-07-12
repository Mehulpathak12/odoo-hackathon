import {
  Card, CardBody, CardHeader, CardFooter,
  Input, Checkbox, Button, Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";  // adjust path

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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ...">
      <Card className="w-full max-w-md bg-white/80 shadow-2xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>…</CardHeader>
          <CardBody>
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <Checkbox label="Remember Me" />
            {error && <Typography color="red">{error}</Typography>}
          </CardBody>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </Button>
            <Typography>
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
