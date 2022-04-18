import { Box, Divider, Grid, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IHighlight } from 'react-pdf-highlighter'
import Primary from '../Primary'
import Secondary from '../Secondary'
import { Sidebar } from '../Sidebar'

import { testHighlights as _testHighlights } from "../test-highlights";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

function Reports() {

  const [highlights, setHighlights] = useState<IHighlight[]>([])


 const resetHighlights = () => {
  }


  const toggleDocument = () => {
  }


  useEffect(() => {
setHighlights(testHighlights['/test.pdf'])
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
      <Primary/>

      </div>
      <div style={{display: 'flex', width: '40vw', height: '90vh'}}>
      <Secondary/>

       {/* <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}

  /> */}

      </div>
    </Stack>
  </div>
  )
}

export default Reports