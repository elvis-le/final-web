// MainContent.js
import React, {useEffect, useState} from 'react';
import AudioManage from "./AudioManage";
import TextManage from "./TextManage";
import StickerManage from "./StickerManage";
import EffectManage from "./EffectManage";
import FilterManage from "./FilterManage";

const MainContent = ({ selectedOption }) => {
    return (
        <div className="main-content">
            <div className="content">
                {selectedOption === 'users' && <div>Users Management</div>}
                {selectedOption === 'projects' && <div>Projects Management</div>}
                {selectedOption === 'videos' && <div>Videos Management</div>}
                {selectedOption === 'audio' && <AudioManage />}
                {selectedOption === 'text' && <TextManage/>}
                {selectedOption === 'stickers' && <StickerManage/>}
                {selectedOption === 'effects' && <EffectManage/>}
                {selectedOption === 'filters' && <FilterManage/>}
            </div>
        </div>
    );
};

export default MainContent;
