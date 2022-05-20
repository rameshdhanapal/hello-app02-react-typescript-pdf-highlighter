import * as React from 'react';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const file2button = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Some CSS
          fontSize: '1rem',
          left: '1110px', 
          top: '-37px'         
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          left: '1110px',
          top: '-35px'
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

export default function UploadFile2(props: TestProps) {
   
  return (
      <div>
     <ThemeProvider theme={file2button}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <label htmlFor="contained-button-file2">
        <Input accept="pdf/*" id="contained-button-file2" multiple type="file"
        onChange={props.handleChange} />
        
          <Button variant="contained" component="span">
          File2 Upload
          </Button>
      
      </label>
      <label htmlFor="icon-button-file2">
        <Input accept="image/*" id="icon-button-file2" type="file" />
        <IconButton color="primary" aria-label="upload picture" component="span">
          < CloudUploadIcon/>
        </IconButton>
      </label>
    </Stack>
    </ThemeProvider>
    </div>
  );
}