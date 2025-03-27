
import { useState } from 'react';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { parseCSV, validateCSV } from '../utils/csvParser';

interface CSVUploaderProps {
  type: 'chemical' | 'material';
  onDataImported: (data: any[]) => void;
}

const CSVUploader = ({ type, onDataImported }: CSVUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check if it's a CSV file
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      event.target.value = ''; // Clear input
      return;
    }

    setIsUploading(true);
    
    try {
      // Validate the CSV file
      await validateCSV(file, type);
      
      // Parse the CSV file
      const parsedData = await parseCSV(file, type);
      
      if (parsedData.length === 0) {
        toast.error('No valid data found in the CSV file');
      } else {
        onDataImported(parsedData);
        toast.success(`Successfully imported ${parsedData.length} ${type}s`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error processing CSV file');
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Clear input
    }
  };

  return (
    <div>
      <label 
        htmlFor={`csv-upload-${type}`} 
        className="flex items-center gap-2 px-3 py-2 bg-evonik-200 text-evonik-700 rounded-md hover:bg-evonik-300 transition-colors cursor-pointer"
      >
        <Upload size={16} />
        <span>{isUploading ? 'Processing...' : `Import ${type === 'chemical' ? 'Chemicals' : 'Materials'} from CSV`}</span>
        <input
          id={`csv-upload-${type}`}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      <div className="mt-1 text-xs text-gray-500">
        CSV format: {type === 'chemical' ? 'Name,Formula' : 'Name,Symbol'} (header row required)
      </div>
    </div>
  );
};

export default CSVUploader;
