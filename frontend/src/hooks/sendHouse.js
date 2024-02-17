import { apiUrl } from "../development";

const endpointUrl = apiUrl + '/api/'

const sendHouse = async (zone, csv) => {
  try {
    const formData = new FormData();
    formData.append('zone', zone);
    formData.append('csv', csv);

    const response = await fetch(endpointUrl, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
      return result;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

const showPastData = async (selectedValue) => {
  const endpointUrlFinal = endpointUrl + '?selected=' + selectedValue

  try {
    const response = await fetch(endpointUrlFinal, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message)
      
      return result
    }

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

export { sendHouse, showPastData};