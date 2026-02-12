"use server";

import { getCategories } from "@/app/actions/categories.action";
import { NavClient } from "./NavClient";

export const NavServer = async () => {
  const categories = await getCategories();
  return <NavClient categories={categories} />;
};
