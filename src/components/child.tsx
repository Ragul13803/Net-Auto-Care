import { useState } from 'react';
import { TextField } from '@mui/material';

const Child = ({ onColorChange }: any) => {
  const [colorInput, setColorInput] = useState(''); // state for TextField input

  // Handle the color change in the TextField
  const handleInputChange = (e: any) => {
    const newColor = e.target.value;
    setColorInput(newColor); // update the input value
    onColorChange(newColor); // call the parent's function to update the color
  };

  return (
    <div>
      {/* TextField for entering color */}
      <TextField 
        value={colorInput} 
        onChange={handleInputChange} 
        label="Enter color"
      />
    </div>
  );
};

export default Child;
