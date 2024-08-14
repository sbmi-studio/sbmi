import { FormEvent, useState } from "react";

const EarlyAccessBtn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      // Handle response if necessary
      const data = await response.json();
      // ...
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input type="text" name="email" />
      <button className="bg-pink-300 p-2 rounded-lg shadow-md" type="submit">
        {isLoading ? "Loading..." : "REGISTER"}
      </button>
    </form>
  );
};

export default EarlyAccessBtn;
