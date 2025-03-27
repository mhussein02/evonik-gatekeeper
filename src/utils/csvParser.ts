
/**
 * Parses a CSV file for chemical or material data
 * @param file The CSV file to parse
 * @param type The type of data being parsed ('chemical' or 'material')
 * @returns A promise that resolves to an array of parsed data
 */
export const parseCSV = (file: File, type: 'chemical' | 'material'): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        
        // Skip the header line and filter out empty lines
        const dataLines = lines.slice(1).filter(line => line.trim() !== '');
        
        const parsedData = dataLines.map((line, index) => {
          const values = line.split(',').map(value => value.trim());
          
          if (type === 'chemical') {
            return {
              id: Date.now() + index, // Generate unique ID
              name: values[0],
              formula: values[1] || ''
            };
          } else { // material
            return {
              id: Date.now() + index, // Generate unique ID
              name: values[0],
              symbol: values[1] || ''
            };
          }
        });
        
        resolve(parsedData);
      } catch (error) {
        reject(new Error('Error parsing CSV file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validates CSV content based on the expected format
 * @param file The CSV file to validate
 * @param type The type of data being validated ('chemical' or 'material')
 * @returns A promise that resolves to a boolean indicating if the file is valid
 */
export const validateCSV = (file: File, type: 'chemical' | 'material'): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        
        if (lines.length < 2) {
          reject(new Error('CSV file must contain at least a header and one data row'));
          return;
        }
        
        // Check header based on type
        const header = lines[0].toLowerCase();
        
        if (type === 'chemical' && !header.includes('name') && !header.includes('formula')) {
          reject(new Error('CSV file must have a header row with Name and Formula columns'));
          return;
        }
        
        if (type === 'material' && !header.includes('name') && !header.includes('symbol')) {
          reject(new Error('CSV file must have a header row with Name and Symbol columns'));
          return;
        }
        
        resolve(true);
      } catch (error) {
        reject(new Error('Error validating CSV file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};
