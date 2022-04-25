import { Box, Divider, Grid, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IHighlight } from 'react-pdf-highlighter'
import UploadButtons from '../fileupload/UploadButtons'
import UploadFile2 from '../fileupload/UploadFile2'
import Primary from '../Primary'
import Secondary from '../Secondary'
import { Sidebar } from '../Sidebar'



type RenderType = JSX.Element | Array<RenderType> | string | number | boolean | null;

function Reports() {
  const [primaryUrl, setPrimaryUrl] = useState<string | null> ('/1.pdf');
  const [secondUrl, SetSecondUrl] = useState<string | null> ('/2.pdf');
  const [renderFile1,setRenderFile1] = useState<boolean>(false);
  const [renderFile2,setRenderFile2] = useState<boolean>(false);


  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPrimaryUrl(e.target.files![0].name);
      setRenderFile1(true)
    };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
      SetSecondUrl(e.target.files![0].name);
      setRenderFile2(true)
    };

      


  useEffect(() => {

    
  },[])


 
  return (
    <div>

    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
      paddingLeft={30}
    >
      <div style={{display: 'flex', width: '45vw', height: '90vh'}}>

    { !renderFile1 && <UploadButtons handleChange={handleChange1}/> }
     {renderFile1 &&<Primary  file1={primaryUrl!} />} 

      </div>
      <div style={{display: 'flex', width: '40vw', height: '90vh'}}>
     { !renderFile2 && <UploadFile2 handleChange={handleChange2} /> }
       {renderFile2 && <Secondary file2={secondUrl!} /> }

     

      </div>
    </Stack>
  </div>
  )
}

export default Reports