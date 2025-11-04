interface SignupUserProps {
  username: string;
  password: string;
  email: string;
  groupName: string;
  firstName: string;
  lastName: string;
}
export async function signupUser({
  username,
  password,
  firstName,
  lastName,
  email,
  groupName,
}: SignupUserProps) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        given_name: firstName,
        family_name: lastName,
        email,
        groupName,
      }),
    });

    // Get the response as text first
    const responseText = await response.text();

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      throw new Error(
        `Server returned invalid JSON: ${responseText.substring(0, 100)}...`
      );
    }

    // Check if the response indicates an error
    if (!response.ok) {
      throw new Error(
        data.message || `Error: ${response.status} ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
