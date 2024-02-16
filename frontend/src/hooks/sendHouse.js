import { apiUrl } from "../development";

const endpointUrl = apiUrl + '/api'

const sendHouse = async (zone, csv) => {
  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ zone, csv})
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

export default sendHouse;