import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useInView } from 'react-intersection-observer';
// import './Pdf.css'; // Import your custom CSS file for styling

// Set PDF.js worker path to fix a worker initialization issue
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfView({data}) {
    
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const changeScale = (newScale) => {
    setScale(newScale);
  };

  const zoomIn = () => {
    changeScale(scale + 0.25);
  };

  const zoomOut = () => {
    if (scale > 0.25) {
      changeScale(scale - 0.25);
    }
  };

  const zoomLevels = [50, 75, 100, 125, 150, 175, 200]; // Adjust these levels as needed

  const changeZoom = (newZoom) => {
    setScale(newZoom / 100);
  };

  const pdfUrl = 'https://givemesomestorage.blob.core.windows.net/mycontainer/sample.pdf?sp=r&st=2024-07-10T17:38:04Z&se=2024-07-11T01:38:04Z&sv=2022-11-02&sr=b&sig=jV%2FgqVZum20RWsyqfr%2FYGUoCF2P0X8W3846l9e9L2xs%3D';
  const encodedPdfUrl = encodeURIComponent(pdfUrl);

  return (
    <div className="pdf-container">
      <div className="controls">
        <button onClick={zoomOut}>-</button>
        <span>{`${Math.round(scale * 100)}%`}</span>
        <button onClick={zoomIn}>+</button>
      </div>
      <div className="pdf-pages">
        <Document
        
          file={`http://localhost:5001/proxy?file=${data.path}`}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<CustomLoading />}
        >
          {numPages &&
            Array.from(new Array(numPages), (el, index) => (
              <PageWithInView
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
              />
            ))}
        </Document>
      </div>
      {/* <div className="zoom-levels">
        {zoomLevels.map((level) => (
          <button key={level} onClick={() => changeZoom(level)}>
            {`${level}%`}
          </button>
        ))}
      </div> */}
    </div>
  );
}

function PageWithInView({ pageNumber, scale, backgroundColor }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} style={{  margin: '20px',width: "fit-content" }}>
      {inView && (
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      )}
    </div>
  );
}

function CustomLoading() {
  return <div className="custom-loading"><div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div></div>;
}

export default PdfView;
