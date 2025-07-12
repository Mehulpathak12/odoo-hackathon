// SignupForm.js
import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export  function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Send to backend or perform further actions
  };

  const password = watch("password");

  return (
    <Box maxW="400px" mx="auto" mt={10} p={5} shadow="md" borderRadius="md">
      <Heading mb={6} size="lg" textAlign="center">
        Signup
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <FormControl isInvalid={errors.name} mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Your name"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        {/* Email */}
        <FormControl isInvalid={errors.email} mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        {/* Password */}
        <FormControl isInvalid={errors.password} mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        {/* Confirm Password */}
        <FormControl isInvalid={errors.confirmPassword} mb={6}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

        <Button width="100%" type="submit" colorScheme="teal">
          Register
        </Button>
      </form>
    </Box>
  );
}
