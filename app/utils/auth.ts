"use client";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

// auth.js

// import {
//   fetchAuthSession,
//   fetchUserAttributes,
//   getCurrentUser,
// } from "aws-amplify/auth";

export const getIdToken = () => localStorage.getItem("idToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export const setTokens = (
  accessToken?: string,
  idToken?: string,
  refreshToken?: string
) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (idToken) {
    localStorage.setItem("idToken", idToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
};

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const getUserRole = async () => {
  // try {
  //   const session = await fetchAuthSession();
  // } catch (error) {
  //   console.error("Error fetching user role:", error);
  //   return null;
  // }
};

export const requireAuth = async (requiredRole?: "ADMIN" | "USER") => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  if (requiredRole && session.user?.role !== requiredRole) {
    return { error: "Forbidden", status: 403 };
  }

  return { session };
};
