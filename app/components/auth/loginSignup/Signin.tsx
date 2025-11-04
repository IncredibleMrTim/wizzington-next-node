"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { STORE_KEYS, useAppDispatch } from "@/stores/store";
import { parseJwt, setTokens } from "@/utils/auth";
import { Button } from "@/components/ui/button";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_SIGNIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign-in failed");
      }

      // Store tokens in localStorage or secure storage
      setTokens(
        data.authResult.accessToken,
        data.authResult.idToken,
        data.authResult.refreshToken
      );

      const payload = parseJwt(data.authResult.idToken);

      dispatch({
        type: STORE_KEYS.SET_CURRENT_USER,
        payload: {
          given_name: payload.given_name,
          family_name: payload.family_name,
          email: payload.email,
          isAdmin: payload["cognito:groups"]?.includes("admin") || false,
        },
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-group">
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>

        <Button type="submit" className="w-full">
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};
