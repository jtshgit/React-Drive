import React from "react";
import { useParams, Link } from "react-router-dom";
const folderIcon = process.env.PUBLIC_URL + "/folder.svg";
const fileIcon = process.env.PUBLIC_URL + "../logo192.png";
const Folder = ({ data }) => {
  // console.log(childFiles)
  const id = useParams();
  let childFiles;
  if (id.id) {
    childFiles = data.filter((child) => child.parent === id.id);
  } else {
    childFiles = data.filter((child) => child.parent === null);
  }
  let self = data.find(item => item._id === id.id);
  const map = [];
  // map.push(self);
  let organizeData;
  let organizedData;
  if(self){
   organizeData = (data, child) => {
    data.forEach((item) => {
      if(item._id === child.parent){
        map.unshift(item);
        organizeData(data,item)
      }
    });
    return Object.values(map);
  }
  organizedData = organizeData(data,self);
}
console.log(organizedData);
  return (
    <div>
<section className="breadcrumbs">
  <nav className="breadcrumb_nav" aria-label="breadcrumb">
  <ol className="breadcrumb">
      {self? (organizedData.map((item) => (
        <li key={item._id} className="breadcrumb-item"><Link to={`/folder/${item._id}`}>{item.name}</Link></li>
        )))

        :""}

{self? (<li className="breadcrumb-item active" aria-current="page"><span>{self.name}</span></li>):""}
  </ol> </nav>
     </section>

      {self? (childFiles.length === 0? <center className="no_file_here"><img src={folderIcon} alt="abc"/><h4>No file here</h4></center>:""):<center className="no_file_here"><img src={folderIcon} alt=""/><h4>Not Exist</h4></center>}
      <ul style={{ marginTop: "3px" }}>
        {childFiles.map((file) => (
          <center key={file._id} className="folder-icon">
            <Link to={"/folder/" + file._id}>
              <div>
                <img
                  src={file.type === "folder" ? folderIcon : fileIcon}
                  alt="abc"
                />
                <span>{file.name}</span>
              </div>
            </Link>
          </center>
        ))}
      </ul>
      {/* <FileUpload/> */}
      {/* <FileGet/> */}
    </div>
  );
};

export default Folder;

  /* <center class="folder-icon" data-name="<%= file.name %>" data-ref="<%= file._id %>">
                    <a href="/folder/<%= file._id %>">
                        <div>
                            <img src="./images/folder.svg" alt="">
                            <span>
                                <%= file.name %>
                            </span>
                        </div>
                    </a>
                </center>
                <% } else { %>
                    <center class="folder-icon" data-name="<%= file.name %>" data-ref="<%= file._id %>">
                        <a href="#">
                            <div>
                                <img style="border: 1px solid rgb(237, 237, 237); border-radius: 4px;"
                                    src="<%= file.blobUrl %>" alt="">
                                <span>
                                    <%= file.name %>
                                </span>
                            </div>
                        </a>
                    </center> */

