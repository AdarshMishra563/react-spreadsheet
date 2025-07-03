// api.js
export const saveSpreadsheetData = async (data,key) => {
  try {
    const response = await fetch('https://reactspreadsheetnode.onrender.com/api/spreadsheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data,key }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};