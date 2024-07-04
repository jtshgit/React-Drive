import React from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
const folderIcon = process.env.PUBLIC_URL + "/folder.svg";
const fileIcon = process.env.PUBLIC_URL + "../logo192.png";

const Accordion = ({ items, parentId }) => {
    const navigate = useNavigate();
    const handleFolderClick = (e) => {
        const dataId = e.target.getAttribute('data-id');
        navigate('/myfolder/' + dataId)
    };
    return (
        <div className="accordion" id={`accordionExample${parentId}`}>
            {items.map((item, index) => (
                <div key={item._id} className="accordion-item">
                    <h2 className="accordion-header" id={`heading${item._id}`}>
                        <Link
                            to={`/myfolder/${item._id}`}
                            className={`accordion-button ${item.type === "file"
                                ? "collapsed accordion-file-button"
                                : "collapsed"
                                }`}
                            type="button"
                            data-bs-toggle={item.type === "file" ? "" : "collapse"}
                            data-bs-target={item.type === "file" ? "" : `#collapse${item._id}`}
                            aria-expanded="false"
                            data-id={item._id}
                            aria-controls={`collapse${item._id}`}
                            disabled={item.type === "file"}
                            onClick={handleFolderClick}
                        >
                            <img
                                src={item.type === "file" ? fileIcon : folderIcon}
                                alt={item.type}
                                style={{ marginRight: "10px", height: "15px" }}
                            />
                            <span>{item.name}</span>
                        </Link>
                    </h2>
                    {item.type !== "file" && (
                        <div
                            id={`collapse${item._id}`}
                            className="accordion-collapse collapse"
                            data-bs-parent={`#accordionExample${parentId}`}
                        >
                            <div className="accordion-body">
                                {item.children && item.children.length > 0 ? (
                                    <Accordion items={item.children} parentId={item._id} />
                                ) : (
                                    <p>No files</p>
                                )}
                            </div>
                        </div>
                    )}
                    {item.type === "file" && <div className="accordion-body"></div>}
                </div>
            ))}
        </div>
    );
};

const FileMap = ({ data }) => {
    const param = useParams();
    // console.log(param.id)
    const organizeData = (data) => {
        const map = {};
        data.struct.forEach((item) => {
            map[item._id] = { ...item, parentId: 0, children: [] };
        });
        // data.struct.forEach((item) => {
        //     if (item.parent && map[item.parent]) {
        //         map[item.parent].children.push(map[item._id]);
        //     }
        // });

        return Object.values(map).filter((item) => !item.parent);
    };
    let organizedData;
    if (data.auth) {
        organizedData = organizeData(data);
    }
    console.log(organizedData);

    return (
        <div>

            <div className="accordion" id="accordionExample">
                {data.auth ? (organizedData.map(element => (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <Link className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + element._id} aria-expanded="true" aria-controls={"collapse" + element._id}>
                                <span>{element.name}</span>
                            </Link>
                        </h2>
                        <div id={"collapse" + element._id} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div class="d-flex justify-content-center">
                                    <div class="spinner-border  spinner-border-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))) : ""}
            </div>


        </div>
    );
};

export default FileMap;