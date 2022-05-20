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
import ContentService from "./services/ContentService";

const Input = styled('input')({
  display: 'none',
});

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
  filename1:  string;
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
    document.location.hash = `highlight-${highlighId}`;   
   clickCnt = 0;   
  }  

  if(clickCnt > 0 && highlight.id === sessionStorage.getItem('tmpId')) {
  //document.location.hash = `highlight-${highlight.id}`; 
  let highlighId : number = clickCnt + Number(highlight.id);
  document.location.hash = `highlight-${highlighId}`; 
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
    
    this.state = {
      url: this.props.file1,
      highlights: [],
      filename1: this.props.file1
    };  

  }


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

    console.log('check process now in DidMount method: '+this.props.processNow1);
    if(this.props.processNow1){    
  
      let data: [] = [];
      ContentService.getContentAll().then((response: any) => {
        //console.log('print response::::: '+JSON.stringify(response))
        data = response["data"]["/HITMER.pdf"];
        //data = data["HITMER"];
        this.setState({
          highlights : data
        })      
        
      })
      .catch((e: Error) => {
        console.log(e);
      });

      }


  }

  componentDidUpdate() {
    console.log('check process now in Updated method: '+this.props.processNow1);
    if(this.state.filename1 !== this.props.file1) {
      this.setState({
        filename1: this.props.file1,
        highlights:[]
      })
    }   
  }

  




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
     
    return (     
      <div>          
          <PdfLoader url={this.state.filename1} beforeLoad={<Spinner />}>
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