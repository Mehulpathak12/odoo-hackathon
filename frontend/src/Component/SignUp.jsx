import {
  Card, CardBody, CardHeader, CardFooter,
  Input, Checkbox, Button, Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";  // Adjust if needed

export function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.agree) {
      setError("You must agree to the terms and privacy policy.");
      return;
    }

    setLoading(true);
    const { success, message } = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    });
    setLoading(false);

    if (success) {
      navigate("/"); // Redirect after signup
    } else {
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-blue-100 to-cyan-100 px-4">
      <Card className="w-full max-w-md backdrop-blur-md bg-white/80 shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader floated={false} shadow={false} className="text-center p-6">
            <Typography variant="h4" color="blue-gray">Create Your Account</Typography>
            <Typography color="gray" className="mt-1 text-sm">Join SkillSwap today — Let’s Swap!</Typography>
          </CardHeader>

          <CardBody className="flex flex-col gap-5 px-6">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <div className="-ml-2.5">
              <Checkbox name="agree" label="I agree to the Terms & Privacy" checked={formData.agree} onChange={handleChange} />
            </div>
            {error && <Typography color="red" className="text-sm">{error}</Typography>}
          </CardBody>

          <CardFooter className="px-6 pb-6 pt-0">
            <Button fullWidth className="bg-blue-600 text-white text-base" type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <Typography variant="small" className="mt-4 text-center text-blue-gray-600">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-600 font-bold hover:underline">Login</Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
