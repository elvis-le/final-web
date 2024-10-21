import React, {useEffect, useState} from 'react';
import AudioManage from "./AudioManage";
import AudioCreate from "./AudioCreate";
import AudioEdit from "./AudioEdit";
import TextManage from "./TextManage";
import TextCreate from "./TextCreate";
import TextEdit from "./TextEdit";
import StickerManage from "./StickerManage";
import StickerCreate from "./StickerCreate";
import StickerEdit from "./StickerEdit";
import EffectManage from "./EffectManage";
import EffectCreate from "./EffectCreate";
import EffectEdit from "./EffectEdit";
import FilterManage from "./FilterManage";
import FilterCreate from "./FilterCreate";
import FilterEdit from "./FilterEdit";
import {useParams} from "react-router-dom";
import UserManage from "./UserManage";
import Profile from "./Profile";

const MainContent = ({ selectedOption }) => {
    const { type, id } = useParams();
    const [selectedOptionContent, setSelectedOptionContent] = useState('audio')

    const handleOptionContentSelect = (option) => {
    setSelectedOptionContent(option);
    localStorage.setItem('setSelectedOptionContent', option);
};

    useEffect(() => {
        const savedOptionContent = localStorage.getItem('setSelectedOptionContent');
        console.log('Saved Option Content:', savedOptionContent);
        if (savedOptionContent) {
            setSelectedOptionContent(savedOptionContent);
        }
    }, []);

    useEffect(() => {
            setSelectedOptionContent(selectedOption);
    }, [selectedOption]);

    useEffect(() => {
        console.log('Item Type:', type);
        console.log('Item ID:', id);
        console.log('selectedOptionContent:', selectedOptionContent);
        console.log('selectedOption:', selectedOption);
    }, [type, id,selectedOption,selectedOptionContent]);

    return (
        <div className="main-content">
            <div className="content">
                {(selectedOption === 'profile') && <Profile onOptionSelect={handleOptionContentSelect} />}
                {(selectedOption === 'users') && <UserManage onOptionSelect={handleOptionContentSelect} />}
                {(selectedOption === 'audio' && selectedOptionContent === 'audio') && <AudioManage onOptionSelect={handleOptionContentSelect} />}
                {selectedOptionContent === 'createAudio' && <AudioCreate onOptionSelect={handleOptionContentSelect} />}
                {(type === 'audio' && selectedOptionContent === 'editAudio') && <AudioEdit onOptionSelect={handleOptionContentSelect} audioId={id} />}
                {(selectedOption === 'text' && selectedOptionContent  === 'text') && <TextManage onOptionSelect={handleOptionContentSelect}/>}
                {selectedOptionContent === 'createText' && <TextCreate onOptionSelect={handleOptionContentSelect}/>}
                {(type === 'text' && selectedOptionContent === 'editText') && <TextEdit  onOptionSelect={handleOptionContentSelect} textId={id}/>}
                {(selectedOption === 'sticker' && selectedOptionContent  === 'sticker') && <StickerManage onOptionSelect={handleOptionContentSelect}/>}
                {selectedOptionContent === 'createSticker' && <StickerCreate onOptionSelect={handleOptionContentSelect}/>}
                {(type === 'sticker' && selectedOptionContent === 'editSticker') && <StickerEdit  onOptionSelect={handleOptionContentSelect} stickerId={id}/>}
                {(selectedOption === 'effect' && selectedOptionContent  === 'effect') && <EffectManage onOptionSelect={handleOptionContentSelect}/>}
                {selectedOptionContent === 'createEffect' && <EffectCreate onOptionSelect={handleOptionContentSelect}/>}
                {(type === 'effect' && selectedOptionContent === 'editEffect') && <EffectEdit  onOptionSelect={handleOptionContentSelect} effectId={id}/>}
                {(selectedOption === 'filter' && selectedOptionContent  === 'filter') && <FilterManage onOptionSelect={handleOptionContentSelect}/>}
                {selectedOptionContent === 'createFilter' && <FilterCreate onOptionSelect={handleOptionContentSelect}/>}
                {(type === 'filter' && selectedOptionContent === 'editFilter') && <FilterEdit  onOptionSelect={handleOptionContentSelect} filterId={id}/>}
            </div>
        </div>
    );
};

export default MainContent;
