import React, { Component } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from "react-pdf-highlighter";

import type { IHighlight, NewHighlight } from "react-pdf-highlighter";

import { testHighlights as _testHighlights } from "./test-highlights";
import {Spinner}  from "./Spinner";
import {Sidebar} from "./Sidebar";

import "./style/AppExtn.css";
import "./style/PrimaryPdfhighlight.css"
import UploadButtons from "./fileupload/UploadButtons";
import { PhotoCamera } from "@mui/icons-material";
import { Stack,  Button, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
}

let clickCnt: number = 0;
const updateHash = (highlight: IHighlight) => {
 
  if(clickCnt === 0 ) {
    sessionStorage.setItem('tmpId',highlight.id)
  }

  clickCnt = clickCnt + 1;
  console.info('print hash::: '+ JSON.stringify(highlight))

  if(clickCnt > 0 && highlight.id !== sessionStorage.getItem('tmpId')) {
   
    //document.location.hash = `highlight-${highlight.id}`; 
  let highlighId : number = 1 + Number(highlight.id);
  //  console.info('print before id: '+highlighId);
    document.location.hash = `highlight-${highlighId}`; 
   // console.info('print id: '+document.location.hash);
   clickCnt = 0;
   
  }
  console.info('session tmpId : '+sessionStorage.getItem('tmpId'));
  console.info('highlight.id : '+highlight.id);
 

  if(clickCnt > 0 && highlight.id === sessionStorage.getItem('tmpId')) {
  //document.location.hash = `highlight-${highlight.id}`; 
  let highlighId : number = clickCnt + Number(highlight.id);
//  console.info('print before id: '+highlighId);
  document.location.hash = `highlight-${highlighId}`; 
 // console.info('print id: '+document.location.hash);
  }
  
  
  if(clickCnt === highlight.matches) {
    clickCnt = 0;
  }
};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = "/paper-bill (1).pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
type primaryProps = {
  processNow1: boolean,
  file1: string
}

class Primary extends Component<primaryProps, State> {
  constructor(props: primaryProps) {
    super(props);
  }
state = {
    url: this.props.file1,
    highlights: testHighlights[this.props.file1]
      ? [...testHighlights[this.props.file1]]
      : [],
  };  
  

  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };

  scrollViewerTo = (highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );

    console.info('primary processNow1 '+this.props.processNow1);
  if(this.props.processNow1){
    this.setState({
      // highlights : [{"content":{"text":"The quick brown fox jumps over the lazy dog"},"position":{"boundingRect":{"x1":119.53515625,"y1":88.2354736328125,"x2":332.1571044921875,"y2":103.2354736328125,"width":744.0000000000001,"height":962.8235294117648},"rects":[{"x1":119.53515625,"y1":88.2354736328125,"x2":332.1571044921875,"y2":103.2354736328125,"width":744.0000000000001,"height":962.8235294117648}],"pageNumber":1},"comment":{"text":" highlight text 1 file 1 ","emoji":"😳"},"id":"1","matches":2}]
      highlights : testHighlights['/'+this.props.file1]

    })
  }
   
  }

 /* buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const button: HTMLButtonElement = event.currentTarget;
    console.log('Ayyappa file1:: '+this.props.file1+ ' file2: '+this.props.file1)
     this.setState({  
      highlights: testHighlights['/'+this.props.file1] ? [...testHighlights['/'+this.props.file1]] : [],
    });
       
  };*/
  

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight: NewHighlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId(), matches: 0 }, ...highlights],
    });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      }),
    });
  }




  


  render() {
    const { url, highlights } = this.state;
     //console.log('print  I am in primary tsk '+url)
    return (     
      <div>         
    
       {/*<h1 className="fileName1">File 1 </h1> */}         
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo) => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                      onClick={() => {
                        updateHash(highlight);
                      }}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        
      </div>
    );
  }
}

export default Primary;