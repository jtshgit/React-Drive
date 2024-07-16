import React,{useState} from 'react'
import PdfView from './PdfView';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function FileShow({data}) {
    const [fileType, setFileType] = useState('');

      const fileName = data.path;
      const fileExtension = fileName.split('.').pop().toLowerCase();
  return (
    <div>
      {['pdf'].includes(fileExtension)?(<PdfView data={data}/>):""}
    </div>
  )
}
