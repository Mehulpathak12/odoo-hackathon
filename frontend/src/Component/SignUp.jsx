// SignupForm.js
import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  useColorModeValue
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Submitted:", data);
  };

  const password = watch("password");

  // Optional: set color scheme manually or based on theme
  const bgColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("white", "gray.700");

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      bg={bgColor}
    >
      <Heading mb={6} fontSize="2xl" textAlign="center">
        Create Account
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <FormControl isInvalid={errors.name} mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            bg={inputBg}
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        {/* Email */}
        <FormControl isInvalid={errors.email} mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            bg={inputBg}
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        {/* Password */}
        <FormControl isInvalid={errors.password} mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            bg={inputBg}
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        {/* Confirm Password */}
        <FormControl isInvalid={errors.confirmPassword} mb={6}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            bg={inputBg}
            type="password"
            placeholder="Re-enter password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="whiteAlpha" type="submit" width="100%">
          Register
        </Button>
      </form>
    </Box>
  );
}
