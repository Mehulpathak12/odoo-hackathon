import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.agree) {
      setError("You must agree to the terms and privacy policy.");
      return;
    }

    setLoading(true);
    try {
      await signUpUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-blue-100 to-cyan-100 px-4">
      <Card className="w-full mt-0 max-w-md backdrop-blur-md bg-white/80 shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader
            floated={false}
            shadow={false}
            className="flex items-center justify-center p-6"
          >
            <div className="text-center">
              <Typography variant="h4" color="blue-gray">
                Create Your Account
              </Typography>
              <Typography color="gray" className="mt-1 text-sm">
                Join SkillSwap today — Lets Swap!
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="flex flex-col gap-5 px-6">
            <Input label="Full Name" size="lg" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" size="lg" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input placeholder="Ajmer, Rajasthan" label="Location" size="lg" name="location" value={formData.phone} onChange={handleChange} required />
            <Input label="Password" size="lg" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <div className="-ml-2.5">
              <Checkbox
                name="agree"
                label="I agree to the Terms & Privacy"
                checked={formData.agree}
                onChange={handleChange}
              />
            </div>
            {error && <Typography color="red" className="text-sm">{error}</Typography>}
          </CardBody>

          <CardFooter className="px-6 pb-6 pt-0">
            <Button
              fullWidth
              className="bg-blue-600 text-white text-base"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <Typography
              variant="small"
              className="mt-4 text-center text-blue-gray-600"
            >
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-600 font-bold hover:underline">
                Login
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
