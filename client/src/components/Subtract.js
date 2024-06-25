import React, { useState } from 'react';
import '../App.css';

const DraggableBox = ({ id, isActive, handleDragOver, handleDrop }) => {
    return (
        <div
            className={`draggable-box ${isActive ? 'active' : ''}`}
            data-id={id}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {isActive ? <span className="plus-sign">+</span> : `Box ${id}`}
        </div>
    );
};

const App = () => {
    const [dragging, setDragging] = useState(false);
    const [activeBox, setActiveBox] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropOutside = (e) => {
        e.preventDefault();
        setDragging(false);
        setActiveBox(null);
        const files = e.dataTransfer.files;
        logFiles('Dropped outside', files);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
        setActiveBox(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const boxId = e.target.getAttribute('data-id');
        setActiveBox(null);
        const files = e.dataTransfer.files;
        logFiles(`Dropped inside box with data-id: ${boxId}`, files);
    };

    const handleBoxDragOver = (e, id) => {
        e.preventDefault();
        setActiveBox(id);
    };

    const logFiles = (location, files) => {
        console.log(location);
        Array.from(files).forEach(file => {
            console.log(`File Name: ${file.name}, File Size: ${file.size}, File Type: ${file.type}`);
        });
    };

    return (
        <div
            className={`App ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDropOutside}
        >
            {dragging && !activeBox && <div className="drop-here">Drop it here</div>}
            <DraggableBox id="1" isActive={activeBox === '1'} handleDragOver={(e) => handleBoxDragOver(e, '1')} handleDrop={handleDrop} />
            <DraggableBox id="2" isActive={activeBox === '2'} handleDragOver={(e) => handleBoxDragOver(e, '2')} handleDrop={handleDrop} />
            <DraggableBox id="3" isActive={activeBox === '3'} handleDragOver={(e) => handleBoxDragOver(e, '3')} handleDrop={handleDrop} />
            <DraggableBox id="4" isActive={activeBox === '4'} handleDragOver={(e) => handleBoxDragOver(e, '4')} handleDrop={handleDrop} />
        </div>
    );
};

export default App;
