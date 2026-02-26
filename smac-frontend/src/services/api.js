import axios from "axios";

const BASE_URL = "http://localhost:8081/api/alloy";

export const calculateAlloy = async (elements) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/calculate`,
      elements
    );
    return response.data;
  } catch (error) {
    console.error("Error calculating alloy:", error);
    throw error;
  }
};