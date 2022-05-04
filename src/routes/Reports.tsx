import { Box, Button, createTheme, Divider, Grid, Stack, ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IHighlight } from 'react-pdf-highlighter'
import UploadButtons from '../fileupload/UploadButtons'
import UploadFile2 from '../fileupload/UploadFile2'
import Primary from '../Primary'
import Secondary from '../Secondary'
import { Sidebar } from '../Sidebar'



type RenderType = JSX.Element | Array<RenderType> | string | number | boolean | null;

const theme = createTheme({
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: '1rem',
          left: '1600px',
          top : '2px',          
        },
      },
    },
  },
});

function Reports() {
  const [primaryUrl, setPrimaryUrl] = useState<string | null> ('/1.pdf');
  const [secondUrl, setSecondUrl] = useState<string | null> ('/2.pdf');
  const [renderFile1,setRenderFile1] = useState<boolean>(false);
  const [renderFile2,setRenderFile2] = useState<boolean>(false);
  const [processFirstNow1, setProcessFirstNow1] = useState<boolean>(false);
  const [processSecondNow2, setProcessSecondNow2] = useState<boolean>(false);


  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPrimaryUrl(e.target.files![0].name);
      setRenderFile1(true)
    };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setSecondUrl(e.target.files![0].name);
      setRenderFile2(true)
    };

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const button: HTMLButtonElement = event.currentTarget;
    console.info('button clicked '+button+ 'renderFile1:  '+renderFile1+ ' renderFile2:: '+renderFile2)
    setProcessFirstNow1(true);
    setProcessSecondNow2(true); 
  };
      
    
    

  useEffect(() => {
  
    
  },[])


 
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Button 
          variant="contained"
          onClick={buttonHandler}
        >Process Now</Button>
        </ThemeProvider>   
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
      paddingLeft={30}
    
    >
      <div style={{display: 'flex', width: '45vw', height: '90vh'}}>

    { !renderFile1 && <UploadButtons handleChange={handleChange1}/> }
     {renderFile1 &&<Primary  file1={primaryUrl!} processNow1={processFirstNow1}/>} 
     {renderFile1 && processFirstNow1&& <Primary  file1={primaryUrl!} processNow1={processFirstNow1}/>} 

      </div>
      <div style={{display: 'flex', width: '40vw', height: '90vh' }}>
     { !renderFile2 && <UploadFile2 handleChange={handleChange2} /> }
       {renderFile2 && <Secondary file2={secondUrl!} processNow2={processSecondNow2} /> }
       {renderFile2 && processSecondNow2 && <Secondary file2={secondUrl!} processNow2={processSecondNow2} /> }

     

      </div>
    </Stack>
  </div>
  )
}

export default Reports