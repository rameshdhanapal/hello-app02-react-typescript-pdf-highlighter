import * as React from 'react';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const file1button = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Some CSS
          fontSize: '1rem',
          left: '300px',
          top : '2px',  
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          left: '300px',         
        }
      }      
    },
  }
})

const Input = styled('input')({
  display: 'none',
});

interface TestProps {  
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function UploadButtons(props: TestProps) {
   
  return (
    <div>
     <ThemeProvider theme={file1button}>
      <Stack direction="row" alignItems="center" spacing={2}>
      <label htmlFor="contained-button-file1">
        <Input accept="pdf/*" id="contained-button-file1" multiple type="file"
        onChange={(e) => {         
          props.handleChange(e) 
        }}/>
        
          <Button variant="contained" component="span">
          File1 Upload
          </Button>
       
       
      </label>
      <label htmlFor="icon-button-file1">
        <Input accept="pdf/*" id="icon-button-file1" type="file" />
        <IconButton color="primary" aria-label="upload picture" component="span">
          <CloudUploadIcon />
        </IconButton>
      </label>
    </Stack>
    </ThemeProvider>
    </div>  
  );
}