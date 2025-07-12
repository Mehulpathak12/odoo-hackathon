import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 via-blue-200 to-cyan-200 px-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl">
        <form >
          <CardHeader
            floated={false}
            shadow={false}
            className="flex items-center justify-center p-6"
          >
            <div className="text-center">
              <Typography variant="h4" color="blue-gray">
                Welcome to SkillSwap
              </Typography>
              <Typography color="gray" className="mt-1 text-sm">
                Log in to Start Swapping
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="flex flex-col gap-5 px-6">
            <Input
              label="Email"
              size="lg"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              size="lg"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="-ml-2.5">
              <Checkbox label="Remember Me" />
            </div>
            {error && <Typography color="red">{error}</Typography>}
          </CardBody>

          <CardFooter className="px-6 pb-6 pt-0">
            <Button
              fullWidth
              type="submit"
              className="bg-blue-600 text-white text-base"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </Button>
            <Typography
              variant="small"
              className="mt-4 text-center text-blue-gray-600"
            >
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-bold hover:underline"
              >
                Sign Up
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
