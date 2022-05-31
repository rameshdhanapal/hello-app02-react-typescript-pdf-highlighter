import { Box, Button, createTheme, Divider, Grid, Stack, ThemeProvider } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IHighlight } from 'react-pdf-highlighter'
import { useNavigate } from 'react-router-dom'
import UploadButtons from '../fileupload/UploadButtons'
import UploadFile2 from '../fileupload/UploadFile2'
import Primary from '../Primary'
import Secondary from '../Secondary'
import ContentService from '../services/ContentService'
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
          top : '-77px',
        },
      },
    },
  },
});

function Reports() {
  const [primaryUrl, setPrimaryUrl] = useState<string | null> ('/HITMER.pdf');
  const [secondUrl, setSecondUrl] = useState<string | null> ('/TRADITIONAL MER.pdf');
  const [renderFile1,setRenderFile1] = useState<boolean>(false);
  const [renderFile2,setRenderFile2] = useState<boolean>(false);
  const [processFirstNow1, setProcessFirstNow1] = useState<boolean>(false);
  const [processSecondNow2, setProcessSecondNow2] = useState<boolean>(false);
  const [selectedFile1,setSelectedFile1] = useState<File | null>();
  const [selectedFile2,setSelectedFile2] = useState<File | null>();


  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPrimaryUrl(e.target.files![0].name);
      setRenderFile1(true);
      setProcessFirstNow1(false);
      //setProcessSecondNow2(false);
     // console.log('e.target.files![0] : '+JSON.stringify(e.target.files![0]))
      setSelectedFile1(e.target.files![0]);
    };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setSecondUrl(e.target.files![0].name);
      setRenderFile2(true);
      //setProcessFirstNow1(false);
      setProcessSecondNow2(false);
      setSelectedFile2(e.target.files![0]);
    };

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const button: HTMLButtonElement = event.currentTarget;
    setProcessFirstNow1(true);
    setProcessSecondNow2(true);
  };

   return (

    <div>
      <UploadButtons handleChange={handleChange1}/>
      <UploadFile2 handleChange={handleChange2} />
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
        <div style={{display: 'flex', width: '45vw', height: '81vh'}}>

        {/*renderFile1 && !processFirstNow1 && <Primary  file1={primaryUrl!} processNow1={processFirstNow1}/>*/}
        {renderFile1 && !processFirstNow1 && selectedFile1 && <Primary  file1={primaryUrl!} processNow1={processFirstNow1} selectedFile1={selectedFile1}/>}
        {renderFile1 && processFirstNow1 && selectedFile1 && <Primary  file1={primaryUrl!} processNow1={processFirstNow1} selectedFile1={selectedFile1}/>}
        </div>

        <div style={{display: 'flex', width: '40vw', height: '81vh' }}>
        {renderFile2 &&  !processSecondNow2 &&  selectedFile2 && <Secondary file2={secondUrl!} processNow2={processSecondNow2} selectedFile2={selectedFile2} /> }
        {renderFile2 && processSecondNow2 && selectedFile2 && <Secondary file2={secondUrl!} processNow2={processSecondNow2} selectedFile2={selectedFile2} /> }



        </div>
        </Stack>

  </div>
  )
}

export default Reports
