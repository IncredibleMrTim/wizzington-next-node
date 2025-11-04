"use server";
import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import outputs from "amplify_outputs.json";
import { jwtDecode } from "jwt-decode";

const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export async function AuthGetCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) =>
        jwtDecode(
          (await cookies()).getAll().find((c) => c.name.includes("idToken"))
            ?.value || ""
        ),
    });

    return currentUser;
  } catch (error) {
    console.error(error);
  }
}
