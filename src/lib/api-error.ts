import axios from "axios";

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {

    const message = error.response?.data?.data?.message;
    console.log("API Error Message:", message);

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (message) {
      return message;
    }

    return (
      "Something went wrong. Please try again later."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};
