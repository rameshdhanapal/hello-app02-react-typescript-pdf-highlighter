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

import { testHighlights as _testHighlights } from "./file2-highlights";
import {Spinner}  from "./Spinner";
import {Sidebar} from "./Sidebar";

import './style/SecondPdfhighlight.css';
import { Stack, Button,createTheme, ThemeProvider  } from "@mui/material";
import ContentService from "./services/ContentService";
import axios from 'axios';

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
  filename2: string;
  binarydata2: string | ArrayBuffer | null | undefined;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
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

const PRIMARY_PDF_URL = "/latest-bill (1).pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
type secondProps = {
  processNow2: boolean,
  file2: string,
  selectedFile2: File | null | undefined,
}

class Secondary extends Component<secondProps, State> {
  constructor(props: secondProps) {
    super(props);

    this.state = {
      url: this.props.file2,
      highlights:[],
      filename2: this.props.file2,
      binarydata2: undefined,
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

    if(this.props.selectedFile2) {
      //file reader function for read the file
      let fileReader2 = new FileReader();
      fileReader2.readAsArrayBuffer(this.props.selectedFile2);
      fileReader2.onload = () => {
        //console.log(fileReader2.result);
        this.setState({
          filename2: this.props.file2,
          highlights:[],
          binarydata2: fileReader2.result
        });
      }
    }

    /*if(this.props.processNow2){

    let data: [] = [];
    ContentService.getContentAll2().then((response: any) => {

      data = response["data"]["/TRADITIONAL MER.pdf"];
      //data = data["HITMER"];
      this.setState({
        highlights : data
      })

    })
    .catch((e: Error) => {
      console.log(e);
    });

    }*/

    if(this.props.processNow2 && this.props.selectedFile2) {
      let data: [] = [];

      let formData = new FormData();
      formData.append('file',this.props.selectedFile2)

      axios.post('http://localhost:8080/uploadFile2API', formData)
            .then(res => {
              data = res["data"]["/TRADITIONAL MER.pdf"];

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
    if(this.state.filename2 !== this.props.file2) {
      if(this.props.selectedFile2) {
        //file reader function for read the file
        let fileReader2 = new FileReader();
        fileReader2.readAsArrayBuffer(this.props.selectedFile2);
        fileReader2.onload = () => {
          //console.log(fileReader2.result);
          this.setState({
            filename2: this.props.file2,
            highlights:[],
            binarydata2: fileReader2.result
          });
        }
      }
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
      highlights: [{ ...highlight, id: getNextId(), matches:0 }, ...highlights],
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
    const { binarydata2, highlights } = this.state;
    if(!binarydata2){
      return null;
    }
    return (
      <div>
          <PdfLoader url={this.state.filename2} data={binarydata2} beforeLoad={<Spinner />}>
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

export default Secondary;
