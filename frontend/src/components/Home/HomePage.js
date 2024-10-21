import React, {useEffect, useRef, useState} from "react";
import './HomePage.scss'
import logo from '../../assets/images/file.png';
import {Link, useNavigate} from "react-router-dom";
import {Menu, MenuItem, Sidebar, SubMenu} from "react-pro-sidebar";
import imgTest from '../../assets/images/Nitro_Wallpaper_01_3840x2400.jpg';
import rainbow from '../../assets/images/rainbow.jpg';
import video from '../../assets/video/video1.mp4';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import {supabase} from '../../supabaseClient';
import {Stage, Layer, Text, Image} from "react-konva";
import {FaBold, FaItalic, FaUnderline} from "react-icons/fa";
import {RxLetterCaseLowercase, RxLetterCaseToggle, RxLetterCaseUppercase} from "react-icons/rx";
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {gsap} from 'gsap';

const ffmpeg = new FFmpeg({log: true});

const HomePage = () => {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const [videoFile, setVideoFile] = useState(null);
    const [playVideo, setPlayVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [duration, setDuration] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [accumulatedTime, setAccumulatedTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [timelineDuration, setTimelineDuration] = useState(0);
    const [timestamps, setTimestamps] = useState([])
    const [videoDuration, setVideoDuration] = useState(0);


    const [listVideo, setListVideo] = useState([]);

    const [selectedVideo, setSelectedVideo] = useState({});
    const [timelineVideos, setTimelineVideos] = useState([]);

    const [selectedText, setSelectedText] = useState({});
    const [timelinesText, setTimelinesText] = useState([]);
    const [textFiles, setTextFiles] = useState({
        default: [],
        trending: [],
        basic: [],
        multicolor: [],
    });

    const [selectedAudio, setSelectedAudio] = useState({});
    const [timelinesAudio, setTimelinesAudio] = useState([]);
    const [audioFiles, setAudioFiles] = useState({
        vlog: [],
        tourism: [],
        spring: [],
        love: [],
        beat: [],
        heal: [],
        warm: [],
        trend: [],
        revenue: [],
        horrified: [],
        laugh: [],
    });

    const [selectedSticker, setSelectedSticker] = useState({});
    const [timelinesSticker, setTimelinesSticker] = useState([]);
    const [stickerFiles, setStickerFiles] = useState({
        trending: [],
        easter_holiday: [],
        fun: [],
        troll_face: [],
        gaming: [],
        emoji: [],
    });

    const [selectedEffect, setSelectedEffect] = useState({});
    const [timelinesEffect, setTimelinesEffect] = useState([]);
    const [effectFiles, setEffectFiles] = useState({
        trending: [],
        nightclub: [],
        lens: [],
        retro: [],
        tv: [],
        star: [],
        trending_body: [],
        mood_body: [],
        mask_body: [],
        selfie_body: [],
    });

    const [selectedFilter, setSelectedFilter] = useState({});
    const [timelinesFilter, setTimelinesFilter] = useState([]);
    const [filterFiles, setFilterFiles] = useState({
        featured: [],
        life: [],
        scenery: [],
        movies: [],
        retro: [],
        style: [],
    });

    const [draggableText, setDraggableText] = useState({
        content: "Your draggable text here",
        position: {x: 0, y: 0},
    });

    const [widthTime, setWidthTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [durationTimeLine, setDurationTimeLine] = useState(0);
    const [textToAdd, setTextToAdd] = useState('');
    const videoWidth = 424;
    const videoHeight = 240;

    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem("refresh_token");
    const projectId = localStorage.getItem('current_project_id');

    const [isResizing, setIsResizing] = useState(false);
    const [resizingInfo, setResizingInfo] = useState({});
    const [scaleValue, setScaleValue] = useState(100);
    const [scaleValueWidth, setScaleValueWidth] = useState(100);
    const [scaleValueHeight, setScaleValueHeight] = useState(100);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [opacity, setOpacity] = useState(100);
    const [blendMode, setBlendMode] = useState("default");
    const [stabilizeLevel, setStabilizeLevel] = useState("recommended");
    const [blurValue, setBlurValue] = useState(94);
    const [blendValue, setBlendValue] = useState(94);
    const [direction, setDirection] = useState("both");
    const [speed, setSpeed] = useState("once");
    const [canvasOption, setCanvasOption] = useState('none');
    const [colorValue, setColorValue] = useState('#ff0000');
    const [customRemovalValue, setCustomRemovalValue] = useState(94);
    const [voiceValue, setVoiceValue] = useState(0);
    const [speedValue, setSpeedValue] = useState(1);


    const [textContent, setTextContent] = useState("Default text")
    const [fontText, setFontText] = useState("arial");
    const [fontSizeText, setFontSizeText] = useState(10);
    const [patternText, setPatternText] = useState("normal");
    const [caseText, setCaseText] = useState("normal");
    const [scaleText, setScaleText] = useState(100);
    const [scaleWidthText, setScaleWidthText] = useState(100);
    const [scaleHeightText, setScaleHeightText] = useState(100);
    const [positionXText, setPositionXText] = useState(0);
    const [positionYText, setPositionYText] = useState(0);
    const [rotateText, setRotateText] = useState(0);
    const [opacityText, setOpacityText] = useState(100);
    const [blod, setBlod] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [italic, setItalic] = useState(false);
    const [styleOfText, setStyleOfText] = useState("lettercase");


    const [voiceValueAudio, setVoiceValueAudio] = useState(0);
    const [speedValueAudio, setSpeedValueAudio] = useState(1);

    const [scaleValueSticker, setScaleValueSticker] = useState(100);
    const [scaleValueWidthSticker, setScaleValueWidthSticker] = useState(100);
    const [scaleValueHeightSticker, setScaleValueHeightSticker] = useState(100);
    const [positionXSticker, setPositionXSticker] = useState(0);
    const [positionYSticker, setPositionYSticker] = useState(0);
    const [rotateValueSticker, setRotateValueSticker] = useState(0);

    const [effectName, setEffectName] = useState("Default");
    const [filterName, setFilterName] = useState("Default");

    const [videoIndex, setVideoIndex] = useState(0);
    const [timelineVideoIndex, setTimelineVideoIndex] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const [timelineTextIndex, setTimelineTextIndex] = useState(0);
    const [audioIndex, setAudioIndex] = useState(0);
    const [timelineAudioIndex, setTimelineAudioIndex] = useState(0);
    const [stickerIndex, setStickerIndex] = useState(0);
    const [timelineStickerIndex, setTimelineStickerIndex] = useState(0);

    const [frameIndex, setFrameIndex] = useState(0);
    const [frames, setFrames] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [gifFileUrl, setGifFileUrl] = useState("");
    const [translateSticker, setTranslateSticker] = useState(false)
    const [stickerFrames, setStickerFrames] = useState({});
    const [currentFrameIndex, setCurrentFrameIndex] = useState({});
    const [videoUrlTranslate, setVideoUrlTranslate] = useState("");
    const [selectedElement, setSelectedElement] = useState(null);
  const seekBarRef = useRef(null);


    const audioRefs = useRef({});

    const filterHandlers = {
        applyFilter: (config) => {
            const contrast = config.contrast?.default ?? 1;
            const brightness = config.brightness?.default ?? 1;
            const saturation = config.saturation?.default ?? 1;
            const hueShift = config.color_tone?.hue_shift?.default ?? 0;
            return `contrast(${contrast}) brightness(${brightness}) hue-rotate(${hueShift}deg) saturate(${saturation})`;
        },
    };

    let isDragging = false;

    const allVideos = timelineVideos.flatMap(timeline => timeline.videos);

    const fetchDataByCategory = async (category, setData, endpoint) => {
        try {
            const response = await axios.get(`http://localhost:8000/myapp/${endpoint}/${category}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const dataByCategory = response.data.filter(audio => audio.category === category);
            setData(prevState => ({
                ...prevState,
                [category]: dataByCategory
            }));
        } catch (error) {
            console.error(`Error fetching ${endpoint} for category ${category}:`, error);
        }
    };

    const fetchVideo = async (project, setData) => {
        try {
            const response = await axios.get(`http://localhost:8000/myapp/video/${project}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const videos = response.data;
                if (Array.isArray(videos) && videos.length > 0) {
                    setData(videos);
                } else {
                    console.error("No video");
                    setData([]);
                }
            } else {
                console.error(`Lỗi server: ${response.status}`);
            }
        } catch (error) {
            console.error(`Lỗi khi lấy video cho dự án ${project}:`, error);
        }
    };

    const handleEffectClick = () => {
        if (videoRef.current) {
            if (!playVideo) {
                videoRef.current.play();
                setPlayVideo(!playVideo);
            } else {
                videoRef.current.pause();
                setPlayVideo(!playVideo);
            }
        }
    };


    const [editType, setEditType] = useState({
        video: false,
        text: false,
        audio: false,
        effect: false,
        filter: false,
        sticker: false,
    });

    const handleMenuEditType = (option) => {
        setEditType({
            video: false,
            text: false,
            audio: false,
            effect: false,
            filter: false,
            sticker: false,
            [option]: true,
        });
    };

    const [editVideoOption, setEditVideoOption] = useState({
        video: true,
        animation: false,
    });

    const handleMenuVideoOptionClick = (option) => {
        setEditVideoOption({
            video: false,
            animation: false,
            [option]: true,
        });
    };

    const [editTextOption, setEditTextOption] = useState({
        text: true,
        animation: false,
        text_to_speed: false,
    });

    const handleMenuEditTextOptionClick = (option) => {
        setEditTextOption({
            text: false,
            animation: false,
            text_to_speed: false,
            [option]: true,
        });
    };

    const [editAudioOption, setEditAudioOption] = useState({
        basic: true,
        voice_changer: false,
    });

    const handleMenuEditAudioOptionClick = (option) => {
        setEditAudioOption({
            basic: false,
            voice_changer: false,
            [option]: true,
        });
    };

    const [editStickerOption, setEditStickerOption] = useState({
        sticker: true,
        animation: false,
    });

    const handleMenuEditStickerOptionClick = (option) => {
        setEditStickerOption({
            sticker: false,
            animation: false,
            [option]: true,
        });
    };

    const [activeWrapper, setActiveWrapper] = useState({
        import: true,
        audio: false,
        text: false,
        sticker: false,
        effect: false,
        filter: false,
    });

    const handleMenuEffectClick = (option) => {
        setActiveWrapper({
            import: false,
            audio: false,
            text: false,
            sticker: false,
            effect: false,
            filter: false,
            [option]: true,
        });
    };

    const [activeImportOption, setActiveImportOption] = useState({
        device: true,
        trendingStockMaterial: false,
        christmasAndNewYearStockMaterial: false,
        greenScreenStockMaterial: false,
        backgroundStockMaterial: false,
        introAndEndStockMaterial: false,
    });

    const handleMenuImportOptionClick = (option) => {
        setActiveImportOption({
            device: false,
            trendingStockMaterial: false,
            christmasAndNewYearStockMaterial: false,
            greenScreenStockMaterial: false,
            backgroundStockMaterial: false,
            introAndEndStockMaterial: false,
            [option]: true,
        });
    };

    const [activeAudioOption, setActiveAudioOption] = useState({
        vlogMusic: true,
        tourismMusic: false,
        springMusic: false,
        loveMusic: false,
        beatMusic: false,
        healMusic: false,
        warmMusic: false,
        trendSoundEffect: false,
        revenueSoundEffect: false,
        horrifiedSoundEffect: false,
        laughSoundEffect: false

    });

    const handleMenuAudioOptionClick = (option) => {
        setActiveAudioOption({
            vlogMusic: false,
            tourismMusic: false,
            springMusic: false,
            loveMusic: false,
            beatMusic: false,
            healMusic: false,
            warmMusic: false,
            trendSoundEffect: false,
            revenueSoundEffect: false,
            horrifiedSoundEffect: false,
            laughSoundEffect: false,
            [option]: true,
        });
    };

    const [activeTextOption, setActiveTextOption] = useState({
        addText: true,
        trendingEffect: false,
        basicEffect: false,
        multicolorEffect: false,

    });

    const handleMenuTextOptionClick = (option) => {
        setActiveTextOption({
            addText: false,
            trendingEffect: false,
            basicEffect: false,
            multicolorEffect: false,
            [option]: true,
        });
    };

    const [activeStickerOption, setActiveStickerOption] = useState({
        trendingSticker: true,
        easterHolidaySticker: false,
        funSticker: false,
        trollFaceSticker: false,
        gamingSticker: false,
        emojiSticker: false,
    });

    const handleMenuStickerOptionClick = (option) => {
        setActiveStickerOption({
            trendingSticker: false,
            easterHolidaySticker: false,
            funSticker: false,
            trollFaceSticker: false,
            gamingSticker: false,
            emojiSticker: false,
            [option]: true,
        });
    };

    const [activeEffectOption, setActiveEffectOption] = useState({
        trendingVideoEffect: true,
        nightclubVideoEffect: false,
        lensVideoEffect: false,
        retroVideoEffect: false,
        tvVideoEffect: false,
        starVideoEffect: false,
        trendingBodyEffect: false,
        moodBodyEffect: false,
        maskBodyEffect: false,
        selfieBodyEffect: false,
    });

    const handleMenuEffectOptionClick = (option) => {
        setActiveEffectOption({
            trendingVideoEffect: false,
            nightclubVideoEffect: false,
            lensVideoEffect: false,
            retroVideoEffect: false,
            tvVideoEffect: false,
            starVideoEffect: false,
            trendingBodyEffect: false,
            moodBodyEffect: false,
            maskBodyEffect: false,
            selfieBodyEffect: false,
            [option]: true,
        });
    };

    const [activeFilterOption, setActiveFilterOption] = useState({
        featuredFilter: true,
        lifeFilter: false,
        sceneryFilter: false,
        moviesFilter: false,
        retroFilter: false,
        styleFilter: false,
    });

    const handleMenuFilterOptionClick = (option) => {
        setActiveFilterOption({
            featuredFilter: false,
            lifeFilter: false,
            sceneryFilter: false,
            moviesFilter: false,
            retroFilter: false,
            styleFilter: false,
            [option]: true,
        });
    };

    const isVideo = (fileName) => {
        if (!fileName) {
            return false;
        }
        const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
        return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        try {
            const random = uuidv4();
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
            const {data, error} = await supabase
                .storage
                .from('video_files')
                .upload(`${projectId}/${random}_${cleanFileName}`, file);

            if (error) {
                throw error;
            }

            const {data: publicURL} = supabase
                .storage
                .from('video_files')
                .getPublicUrl(`${projectId}/${random}_${cleanFileName}`);

            if (!publicURL) {
                alert('Failed to get public URL');
                return;
            }

            setVideoFile(file);
            if (isVideo(file.name)) {
                const videoURL = URL.createObjectURL(file);
                const videoElement = document.createElement('video');
                videoElement.src = videoURL;

                videoElement.addEventListener('loadedmetadata', async () => {
                    const formData = new FormData();
                    formData.append('project', projectId);
                    formData.append('video_url', publicURL.publicUrl);
                    formData.append('name', cleanFileName);
                    formData.append('duration', videoElement.duration);
                    const response = await axios.post('http://localhost:8000/myapp/upload_video/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    fetchVideo(projectId, setListVideo);
                    if (response.status === 201) {
                        alert('File uploaded and saved successfully!');
                    } else {
                        alert('Failed to save video details to database');
                    }
                });

            } else if (file) {
                const formData = new FormData();
                formData.append('project', projectId);
                formData.append('video_url', publicURL.publicUrl);
                formData.append('name', cleanFileName);
                formData.append('duration', 5);
                const response = await axios.post('http://localhost:8000/myapp/upload_video/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },

                });

                fetchVideo(projectId, setListVideo);
                if (response.status === 201) {
                    alert('File uploaded and saved successfully!');
                } else {
                    alert('Failed to save video details to database');
                }
            }


        } catch (error) {
            console.error('Error uploading file:', error.message);
            alert('Error uploading file');
        }
    };

    const handleDrop = (e, timelineIndex = null) => {
        e.preventDefault();
        const dropZone = document.querySelector('.timeline-dropzone');
        dropZone.classList.remove('drag-over');
        const type = e.dataTransfer.getData("type");
        const content = e.dataTransfer.getData("text/plain");


        const videoUrl = e.dataTransfer.getData("videoUrl");
        const fileName = e.dataTransfer.getData("fileName");
        const text = e.dataTransfer.getData("text/plain");
        const effect = e.dataTransfer.getData("text/plain");
        const filter = e.dataTransfer.getData("text/plain");
        const audioUrl = e.dataTransfer.getData("audioUrl");
        const stickerUrl = e.dataTransfer.getData("stickerUrl");



        if (videoUrl && fileName) {
            setVideoUrl(videoUrl);
            setCurrentTime(0);
            handleDropVideo(e, timelineIndex);
        } else if (stickerUrl) {
            handleDropSticker(e, timelineIndex);
        } else if (audioUrl) {
            let foundAudio = null;

            for (let category in audioFiles) {
                if (audioFiles[category]) {
                    const audio = audioFiles[category].find(audio => audio.url === audioUrl.url);
                    if (audio) {
                        foundAudio = audio;
                        break;
                    }
                }
            }

            if (foundAudio) {
                handleDropAudio(e, timelineIndex, foundAudio);
            } else {
                console.error("Audio not found");
            }
        } else if (type === "text") {
            handleDropText(e, timelineIndex);
        } else if (type === "effect") {
            handleDropEffect(e, timelineIndex);
        } else if (type === "filter") {
            handleDropFilter(e, timelineIndex);
        }


        if (seekBarRef.current) {
      seekBarRef.current.style.pointerEvents = 'auto';
      console.log(seekBarRef.current.style.pointerEvents)
    }

    };

    const handleDragStart = (e, item, timelineIndex, type) => {
        if (seekBarRef.current) {
      seekBarRef.current.style.pointerEvents = 'none';
      console.log(seekBarRef.current.style.pointerEvents)
    }
        if (isResizing) {
            e.preventDefault();
            return;
        }
        const idKey = type === "video" ? "videoId" : type === "text" ? "textId" : type === "sticker" ? "stickerId" : type === "effect" ? "effectId" : type === "filter" ? "filterId" : "audioId";
        const urlKey = type === "video" ? "videoUrl" : type === "text" ? "text/plain" : type === "sticker" ? "stickerUrl" : type === "effect" ? "text/plain" : type === "filter" ? "text/plain" : "audioUrl";

        if (type === "video") {
            e.dataTransfer.setData(urlKey, item.video_url || item.url);
        } else if (type === "audio") {
            e.dataTransfer.setData(urlKey, item.audio_file || item.url);
        } else if (type === "sticker") {
            e.dataTransfer.setData(urlKey, item.sticker_file || item.url);
        } else if (type === "text") {
            e.dataTransfer.setData("type", "text");
            e.dataTransfer.setData(urlKey, item.content || item.url);
            e.dataTransfer.setData("style", JSON.stringify(item.style));
        } else if (type === "effect") {
            e.dataTransfer.setData("type", "effect");
            e.dataTransfer.setData("config", JSON.stringify(item.config));
        } else if (type === "filter") {
            e.dataTransfer.setData("type", "filter");
            e.dataTransfer.setData("config", JSON.stringify(item.config));
        } else {
            e.dataTransfer.setData(urlKey, type === "text" ? item.content : item.url);
        }
        e.dataTransfer.setData("image", item.image || null);
        e.dataTransfer.setData("fileName", item.name || item.fileName);
        e.dataTransfer.setData(idKey, item.id || uuidv4());
        e.dataTransfer.setData("instanceId", item.instanceId || uuidv4());
        e.dataTransfer.setData("duration", item.duration || 5);

        const selectedHandlers = {
            "video": setSelectedVideo,
            "text": setSelectedText,
            "audio": setSelectedAudio,
            "sticker": setSelectedSticker,
            "effect": setSelectedEffect,
            "filter": setSelectedFilter,
        };
        selectedHandlers[type]?.({...item, timelineIndex});
    };

    const handleDropVideo = (e, timelineIndex = null) => {
        e.preventDefault();
        const videoUrl = e.dataTransfer.getData("videoUrl");
        const fileName = e.dataTransfer.getData("fileName");
        const videoId = e.dataTransfer.getData("videoId");
        const instanceId = e.dataTransfer.getData("instanceId");
        const video = listVideo.find(video => video.video_url === videoUrl);
        const duration = video.duration;


        const totalTimelineDuration = Math.max(totalDuration, 30);
        const segmentWidth = (duration / totalTimelineDuration) * 100;

        setTimelineDuration(duration);
        setTimestamps(generateTimestamps(totalTimelineDuration));

        if (!video) {
            console.error("Video not found in listVideo.");
            return;
        }

        const dropX = e.clientX - e.target.getBoundingClientRect().left;
        const timelineWidth = e.target.clientWidth;
        const dropPositionPercentage = (dropX / timelineWidth) * 100;

        const startTime = (dropPositionPercentage / 100) * totalTimelineDuration;
        const endTime = startTime + duration;

        setTimelineVideos((prevTimelineVideos) => {
            const updatedTimelineVideos = [...prevTimelineVideos];

            const newVideoSegment = {
                instanceId: instanceId,
                id: videoId,
                url: videoUrl,
                fileName,
                position: dropPositionPercentage,
                width: segmentWidth,
                startTime: startTime,
                duration: duration,
                endTime: endTime,
                scale: 100,
                scaleWidth: 100,
                scaleHeight: 100,
                positionX: 0,
                positionY: 0,
                rotate: 0,
                opacity: 100,
                voice: 0,
                speed: 1,
            };

            if (selectedVideo.timelineIndex === timelineIndex) {
                updatedTimelineVideos[timelineIndex].videos = updatedTimelineVideos[timelineIndex].videos.map(video => {
                    if (video.instanceId === selectedVideo.instanceId) {
                        return {
                            ...video,
                            position: dropPositionPercentage,
                        };
                    }

                    return video;
                });

            } else if (selectedVideo.timelineIndex !== null &&
                selectedVideo.timelineIndex !== undefined &&
                selectedVideo.timelineIndex !== timelineIndex &&
                updatedTimelineVideos[selectedVideo.timelineIndex]) {

                if (selectedVideo.timelineIndex !== null && selectedVideo.timelineIndex !== undefined) {
                    updatedTimelineVideos[selectedVideo.timelineIndex].videos = updatedTimelineVideos[selectedVideo.timelineIndex].videos.filter(video => video.instanceId !== selectedVideo.instanceId);
                }
                if (updatedTimelineVideos[selectedVideo.timelineIndex].videos.length === 0) {
                    delete updatedTimelineVideos[selectedVideo.timelineIndex];
                }
            }

            if (timelineIndex === null) {
                updatedTimelineVideos.push({
                    videos: [newVideoSegment],
                });
            } else if (updatedTimelineVideos[timelineIndex] && !updatedTimelineVideos[timelineIndex].videos.some(video => video.instanceId === selectedVideo.instanceId)) {
                updatedTimelineVideos[timelineIndex].videos.push(newVideoSegment);
            }

            if (updatedTimelineVideos.length > 0 && updatedTimelineVideos[0].videos.length > 0) {
                updatedTimelineVideos[0].videos[0].position = 0;
                updatedTimelineVideos[0].videos[0].startTime = 0;
                updatedTimelineVideos[0].videos[0].endTime = duration;
            }
            return updatedTimelineVideos;
        });
    };

    const handleDropText = (e, timelineIndex = null) => {
        e.preventDefault();

        const content = e.dataTransfer.getData("text/plain");
        const textId = e.dataTransfer.getData("textId");
        const instanceId = e.dataTransfer.getData("instanceId");
        const image = e.dataTransfer.getData("image");
        const style = JSON.parse(e.dataTransfer.getData("style"));
        const duration = 5;

        const dropX = e.clientX - e.target.getBoundingClientRect().left;
        const timelineWidth = e.target.clientWidth;
        const dropPositionPercentage = (dropX / timelineWidth) * 100;

        const totalTimelineDuration = Math.max(totalDuration, 30);
        const segmentWidth = (duration / totalTimelineDuration) * 100;

        const startTime = (dropPositionPercentage / 100)* totalTimelineDuration;
        const endTime = startTime + duration;

        const x = (videoWidth / 2) - (style?.fontSize ? parseInt(style.fontSize) * content.length / 2 : 8 * content.length / 2);
        const y = (videoHeight / 2) - (style?.fontSize ? parseInt(style.fontSize) / 2 : 8);

        setTimelinesText((prevTimelinesText) => {
            const updatedTimelinesText = [...prevTimelinesText];

            const newTextSegment = {
                instanceId: instanceId,
                id: textId,
                image,
                content,
                position: dropPositionPercentage,
                width: segmentWidth,
                style: style,
                startTime: startTime,
                duration: duration,
                endTime: endTime,

                fontStyle: "arial",
                fontSize: parseInt(style.fontSize),
                pattern: "normal",
                case: "normal",

                scale: 100,
                scaleWidth: 100,
                scaleHeight: 100,
                positionX: x,
                positionY: y,
                rotate: 0,
                opacity: 100,
                voice: 0,
                speed: 1,
                blod: false,
                underline: false,
                italic: false,
                styleOfText: styleOfText,
            };

            if (selectedText.timelineIndex === timelineIndex) {
                updatedTimelinesText[timelineIndex].texts = updatedTimelinesText[timelineIndex].texts.map(text => {
                    if (text.instanceId === selectedText.instanceId) {
                        return {
                            ...text,
                            position: dropPositionPercentage,
                            startTime: startTime,
                            endTime: endTime
                        };
                    }
                    return text;
                });

            } else if (selectedText.timelineIndex !== null &&
                selectedText.timelineIndex !== undefined &&
                selectedText.timelineIndex !== timelineIndex &&
                updatedTimelinesText[selectedText.timelineIndex]) {

                if (selectedText.timelineIndex !== null && selectedText.timelineIndex !== undefined) {
                    updatedTimelinesText[selectedText.timelineIndex].texts = updatedTimelinesText[selectedText.timelineIndex].texts.filter(text => text.instanceId !== selectedText.instanceId);
                }
                if (updatedTimelinesText[selectedText.timelineIndex].texts.length === 0) {
                    delete updatedTimelinesText[selectedText.timelineIndex];
                }
            }

            if (timelineIndex === null) {
                updatedTimelinesText.push({
                    texts: [newTextSegment],
                });
            } else if (updatedTimelinesText[timelineIndex] && !updatedTimelinesText[timelineIndex].texts.some(text => text.instanceId === selectedText.instanceId)) {
                updatedTimelinesText[timelineIndex].texts.push(newTextSegment);
            }

            return updatedTimelinesText;
        });
    };

    const handleDropAudio = (e, timelineIndex = null, audio) => {
        e.preventDefault();

        const audioUrl = e.dataTransfer.getData("audioUrl");
        const fileName = e.dataTransfer.getData("fileName");
        const audioId = e.dataTransfer.getData("audioId");
        const instanceId = e.dataTransfer.getData("instanceId");
        const image = e.dataTransfer.getData("image");
        const duration = parseFloat(e.dataTransfer.getData("duration"));

        if (!audio) {
            console.error("Audio not found in audioFiles");
            return;
        }

        const dropX = e.clientX - e.target.getBoundingClientRect().left;
        const timelineWidth = e.target.clientWidth;
        const dropPositionPercentage = (dropX / timelineWidth) * 100;

        const totalTimelineDuration = Math.max(totalDuration, 30);
        const segmentWidth = (duration / totalTimelineDuration) * 100;


        const startTime = (dropPositionPercentage / 100)* totalTimelineDuration;
        const endTime = startTime + duration;

        setTimelinesAudio((prevTimelinesAudio) => {
            const updatedTimelinesAudio = [...prevTimelinesAudio];

            const newAudioSegment = {
                instanceId: instanceId,
                id: audioId,
                url: audioUrl,
                fileName,
                image,
                position: dropPositionPercentage,
                width: segmentWidth,
                startTime: startTime,
                duration: duration,
                endTime: endTime,
                voice: 0,
                speed: 1,
            };

            if (selectedAudio.timelineIndex === timelineIndex) {
                updatedTimelinesAudio[timelineIndex].audios = updatedTimelinesAudio[timelineIndex].audios.map(audio => {
                    if (audio.instanceId === selectedAudio.instanceId) {
                        return {
                            ...audio,
                            position: dropPositionPercentage,
                            startTime: startTime,
                            endTime: endTime
                        };
                    }
                    return audio;
                });
            } else if (selectedAudio.timelineIndex !== null &&
                selectedAudio.timelineIndex !== undefined &&
                selectedAudio.timelineIndex !== timelineIndex &&
                updatedTimelinesAudio[selectedAudio.timelineIndex]) {

                if (selectedAudio.timelineIndex !== null && selectedAudio.timelineIndex !== undefined) {
                    updatedTimelinesAudio[selectedAudio.timelineIndex].audios = updatedTimelinesAudio[selectedAudio.timelineIndex].audios.filter(audio => audio.instanceId !== selectedAudio.instanceId);
                }
                if (updatedTimelinesAudio[selectedAudio.timelineIndex].audios.length === 0) {
                    delete updatedTimelinesAudio[selectedAudio.timelineIndex];
                }
            }


            if (timelineIndex === null) {
                updatedTimelinesAudio.push({
                    audios: [newAudioSegment],
                });
            } else if (updatedTimelinesAudio[timelineIndex] && !updatedTimelinesAudio[timelineIndex].audios.some(audio => audio.instanceId === selectedAudio.instanceId)) {
                updatedTimelinesAudio[timelineIndex].audios.push(newAudioSegment);
            }

            return updatedTimelinesAudio;
        });
    };

    const handleDropSticker = (e, timelineIndex = null) => {
        e.preventDefault();

        const stickerUrl = e.dataTransfer.getData("stickerUrl");
        const stickerId = e.dataTransfer.getData("stickerId");
        const duration = 5;


        const img = new window.Image();
        img.src = stickerUrl;

        img.onload = () => {
            const stickerWidth = img.width;
            const stickerHeight = img.height;


            const x = (videoWidth / 2) - (stickerWidth / 2);
            const y = (videoHeight / 2) - (stickerHeight / 2);


            const dropX = e.clientX - e.target.getBoundingClientRect().left;
            const timelineWidth = e.target.clientWidth;
            const dropPositionPercentage = (dropX / timelineWidth) * 100;

            const totalTimelineDuration = Math.max(totalDuration, 30);
            const segmentWidth = (duration / totalTimelineDuration) * 100;

            const startTime = (dropPositionPercentage / 100)* totalTimelineDuration;
            const endTime = startTime + duration;

            setTimelinesSticker((prevTimelinesStickers) => {
                const updatedTimelinesStickers = [...prevTimelinesStickers];

                const newStickerSegment = {
                    id: stickerId,
                    url: stickerUrl,
                    position: dropPositionPercentage,
                    width: segmentWidth,
                    startTime: startTime,
                    duration: duration,
                    endTime: endTime,
                    scale: 100,
                    scaleWidth: 100,
                    scaleHeight: 100,
                    positionX: x,
                    positionY: y,
                    rotate: 0,
                };

                if (selectedSticker.timelineIndex === timelineIndex) {
                    updatedTimelinesStickers[timelineIndex].stickers = updatedTimelinesStickers[timelineIndex].stickers.map(sticker => {
                        if (sticker.id === selectedSticker.id) {
                            return {
                                ...sticker,
                                position: dropPositionPercentage,
                                startTime: startTime,
                                endTime: endTime
                            };
                        }

                        return sticker;
                    });

                } else if (selectedSticker.timelineIndex !== null &&
                    selectedSticker.timelineIndex !== undefined &&
                    selectedSticker.timelineIndex !== timelineIndex &&
                    updatedTimelinesStickers[selectedSticker.timelineIndex]) {

                    if (selectedSticker.timelineIndex !== null && selectedSticker.timelineIndex !== undefined) {
                        updatedTimelinesStickers[selectedSticker.timelineIndex].stickers = updatedTimelinesStickers[selectedSticker.timelineIndex].stickers.filter(v => v.id !== selectedSticker.id);
                    }
                    if (updatedTimelinesStickers[selectedSticker.timelineIndex].stickers.length === 0) {
                        delete updatedTimelinesStickers[selectedSticker.timelineIndex];
                    }
                }


                if (timelineIndex === null) {
                    updatedTimelinesStickers.push({
                        stickers: [newStickerSegment],
                    });
                } else if (updatedTimelinesStickers[timelineIndex] && !updatedTimelinesStickers[timelineIndex].stickers.some(sticker => sticker.id === selectedSticker.id)) {
                    updatedTimelinesStickers[timelineIndex].stickers.push(newStickerSegment);
                }

                return updatedTimelinesStickers;
            });

        };

        img.onerror = () => {
            console.error("Error loading sticker image");
        };
    };

    const handleDropEffect = (e, timelineIndex = null) => {
        e.preventDefault();

        const effectId = e.dataTransfer.getData("effectId");
        const instanceId = e.dataTransfer.getData("instanceId");
        const config = JSON.parse(e.dataTransfer.getData("config"));
        const name = e.dataTransfer.getData("fileName");
        const duration = 5;
        const image = e.dataTransfer.getData("image");

        const dropX = e.clientX - e.target.getBoundingClientRect().left;
        const timelineWidth = e.target.clientWidth;
        const dropPositionPercentage = (dropX / timelineWidth) * 100;

        const totalTimelineDuration = Math.max(totalDuration, 30);
        const segmentWidth = (duration / totalTimelineDuration) * 100;

        const startTime = (dropPositionPercentage / 100)* totalTimelineDuration;
        const endTime = startTime + duration;

        setTimelinesEffect((prevTimelinesEffect) => {
            const updatedTimelinesEffect = [...prevTimelinesEffect];

            const newEffectSegment = {
                instanceId: instanceId,
                id: effectId,
                name: name,
                config: config,
                image: image,
                position: dropPositionPercentage,
                width: segmentWidth,
                startTime: startTime,
                duration: duration,
                endTime: endTime
            };

            if (selectedEffect.timelineIndex === timelineIndex) {
                updatedTimelinesEffect[timelineIndex].effects = updatedTimelinesEffect[timelineIndex].effects.map(effect => {
                    if (effect.instanceId === selectedEffect.instanceId) {
                        return {
                            ...effect,
                            position: dropPositionPercentage,
                            startTime: startTime,
                            endTime: endTime
                        };
                    }
                    return effect;
                });
            } else if (selectedEffect.timelineIndex !== null &&
                selectedEffect.timelineIndex !== undefined &&
                selectedEffect.timelineIndex !== timelineIndex &&
                updatedTimelinesEffect[selectedEffect.timelineIndex]) {

                updatedTimelinesEffect[selectedEffect.timelineIndex].effects = updatedTimelinesEffect[selectedEffect.timelineIndex].effects.filter(effect => effect.instanceId !== selectedEffect.instanceId);

                if (updatedTimelinesEffect[selectedEffect.timelineIndex].effects.length === 0) {
                    delete updatedTimelinesEffect[selectedEffect.timelineIndex];
                }
            }

            if (timelineIndex === null) {
                updatedTimelinesEffect.push({
                    effects: [newEffectSegment],
                });
            } else if (updatedTimelinesEffect[timelineIndex] && !updatedTimelinesEffect[timelineIndex].effects.some(effect => effect.instanceId === selectedEffect.instanceId)) {
                updatedTimelinesEffect[timelineIndex].effects.push(newEffectSegment);
            }

            return updatedTimelinesEffect;
        });
    };

    const handleDropFilter = (e, timelineIndex = null) => {
        e.preventDefault();

        const filterId = e.dataTransfer.getData("filterId");
        const instanceId = e.dataTransfer.getData("instanceId");
        const config = JSON.parse(e.dataTransfer.getData("config"));
        const name = e.dataTransfer.getData("fileName");
        const duration = 5;
        const image = e.dataTransfer.getData("image");

        const dropX = e.clientX - e.target.getBoundingClientRect().left;
        const timelineWidth = e.target.clientWidth;
        const dropPositionPercentage = (dropX / timelineWidth) * 100;

        const totalTimelineDuration = Math.max(totalDuration, 30);
        const segmentWidth = (duration / totalTimelineDuration) * 100;

        const startTime = (dropPositionPercentage / 100)* totalTimelineDuration;
        const endTime = startTime + duration;

        setTimelinesFilter((prevTimelinesFilter) => {
            const updatedTimelinesFilter = [...prevTimelinesFilter];

            const newFilterSegment = {
                instanceId: instanceId,
                id: filterId,
                name: name,
                config: config,
                image: image,
                position: dropPositionPercentage,
                width: segmentWidth,
                startTime: startTime,
                duration: duration,
                endTime: endTime
            };

            if (selectedFilter.timelineIndex === timelineIndex) {
                updatedTimelinesFilter[timelineIndex].filters = updatedTimelinesFilter[timelineIndex].filters.map(filter => {
                    if (filter.instanceId === selectedFilter.instanceId) {
                        return {
                            ...filter,
                            position: dropPositionPercentage,
                            startTime: startTime,
                            endTime: endTime
                        };
                    }
                    return filter;
                });
            } else if (selectedFilter.timelineIndex !== null &&
                selectedFilter.timelineIndex !== undefined &&
                selectedFilter.timelineIndex !== timelineIndex &&
                updatedTimelinesFilter[selectedFilter.timelineIndex]) {

                updatedTimelinesFilter[selectedFilter.timelineIndex].filters = updatedTimelinesFilter[selectedFilter.timelineIndex].filters.filter(filter => filter.instanceId !== selectedFilter.instanceId);

                if (updatedTimelinesFilter[selectedFilter.timelineIndex].filters.length === 0) {
                    delete updatedTimelinesFilter[selectedFilter.timelineIndex];
                }
            }

            if (timelineIndex === null) {
                updatedTimelinesFilter.push({
                    filters: [newFilterSegment],
                });
            } else if (updatedTimelinesFilter[timelineIndex] && !updatedTimelinesFilter[timelineIndex].filters.some(filter => filter.instanceId === selectedFilter.instanceId)) {
                updatedTimelinesFilter[timelineIndex].filters.push(newFilterSegment);
            }

            return updatedTimelinesFilter;
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const element = e.target;
        if (element && element.classList) {
            const dropZone = document.querySelector('.timeline-dropzone');
            dropZone.classList.add('drag-over');
        }

    };

    const handleDragLeave = (e) => {
        const dropZone = document.querySelector('.timeline-dropzone');
        dropZone.classList.remove('drag-over');
    };

    const handleProgress = (progress) => {
        if (timelineVideos.length > 0) {
            if (allVideos[currentVideoIndex].duration === currentTime) {
                setAccumulatedTime(currentTime)
                setCurrentTime(0);
            }
        }
        if (progress.playedSeconds !== undefined && progress.playedSeconds !== null) {
            setCurrentTime(accumulatedTime + progress.playedSeconds);
        }
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handleTextChange = (e) => {
        setTextToAdd(e.target.value);
        setTextContent(e.target.value);
    };

    const handleExport = async (currentTotalDuration) => {
        setIsProcessing(true);
        const durationToSend = currentTotalDuration || totalDuration;
        const formData = new FormData();

        formData.append('total_duration', durationToSend);

        if (timelineVideos.length > 0) {
            for (const timeline of timelineVideos) {
                for (const video of timeline.videos) {
                    formData.append('videos', JSON.stringify(video));
                }
            }
        }


        if (timelinesAudio.length > 0) {
            for (const timeline of timelinesAudio) {
                for (const audio of timeline.audios) {
                    formData.append('audios', JSON.stringify(audio));
                }
            }
        }

        if (timelinesText.length > 0) {
            for (const timeline of timelinesText) {
                for (const text of timeline.texts) {
                    formData.append('texts', JSON.stringify(text));
                }
            }
        }


        if (timelinesSticker.length > 0) {
            for (const timeline of timelinesSticker) {
                for (const sticker of timeline.stickers) {
                    formData.append('stickers', JSON.stringify(sticker));
                }
            }
        }


        if (timelinesEffect.length > 0) {
            for (const timeline of timelinesEffect) {
                for (const effect of timeline.effects) {
                    formData.append('effects', JSON.stringify(effect));
                }
            }
        }

        if (timelinesFilter.length > 0) {
            for (const timeline of timelinesFilter) {
                for (const filter of timeline.filters) {
                    formData.append('filters', JSON.stringify(filter));
                }
            }
        }


        try {
            const response = await axios.post('http://localhost:8000/myapp/export_video/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const videoUrl = `http://localhost:8000${response.data.merged_video_url}?t=${Date.now()}`;
                setVideoUrlTranslate(videoUrl);

const videoElement = document.createElement("video");
videoElement.src = videoUrl;

videoElement.addEventListener('loadedmetadata', () => {
    setTotalDuration(videoElement.duration);  // Lấy độ dài video sau khi metadata đã tải xong
});
            } else {
                console.error('Error exporting video');
            }
        } catch (error) {
            setVideoUrlTranslate("");
            setCurrentTime(0);
            setTotalDuration(0);
            console.error('Error:', error);
        } finally {
        setIsProcessing(false);  // Re-enable updates after export completes
    }
    };

    const handleDownloadVideo = () => {
    if (videoUrlTranslate) {
        const link = document.createElement('a');
        link.href = videoUrlTranslate;
        link.download = 'exported_video.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        console.error('No video URL available');
    }
};


    const handleSaveEditSession = async () => {
        const actions = {
            videos: timelineVideos,
            texts: timelinesText,
            stickers: timelinesSticker,
            audios: timelinesAudio,
            effects: timelinesEffect,
            filters: timelinesFilter,
        };

        const response = await axios.post('http://localhost:8000/myapp/save_edit_session/', {
            project_id: projectId,
            actions: actions,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            navigate('/user');
        } else {
            console.error('Failed to save changes');
        }
    };

    const loadEditSession = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/myapp/edit_session/${projectId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const {actions, message} = response.data;

                if (message) {
                    setTimelineVideos([]);
                    setTimelinesText([]);
                    setTimelinesSticker([]);
                    setTimelinesAudio([]);
                    setTimelinesEffect([]);
                    setTimelinesFilter([]);
                } else {
                    setTimelineVideos(actions.videos || []);
                    setTimelinesText(actions.texts || []);
                    setTimelinesSticker(actions.stickers || []);
                    setTimelinesAudio(actions.audios || []);
                    setTimelinesEffect(actions.effects || []);
                    setTimelinesFilter(actions.filters || []);
                }
            } else {
                console.error('Failed to load edit session');
            }
        } catch (error) {
            console.error('Error loading edit session:', error);
        }
    };

    const handleDragEnd = (e, index, type) => {

        const x = (e.target.x() / videoWidth) * 100;
        const y = (e.target.y() / videoHeight) * 100;

        if (type === "audio") {
            setTimelinesAudio((prev) => {
                const updated = [...prev];
                updated[index].position = {x, y};
                return updated;
            });
        } else if (type === "text") {
            setTimelinesText((prev) => {
                const updated = [...prev];
                updated[index].position = {x, y};
                return updated;
            });
        } else if (type === "effect") {
            setTimelinesEffect((prev) => {
                const updated = [...prev];
                updated[index].position = {x, y};
                return updated;
            });
        } else if (type === "sticker") {
            setTimelinesSticker((prev) => {
                const updated = [...prev];
                updated[index].position = {x, y};
                return updated;
            });
        } else if (type === "filter") {
            setTimelinesFilter((prev) => {
                const updated = [...prev];
                updated[index].position = {x, y};
                return updated;
            });
        }
    };

   const generateTimestamps = (totalDuration, interval = 5) => {
    const timestamps = [];
    const duration = Math.max(totalDuration, 30);

    for (let i = 0; i <= duration; i += interval) {
        const minutes = Math.floor(i / 60).toString().padStart(2, '0');
        const seconds = (i % 60).toString().padStart(2, '0');
        timestamps.push(`${minutes}:${seconds}`);
    }

    // Nếu thời gian cuối cùng không phải là bội số của interval, thêm mốc thời gian cuối cùng
    if (duration % interval !== 0) {
        const finalMinutes = Math.floor(duration / 60).toString().padStart(2, '0');
        const finalSeconds = (duration % 60).toString().padStart(2, '0');
        timestamps.push(`${finalMinutes}:${finalSeconds}`);
    }

    return timestamps;
};

    const calculateLeftValue = (index, totalSegments) => {
        return `${(index / (totalSegments - 1)) * 100}%`;
    };

    const handleVideoEnd = () => {
        if (currentVideoIndex + 1 < allVideos.length) {
            setCurrentVideoIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                return nextIndex < allVideos.length ? nextIndex : 0;
            });
            setAccumulatedTime(accumulatedTime + allVideos[currentVideoIndex].duration);
        } else if (currentTime + accumulatedTime >= totalDuration) {
            setAccumulatedTime(0);
            setCurrentTime(0);
            setCurrentVideoIndex(0);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;

                videoRef.current.oncanplay = () => {
                    videoRef.current.play();
                    videoRef.current.oncanplay = null;
                };
            }
        } else {

        }
    };

    const [totalCurrentTime, setTotalCurrentTime] = useState(0)

    useEffect(() => {
        setTotalCurrentTime(accumulatedTime + currentTime)
    }, [accumulatedTime, currentTime])


    const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    const updateWidthTimeline = (totalTimelineDuration) => {
        if (isProcessing) return;

    // Cập nhật width và position cho timelineVideos
    const updatedTimelineVideos = timelineVideos.map(timeline => {
        const updatedVideos = timeline.videos.map(video => {
            const videoWidth = (video.duration / totalTimelineDuration) * 100;
            const videoPosition = (video.startTime / totalTimelineDuration) * 100;
            console.log(`videoWidth: ${videoWidth}`)
            console.log(`videoPosition: ${videoPosition}`)

            return {
                ...video,
                width: videoWidth,
                position: videoPosition
            };
        });

        return {
            ...timeline,
            videos: updatedVideos
        };
    });

    // Cập nhật width và position cho timelinesAudio
    const updatedTimelinesAudio = timelinesAudio.map(timeline => {
        const updatedAudios = timeline.audios.map(audio => {
            const audioWidth = (audio.duration / totalTimelineDuration) * 100;
            const audioPosition = (audio.startTime / totalTimelineDuration) * 100;
            console.log(`audioWidth: ${audioWidth}`)
            console.log(`audioPosition: ${audioPosition}`)

            return {
                ...audio,
                width: audioWidth,
                position: audioPosition
            };
        });

        return {
            ...timeline,
            audios: updatedAudios
        };
    });

    // Cập nhật width và position cho timelinesText
    const updatedTimelinesText = timelinesText.map(timeline => {
        const updatedTexts = timeline.texts.map(text => {
            const textWidth = (text.duration / totalTimelineDuration) * 100;
            const textPosition = (text.startTime / totalTimelineDuration) * 100;
            console.log(`textWidth: ${textWidth}`)
            console.log(`textPosition: ${textPosition}`)

            return {
                ...text,
                width: textWidth,
                position: textPosition
            };
        });

        return {
            ...timeline,
            texts: updatedTexts
        };
    });

    // Cập nhật width và position cho timelinesSticker
    const updatedTimelinesSticker = timelinesSticker.map(timeline => {
        const updatedStickers = timeline.stickers.map(sticker => {
            const stickerWidth = (sticker.duration / totalTimelineDuration) * 100;
            const stickerPosition = (sticker.startTime / totalTimelineDuration) * 100;
            console.log(`stickerWidth: ${stickerWidth}`)
            console.log(`stickerPosition: ${stickerPosition}`)

            return {
                ...sticker,
                width: stickerWidth,
                position: stickerPosition
            };
        });

        return {
            ...timeline,
            stickers: updatedStickers
        };
    });

    // Cập nhật width và position cho timelinesEffect
    const updatedTimelinesEffect = timelinesEffect.map(timeline => {
        const updatedEffects = timeline.effects.map(effect => {
            const effectWidth = (effect.duration / totalTimelineDuration) * 100;
            const effectPosition = (effect.startTime / totalTimelineDuration) * 100;
            console.log(`effectWidth: ${effectWidth}`)
            console.log(`effectPosition: ${effectPosition}`)

            return {
                ...effect,
                width: effectWidth,
                position: effectPosition
            };
        });

        return {
            ...timeline,
            effects: updatedEffects
        };
    });

    // Cập nhật width và position cho timelinesFilter
    const updatedTimelinesFilter = timelinesFilter.map(timeline => {
        const updatedFilters = timeline.filters.map(filter => {
            const filterWidth = (filter.duration / totalTimelineDuration) * 100;
            const filterPosition = (filter.startTime / totalTimelineDuration) * 100;
            console.log(`filterWidth: ${filterWidth}`)
            console.log(`filterPosition: ${filterPosition}`)

            return {
                ...filter,
                width: filterWidth,
                position: filterPosition
            };
        });

        return {
            ...timeline,
            filters: updatedFilters
        };
    });

    // Cập nhật state nếu có thay đổi
    if (!deepEqual(timelineVideos, updatedTimelineVideos)) {
        setTimelineVideos(updatedTimelineVideos);
    }
    if (!deepEqual(timelinesAudio, updatedTimelinesAudio)) {
        setTimelinesAudio(updatedTimelinesAudio);
    }
    if (!deepEqual(timelinesText, updatedTimelinesText)) {
        setTimelinesText(updatedTimelinesText);
    }
    if (!deepEqual(timelinesSticker, updatedTimelinesSticker)) {
        setTimelinesSticker(updatedTimelinesSticker);
    }
    if (!deepEqual(timelinesEffect, updatedTimelinesEffect)) {
        setTimelinesEffect(updatedTimelinesEffect);
    }
    if (!deepEqual(timelinesFilter, updatedTimelinesFilter)) {
        setTimelinesFilter(updatedTimelinesFilter);
    }
    }

    const calculateTotalDuration = () => {
    if (timelineVideos.length === 0 && timelinesAudio.length === 0 && timelinesText.length === 0 && timelinesSticker.length === 0 && timelinesEffect.length === 0 && timelinesFilter.length === 0)
        return 0;

    // Gộp tất cả các timeline lại thành một mảng
    const allTimelines = [
        ...timelineVideos.map(timeline => timeline.videos),
        ...timelinesAudio.map(timeline => timeline.audios),
        ...timelinesText.map(timeline => timeline.texts),
        ...timelinesSticker.map(timeline => timeline.stickers),
        ...timelinesEffect.map(timeline => timeline.effects),
        ...timelinesFilter.map(timeline => timeline.filters)
    ].flat();

    // Lấy startTime nhỏ nhất
    const minStartTime = Math.min(...allTimelines.map(element => (element.position / 100) * 30));

    // Lấy endTime lớn nhất
    const maxEndTime = Math.max(...allTimelines.map(element => ((element.position / 100) * 30) + element.duration));

    const totalDuration = maxEndTime - minStartTime;
    const totalTimelineDuration = Math.max(totalDuration, 30);
    // updateWidthTimeline(totalTimelineDuration);
    const calculatedWidthTime = (totalDuration / totalTimelineDuration) * 100;

    console.log(`totalDuration: ${totalDuration}`);
    console.log(`totalTimelineDuration: ${totalTimelineDuration}`);
    console.log(`calculatedWidthTime: ${calculatedWidthTime}`);

    setWidthTime(calculatedWidthTime);

    return totalDuration;
};

    console.log(`widthTime: ${widthTime}`)


    const calculateTimeFromPosition = (position, totalWidth) => {
        const duration = Math.max(totalDuration, 30);
        return (position / 100) * duration;
    };

    const handleResizeStart = (e, timelineIndex, itemIndex, type, direction) => {
        e.preventDefault();
        isDragging = false;
        setIsResizing(true);
        setResizingInfo({timelineIndex, itemIndex, type, direction});

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        isDragging = true;
        if (isResizing && resizingInfo.timelineIndex !== null) {
            const timelineWidth = e.target ? e.target.clientWidth : 0;
            if (timelineWidth === 0) return;

            const dropX = e.clientX - e.target.getBoundingClientRect().left;
            const newPosition = Math.max(0, (dropX / timelineWidth) * 100);
            const {timelineIndex, itemIndex, type, direction} = resizingInfo;

            switch (type) {
                case "video":
                    setTimelineVideos((prevVideos) => {
                        const updatedVideos = [...prevVideos];
                        const video = updatedVideos[timelineIndex].videos[itemIndex];

                        if (direction === "right") {
                            const newWidth = Math.max(0, newPosition - video.position);
                            video.width = newWidth;
                            video.endTime = calculateTimeFromPosition(video.position + video.width, timelineWidth);
                            video.duration = video.endTime - video.startTime;

                        } else if (direction === "left") {
                            const delta = video.position - newPosition;
                            if (video.width + delta > 0) {
                                video.position = Math.max(0, newPosition);
                                video.width = Math.max(0, video.width + delta);
                            }
                            if (itemIndex === 0) {
                                video.startTime = 0;
                                video.position = 0;
                            } else {
                                video.startTime = calculateTimeFromPosition(video.position, timelineWidth);
                            }
                            video.endTime = calculateTimeFromPosition(video.position + video.width, timelineWidth);
                            video.duration = video.endTime - video.startTime;
                        }
                        return updatedVideos;
                    });
                    break;

                case "text":
                    setTimelinesText((prevText) => {
                        const updatedText = [...prevText];
                        const text = updatedText[timelineIndex].texts[itemIndex];

                        if (direction === "right") {
                            const newWidth = Math.max(0, newPosition - text.position);
                            text.width = newWidth;
                            text.endTime = calculateTimeFromPosition(text.position + text.width, timelineWidth);
                            text.duration = text.endTime - text.startTime;
                        } else if (direction === "left") {
                            const delta = text.position - newPosition;
                            if (text.width + delta > 0) {
                                text.position = Math.max(0, newPosition);
                                text.width = Math.max(0, text.width + delta);
                            }
                            text.startTime = calculateTimeFromPosition(text.position, timelineWidth);
                            text.endTime = calculateTimeFromPosition(text.position + text.width, timelineWidth);
                            text.duration = text.endTime - text.startTime;
                        }

                        return updatedText;
                    });
                    break;

                case "audio":
                    setTimelinesAudio((prevAudio) => {
                        const updatedAudio = [...prevAudio];
                        const audio = updatedAudio[timelineIndex].audios[itemIndex];

                        if (direction === "right") {
                            const newWidth = Math.max(0, newPosition - audio.position);
                            audio.width = newWidth;
                            audio.endTime = calculateTimeFromPosition(audio.position + audio.width, timelineWidth);
                            audio.duration = audio.endTime - audio.startTime;
                        } else if (direction === "left") {
                            const delta = audio.position - newPosition;
                            if (audio.width + delta > 0) {
                                audio.position = Math.max(0, newPosition);
                                audio.width = Math.max(0, audio.width + delta);
                                audio.startTime = calculateTimeFromPosition(audio.position, timelineWidth);
                                audio.endTime = calculateTimeFromPosition(audio.position + audio.width, timelineWidth);
                                audio.duration = audio.endTime - audio.startTime;
                            }
                        }

                        return updatedAudio;
                    });
                    break;

                case "sticker":
                    setTimelinesSticker((prevSticker) => {
                        const updatedSticker = [...prevSticker];
                        const sticker = updatedSticker[timelineIndex].stickers[itemIndex];

                        if (direction === "right") {
                            const newWidth = Math.max(0, newPosition - sticker.position);
                            sticker.width = newWidth;
                            sticker.endTime = calculateTimeFromPosition(sticker.position + sticker.width, timelineWidth);
                            sticker.duration = sticker.endTime - sticker.startTime;
                        } else if (direction === "left") {
                            const delta = sticker.position - newPosition;
                            if (sticker.width + delta > 0) {
                                sticker.position = Math.max(0, newPosition);
                                sticker.width = Math.max(0, sticker.width + delta);
                                sticker.startTime = calculateTimeFromPosition(sticker.position, timelineWidth);
                                sticker.endTime = calculateTimeFromPosition(sticker.position + sticker.width, timelineWidth);
                                sticker.duration = sticker.endTime - sticker.startTime;
                            }
                        }

                        return updatedSticker;
                    });
                    break;

                case "effect":
                    setTimelinesEffect((prevEffect) => {
                        const updatedEffect = [...prevEffect];
                        const effect = updatedEffect[timelineIndex].effects[itemIndex];

                        if (direction === "right") {
                            const newWidth = Math.max(0, newPosition - effect.position);
                            effect.width = newWidth;
                            effect.endTime = calculateTimeFromPosition(effect.position + effect.width, timelineWidth);
                            effect.duration = effect.endTime - effect.startTime;
                        } else if (direction === "left") {
                            const delta = effect.position - newPosition;
                            if (effect.width + delta > 0) {
                                effect.position = Math.max(0, newPosition);
                                effect.width = Math.max(0, effect.width + delta);
                                effect.startTime = calculateTimeFromPosition(effect.position, timelineWidth);
                                effect.endTime = calculateTimeFromPosition(effect.position + effect.width, timelineWidth);
                                effect.duration = effect.endTime - effect.startTime;
                            }
                        }

                        return updatedEffect;
                    });
                    break;

                case "filter":
                    setTimelinesFilter((prevFilter) => {
                        const updatedFilter = [...prevFilter];
                        const filter = updatedFilter[timelineIndex].filters[itemIndex];

                        if (direction === "right") {
                            const newWidth = Math.max(0, newPosition - filter.position);
                            filter.width = newWidth;
                            filter.endTime = calculateTimeFromPosition(filter.position + filter.width, timelineWidth);
                            filter.duration = filter.endTime - filter.startTime;
                        } else if (direction === "left") {
                            const delta = filter.position - newPosition;
                            if (filter.width + delta > 0) {
                                filter.position = Math.max(0, newPosition);
                                filter.width = Math.max(0, filter.width + delta);
                                filter.startTime = calculateTimeFromPosition(filter.position, timelineWidth);
                                filter.endTime = calculateTimeFromPosition(filter.position + filter.width, timelineWidth);
                                filter.duration = filter.endTime - filter.startTime;
                            }
                        }

                        return updatedFilter;
                    });
                    break;

                default:
                    break;
            }
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleClick = (item, type) => {
        setSelectedElement({ ...item, type });
    console.log({ ...item, type });
        switch (type) {
            case "video":
                setScaleValue(item.scale);
                setScaleValueWidth(item.scaleWidth);
                setScaleValueHeight(item.scaleHeight);
                setPositionX(item.positionX);
                setPositionY(item.positionY);
                setRotateValue(item.rotate);
                setOpacity(item.opacity);
                setVoiceValue(item.voice);
                setSpeedValue(item.speed);
                break;

            case "text":
                setTextContent(item.content)
                setFontText(item.fontStyle)
                setFontSizeText(item.fontSize)
                setPatternText(item.pattern)
                setCaseText(item.case)
                setScaleText(item.scale)
                setScaleWidthText(item.scaleWidth)
                setScaleHeightText(item.scaleHeight)
                setPositionXText(item.positionX)
                setPositionYText(item.positionY)
                setRotateText(item.rotate)
                setOpacityText(item.opacity)
                setBlod(item.blod)
                setUnderline(item.underline)
                setItalic(item.italic)
                setStyleOfText(item.styleOfText)
                break;

            case "audio":
                setVoiceValueAudio(item.voice);
                setSpeedValueAudio(item.speed);
                break;

            case "sticker":
                setScaleValueSticker(item.scale);
                setScaleValueWidthSticker(item.scaleWidth);
                setScaleValueHeightSticker(item.scaleHeight);
                setPositionXSticker(item.positionX);
                setPositionYSticker(item.positionY);
                setRotateValueSticker(item.rotate);
                setGifFileUrl(item.url);
                break;

            case "effect":
                setEffectName(item.name)
                break;

            case "filter":
                setFilterName(item.name)
                break;

            default:
                break;
        }
    };

    const handleDoubleClick = (item, type) => {
        console.log(`Clicked on: ${item.fileName || item.content || item.url}`);
    };

    const updateSliderWidthValue = (e) => {
        const newScaleValueWidth = parseFloat(e.target.value);
        setScaleValueWidth(newScaleValueWidth);
    };

    const updateSliderWidthValueSticker = (e) => {
        const newScaleValueWidth = parseFloat(e.target.value);
        setScaleValueWidthSticker(newScaleValueWidth);
    };

    const updateSliderScaleWidthTextValue = (e) => {
        const newScaleValueWidth = parseFloat(e.target.value);
        setScaleWidthText(newScaleValueWidth);
    };

    const updateSliderHeightValue = (e) => {
        const newScaleValueHeight = parseFloat(e.target.value);
        setScaleValueHeight(newScaleValueHeight);
    };

    const updateSliderHeightValueSticker = (e) => {
        const newScaleValueHeight = parseFloat(e.target.value);
        setScaleValueHeightSticker(newScaleValueHeight);
    };

    const updateSliderScaleHeightTextValue = (e) => {
        const newScaleValueHeight = parseFloat(e.target.value);
        setScaleHeightText(newScaleValueHeight);
    };

    const updateVoiceValue = (value) => {
        const newVoice = parseFloat(value);
        setVoiceValue(newVoice);


        if (videoRef.current) {
            const linearVolume = Math.pow(10, newVoice / 20);
            videoRef.current.volume = Math.max(0, Math.min(linearVolume, 1));
        }
    };

    const updateVoiceValueAudio = (value) => {
        const newVoice = parseFloat(value);
        setVoiceValueAudio(newVoice);
    };

    const updateSpeedValue = (value) => {
        const newSpeed = parseFloat(value);
        setSpeedValue(newSpeed);

    };

    const updateSpeedValueAudio = (value) => {
        const newSpeed = parseFloat(value);
        setSpeedValueAudio(newSpeed);
    };

    const updatePositionX = (value) => {
        setPositionX(value);
    };

    const updatePositionXSticker = (value) => {
        setPositionXSticker(value);
    };

    const updatePositionXText = (value) => {
        setPositionXText(value);
    };

    const updatePositionY = (value) => {
        setPositionY(value);
    };

    const updatePositionYSticker = (value) => {
        setPositionYSticker(value);
    };

    const updatePositionYText = (value) => {
        setPositionYText(value);
    };

    const updateRotate = (value) => {
        setRotateValue(value);
    };

    const updateRotateSticker = (value) => {
        setRotateValueSticker(value);
    };

    const updateRotateText = (value) => {
        setRotateText(parseInt(value));
    };

    const updateSliderSticker = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 300) numericValue = 300;
        if (numericValue < 5) numericValue = 5;
        setScaleValueSticker(numericValue);
        setScaleValueWidthSticker(numericValue);
        setScaleValueHeightSticker(numericValue);
    };

    const updateSlider = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 300) numericValue = 300;
        if (numericValue < 5) numericValue = 5;
        setScaleValue(numericValue);
        setScaleValueWidth(numericValue);
        setScaleValueHeight(numericValue);
    };

    const updateSliderScaleText = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 300) numericValue = 300;
        if (numericValue < 5) numericValue = 5;
        setScaleText(numericValue);
        setScaleWidthText(numericValue);
        setScaleHeightText(numericValue);
    };

    const updateFontSizeText = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 300) numericValue = 300;
        if (numericValue < 5) numericValue = 5;
        setFontSizeText(numericValue);
    };

    const updateSliderWidth = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 400) numericValue = 400;
        if (numericValue < 1) numericValue = 1;
        setScaleValueWidth(numericValue);
    };

    const updateSliderWidthSticker = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 400) numericValue = 400;
        if (numericValue < 1) numericValue = 1;
        setScaleValueWidthSticker(numericValue);
    };

    const updateSliderWidthText = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 400) numericValue = 400;
        if (numericValue < 1) numericValue = 1;
        setScaleWidthText(numericValue);
    };

    const updateSliderHeightSticker = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 400) numericValue = 400;
        if (numericValue < 1) numericValue = 1;
        setScaleValueHeightSticker(numericValue);
    };

    const updateSliderHeight = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 400) numericValue = 400;
        if (numericValue < 1) numericValue = 1;
        setScaleValueHeight(numericValue);
    };

    const updateSliderHeightText = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 400) numericValue = 400;
        if (numericValue < 1) numericValue = 1;
        setScaleHeightText(numericValue);
    };

    const updateVoice = (value) => {
        let numericValue = parseInt(value.replace("dB", ""), 10);
        if (numericValue > 20) numericValue = 20;
        if (numericValue < -60) numericValue = -60;
        setVoiceValue(numericValue);
    };

    const updateSpeed = (value) => {
        let numericValue = parseInt(value.replace("x", ""), 10);
        if (numericValue > 100) numericValue = 100;
        if (numericValue < 1) numericValue = 1;
        setSpeedValue(numericValue);
    };

    const updateVoiceAudio = (value) => {
        let numericValue = parseInt(value.replace("dB", ""), 10);
        if (numericValue > 20) numericValue = 20;
        if (numericValue < -60) numericValue = -60;
        setVoiceValueAudio(numericValue);
    };

    const updateSpeedAudio = (value) => {
        let numericValue = parseInt(value.replace("x", ""), 10);
        if (numericValue > 100) numericValue = 100;
        if (numericValue < 1) numericValue = 1;
        setSpeedValueAudio(numericValue);
    };

    const handleStabilizeLevelChange = (e) => {
        setStabilizeLevel(e.target.value);
    };

    const updateBlurValue = (value) => {
        setBlurValue(value);
    };

    const updateBlendValue = (value) => {
        setBlendValue(value);
    };

    const handleCanvasOptionChange = (e) => {
        setCanvasOption(e.target.value);
    };

    const handleColorChange = (e) => {
        setColorValue(e.target.value);
    };

    const increaseSlider = () => {
        if (scaleValue < 400) {
            setScaleValue(prevValue => Math.min(prevValue + 1, 400));
            setScaleValueWidth(prevValue => Math.min(prevValue + 1, 400));
            setScaleValueHeight(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseSliderSticker = () => {
        if (scaleValueSticker < 400) {
            setScaleValueSticker(prevValue => Math.min(prevValue + 1, 400));
            setScaleValueWidthSticker(prevValue => Math.min(prevValue + 1, 400));
            setScaleValueHeightSticker(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseSliderScaleText = () => {
        if (scaleText < 400) {
            setScaleText(prevValue => Math.min(prevValue + 1, 400));
            setScaleWidthText(prevValue => Math.min(prevValue + 1, 400));
            setScaleHeightText(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseFontSizeText = () => {
        if (fontSizeText < 300) {
            setFontSizeText(prevValue => Math.min(prevValue + 1, 300));
        }
    };

    const increaseSliderWidth = () => {
        if (scaleValueWidth < 400) {
            setScaleValueWidth(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseSliderWidthSticker = () => {
        if (scaleValueWidthSticker < 400) {
            setScaleValueWidthSticker(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseSliderWidthText = () => {
        if (scaleValueWidth < 400) {
            setScaleWidthText(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseSliderHeight = () => {
        if (scaleValueHeight < 400) {
            setScaleValueHeight(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseSliderHeightSticker = () => {
        if (scaleValueHeightSticker < 400) {
            setScaleValueHeightSticker(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseSliderHeightText = () => {
        if (scaleValueHeight < 400) {
            setScaleHeightText(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const increaseVoice = () => {
        let newVoice = voiceValue + 1;
        if (newVoice > 20) newVoice = 6;
        updateVoiceValue(newVoice);
    };

    const increaseSpeed = () => {
        let newSpeed = speedValue + 1;
        if (newSpeed > 100) newSpeed = 100;
        updateSpeedValue(newSpeed);
    };

    const increaseVoiceAudio = () => {
        let newVoice = voiceValueAudio + 1;
        if (newVoice > 6) newVoice = 6;
        updateVoiceValueAudio(newVoice);
    };

    const increaseSpeedAudio = () => {
        let newSpeed = speedValueAudio + 1;
        if (newSpeed > 100) newSpeed = 100;
        updateSpeedValueAudio(newSpeed);
    };

    const decreaseSlider = () => {
        if (scaleValue > 1) {
            setScaleValue(prevValue => Math.max(prevValue - 1, 1));
            setScaleValueWidth(prevValue => Math.max(prevValue - 1, 1));
            setScaleValueHeight(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseSliderSticker = () => {
        if (scaleValueSticker > 1) {
            setScaleValueSticker(prevValue => Math.max(prevValue - 1, 1));
            setScaleValueWidthSticker(prevValue => Math.max(prevValue - 1, 1));
            setScaleValueHeightSticker(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseSliderScaleText = () => {
        if (scaleText > 1) {
            setScaleText(prevValue => Math.max(prevValue - 1, 1));
            setScaleWidthText(prevValue => Math.max(prevValue - 1, 1));
            setScaleHeightText(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseFontSizeText = () => {
        if (fontSizeText > 5) {
            setFontSizeText(prevValue => Math.max(prevValue - 1, 5));
        }
    };

    const decreaseSliderWidthSticker = () => {
        if (scaleValueWidthSticker > 1) {
            setScaleValueWidthSticker(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseSliderWidth = () => {
        if (scaleValueWidth > 1) {
            setScaleValueWidth(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseSliderWidthText = () => {
        if (scaleValueWidth > 1) {
            setScaleWidthText(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseSliderHeight = () => {
        if (scaleValueHeight > 1) {
            setScaleValueHeight(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseSliderHeightSticker = () => {
        if (scaleValueHeightSticker > 1) {
            setScaleValueHeightSticker(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseSliderHeightText = () => {
        if (scaleValueHeight > 1) {
            setScaleHeightText(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const decreaseVoice = () => {
        let newVoice = voiceValue - 1;
        if (newVoice < -60) newVoice = -60;
        updateVoiceValue(newVoice);
    };

    const decreaseSpeed = () => {
        let newSpeed = speedValue - 1;
        if (newSpeed < 1) newSpeed = 1;
        updateSpeedValue(newSpeed);
    };

    const decreaseVoiceAudio = () => {
        let newVoice = voiceValueAudio - 1;
        if (newVoice < -60) newVoice = -60;
        updateVoiceValueAudio(newVoice);
    };

    const decreaseSpeedAudio = () => {
        let newSpeed = speedValueAudio - 1;
        if (newSpeed < 1) newSpeed = 1;
        updateSpeedValueAudio(newSpeed);
    };

    const increasePositionX = () => {
        setPositionX(prevValue => Math.min(prevValue + 1, 5000));
    };

    const increasePositionXSticker = () => {
        setPositionXSticker(prevValue => Math.min(prevValue + 1, 5000));
    };

    const increasePositionXText = () => {
        setPositionXText(prevValue => Math.min(prevValue + 1, 5000));
    };

    const decreasePositionX = () => {
        setPositionX(prevValue => Math.max(prevValue - 1, -5000));
    };

    const decreasePositionXSticker = () => {
        setPositionXSticker(prevValue => Math.max(prevValue - 1, -5000));
    };

    const decreasePositionXText = () => {
        setPositionXText(prevValue => Math.max(prevValue - 1, -5000));
    };

    const increasePositionY = () => {
        setPositionY(prevValue => Math.min(prevValue + 1, 5000));
    };

    const increasePositionYSticker = () => {
        setPositionYSticker(prevValue => Math.min(prevValue + 1, 5000));
    };

    const decreasePositionY = () => {
        setPositionY(prevValue => Math.max(prevValue - 1, -5000));
    };

    const decreasePositionYSticker = () => {
        setPositionYSticker(prevValue => Math.max(prevValue - 1, -5000));
    };

    const increasePositionYText = () => {
        setPositionYText(prevValue => Math.min(prevValue + 1, 5000));
    };

    const decreasePositionYText = () => {
        setPositionYText(prevValue => Math.max(prevValue - 1, -5000));
    };

    const increaseRotate = () => {
        setRotateValue(prevValue => Math.min(prevValue + 1, 3600));
    };

    const increaseRotateSticker = () => {
        setRotateValueSticker(prevValue => Math.min(prevValue + 1, 3600));
    };

    const increaseRotateText = () => {
        setRotateText(prevValue => Math.min(prevValue + 1, 3600));
    };

    const decreaseRotate = () => {
        setRotateValue(prevValue => Math.max(prevValue - 1, -3600));
    };

    const decreaseRotateSticker = () => {
        setRotateValueSticker(prevValue => Math.max(prevValue - 1, -3600));
    };

    const decreaseRotateText = () => {
        setRotateText(prevValue => Math.max(prevValue - 1, -3600));
    };

    const updateOpacityValue = (value) => {
        setOpacity(value);
    };

    const updateOpacityValueText = (value) => {
        setOpacityText(value);
    };

    const updateOpacity = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 100) numericValue = 100;
        if (numericValue < 0) numericValue = 0;
        setOpacity(numericValue);
    };

    const updateOpacityText = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (numericValue > 100) numericValue = 100;
        if (numericValue < 0) numericValue = 0;
        setOpacityText(numericValue);
    };

    const increaseOpacity = () => {
        if (opacity < 100) {
            setOpacity(prevValue => Math.min(prevValue + 1, 100));
        }
    };

    const decreaseOpacity = () => {
        if (opacity > 0) {
            setOpacity(prevValue => Math.max(prevValue - 1, 0));
        }
    };

    const increaseOpacityText = () => {
        if (opacityText < 100) {
            setOpacityText(prevValue => Math.min(prevValue + 1, 100));
        }
    };

    const decreaseOpacityText = () => {
        if (opacityText > 0) {
            setOpacityText(prevValue => Math.max(prevValue - 1, 0));
        }
    };

    const handleBlendModeChange = (e) => {
        setBlendMode(e.target.value);
    };

    const increaseBlur = () => {
        if (blurValue < 400) {
            setBlurValue(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const decreaseBlur = () => {
        if (blurValue > 1) {
            setBlurValue(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const increaseBlend = () => {
        if (blendValue < 400) {
            setBlendValue(prevValue => Math.min(prevValue + 1, 400));
        }
    };

    const decreaseBlend = () => {
        if (blendValue > 1) {
            setBlendValue(prevValue => Math.max(prevValue - 1, 1));
        }
    };

    const handleDirectionChange = (e) => {
        setDirection(e.target.value);
    };

    const handleSpeedChange = (e) => {
        setSpeed(e.target.value);
    };

    const updateCustomRemovalValue = (value) => {
        const numericValue = Math.min(Math.max(parseInt(value, 10), 1), 400);
        setCustomRemovalValue(numericValue);
    };

    const updateCustomRemoval = (value) => {
        let numericValue = parseInt(value.replace("%", ""), 10);
        if (isNaN(numericValue)) numericValue = 94;
        updateCustomRemovalValue(numericValue);
    };

    const increaseCustomRemoval = () => {
        if (customRemovalValue < 400) {
            setCustomRemovalValue(customRemovalValue + 1);
        }
    };

    const decreaseCustomRemoval = () => {
        if (customRemovalValue > 1) {
            setCustomRemovalValue(customRemovalValue - 1);
        }
    };

    const handleVideoSelect = (video, timelineIndex, videoIndex) => {
        setSelectedVideo(video);
        setTimelineVideoIndex(timelineIndex);
        setVideoIndex(videoIndex);
    };

    const handleTextSelect = (text, timelineIndex, Index) => {
        setSelectedText(text);
        setTimelineTextIndex(timelineIndex);
        setTextIndex(Index);
    };

    const handleFontTextChange = (e) => {
        setFontText(e.target.value);
    }

    const updateSliderValue = (e) => {
        const newScaleValue = parseFloat(e.target.value);
        setScaleValue(newScaleValue);
        setScaleValueWidth(newScaleValue);
        setScaleValueHeight(newScaleValue);
    };

    const updateSliderValueSticker = (e) => {
        const newScaleValue = parseFloat(e.target.value);
        setScaleValueSticker(newScaleValue);
        setScaleValueWidthSticker(newScaleValue);
        setScaleValueHeightSticker(newScaleValue);
    };

    const updateScaleTextValue = (e) => {
        const newScaleValue = parseFloat(e.target.value);
        setScaleText(newScaleValue);
        setScaleWidthText(newScaleValue);
        setScaleHeightText(newScaleValue);
    };

    const updateFontSizeTextValue = (e) => {
        const newFontSizeValue = parseFloat(e.target.value);
        setFontSizeText(newFontSizeValue);
    };


    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                await axios.get("http://localhost:8000/myapp/validate_token/", {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setIsLogin(true);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        const response = await axios.post("http://localhost:8000/myapp/token/refresh/", {
                            refresh: refreshToken,
                        });
                        localStorage.setItem("access_token", response.data.access);
                        setIsLogin(true);
                    } catch (refreshError) {
                        setIsLogin(false);
                    }
                } else {
                        setIsLogin(false);
                }
            }
        };

        checkTokenValidity();
    }, [token, refreshToken, setIsLogin]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await fetchVideo(projectId, setListVideo);

                const audioCategories = ['vlog', 'tourism', 'love', 'spring', 'beat', 'heal', 'warm', 'trend', 'revenue', 'horrified', 'laugh'];
                await Promise.all(audioCategories.map(category => fetchDataByCategory(category, setAudioFiles, 'audio')));

                const textCategories = ['default', 'trending', 'basic', 'multicolor'];
                await Promise.all(textCategories.map(category => fetchDataByCategory(category, setTextFiles, 'text')));

                const stickerCategories = ['trending', 'easter_holiday', 'fun', 'troll_face', 'gaming', 'emoji'];
                await Promise.all(stickerCategories.map(category => fetchDataByCategory(category, setStickerFiles, 'sticker')));

                const effectCategories = ['trending', 'nightclub', 'lens', 'retro', 'tv', 'star', 'trending_body', 'mood_body', 'mask_body', 'selfie_body'];
                await Promise.all(effectCategories.map(category => fetchDataByCategory(category, setEffectFiles, 'effect')));

                const filterCategories = ['featured', 'life', 'scenery', 'movies', 'retro', 'style'];
                await Promise.all(filterCategories.map(category => fetchDataByCategory(category, setFilterFiles, 'filter')));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAllData();
    }, [projectId]);

    useEffect(() => {
        loadEditSession();
    }, []);

const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    setCurrentTime(videoElement.currentTime);

    // Đảm bảo cập nhật opacity khi nó thay đổi
    if (opacity !== undefined) {
        videoElement.style.opacity = opacity / 100; // Sử dụng style để cập nhật opacity
    }
};

useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
        // Lắng nghe sự kiện loadedmetadata để lấy tổng thời lượng video
        videoElement.addEventListener('loadedmetadata', () => {
            setTotalDuration(videoElement.duration);  // Thiết lập tổng thời lượng video
        });

        // Lắng nghe sự kiện timeupdate để cập nhật thời gian hiện tại
        videoElement.addEventListener('timeupdate', handleTimeUpdate);

        // Cleanup khi component unmount hoặc thay đổi
        return () => {
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }
}, [selectedVideo, opacity]);

// Hàm xử lý sự kiện kéo thanh seek-bar
const handleSeek = (e) => {
  const videoElement = videoRef.current;

  // Kiểm tra xem video có khả năng tua tới thời điểm này không
  const seekPercentage = parseFloat(e.target.value);
  const seekTime = (seekPercentage / 100) * totalDuration;

  if (videoElement.seekable.length > 0) {
    // Kiểm tra xem thời gian cần tua có nằm trong khoảng seekable không
    const seekableStart = videoElement.seekable.start(0);
    const seekableEnd = videoElement.seekable.end(0);

    if (seekTime >= seekableStart && seekTime <= seekableEnd) {

      // Cập nhật thời gian video trực tiếp
      videoElement.currentTime = seekTime;
      setCurrentTime(seekTime);

      videoElement.addEventListener('seeked', () => {
      });
    } else {
      console.log(`Seek time (${seekTime}) is out of seekable range: ${seekableStart} - ${seekableEnd}`);
    }
  } else {
    console.log('Video không thể tua tại thời điểm này');
  }
};


    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play();
        }
    }, [currentVideoIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (videoRef.current && !videoRef.current.paused) {
                setCurrentTime(videoRef.current.currentTime);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            const handleLoadedMetadata = () => {
                const duration = videoElement.duration;
                setVideoDuration(duration);
            };

            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            return () => {
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [videoUrl]);

    useEffect(() => {
        const newTimestamps = generateTimestamps(totalDuration, 5);

        if (JSON.stringify(newTimestamps) !== JSON.stringify(timestamps)) {
            setTimestamps(newTimestamps);
        }
    }, [totalDuration, timestamps]);

   useEffect(() => {
    const newTotalDuration = calculateTotalDuration();
    if (newTotalDuration !== totalDuration) {
        setTotalDuration(newTotalDuration);
    }

    if (timelineVideos.length || timelinesText.length || timelinesFilter.length || timelinesEffect.length || timelinesAudio.length || timelinesSticker.length) {
        handleExport(newTotalDuration);  // Pass the newTotalDuration directly
    }
}, [timelineVideos, timelinesText, timelinesFilter, timelinesEffect, timelinesAudio, timelinesSticker]);

    useEffect(() => {
        setTimelineVideos((prevVideos) => {
            return prevVideos.map((timelineVideo, index) => {
                if (index !== timelineVideoIndex) return timelineVideo;

                const updatedVideos = [...timelineVideo.videos];
                const video = updatedVideos[videoIndex];
                const duration = video.duration / speedValue;

                const totalTimelineDuration = Math.max(totalDuration, 30);
                const segmentWidth = (duration / totalTimelineDuration) * 100;

                if (!video) return timelineVideo;

                const updatedVideo = {
                    ...video,
                    width: segmentWidth,
                    scale: scaleValue,
                    scaleWidth: scaleValueWidth,
                    scaleHeight: scaleValueHeight,
                    positionX: positionX,
                    positionY: positionY,
                    rotate: rotateValue,
                    opacity: opacity,
                    voice: voiceValue,
                    speed: speedValue
                };

                return {
                    ...timelineVideo,
                    videos: updatedVideos.map((v, i) => (i === videoIndex ? updatedVideo : v))
                };
            });
        });
    }, [scaleValue, scaleValueWidth, scaleValueHeight, positionX, positionY, rotateValue, opacity, voiceValue, speedValue]);

    useEffect(() => {
        setTimelinesText((prevTexts) => {
            return prevTexts.map((timelineText, index) => {
                if (index !== timelineTextIndex) return timelineText;

                const updatedTexts = [...timelineText.texts];
                const text = updatedTexts[textIndex];

                const x = (videoWidth / 2) - (fontSizeText ? parseInt(fontSizeText) * textContent.length / 2 : 8 * textContent.length / 2);
                const y = (videoHeight / 2) - (fontSizeText ? parseInt(fontSizeText) / 2 : 8);

                if (!text) return timelineText;

                const updatedText = {
                    ...text,
                    content: textContent,
                    fontStyle: fontText,
                    fontSize: fontSizeText,
                    pattern: patternText,
                    case: caseText,
                    scale: scaleText,
                    scaleWidth: scaleWidthText,
                    scaleHeight: scaleHeightText,
                    positionX: positionXText,
                    positionY: positionYText,
                    rotate: rotateText,
                    opacity: opacityText,
                    blod: blod,
                    underline: underline,
                    italic: italic,
                    styleOfText: styleOfText,
                };

                return {
                    ...timelineText,
                    texts: updatedTexts.map((v, i) => (i === textIndex ? updatedText : v))
                };
            });
        });
    }, [textContent, fontText, fontSizeText, patternText, caseText, scaleText, scaleWidthText, scaleHeightText, positionXText, positionYText, rotateText, opacityText, blod, underline, italic, styleOfText]);

    useEffect(() => {
        setTimelinesSticker((prevStickers) => {
            return prevStickers.map((timelineSticker, index) => {
                if (index !== timelineStickerIndex) return timelineSticker;

                const updatedStickers = [...timelineSticker.stickers];
                const sticker = updatedStickers[stickerIndex];

                if (!sticker) return timelineSticker;

                const updatedSticker = {
                    ...sticker,
                    scale: scaleValueSticker,
                    scaleWidth: scaleValueWidthSticker,
                    scaleHeight: scaleValueHeightSticker,
                    positionX: positionXSticker,
                    positionY: positionYSticker,
                    rotate: rotateValueSticker,
                };

                return {
                    ...timelineSticker,
                    stickers: updatedStickers.map((v, i) => (i === stickerIndex ? updatedSticker : v))
                };
            });
        });
    }, [scaleValueSticker, scaleValueWidthSticker, scaleValueHeightSticker, positionXSticker, positionYSticker, rotateValueSticker]);

    useEffect(() => {
        setTimelinesAudio((prevAudios) => {
            return prevAudios.map((timelineAudio, index) => {
                if (index !== timelineAudioIndex) return timelineAudio;

                const updatedAudios = [...timelineAudio.audios];
                const audio = updatedAudios[audioIndex];

                const duration = audio.duration / speedValueAudio;

                const totalTimelineDuration = Math.max(totalDuration, 30);
                const segmentWidth = (duration / totalTimelineDuration) * 100;

                if (!audio) return timelineAudio;

                const updatedAudio = {
                    ...audio,
                    width: segmentWidth,
                    voice: voiceValueAudio,
                    speed: speedValueAudio
                };

                return {
                    ...timelineAudio,
                    audios: updatedAudios.map((v, i) => (i === audioIndex ? updatedAudio : v))
                };
            });
        });
    }, [voiceValueAudio, speedValueAudio]);

    useEffect(() => {
    const handleDeleteKey = (e) => {
        console.log(e.key);  // Kiểm tra xem có log ra phím "Delete" hay không
        if (e.key === "Delete" && selectedElement) {
            handleDeleteElement(selectedElement);
        }
    };

    window.addEventListener("keydown", handleDeleteKey);

    return () => {
        window.removeEventListener("keydown", handleDeleteKey);
    };
}, [selectedElement]);

    const handleDeleteElement = (element) => {
    console.log('Element to delete:', element);  // Kiểm tra phần tử sẽ bị xóa
    switch (element.type) {
        case 'video':
            setTimelineVideos(prev => {
                const updated = prev.map(timeline => {
                    // Lọc các video không khớp với instanceId của phần tử cần xóa
                    return {
                        ...timeline,
                        videos: timeline.videos.filter(video => video.instanceId !== element.instanceId)
                    };
                });
                console.log('Updated timelines after delete:', updated);
                return updated;
            });
            break;

        case 'text':
            setTimelinesText(prev => {
                const updated = prev.map(timeline => {
                    // Lọc các text không khớp với instanceId của phần tử cần xóa
                    return {
                        ...timeline,
                        texts: timeline.texts.filter(text => text.instanceId !== element.instanceId)
                    };
                });
                console.log('Updated timelines (text) after delete:', updated);
                return updated;
            });
            break;

        case 'audio':
            setTimelinesAudio(prev => {
                const updated = prev.map(timeline => {
                    // Lọc các audio không khớp với instanceId của phần tử cần xóa
                    return {
                        ...timeline,
                        audios: timeline.audios.filter(audio => audio.instanceId !== element.instanceId)
                    };
                });
                console.log('Updated timelines (audio) after delete:', updated);
                return updated;
            });
            break;

        case 'sticker':
            setTimelinesSticker(prev => {
                const updated = prev.map(timeline => {
                    // Lọc các sticker không khớp với instanceId của phần tử cần xóa
                    return {
                        ...timeline,
                        stickers: timeline.stickers.filter(sticker => sticker.instanceId !== element.instanceId)
                    };
                });
                console.log('Updated timelines (sticker) after delete:', updated);
                return updated;
            });
            break;

        case 'effect':
            setTimelinesEffect(prev => {
                const updated = prev.map(timeline => {
                    // Lọc các effect không khớp với instanceId của phần tử cần xóa
                    return {
                        ...timeline,
                        effects: timeline.effects.filter(effect => effect.instanceId !== element.instanceId)
                    };
                });
                console.log('Updated timelines (effect) after delete:', updated);
                return updated;
            });
            break;

        case 'filter':
            setTimelinesFilter(prev => {
                const updated = prev.map(timeline => {
                    // Lọc các filter không khớp với instanceId của phần tử cần xóa
                    return {
                        ...timeline,
                        filters: timeline.filters.filter(filter => filter.instanceId !== element.instanceId)
                    };
                });
                console.log('Updated timelines (filter) after delete:', updated);
                return updated;
            });
            break;

        default:
            console.warn('Unknown type:', element.type);
            break;
    }
};

    useEffect(() => {
  const videoElement = videoRef.current;
if (videoElement) {
    videoElement.addEventListener('seeked', () => {
    });

    return () => {
        videoElement.removeEventListener('seeked', () => {
        });
    };
}
}, []);

    return (
        <body>
        <div className="body-wrapper">
            <div className="header">
                <div className="logo-wrap">
                    <img src={logo} alt="Video Thum"/>
                    <p>EditEase</p>
                </div>
                <div className="export-btn">
                    <button className="export" onClick={handleDownloadVideo}>
                        Export
                    </button>
                </div>
                {isLogin ? (
                    <div className="profile-user" onClick={handleSaveEditSession}>
                        <img src={logo} alt="User image"/>
                    </div>
                ) : (
                    <div className="login-btn">
                        <Link className="btn-login-link" to="/login">Login</Link>
                    </div>
                )}
            </div>
            <div className="adjustment-effect-wrapper">
                <div className="effect-wrapper">
                    <div className="effect-nav">
                        <nav className="effect-nav-type">
                            <div className="effect-wrap" id="import-effect-list-wrapper"
                                 onClick={() => handleMenuEffectClick('import')}>
                                <div className="effect-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-square-play">
                                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                                        <path d="m9 8 6 4-6 4Z"/>
                                    </svg>
                                </div>
                                <button className="btn effect-btn">Import</button>
                            </div>
                            <div className="effect-wrap" id="audio-effect-list-wrapper"
                                 onClick={() => handleMenuEffectClick('audio')}>
                                <div className="effect-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-voicemail">
                                        <circle cx="6" cy="12" r="4"/>
                                        <circle cx="18" cy="12" r="4"/>
                                        <line x1="6" x2="18" y1="16" y2="16"/>
                                    </svg>
                                </div>
                                <button className="btn effect-btn">Audio</button>
                            </div>
                            <div className="effect-wrap" id="text-effect-list-wrapper"
                                 onClick={() => handleMenuEffectClick('text')}>
                                <div className="effect-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-type">
                                        <polyline points="4 7 4 4 20 4 20 7"/>
                                        <line x1="9" x2="15" y1="20" y2="20"/>
                                        <line x1="12" x2="12" y1="4" y2="20"/>
                                    </svg>
                                </div>
                                <button className="btn effect-btn">Text</button>
                            </div>
                            <div className="effect-wrap" id="sticker-effect-list-wrapper"
                                 onClick={() => handleMenuEffectClick('sticker')}>
                                <div className="effect-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-sticker">
                                        <path
                                            d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/>
                                        <path d="M14 3v4a2 2 0 0 0 2 2h4"/>
                                        <path d="M8 13h0"/>
                                        <path d="M16 13h0"/>
                                        <path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1"/>
                                    </svg>
                                </div>
                                <button className="btn effect-btn">Stickers</button>
                            </div>
                            <div className="effect-wrap" id="effect-effect-list-wrapper"
                                 onClick={() => handleMenuEffectClick('effect')}>
                                <div className="effect-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-sparkles">
                                        <path
                                            d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                                        <path d="M20 3v4"/>
                                        <path d="M22 5h-4"/>
                                        <path d="M4 17v2"/>
                                        <path d="M5 18H3"/>
                                    </svg>
                                </div>
                                <button className="btn effect-btn">Effect</button>
                            </div>
                            <div className="effect-wrap" id="filter-effect-list-wrapper"
                                 onClick={() => handleMenuEffectClick('filter')}>
                                <div className="effect-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-blend">
                                        <circle cx="9" cy="9" r="7"/>
                                        <circle cx="15" cy="15" r="7"/>
                                    </svg>
                                </div>
                                <button className="btn effect-btn">Filters</button>
                            </div>
                        </nav>
                    </div>
                    {activeWrapper.import &&
                        <div className="effect-list-import-wrapper effect-list-option-wrapper"
                             id="effect-list-import-wrapper">
                            <div className="effect-list-import effect-list-option">
                                <Sidebar className="effect-type-import effect-type-option">
                                    <Menu className="dropdown">
                                        <MenuItem id="btn-dropdown"
                                                  className={`btn-dropdown ${activeImportOption.device ? 'active' : ''}`}
                                                  title="Device"
                                                  onClick={() => handleMenuImportOptionClick('device')}> Device </MenuItem>
                                        <SubMenu id="btn-dropdown" className="btn-dropdown" label="Stock material"
                                                 title="Stock material">
                                            <MenuItem className={`trending-stock-material dropdown-item
                                ${activeImportOption.trendingStockMaterial ? 'active' : ''}`}
                                                      id="trending-stock-material"
                                                      title="Trending"
                                                      onClick={() => handleMenuImportOptionClick('trendingStockMaterial')}> Trending </MenuItem>
                                            <MenuItem className={`christmas&NewYear-stock-material dropdown-item
                                ${activeImportOption.christmasAndNewYearStockMaterial ? 'active' : ''}`}
                                                      id="christmas&NewYear-stock-material" title="Christmas & New Year"
                                                      onClick={() => handleMenuImportOptionClick('christmasAndNewYearStockMaterial')}> Christmas
                                                & New Year </MenuItem>
                                            <MenuItem className={`greenScreen&NewYear-stock-material dropdown-item
                                ${activeImportOption.greenScreenStockMaterial ? 'active' : ''}`}
                                                      onClick={() => handleMenuImportOptionClick('greenScreenStockMaterial')}> Green
                                                Screen </MenuItem>
                                            <MenuItem className={`background-stock-material&NewYear-stock-material dropdown-item
                                ${activeImportOption.backgroundStockMaterial ? 'active' : ''}`}
                                                      id="background-stock-material" title="Background"
                                                      onClick={() => handleMenuImportOptionClick('backgroundStockMaterial')}> Background </MenuItem>
                                            <MenuItem className={`intro&End-stock-material&NewYear-stock-material dropdown-item
                                ${activeImportOption.introAndEndStockMaterial ? 'active' : ''}`}
                                                      id="intro&End-stock-material" title="Intro & End"
                                                      onClick={() => handleMenuImportOptionClick('introAndEndStockMaterial')}> Intro
                                                &
                                                End </MenuItem>
                                        </SubMenu>
                                    </Menu>
                                </Sidebar>;
                            </div>
                            <div className="effect-list-type-import effect-list-type">
                                <div className="search-import search-effect">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-search">
                                        <circle cx="11" cy="11" r="8"/>
                                        <path d="m21 21-4.3-4.3"/>
                                    </svg>
                                    <input className="search-input" type="text" name="search-import"
                                           placeholder="search project, subject in image, lines"/>
                                </div>
                                <div className="import-sort-video" id="import-sort-video">
                                    <label htmlFor="import-video" className="import-video">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round"
                                             className="lucide lucide-circle-plus">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M8 12h8"/>
                                            <path d="M12 8v8"/>
                                        </svg>
                                        <p>Import</p>
                                    </label>
                                    <input id="import-video" type="file" name="import" style={{display: 'none'}}
                                           onChange={handleFileChange}/>
                                    <div className="sort-video">
                                        <div className="expression-type sort-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round"
                                                 className="lucide lucide-layout-dashboard">
                                                <rect width="7" height="9" x="3" y="3" rx="1"/>
                                                <rect width="7" height="5" x="14" y="3" rx="1"/>
                                                <rect width="7" height="9" x="14" y="12" rx="1"/>
                                                <rect width="7" height="5" x="3" y="16" rx="1"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round"
                                                 className="lucide lucide-chevron-down">
                                                <path d="m6 9 6 6 6-6"/>
                                            </svg>
                                        </div>
                                        <div className="sorted-type sort-icon">
                                            <p>Sort</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round"
                                                 className="lucide lucide-arrow-down-wide-narrow">
                                                <path d="m3 16 4 4 4-4"/>
                                                <path d="M7 20V4"/>
                                                <path d="M11 4h10"/>
                                                <path d="M11 8h7"/>
                                                <path d="M11 12h4"/>
                                            </svg>
                                        </div>
                                        <div className="choose-type sort-icon">
                                            <p>All</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round"
                                                 className="lucide lucide-filter">
                                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {activeImportOption.device &&
                                    <div className="video-import-wrapper effect-option" id="video-import-wrapper">
                                        <h3>All</h3>
                                        <div className="list-file-import-wrapper list-import-file-wrapper">
                                            <div className="list-file-import list-import-file">
                                                {listVideo.length > 0 ? (
                                                    listVideo.map((file, index) => (
                                                        <div key={index} className="file-import import-file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, file, index, "video")}
                                                        >
                                                            <div className="file">
                                                                {isVideo(file.name) ? (
                                                                    <>
                                                                        <video
                                                                            src={file.video_url} width="200">
                                                                        </video>
                                                                        <span
                                                                            className="file-time">{formatTime(file.duration)}</span>
                                                                    </>
                                                                ) : (
                                                                    <img src={file.video_url} alt="File Thumbnail"/>
                                                                )}
                                                                <span className="file-add">Added</span>
                                                            </div>
                                                            <div
                                                                className="file-name">{file.name || 'Unknown File'}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p></p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeImportOption.trendingStockMaterial &&
                                    <div className="trending-stock-material-wrapper effect-option"
                                         id="trending-stock-material-wrapper">
                                        <h3>Trending</h3>
                                        <div className="list-file-trending-wrapper list-import-file-wrapper">
                                            <div className="list-file-trending list-import-file">
                                                <div className="file-trending import-file">
                                                    <div className="file">
                                                        <img src={imgTest} alt="Description"/>
                                                        <span className="file-time">04:26</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeImportOption.christmasAndNewYearStockMaterial &&
                                    <div className="christmas&NewYear-stock-material-wrapper effect-option"
                                         id="christmas&NewYear-stock-material-wrapper">
                                        <h3>Christmas & New Year</h3>
                                        <div className="list-file-christmas&NewYear-wrapper list-import-file-wrapper">
                                            <div className="list-file-christmas&NewYear list-import-file">
                                                <div className="file-christmas&NewYear import-file">
                                                    <div className="file">
                                                        <img src={imgTest} alt="Description"
                                                             alt="Video Thumbnail"/>
                                                        <span className="file-time">04:26</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeImportOption.greenScreenStockMaterial &&
                                    <div className="greenScreen-stock-material-wrapper effect-option"
                                         id="greenScreen-stock-material-wrapper">
                                        <h3>Green Screen</h3>
                                        <div className="list-file-greenScreen-wrapper list-import-file-wrapper">
                                            <div className="list-file-greenScreen list-import-file">
                                                <div className="file-greenScreen import-file">
                                                    <div className="file">
                                                        <img src={imgTest} alt="Description"
                                                             alt="Video Thumbnail"/>
                                                        <span className="file-time">04:26</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeImportOption.backgroundStockMaterial &&
                                    <div className="background-stock-material-wrapper effect-option"
                                         id="background-stock-material-wrapper">
                                        <h3>Background</h3>
                                        <div className="list-file-background-wrapper list-import-file-wrapper">
                                            <div className="list-file-background list-import-file">
                                                <div className="file-background import-file">
                                                    <div className="file">
                                                        <img src={imgTest} alt="Description"
                                                             alt="Video Thumbnail"/>
                                                        <span className="file-time">04:26</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeImportOption.introAndEndStockMaterial &&
                                    <div className="intro&End-stock-material-wrapper effect-option"
                                         id="intro&End-stock-material-wrapper">
                                        <h3>Intro & End</h3>
                                        <div className="list-file-intro&End-wrapper list-import-file-wrapper">
                                            <div className="list-file-intro&End list-import-file">
                                                <div className="file-intro&End import-file">
                                                    <div className="file">
                                                        <img src={imgTest} alt="Description"
                                                             alt="Video Thumbnail"/>
                                                        <span className="file-time">04:26</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {activeWrapper.audio &&
                        <div className="effect-list-audio-wrapper effect-list-option-wrapper"
                             id="effect-list-audio-wrapper">
                            <div className="effect-list-audio effect-list-option">
                                <Sidebar className="effect-type-import effect-type-option">
                                    <Menu className="dropdown">
                                        <SubMenu id="btn-dropdown" className="btn-dropdown" label="Music"
                                                 title="Music">
                                            <MenuItem className={`vlog-music dropdown-item
                                ${activeAudioOption.vlogMusic ? 'active' : ''}`}
                                                      id="vlog-music"
                                                      title="Vlog"
                                                      onClick={() => handleMenuAudioOptionClick('vlogMusic')}> Vlog </MenuItem>
                                            <MenuItem className={`tourism-music dropdown-item
                                ${activeAudioOption.tourismMusic ? 'active' : ''}`}
                                                      id="tourism-music"
                                                      title="Tourism"
                                                      onClick={() => handleMenuAudioOptionClick('tourismMusic')}> Tourism </MenuItem>
                                            <MenuItem className={`spring-music dropdown-item
                                ${activeAudioOption.springMusic ? 'active' : ''}`}
                                                      id="spring-music"
                                                      title="Spring"
                                                      onClick={() => handleMenuAudioOptionClick('springMusic')}> Spring </MenuItem>
                                            <MenuItem className={`love-music dropdown-item
                                ${activeAudioOption.loveMusic ? 'active' : ''}`}
                                                      id="love-music"
                                                      title="Love"
                                                      onClick={() => handleMenuAudioOptionClick('loveMusic')}> Love </MenuItem>
                                            <MenuItem className={`beat-music dropdown-item
                                ${activeAudioOption.beatMusic ? 'active' : ''}`}
                                                      id="beat-music"
                                                      title="Beat"
                                                      onClick={() => handleMenuAudioOptionClick('beatMusic')}> Beat </MenuItem>
                                            <MenuItem className={`heal-music dropdown-item
                                ${activeAudioOption.healMusic ? 'active' : ''}`}
                                                      id="heal-music"
                                                      title="Heal"
                                                      onClick={() => handleMenuAudioOptionClick('healMusic')}> Heal </MenuItem>
                                            <MenuItem className={`warm-music dropdown-item
                                ${activeAudioOption.warmMusic ? 'active' : ''}`}
                                                      id="warm-music"
                                                      title="Warm"
                                                      onClick={() => handleMenuAudioOptionClick('warmMusic')}> Warm </MenuItem>
                                        </SubMenu>
                                        <SubMenu id="sound-effect-dropdown" className="btn-dropdown"
                                                 label="Sound Effect"
                                                 title="Sound Effect">
                                            <MenuItem
                                                className={`trend-sound-effect dropdown-item ${activeAudioOption.trendSoundEffect ? 'active' : ''}`}
                                                id="trend-sound-effect"
                                                title="Trend"
                                                onClick={() => handleMenuAudioOptionClick('trendSoundEffect')}
                                            >
                                                Trend
                                            </MenuItem>
                                            <MenuItem
                                                className={`revenue-sound-effect dropdown-item ${activeAudioOption.revenueSoundEffect ? 'active' : ''}`}
                                                id="revenue-sound-effect"
                                                title="Revenue"
                                                onClick={() => handleMenuAudioOptionClick('revenueSoundEffect')}
                                            >
                                                Revenue
                                            </MenuItem>
                                            <MenuItem
                                                className={`horrified-sound-effect dropdown-item ${activeAudioOption.horrifiedSoundEffect ? 'active' : ''}`}
                                                id="horrified-sound-effect"
                                                title="Horrified"
                                                onClick={() => handleMenuAudioOptionClick('horrifiedSoundEffect')}
                                            >
                                                Horrified
                                            </MenuItem>
                                            <MenuItem
                                                className={`laugh-sound-effect dropdown-item ${activeAudioOption.laughSoundEffect ? 'active' : ''}`}
                                                id="laugh-sound-effect"
                                                title="Laugh"
                                                onClick={() => handleMenuAudioOptionClick('laughSoundEffect')}
                                            >
                                                Laugh
                                            </MenuItem>
                                        </SubMenu>

                                    </Menu>
                                </Sidebar>;
                            </div>
                            <div className="effect-list-type-audio effect-list-type">
                                <div className="search-audio search-effect">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-search">
                                        <circle cx="11" cy="11" r="8"/>
                                        <path d="m21 21-4.3-4.3"/>
                                    </svg>
                                    <input className="search-input" type="text" name="search-audio"
                                           placeholder="search songs or artists"/>
                                </div>
                                {activeAudioOption.vlogMusic &&
                                    <div className="vlog-music-wrapper effect-option" id="vlog-music-wrapper">
                                        <h3>Vlog</h3>
                                        <div className="list-file-vlog-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-vlog-music list-audio-file">
                                                {audioFiles.vlog.map((audio, index) => (
                                                    <div className="file-vlog-music audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeAudioOption.tourismMusic &&
                                    <div className="tourism-music-wrapper effect-option" id="tourism-music-wrapper">
                                        <h3>Tourism</h3>
                                        <div className="list-file-tourism-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-tourism-music list-audio-file">
                                                {audioFiles.tourism.map((audio, index) => (
                                                    <div className="file-tourism-music audio-file">
                                                        <div className="file" draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.springMusic &&
                                    <div className="spring-music-wrapper effect-option" id="spring-music-wrapper">
                                        <h3>Spring</h3>
                                        <div className="list-file-spring-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-spring-music list-audio-file">

                                                {audioFiles.spring.map((audio, index) => (
                                                    <div className="file-spring-music audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.loveMusic &&
                                    <div className="love-music-wrapper effect-option" id="love-music-wrapper">
                                        <h3>Love</h3>
                                        <div className="list-file-love-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-love-music list-audio-file">
                                                {audioFiles.love.map((audio, index) => (
                                                    <div className="file-love-music audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.beatMusic &&
                                    <div className="beat-music-wrapper effect-option" id="beat-music-wrapper">
                                        <h3>Beat</h3>
                                        <div className="list-file-beat-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-beat-music list-audio-file">
                                                {audioFiles.beat.map((audio, index) => (
                                                    <div className="file-beat-music audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.healMusic &&
                                    <div className="heal-music-wrapper effect-option" id="heal-music-wrapper">
                                        <h3>Heal</h3>
                                        <div className="list-file-heal-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-heal-music list-audio-file">
                                                {audioFiles.heal.map((audio, index) => (
                                                    <div className="file-heal-music audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.warmMusic &&
                                    <div className="warm-music-wrapper effect-option" id="warm-music-wrapper">
                                        <h3>Warm</h3>
                                        <div className="list-file-warm-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-warm-music list-audio-file">
                                                {audioFiles.warm.map((audio, index) => (
                                                    <div className="file-warm-music audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.trendSoundEffect &&
                                    <div className="trend-sound-effect-wrapper effect-option"
                                         id="trend-sound-effect-wrapper">
                                        <h3>Trend</h3>
                                        <div className="list-file-trend-sound-wrapper list-audio-file-wrapper">
                                            <div className="list-file-trend-sound list-audio-file">
                                                {audioFiles.trend.map((audio, index) => (
                                                    <div className="file-trend-sound audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.revenueSoundEffect &&
                                    <div className="revenue-sound-effect-wrapper effect-option"
                                         id="revenue-sound-effect-wrapper">
                                        <h3>Revenue</h3>
                                        <div className="list-file-revenue-sound-wrapper list-audio-file-wrapper">
                                            <div className="list-file-revenue-sound list-audio-file">
                                                {audioFiles.revenue.map((audio, index) => (
                                                    <div className="file-revenue-sound audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.horrifiedSoundEffect &&
                                    <div className="horrified-sound-effect-wrapper effect-option"
                                         id="horrified-sound-effect-wrapper">
                                        <h3>Horrified</h3>
                                        <div className="list-file-horrified-sound-wrapper list-audio-file-wrapper">
                                            <div className="list-file-horrified-sound list-audio-file">
                                                {audioFiles.horrified.map((audio, index) => (
                                                    <div className="file-horrified-sound audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.laughSoundEffect &&
                                    <div className="laugh-sound-effect-wrapper effect-option"
                                         id="laugh-sound-effect-wrapper">
                                        <h3>Laugh</h3>
                                        <div className="list-file-laugh-sound-wrapper list-audio-file-wrapper">
                                            <div className="list-file-laugh-sound list-audio-file">
                                                {audioFiles.laugh.map((audio, index) => (
                                                    <div className="file-laugh-sound audio-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, audio, index, "audio")}>
                                                            <div className="file-image">
                                                                <img src={audio.image}
                                                                     alt="Video Thumbnail"/>
                                                            </div>
                                                            <div className="file-information">
                                                                <span className="file-name">{audio.name}</span>
                                                                <span className="file-artist">{audio.artist}</span>
                                                                <span
                                                                    className="file-time">{formatTime(audio.duration)}</span>
                                                            </div>
                                                            <div className="favorite-file">
                                                                <label htmlFor="favorite-audio">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-star">
                                                                        <polygon
                                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                                    </svg>
                                                                </label>
                                                                <input type="checkbox" id="favorite-audio"
                                                                       className="favorite-audio"
                                                                       style={{display: 'none'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>
                    }
                    {activeWrapper.text &&
                        <div className="effect-list-text-wrapper effect-list-option-wrapper"
                             id="effect-list-text-wrapper">
                            <div className="effect-list-text effect-list-option">

                                <Sidebar className="effect-type-text effect-type-option">
                                    <Menu className="dropdown">
                                        <MenuItem id="btn-dropdown"
                                                  className={`btn-dropdown ${activeTextOption.addText ? 'active' : ''}`}
                                                  title="Add Text"
                                                  onClick={() => handleMenuTextOptionClick('addText')}> Add
                                            text </MenuItem>
                                        <SubMenu id="btn-dropdown" className="btn-dropdown" label="Effect"
                                                 title="Effect">
                                            <MenuItem className={`trending-effect dropdown-item
                                ${activeTextOption.trendingEffect ? 'active' : ''}`}
                                                      id="trending-effect"
                                                      title="Trending"
                                                      onClick={() => handleMenuTextOptionClick('trendingEffect')}> Trending </MenuItem>
                                            <MenuItem className={`basic-effect dropdown-item
                                ${activeTextOption.basicEffect ? 'active' : ''}`}
                                                      id="basic-effect" title="Basic"
                                                      onClick={() => handleMenuTextOptionClick('basicEffect')}> Basic </MenuItem>
                                            <MenuItem className={`multicolor-effect dropdown-item
                                ${activeTextOption.multicolorEffect ? 'active' : ''}`}
                                                      id="multicolor-effect" title="Multicolor"
                                                      onClick={() => handleMenuTextOptionClick('multicolorEffect')}> Multicolor </MenuItem>
                                        </SubMenu>
                                    </Menu>
                                </Sidebar>;
                            </div>
                            <div className="effect-list-type-text effect-list-type">
                                <div className="search-text search-effect">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-search">
                                        <circle cx="11" cy="11" r="8"/>
                                        <path d="m21 21-4.3-4.3"/>
                                    </svg>
                                    <input className="search-input" type="text" name="search-text"
                                           placeholder="search text or color"/>
                                </div>
                                {activeTextOption.addText &&
                                    <div className="default-text-wrapper effect-option"
                                         id="default-text-wrapper">
                                        <h3>Default</h3>
                                        <div className="list-file-default-text-wrapper list-text-file-wrapper">
                                            <div className="list-file-default-text list-text-file">
                                                {textFiles.default.map((text, index) => (
                                                    <div className="file-default-text text-file">
                                                        <div className="file"
                                                             style={{
                                                                 position: "absolute",
                                                                 left: `${draggableText.position.x}px`,
                                                                 top: `${draggableText.position.y}px`,
                                                                 cursor: "move",
                                                             }}
                                                             draggable="true"
                                                             onDragStart={(e) => handleDragStart(e, text, index, "text")}>
                                                            <label
                                                            >{draggableText.content}</label>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeTextOption.trendingEffect &&
                                    <div className="trending-effect-wrapper effect-option"
                                         id="trending-effect-wrapper">
                                        <h3>Trending</h3>
                                        <div className="list-file-trending-effect-wrapper list-text-file-wrapper">
                                            <div className="list-file-trending-effect list-text-file">
                                                {textFiles.trending.map((text, index) => (
                                                    <div className="file-trending-effect text-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, text, index, "text")}>
                                                            <img src={text.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeTextOption.basicEffect &&
                                    <div className="basic-effect-wrapper effect-option"
                                         id="basic-effect-wrapper">
                                        <h3>Basic</h3>
                                        <div className="list-file-basic-effect-wrapper list-text-file-wrapper">
                                            <div className="list-file-basic-effect list-text-file">
                                                {textFiles.basic.map((text, index) => (
                                                    <div className="file-basic-effect text-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, text, index, "text")}>
                                                            <img src={text.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeTextOption.multicolorEffect &&
                                    <div className="multicolor-effect-wrapper effect-option"
                                         id="multicolor-effect-wrapper">
                                        <h3>Multicolor</h3>
                                        <div className="list-file-multicolor-effect-wrapper list-text-file-wrapper">
                                            <div className="list-file-multicolor-effect list-text-file">
                                                {textFiles.multicolor.map((text, index) => (
                                                    <div className="file-multicolor-effect text-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, text, index, "text")}>
                                                            <img src={text.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {activeWrapper.sticker &&
                        <div className="effect-list-sticker-wrapper effect-list-option-wrapper"
                             id="effect-list-sticker-wrapper">
                            <div className="effect-list-sticker effect-list-option">
                                <Sidebar className="effect-type-sticker effect-type-option">
                                    <Menu className="dropdown">
                                        <SubMenu id="btn-dropdown" className="btn-dropdown" label="Sticker"
                                                 title="Sticker">
                                            <MenuItem
                                                className={`trending-sticker dropdown-item ${activeStickerOption.trendingSticker ? 'active' : ''}`}
                                                id="trending-sticker"
                                                title="Trending"
                                                onClick={() => handleMenuStickerOptionClick('trendingSticker')}> Trending </MenuItem>
                                            <MenuItem
                                                className={`easter-holiday-sticker dropdown-item ${activeStickerOption.easterHolidaySticker ? 'active' : ''}`}
                                                id="easter-holiday-sticker"
                                                title="Easter Holiday"
                                                onClick={() => handleMenuStickerOptionClick('easterHolidaySticker')}> Easter
                                                Holiday </MenuItem>
                                            <MenuItem
                                                className={`fun-sticker dropdown-item ${activeStickerOption.funSticker ? 'active' : ''}`}
                                                id="fun-sticker"
                                                title="Fun"
                                                onClick={() => handleMenuStickerOptionClick('funSticker')}> Fun </MenuItem>
                                            <MenuItem
                                                className={`troll-face-sticker dropdown-item ${activeStickerOption.trollFaceSticker ? 'active' : ''}`}
                                                id="troll-face-sticker"
                                                title="Troll Face"
                                                onClick={() => handleMenuStickerOptionClick('trollFaceSticker')}> Troll
                                                Face </MenuItem>
                                            <MenuItem
                                                className={`gaming-sticker dropdown-item ${activeStickerOption.gamingSticker ? 'active' : ''}`}
                                                id="gaming-sticker"
                                                title="Gaming"
                                                onClick={() => handleMenuStickerOptionClick('gamingSticker')}> Gaming </MenuItem>
                                            <MenuItem
                                                className={`emoji-sticker dropdown-item ${activeStickerOption.emojiSticker ? 'active' : ''}`}
                                                id="emoji-sticker"
                                                title="Emoji"
                                                onClick={() => handleMenuStickerOptionClick('emojiSticker')}> Emoji </MenuItem>
                                        </SubMenu>
                                    </Menu>
                                </Sidebar>;
                            </div>
                            <div className="effect-list-type-sticker effect-list-type">
                                <div className="search-sticker search-effect">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-search">
                                        <circle cx="11" cy="11" r="8"/>
                                        <path d="m21 21-4.3-4.3"/>
                                    </svg>
                                    <input className="search-input" type="text" name="search-audio"
                                           placeholder="search for sticker"/>
                                </div>
                                {activeStickerOption.trendingSticker &&
                                    <div className="trending-sticker-wrapper effect-option"
                                         id="trending-sticker-wrapper"
                                    >
                                        <h3>Trending</h3>
                                        <div className="list-file-trending-sticker-wrapper list-sticker-file-wrapper">
                                            <div className="list-file-trending-effect list-sticker-file">
                                                {stickerFiles.trending.map((sticker, index) => (
                                                    <div className="file-trending-effect sticker-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, sticker, index, "sticker")}>
                                                            <img src={sticker.sticker_file} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeStickerOption.easterHolidaySticker &&
                                    <div className="easter-holiday-sticker-wrapper effect-option"
                                         id="easter-holiday-sticker-wrapper"
                                    >
                                        <h3>Easter holiday</h3>
                                        <div
                                            className="list-file-easter-holiday-sticker-wrapper list-sticker-file-wrapper">
                                            <div className="list-file-easter-holiday-effect list-sticker-file">
                                                {stickerFiles.easter_holiday.map((sticker, index) => (
                                                    <div className="file-easter-holiday-effect sticker-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, sticker, index, "sticker")}>
                                                            <img src={sticker.sticker_file} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeStickerOption.funSticker &&
                                    <div className="fun-sticker-wrapper effect-option" id="fun-sticker-wrapper"
                                    >
                                        <h3>Fun</h3>
                                        <div className="list-file-fun-sticker-wrapper list-sticker-file-wrapper">
                                            <div className="list-file-fun-effect list-sticker-file">
                                                {stickerFiles.fun.map((sticker, index) => (
                                                    <div className="file-fun-effect sticker-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, sticker, index, "sticker")}>
                                                            <img src={sticker.sticker_file} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeStickerOption.trollFaceSticker &&
                                    <div className="troll-face-sticker-wrapper effect-option"
                                         id="troll-face-sticker-wrapper"
                                    >
                                        <h3>Troll face</h3>
                                        <div className="list-file-troll-face-sticker-wrapper list-sticker-file-wrapper">
                                            <div className="list-file-troll-face-effect list-sticker-file">
                                                {stickerFiles.troll_face.map((sticker, index) => (
                                                    <div className="file-troll-face-effect sticker-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, sticker, index, "sticker")}>
                                                            <img src={sticker.sticker_file} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeStickerOption.gamingSticker &&
                                    <div className="gaming-sticker-wrapper effect-option" id="gaming-sticker-wrapper"
                                    >
                                        <h3>Gaming</h3>
                                        <div className="list-file-gaming-sticker-wrapper list-sticker-file-wrapper">
                                            <div className="list-file-gaming-effect list-sticker-file">
                                                {stickerFiles.gaming.map((sticker, index) => (
                                                    <div className="file-gaming-effect sticker-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, sticker, index, "sticker")}>
                                                            <img src={sticker.sticker_file} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeStickerOption.emojiSticker &&
                                    <div className="emoji-sticker-wrapper effect-option" id="emoji-sticker-wrapper"
                                    >
                                        <h3>Emoji</h3>
                                        <div className="list-file-emoji-sticker-wrapper list-sticker-file-wrapper">
                                            <div className="list-file-emoji-effect list-sticker-file">
                                                {stickerFiles.emoji.map((sticker, index) => (
                                                    <div className="file-emoji-effect sticker-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, sticker, index, "sticker")}>
                                                            <img src={sticker.sticker_file} alt="Sticker"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {activeWrapper.effect &&
                        <div className="effect-list-effect-wrapper effect-list-option-wrapper"
                             id="effect-list-effect-wrapper">
                            <div className="effect-list-effect effect-list-option">
                                <Sidebar className="effect-type-effect effect-type-option">
                                    <Menu className="dropdown">
                                        <SubMenu id="btn-dropdown" className="btn-dropdown" label="Video effect"
                                                 title="Video effect">
                                            <MenuItem
                                                className={`trending-video-effect dropdown-item ${activeEffectOption.trendingVideoEffect ? 'active' : ''}`}
                                                id="trending-video-effect"
                                                title="Trending"
                                                onClick={() => handleMenuEffectOptionClick('trendingVideoEffect')}> Trending </MenuItem>
                                            <MenuItem
                                                className={`nightclub-video-effect dropdown-item ${activeEffectOption.nightclubVideoEffect ? 'active' : ''}`}
                                                id="nightclub-video-effect"
                                                title="Nightclub"
                                                onClick={() => handleMenuEffectOptionClick('nightclubVideoEffect')}> Nightclub </MenuItem>
                                            <MenuItem
                                                className={`lens-video-effect dropdown-item ${activeEffectOption.lensVideoEffect ? 'active' : ''}`}
                                                id="lens-video-effect"
                                                title="Lens"
                                                onClick={() => handleMenuEffectOptionClick('lensVideoEffect')}> Lens </MenuItem>
                                            <MenuItem
                                                className={`retro-video-effect dropdown-item ${activeEffectOption.retroVideoEffect ? 'active' : ''}`}
                                                id="retro-video-effect"
                                                title="Retro"
                                                onClick={() => handleMenuEffectOptionClick('retroVideoEffect')}> Retro </MenuItem>
                                            <MenuItem
                                                className={`tv-video-effect dropdown-item ${activeEffectOption.tvVideoEffect ? 'active' : ''}`}
                                                id="tv-video-effect"
                                                title="TV"
                                                onClick={() => handleMenuEffectOptionClick('tvVideoEffect')}> TV </MenuItem>
                                            <MenuItem
                                                className={`star-video-effect dropdown-item ${activeEffectOption.starVideoEffect ? 'active' : ''}`}
                                                id="star-video-effect"
                                                title="Star"
                                                onClick={() => handleMenuEffectOptionClick('starVideoEffect')}> Star </MenuItem>
                                        </SubMenu>

                                        <SubMenu id="btn-dropdown" className="btn-dropdown" label="Body effect"
                                                 title="Body effect">
                                            <MenuItem
                                                className={`trending-body-effect dropdown-item ${activeEffectOption.trendingBodyEffect ? 'active' : ''}`}
                                                id="trending-body-effect"
                                                title="Trending"
                                                onClick={() => handleMenuEffectOptionClick('trendingBodyEffect')}> Trending </MenuItem>
                                            <MenuItem
                                                className={`mood-body-effect dropdown-item ${activeEffectOption.moodBodyEffect ? 'active' : ''}`}
                                                id="mood-body-effect"
                                                title="Mood"
                                                onClick={() => handleMenuEffectOptionClick('moodBodyEffect')}> Mood </MenuItem>
                                            <MenuItem
                                                className={`mask-body-effect dropdown-item ${activeEffectOption.maskBodyEffect ? 'active' : ''}`}
                                                id="mask-body-effect"
                                                title="Mask"
                                                onClick={() => handleMenuEffectOptionClick('maskBodyEffect')}> Mask </MenuItem>
                                            <MenuItem
                                                className={`selfie-body-effect dropdown-item ${activeEffectOption.selfieBodyEffect ? 'active' : ''}`}
                                                id="selfie-body-effect"
                                                title="Selfie"
                                                onClick={() => handleMenuEffectOptionClick('selfieBodyEffect')}> Selfie </MenuItem>
                                        </SubMenu>
                                    </Menu>
                                </Sidebar>;
                            </div>
                            <div className="effect-list-type-effect effect-list-type">
                                <div className="search-effect">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-search">
                                        <circle cx="11" cy="11" r="8"/>
                                        <path d="m21 21-4.3-4.3"/>
                                    </svg>
                                    <input className="search-input" type="text" name="search-audio"
                                           placeholder="search for effect"/>
                                </div>
                                {activeEffectOption.trendingVideoEffect &&
                                    <div className="trending-video-effect-wrapper effect-option"
                                         id="trending-video-effect-wrapper">
                                        <h3>Trending</h3>
                                        <div
                                            className="list-file-trending-video-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-trending-effect list-effect-file">
                                                {effectFiles.trending.map((effect, index) => (
                                                    <div className="file-trending-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.nightclubVideoEffect &&
                                    <div className="nightclub-video-effect-wrapper effect-option"
                                         id="nightclub-video-effect-wrapper"
                                    >
                                        <h3>nightclub</h3>
                                        <div
                                            className="list-file-nightclub-video-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-nightclub-effect list-effect-file">
                                                {effectFiles.nightclub.map((effect, index) => (
                                                    <div className="file-nightclub-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.lensVideoEffect &&
                                    <div className="lens-video-effect-wrapper effect-option"
                                         id="lens-video-effect-wrapper"
                                    >
                                        <h3>lens</h3>
                                        <div className="list-file-lens-video-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-lens-effect list-effect-file">
                                                {effectFiles.lens.map((effect, index) => (
                                                    <div className="file-lens-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.retroVideoEffect &&
                                    <div className="retro-video-effect-wrapper effect-option"
                                         id="retro-video-effect-wrapper">
                                        <h3>retro</h3>
                                        <div className="list-file-retro-video-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-retro-effect list-effect-file">
                                                {effectFiles.retro.map((effect, index) => (
                                                    <div className="file-retro-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.tvVideoEffect &&
                                    <div className="tv-video-effect-wrapper effect-option"
                                         id="tv-video-effect-wrapper"
                                    >
                                        <h3>tv</h3>
                                        <div className="list-file-tv-video-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-tv-effect list-effect-file">
                                                {effectFiles.tv.map((effect, index) => (
                                                    <div className="file-tv-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.starVideoEffect &&
                                    <div className="star-video-effect-wrapper effect-option"
                                         id="star-video-effect-wrapper">
                                        <h3>star</h3>
                                        <div className="list-file-star-video-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-star-effect list-effect-file">
                                                {effectFiles.star.map((effect, index) => (
                                                    <div className="file-star-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.trendingBodyEffect &&
                                    <div className="trending-body-effect-wrapper effect-option"
                                         id="trending-body-effect-wrapper">
                                        <h3>Trending</h3>
                                        <div
                                            className="list-file-trending-body-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-trending-effect list-effect-file">
                                                {effectFiles.trending_body.map((effect, index) => (
                                                    <div className="file-trending-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.moodBodyEffect &&
                                    <div className="mood-body-effect-wrapper effect-option"
                                         id="mood-body-effect-wrapper">
                                        <h3>mood</h3>
                                        <div className="list-file-mood-body-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-mood-effect list-effect-file">
                                                {effectFiles.mood_body.map((effect, index) => (
                                                    <div className="file-mood-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.maskBodyEffect &&
                                    <div className="mask-body-effect-wrapper effect-option"
                                         id="mask-body-effect-wrapper">
                                        <h3>mask</h3>
                                        <div className="list-file-mask-body-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-mask-effect list-effect-file">
                                                {effectFiles.mask_body.map((effect, index) => (
                                                    <div className="file-mask-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeEffectOption.selfieBodyEffect &&
                                    <div className="selfie-body-effect-wrapper effect-option"
                                         id="selfie-body-effect-wrapper">
                                        <h3>selfie</h3>
                                        <div className="list-file-selfie-body-effect-wrapper list-effect-file-wrapper">
                                            <div className="list-file-selfie-effect list-effect-file">
                                                {effectFiles.selfie_body.map((effect, index) => (
                                                    <div className="file-selfie-effect effect-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, effect, index, "effect")}>
                                                            <img src={effect.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {activeWrapper.filter &&
                        <div className="effect-list-filter-wrapper effect-list-option-wrapper"
                             id="effect-list-filter-wrapper">
                            <div className="effect-list-filter effect-list-option">
                                <Sidebar className="effect-type-filter effect-type-option">
                                    <Menu className="dropdown">
                                        <SubMenu id="btn-dropdown" className="btn-dropdown" label="Filter"
                                                 title="Filter">
                                            <MenuItem
                                                className={`featured-filter dropdown-item ${activeFilterOption.featuredFilter ? 'active' : ''}`}
                                                id="featured-filter"
                                                title="Featured"
                                                onClick={() => handleMenuFilterOptionClick('featuredFilter')}> Featured </MenuItem>
                                            <MenuItem
                                                className={`life-filter dropdown-item ${activeFilterOption.lifeFilter ? 'active' : ''}`}
                                                id="life-filter"
                                                title="Life"
                                                onClick={() => handleMenuFilterOptionClick('lifeFilter')}> Life </MenuItem>
                                            <MenuItem
                                                className={`scenery-filter dropdown-item ${activeFilterOption.sceneryFilter ? 'active' : ''}`}
                                                id="scenery-filter"
                                                title="Scenery"
                                                onClick={() => handleMenuFilterOptionClick('sceneryFilter')}> Scenery </MenuItem>
                                            <MenuItem
                                                className={`movies-filter dropdown-item ${activeFilterOption.moviesFilter ? 'active' : ''}`}
                                                id="movies-filter"
                                                title="Movies"
                                                onClick={() => handleMenuFilterOptionClick('moviesFilter')}> Movies </MenuItem>
                                            <MenuItem
                                                className={`retro-filter dropdown-item ${activeFilterOption.retroFilter ? 'active' : ''}`}
                                                id="retro-filter"
                                                title="Retro"
                                                onClick={() => handleMenuFilterOptionClick('retroFilter')}> Retro </MenuItem>
                                            <MenuItem
                                                className={`style-filter dropdown-item ${activeFilterOption.styleFilter ? 'active' : ''}`}
                                                id="style-filter"
                                                title="Style"
                                                onClick={() => handleMenuFilterOptionClick('styleFilter')}> Style </MenuItem>
                                        </SubMenu>
                                    </Menu>
                                </Sidebar>;
                            </div>
                            <div className="effect-list-type-filter effect-list-type">
                                <div className="search-filter search-effect">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="lucide lucide-search">
                                        <circle cx="11" cy="11" r="8"/>
                                        <path d="m21 21-4.3-4.3"/>
                                    </svg>
                                    <input className="search-input" type="text" name="search-audio"
                                           placeholder="search for filter"/>
                                </div>

                                {activeFilterOption.featuredFilter &&
                                    <div className="featured-filter-wrapper effect-option"
                                         id="featured-filter-wrapper">
                                        <h3>featured</h3>
                                        <div className="list-file-featured-filter-wrapper list-filter-file-wrapper">
                                            <div className="list-file-featured-effect list-filter-file">
                                                {filterFiles.featured.map((filter, index) => (
                                                    <div className="file-featured-effect filter-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, filter, index, "filter")}>
                                                            <img src={filter.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeFilterOption.lifeFilter &&
                                    <div className="life-filter-wrapper effect-option"
                                         id="life-filter-wrapper">
                                        <h3>life</h3>
                                        <div className="list-file-life-filter-wrapper list-filter-file-wrapper">
                                            <div className="list-file-life-effect list-filter-file">
                                                {filterFiles.life.map((filter, index) => (
                                                    <div className="file-life-effect filter-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, filter, index, "filter")}>
                                                            <img src={filter.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeFilterOption.sceneryFilter &&
                                    <div className="scenery-filter-wrapper effect-option"
                                         id="scenery-filter-wrapper">
                                        <h3>scenery</h3>
                                        <div className="list-file-scenery-filter-wrapper list-filter-file-wrapper">
                                            <div className="list-file-scenery-effect list-filter-file">
                                                {filterFiles.featured.map((filter, index) => (
                                                    <div className="file-scenery-effect filter-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, filter, index, "filter")}>
                                                            <img src={filter.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeFilterOption.moviesFilter &&
                                    <div className="movies-filter-wrapper effect-option"
                                         id="movies-filter-wrapper">
                                        <h3>movies</h3>
                                        <div className="list-file-movies-filter-wrapper list-filter-file-wrapper">
                                            <div className="list-file-movies-effect list-filter-file">
                                                {filterFiles.movies.map((filter, index) => (
                                                    <div className="file-movies-effect filter-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, filter, index, "filter")}>
                                                            <img src={filter.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeFilterOption.retroFilter &&
                                    <div className="retro-filter-wrapper effect-option"
                                         id="retro-filter-wrapper">
                                        <h3>retro</h3>
                                        <div className="list-file-retro-filter-wrapper list-filter-file-wrapper">
                                            <div className="list-file-retro-effect list-filter-file">
                                                {filterFiles.retro.map((filter, index) => (
                                                    <div className="file-retro-effect filter-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, filter, index, "filter")}>
                                                            <img src={filter.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeFilterOption.styleFilter &&
                                    <div className="style-filter-wrapper effect-option"
                                         id="style-filter-wrapper">
                                        <h3>style</h3>
                                        <div className="list-file-style-filter-wrapper list-filter-file-wrapper">
                                            <div className="list-file-style-effect list-filter-file">
                                                {filterFiles.style.map((filter, index) => (
                                                    <div className="file-style-effect filter-file">
                                                        <div className="file"
                                                             draggable
                                                             onDragStart={(e) => handleDragStart(e, filter, index, "filter")}>
                                                            <img src={filter.image} alt="Description"/>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24"
                                                                 viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="2"
                                                                 strokeLinecap="round"
                                                                 strokeLinejoin="round"
                                                                 className="lucide lucide-circle-plus">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                </div>
                <div className="player-wrapper">
                    <div className="player-nav">
                        <span>Player</span>
                    </div>
                    <div className="player-wrap">
                        <div
                            id="canvas-cover"
                            className="player-show"
                            style={{
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: 'black',
                                    width: `${scaleValueWidth}%`,
                                    height: `${scaleValueHeight}%`,
                                    position: 'absolute',
                                    top: `${(1 - (scaleValueHeight / 100)) * 50}%`,
                                    left: `${(1 - (scaleValueWidth / 100)) * 50}%`,
                                }}
                            >
                                {videoUrlTranslate ? (
                                    <video
                                        key={videoUrlTranslate}
                                        id="player"
                                        ref={videoRef}
                                        width="100%"
                                        height="100%"
                                        src={videoUrlTranslate}
                                    />
                                ) : (
                                    <video id="player"></video>
                                )}
                            </div>
                        </div>


                        <Stage width={videoWidth} height={videoHeight} style={{
                            position: "absolute",
                            top: "4rem",
                            left: "43rem",
                            width: "26.5rem",
                            height: "15rem",
                            pointerEvents: "none"
                        }}>
                            <Layer
                                style={{
                                    zIndex: 5,
                                }}>
                                {timelinesText.map((timeline) => (
                                    timeline.texts.map((textSegment, index) => (
                                        currentTime >= textSegment.startTime && currentTime <= textSegment.endTime ? (
                                            <Text
                                                key={`${index}`}
                                                x={textSegment.positionX}
                                                y={textSegment.positionY}
                                                text={
                                                    textSegment.styleOfText === "uppercase"
                                                        ? textSegment.content.toUpperCase()
                                                        : textSegment.styleOfText === "lowercase"
                                                            ? textSegment.content.toLowerCase()
                                                            : textSegment.content
                                                }
                                                opacity={parseInt(textSegment.opacity)}
                                                rotation={parseInt(textSegment.rotate)}
                                                fontSize={textSegment.fontSize ? parseInt(textSegment.fontSize) : 16}
                                                fill={textSegment.style && textSegment.style.color ? textSegment.style.color : "black"}
                                                fontFamily={textSegment.fontStyle || "Arial"}
                                                stroke={textSegment.style && textSegment.style.strokeColor ? textSegment.style.strokeColor : null}
                                                strokeWidth={textSegment.style && textSegment.style.strokeWidth ? parseInt(textSegment.style.strokeWidth) : 0}
                                                shadowColor={textSegment.style && textSegment.style.textShadow ? "rgba(255, 223, 0, 0.8)" : null}
                                                shadowBlur={textSegment.style && textSegment.style.textShadow ? 20 : 0}
                                                fontStyle={
                                                    (textSegment.blod || textSegment.style.fontWeight === "bold" ? "bold" : "normal") +
                                                    (textSegment.italic || textSegment.style.fontStyle === "italic" ? " italic" : "")
                                                }
                                                textDecoration={textSegment.underline ? "underline" : null}
                                                shadowOffset={{x: 0, y: 0}}
                                                draggable
                                                onDragEnd={(e) => handleDragEnd(e, index, "text")}
                                            />
                                        ) : null
                                    ))
                                ))}
                                {timelinesSticker.map((timeline) =>
                                    timeline.stickers.map((stickerSegment, index) => {
                                        if (currentTime >= stickerSegment.startTime && currentTime <= stickerSegment.endTime) {
                                            const frames = stickerFrames[stickerSegment.id];
                                            const frameIndex = currentFrameIndex[stickerSegment.id];

                                            if (frames && frames[frameIndex]) {
                                                return (
                                                    <Image
                                                        x={stickerSegment.positionX}
                                                        y={stickerSegment.positionY}
                                                        width={100}
                                                        height={100}
                                                        key={`${index}`}
                                                        image={frames[frameIndex]}
                                                        draggable
                                                        onDragEnd={(e) => handleDragEnd(e, index, "sticker")}
                                                    />
                                                );
                                            }

                                            return null;
                                        }

                                        return null;
                                    })
                                )}
                            </Layer>
                        </Stage>


                        <div className="player-actions">
                            <div className="time-play-player">
                                <span>{currentTime ? formatTime(currentTime) : "0:00"}</span>
                            </div>
                            <div className="time-player">
                                <span>{totalDuration ? formatTime(totalDuration) : "0:00"}</span>
                            </div>
                            <div className="action-player">
                                <button id="playPause" className="btn"
                                        onClick={handleEffectClick}
                                >
                                    {playVideo ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round"
                                             className="lucide lucide-pause">
                                            <rect x="14" y="4" width="4" height="16" rx="1"/>
                                            <rect x="6" y="4" width="4" height="16" rx="1"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round"
                                             className="lucide lucide-play">
                                            <polygon points="6 3 20 12 6 21 6 3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div id="zoom" className="zoom-player">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-scan-search">
                                    <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                                    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                                    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                                    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="m16 16-1.9-1.9"/>
                                </svg>
                            </div>
                            <div className="display-player">

                            </div>
                            <div id="fullScreen" className="full-screen-player">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-expand">
                                    <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/>
                                    <path d="M3 16.2V21m0 0h4.8M3 21l6-6"/>
                                    <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/>
                                    <path d="M3 7.8V3m0 0h4.8M3 3l6 6"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detail-wrapper">
                    <div className="detail-nav">
                        <nav className="detail-nav-type">
                            {editType.video &&
                                <div className="detail-video detail-type">
                                    <div className="detail-wrap" id="video-video"
                                         onClick={() => handleMenuVideoOptionClick('video')}>
                                        <button>Video</button>
                                    </div>
                                    <div className="detail-wrap" id="video-animation"
                                         onClick={() => handleMenuVideoOptionClick('animation')}>
                                        <button>Animation</button>
                                    </div>
                                </div>
                            }
                            {editType.audio &&
                                <div className="detail-audio detail-type">
                                    <div className="detail-wrap"
                                         onClick={() => handleMenuEditAudioOptionClick('basic')}>
                                        <button>Basic</button>
                                    </div>
                                    <div className="detail-wrap"
                                         onClick={() => handleMenuEditAudioOptionClick('voice_changer')}>
                                        <button>Voice Changer</button>
                                    </div>
                                </div>
                            }
                            {editType.text &&
                                <div className="detail-text detail-type">
                                    <div className="detail-wrap"
                                         onClick={() => handleMenuEditTextOptionClick('text')}>
                                        <button>Text</button>
                                    </div>
                                    <div className="detail-wrap"
                                         onClick={() => handleMenuEditTextOptionClick('animation')}>
                                        <button>Animation</button>
                                    </div>
                                    <div className="detail-wrap"
                                         onClick={() => handleMenuEditTextOptionClick('text_to_speed')}>
                                        <button>Text to speech</button>
                                    </div>
                                </div>
                            }
                            {editType.sticker &&
                                <div className="detail-sticker detail-type">
                                    <div className="detail-wrap"
                                         onClick={() => handleMenuEditStickerOptionClick('sticker')}>
                                        <button>Sticker</button>
                                    </div>
                                    <div className="detail-wrap"
                                         onClick={() => handleMenuEditStickerOptionClick('animation')}>
                                        <button>Animation</button>
                                    </div>
                                </div>
                            }
                            {editType.effect &&
                                <div className="detail-effect detail-type">
                                    <div className="detail-wrap">
                                        <button>Effect</button>
                                    </div>
                                </div>
                            }
                            {editType.filter &&
                                <div className="detail-filter detail-type">
                                    <div className="detail-wrap">
                                        <button>Filter</button>
                                    </div>
                                </div>
                            }
                        </nav>
                    </div>
                    <div className="detail-edit">
                        {editType.video &&
                            <div className="detail-edit-video-type detail-edit-wrapper">
                                <div className="detail-edit-video-video detail-edit-wrap">
                                    {editVideoOption.video &&
                                        <ul className="detail-edit-video-basic-wrap edit-parameters-wrap"
                                            id="video-video-basic-option">
                                            <Sidebar className="detail-edit-video detail-edit-video-basic-transform">
                                                <Menu className="dropdown">
                                                    <SubMenu title="Transform" label="Transform" id="btn-dropdown"
                                                             className="btn-dropdown">
                                                        <MenuItem className="slider-container">
                                                            <label htmlFor="scale-slider">Scale</label>
                                                            <input
                                                                type="range"
                                                                id="scale-slider"
                                                                className="slider"
                                                                min="1"
                                                                max="400"
                                                                value={scaleValue}
                                                                onChange={updateSliderValue}
                                                            />
                                                            <input
                                                                type="text"
                                                                id="slider-value"
                                                                className="slider-value"
                                                                value={`${scaleValue}%`}
                                                                onInput={(e) => updateSlider(e.target.value)}
                                                            />
                                                            <div className="slider-buttons">
                                                                <button className="slider-up"
                                                                        onClick={() => increaseSlider()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-down"
                                                                        onClick={() => decreaseSlider()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem className="slider-container slider-width-container">
                                                            <label htmlFor="scale-slider scale-width-slider">Scale
                                                                width</label>
                                                            <input type="range" id="scale-width-slider"
                                                                   className="slider"
                                                                   min="1"
                                                                   max="400"
                                                                   value={scaleValueWidth}
                                                                   onChange={updateSliderWidthValue}/>
                                                            <input type="text" id="slider-width-value"
                                                                   className="slider-value"
                                                                   value={`${scaleValueWidth}%`}
                                                                   onInput={(e) => updateSliderWidth(e.target.value)}/>
                                                            <div className="slider-buttons slider-width-buttons">
                                                                <button className="slider-up slider-width-up"
                                                                        onClick={() => increaseSliderWidth()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-down slider-width-down"
                                                                        onClick={() => decreaseSliderWidth()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem className="slider-container slider-height-container">
                                                            <label htmlFor="scale-slider scale-height-slide">Scale
                                                                height</label>
                                                            <input type="range" id="scale-height-slider"
                                                                   className="slider"
                                                                   min="1"
                                                                   max="400"
                                                                   value={scaleValueHeight}
                                                                   onChange={updateSliderHeightValue}/>
                                                            <input type="text" id="slider-height-value"
                                                                   className="slider-value"
                                                                   value={`${scaleValueHeight}%`}
                                                                   onInput={(e) => updateSliderHeight(e.target.value)}/>
                                                            <div className="slider-buttons slider-height-buttons">
                                                                <button className="slider-up slider-height-up"
                                                                        onClick={() => increaseSliderHeight()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-down slider-height-down"
                                                                        onClick={() => decreaseSliderHeight()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem className="uniform-slider">
                                                            <span>Uniform scale</span>
                                                            <label>
                                                                <input type="checkbox" className="uniform-slider-check"
                                                                       id="uniform-slider-check"/>
                                                                <div className="slider-check"></div>
                                                            </label>
                                                        </MenuItem>
                                                        <MenuItem className="slider-container position-video">
                                                            <span>position</span>
                                                            <div className="position-video position-x">
                                                                <label htmlFor="position-x-value">X</label>
                                                                <input type="text" id="position-x-value"
                                                                       className="slider-value position-x-value"
                                                                       value={positionX}
                                                                       onInput={(e) => updatePositionX(Math.max(0, Math.min(e.target.value, 5000)))}/>
                                                                <div className="slider-buttons position-x-buttons">
                                                                    <button className="slider-up position-x-up"
                                                                            onClick={() => increasePositionX()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="slider-down position-x-down"
                                                                            onClick={() => decreasePositionX()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="position-video position-y">
                                                                <label htmlFor="position-y-value">Y</label>
                                                                <input type="text" id="position-y-value"
                                                                       className="slider-value position-y-value"
                                                                       value={positionY}
                                                                       onInput={(e) => updatePositionY(Math.max(0, Math.min(e.target.value, 5000)))}/>
                                                                <div className="slider-buttons position-y-buttons">
                                                                    <button className="slider-up position-y-up"
                                                                            onClick={() => increasePositionY()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="slider-down position-y-down"
                                                                            onClick={() => decreasePositionY()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem className="slider-container rotate-video">
                                                            <span>rotate</span>
                                                            <div className="position-video rotate">
                                                                <input type="text" id="rotate-value"
                                                                       className="slider-value rotate-value"
                                                                       value={rotateValue}
                                                                       onInput={(e) => updateRotate(e.target.value)}/>
                                                                <div className="slider-buttons rotate-buttons">
                                                                    <button className="slider-up rotate-up"
                                                                            onClick={() => increaseRotate()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="slider-down rotate-down"
                                                                            onClick={() => decreaseRotate()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </MenuItem>
                                                    </SubMenu>
                                                    <SubMenu title="Blend" label="Blend" id="btn-dropdown"
                                                             className="btn-dropdown">
                                                        <MenuItem
                                                            className="slider-container mode-video-basic-blend video-basic-option-edit">
                                                            <label>Mode</label>
                                                            <select
                                                                name="mode-video-type"
                                                                id="mode-video-type"
                                                                className="video-type-option mode-video-type"
                                                                value={blendMode}
                                                                onChange={handleBlendModeChange}
                                                            >
                                                                <option value="default">Default</option>
                                                                <option value="brighten">Brighten</option>
                                                                <option value="screen">Screen</option>
                                                                <option value="darken">Darken</option>
                                                                <option value="overlay">Overlay</option>
                                                                <option value="hardLight">Hard light</option>
                                                                <option value="multiply">Multiply</option>
                                                            </select>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container opacity-video-basic-blend video-basic-option-edit">
                                                            <label>Opacity</label>
                                                            <input
                                                                type="range"
                                                                id="opacity-slider"
                                                                className="slider"
                                                                min="0"
                                                                max="100"
                                                                value={opacity}
                                                                onInput={(e) => updateOpacityValue(e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                id="opacity-value"
                                                                className="slider-value"
                                                                value={`${opacity}%`}
                                                                onInput={(e) => updateOpacity(e.target.value)}
                                                            />
                                                            <div className="slider-buttons slider-opacity-buttons">
                                                                <button className="slider-up slider-up-opacity"
                                                                        onClick={increaseOpacity}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24" viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor" strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-down slider-down-opacity"
                                                                        onClick={decreaseOpacity}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24" viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor" strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                    </SubMenu>
                                                    <SubMenu title="Canvas" label="Canvas" id="btn-dropdown"
                                                             className="btn-dropdown">
                                                        {/* Canvas Option Dropdown */}
                                                        <MenuItem
                                                            className="type-video-basic-canvas video-basic-option-edit">
                                                            <select
                                                                name="video-basic-canvas-option"
                                                                className="video-basic-canvas-option"
                                                                value={canvasOption}
                                                                onChange={handleCanvasOptionChange}
                                                            >
                                                                <option value="none">None</option>
                                                                <option value="blur">Blur</option>
                                                                <option value="color">Color</option>
                                                                <option value="pattern">Pattern</option>
                                                            </select>
                                                        </MenuItem>

                                                        {/* Blur Option */}
                                                        {canvasOption === 'blur' && (
                                                            <MenuItem className="video-basic-blur-option">
                                                                <div className="blur-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="blur-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="blur-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="blur-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                            </MenuItem>
                                                        )}

                                                        {/* Color Option */}
                                                        {canvasOption === 'color' && (
                                                            <MenuItem className="video-basic-color-option">
                                                                <div className="color-option-wrap">
                                                                    <label htmlFor="color-picker">
                                                                        <img className="color-display" alt=""
                                                                             src={rainbow}/>
                                                                    </label>
                                                                    <input
                                                                        type="color"
                                                                        id="color-picker"
                                                                        name="color-picker"
                                                                        value={colorValue}
                                                                        onChange={handleColorChange}
                                                                        style={{display: 'none'}}
                                                                    />
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFFFFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#EEEEEE'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#DDDDDD'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCCCCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#BBBBBB'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#AAAAAA'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#999999'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#888888'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#777777'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#666666'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#555555'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#444444'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#333333'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#222222'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#111111'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#000000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FF0000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#EE0000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#DD0000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CC0000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#BB0000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#AA0000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#990000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#880000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#770000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#660000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#550000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#440000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#330000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#220000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#110000'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFFFCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFFF99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFFF66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFFF33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFFF00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCFFFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCFFCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCFF99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCFF66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCFF33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCFF00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99FFFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99FFCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99FF99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99FF66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99FF33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99FF00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66FFFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66FFCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66FF99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66FF66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66FF33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66FF00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33FFFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33FFCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33FF99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33FF66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33FF33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33FF00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00FFFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00FFCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00FF99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00FF66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00FF33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00FF00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFCCFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFCCCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFCC99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFCC66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFCC33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FFCC00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCCCFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCCCCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCCC99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCCC66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCCC33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CCCC00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99CCFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99CCCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99CC99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99CC66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99CC33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#99CC00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66CCFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66CCCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66CC99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66CC66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66CC33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#66CC00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33CCFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33CCCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33CC99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33CC66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33CC33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#33CC00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00CCFF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00CCCC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00CC99'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00CC66'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00CC33'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#00CC00'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FF99FF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FF99CC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FF9999'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FF9966'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FF9933'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#FF9900'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CC99FF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CC99CC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CC9999'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CC9966'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CC9933'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#CC9900'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#9999FF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#9999CC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#999999'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#999966'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#999933'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#999900'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#6699FF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#6699CC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#669999'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#669966'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#669933'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#669900'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#3399FF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#3399CC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#339999'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#339966'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#339933'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#339900'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#0099FF'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#0099CC'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#009999'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#009966'}}></div>
                                                                </div>

                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#009933'}}></div>
                                                                </div>
                                                                <div className="color-option-wrap">
                                                                    <div className="color-display"
                                                                         style={{backgroundColor: '#009900'}}></div>
                                                                </div>
                                                            </MenuItem>
                                                        )}

                                                        {/* Pattern Option */}
                                                        {canvasOption === 'pattern' && (
                                                            <MenuItem className="video-basic-pattern-option">
                                                                <div className="pattern-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="pattern-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="pattern-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="pattern-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="pattern-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="pattern-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                                <div className="pattern-option-wrap">
                                                                    <img src={imgTest} alt="Description"/>
                                                                </div>
                                                            </MenuItem>
                                                        )}
                                                    </SubMenu>
                                                    <SubMenu title="Voice" label="Voice" className="btn-dropdown">
                                                        <MenuItem className="slider-container voice-container">
                                                            <label htmlFor="voice-slider">Voice</label>
                                                            <input
                                                                type="range"
                                                                id="scale-voice"
                                                                className="voice slider"
                                                                min="-60"
                                                                max="6"
                                                                value={voiceValue}
                                                                onInput={(e) => updateVoiceValue(e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                id="voice-value"
                                                                className="voice-value slider-value"
                                                                value={`${voiceValue}dB`}
                                                                onInput={(e) => updateVoice(e.target.value)}
                                                            />
                                                            <div className="voice-buttons slider-buttons">
                                                                <button className="voice-up"
                                                                        onClick={() => increaseVoice()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="voice-down"
                                                                        onClick={() => decreaseVoice()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                    </SubMenu>
                                                    <SubMenu title="Speed" label="Speed" className="btn-dropdown">
                                                        <MenuItem className="slider-container speed-container">
                                                            <label htmlFor="speed-slider">Speed</label>
                                                            <input
                                                                type="range"
                                                                id="scale-speed"
                                                                className="speed slider"
                                                                min="1"
                                                                max="100"
                                                                value={speedValue}
                                                                onInput={(e) => updateSpeedValue(e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                id="speed-value"
                                                                className="speed-value slider-value"
                                                                value={`${speedValue}x`}
                                                                onInput={(e) => updateSpeed(e.target.value)}
                                                            />
                                                            <div className="speed-buttons slider-buttons">
                                                                <button className="speed-up"
                                                                        onClick={() => increaseSpeed()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="speed-down"
                                                                        onClick={() => decreaseSpeed()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                    </SubMenu>
                                                </Menu>
                                            </Sidebar>
                                        </ul>
                                    }
                                    {editVideoOption.animation &&
                                        <>
                                            <ul className="detail-edit-video-in-wrap edit-parameters-wrap"
                                                id="video-animation-in-option">
                                            </ul>
                                            <ul className="detail-edit-video-out-wrap edit-parameters-wrap"
                                                id="video-animation-out-option">
                                            </ul>
                                            <ul className="detail-edit-video-combo-wrap edit-parameters-wrap"
                                                id="video-animation-combo-option">
                                            </ul>
                                        </>
                                    }


                                </div>
                            </div>
                        }
                        {editType.audio &&
                            <div className="detail-edit-audio-type detail-edit-wrapper">
                                <div className="detail-edit-audio-basic detail-edit-wrap">
                                    {editAudioOption.basic &&
                                        <ul className="detail-edit-audio-basic-wrap edit-parameters-wrap"
                                            id="video-audio-basic-option">
                                            <Sidebar className="detail-edit-video detail-edit-audio-basic-transform">
                                                <Menu className="dropdown">
                                                    <MenuItem className="slider-container voice-audio-container">
                                                        <label htmlFor="voice-slider">Voice</label>
                                                        <input
                                                            type="range"
                                                            id="scale-voice"
                                                            className="voice slider"
                                                            min="-60"
                                                            max="6"
                                                            value={voiceValueAudio}
                                                            onChange={(e) => updateVoiceValueAudio(e.target.value)}
                                                            onInput={(e) => updateVoiceValueAudio(e.target.value)}
                                                        />
                                                        <input
                                                            type="text"
                                                            id="voice-value"
                                                            className="voice-value slider-value"
                                                            value={`${voiceValueAudio}dB`}
                                                            onInput={(e) => updateVoiceAudio(e.target.value)}
                                                        />
                                                        <div className="voice-audio-buttons slider-buttons">
                                                            <button className="voice-audio-up"
                                                                    onClick={() => increaseVoiceAudio()}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                     height="24"
                                                                     viewBox="0 0 24 24"
                                                                     fill="none" stroke="currentColor"
                                                                     strokeWidth="2"
                                                                     strokeLinecap="round"
                                                                     strokeLinejoin="round"
                                                                     className="lucide lucide-chevron-up">
                                                                    <path d="m18 15-6-6-6 6"/>
                                                                </svg>
                                                            </button>
                                                            <button className="voice-audio-down"
                                                                    onClick={() => decreaseVoiceAudio()}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                     height="24"
                                                                     viewBox="0 0 24 24"
                                                                     fill="none" stroke="currentColor"
                                                                     strokeWidth="2"
                                                                     strokeLinecap="round"
                                                                     strokeLinejoin="round"
                                                                     className="lucide lucide-chevron-down">
                                                                    <path d="m6 9 6 6 6-6"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem className="slider-container speed-audio-container">
                                                        <label htmlFor="speed-slider">Speed</label>
                                                        <input
                                                            type="range"
                                                            id="scale-audio-speed"
                                                            className="speed-audio slider"
                                                            min="1"
                                                            max="100"
                                                            value={speedValueAudio}
                                                            onInput={(e) => updateSpeedValueAudio(e.target.value)}
                                                        />
                                                        <input
                                                            type="text"
                                                            id="speed-audio-value"
                                                            className="speed-audio-value slider-value"
                                                            value={`${speedValueAudio}x`}
                                                            onInput={(e) => updateSpeedAudio(e.target.value)}
                                                        />
                                                        <div className="speed-audio-buttons slider-buttons">
                                                            <button className="speed-audio-up"
                                                                    onClick={() => increaseSpeedAudio()}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                     height="24"
                                                                     viewBox="0 0 24 24"
                                                                     fill="none" stroke="currentColor"
                                                                     strokeWidth="2"
                                                                     strokeLinecap="round"
                                                                     strokeLinejoin="round"
                                                                     className="lucide lucide-chevron-up">
                                                                    <path d="m18 15-6-6-6 6"/>
                                                                </svg>
                                                            </button>
                                                            <button className="speed-audio-down"
                                                                    onClick={() => decreaseSpeedAudio()}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                     height="24"
                                                                     viewBox="0 0 24 24"
                                                                     fill="none" stroke="currentColor"
                                                                     strokeWidth="2"
                                                                     strokeLinecap="round"
                                                                     strokeLinejoin="round"
                                                                     className="lucide lucide-chevron-down">
                                                                    <path d="m6 9 6 6 6-6"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </MenuItem>
                                                </Menu>
                                            </Sidebar>
                                        </ul>
                                    }
                                    {editAudioOption.voice_changer &&
                                        <>
                                            <ul className="detail-edit-video-in-wrap edit-parameters-wrap"
                                                id="video-animation-in-option">
                                            </ul>
                                            <ul className="detail-edit-video-out-wrap edit-parameters-wrap"
                                                id="video-animation-out-option">
                                            </ul>
                                            <ul className="detail-edit-video-combo-wrap edit-parameters-wrap"
                                                id="video-animation-combo-option">
                                            </ul>
                                        </>
                                    }
                                </div>
                            </div>
                        }
                        {editType.text &&
                            <div className="detail-edit-text-type detail-edit-wrapper">
                                <div className="detail-edit-text-video detail-edit-wrap">
                                    {editTextOption.text &&
                                        <ul className="detail-edit-text-text-wrap edit-parameters-wrap"
                                            id="video-text-text-option">
                                            <Sidebar className="detail-edit-video detail-edit-text-text-transform">
                                                <Menu className="dropdown">
                                                    <MenuItem
                                                        className="slider-container text-content-edit content-text-edit"
                                                        id="text-content-edit">
                                                        <textarea
                                                            value={textContent}
                                                            onChange={handleTextChange}
                                                        />
                                                    </MenuItem>
                                                    <MenuItem className="slider-container text-font-edit font-text-edit"
                                                              id="text-font-edit">
                                                        <label>Font</label>
                                                        <select
                                                            name="mode-text-type"
                                                            id="mode-text-type"
                                                            className="text-type-option mode-video-type"
                                                            value={fontText}
                                                            onChange={handleFontTextChange}
                                                        >
                                                            <option value="arial">Arial</option>
                                                            <option value="helvetica">Helvetica</option>
                                                            <option value="timesNewRoman">Times New Roman</option>
                                                            <option value="courierNew">Courier New</option>
                                                            <option value="verdana">Verdana</option>
                                                            <option value="georgia">Georgia</option>
                                                            <option value="tahoma">Tahoma</option>
                                                            <option value="comicSansMS">Comic Sans MS</option>
                                                            <option value="trebuchetMS">Trebuchet MS</option>
                                                            <option value="impact">Impact</option>
                                                        </select>
                                                    </MenuItem>
                                                    <MenuItem className="slider-container font-size-text-edit">
                                                        <label htmlFor="scale-text-slider">Font Size</label>
                                                        <input
                                                            type="range"
                                                            id="font-size-text-slider"
                                                            className="slider slider-text"
                                                            min="5"
                                                            max="300"
                                                            value={fontSizeText}
                                                            onChange={updateFontSizeTextValue}
                                                        />
                                                        <input
                                                            type="text"
                                                            id="font-size-text-slider-value"
                                                            className="font-size-text-slider-value slider-value"
                                                            value={fontSizeText}
                                                            onInput={(e) => updateFontSizeText(e.target.value)}
                                                        />
                                                        <div className="text-buttons slider-buttons">
                                                            <button className="slider-text-up"
                                                                    onClick={() => increaseFontSizeText()}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                     height="24"
                                                                     viewBox="0 0 24 24"
                                                                     fill="none" stroke="currentColor"
                                                                     strokeWidth="2"
                                                                     strokeLinecap="round"
                                                                     strokeLinejoin="round"
                                                                     className="lucide lucide-chevron-up">
                                                                    <path d="m18 15-6-6-6 6"/>
                                                                </svg>
                                                            </button>
                                                            <button className="slider-text-down"
                                                                    onClick={() => decreaseFontSizeText()}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                     height="24"
                                                                     viewBox="0 0 24 24"
                                                                     fill="none" stroke="currentColor"
                                                                     strokeWidth="2"
                                                                     strokeLinecap="round"
                                                                     strokeLinejoin="round"
                                                                     className="lucide lucide-chevron-down">
                                                                    <path d="m6 9 6 6 6-6"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem
                                                        className="slider-container text-pattern-edit pattern-text-edit"
                                                        id="text-pattern-edit">
                                                        <label>Pattern</label>
                                                        <button className="bold-btn" onClick={() => (setBlod(!blod))}>
                                                            <FaBold/></button>
                                                        <button className="underline-btn"
                                                                onClick={() => (setUnderline(!underline))}>
                                                            <FaUnderline/></button>
                                                        <button className="italic-btn"
                                                                onClick={() => (setItalic(!italic))}><FaItalic/>
                                                        </button>
                                                    </MenuItem>
                                                    <MenuItem className="slider-container text-case-edit case-text-edit"
                                                              id="text-case-edit">
                                                        <label>Case</label>
                                                        <button className="upper-case-btn"
                                                                onClick={() => (setStyleOfText("uppercase"))}>
                                                            <RxLetterCaseUppercase/></button>
                                                        <button className="lower-case-btn"
                                                                onClick={() => (setStyleOfText("lowercase"))}>
                                                            <RxLetterCaseLowercase/></button>
                                                        <button className="letter-case-btn"
                                                                onClick={() => (setStyleOfText("lettercase"))}>
                                                            <RxLetterCaseToggle/></button>
                                                    </MenuItem>
                                                    <SubMenu title="Transform" label="Transform" id="btn-dropdown"
                                                             className="btn-dropdown">
                                                        <MenuItem className="slider-container scale-text-edit">
                                                            <label htmlFor="scale-slider">Scale</label>
                                                            <input
                                                                type="range"
                                                                id="scale-text-slider"
                                                                className="slider slider-text"
                                                                min="1"
                                                                max="400"
                                                                value={scaleText}
                                                                onChange={updateScaleTextValue}
                                                            />
                                                            <input
                                                                type="text"
                                                                id="slider-text-value"
                                                                className="slider-value slider-text-value"
                                                                value={`${scaleText}%`}
                                                                onInput={(e) => updateSliderScaleText(e.target.value)}
                                                            />
                                                            <div className="slider-buttons slider-text-buttons">
                                                                <button className="slider-text-up"
                                                                        onClick={() => increaseSliderScaleText()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-text-down"
                                                                        onClick={() => decreaseSliderScaleText()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container slider-width-container scale-width-text-edit">
                                                            <label htmlFor="scale-slider scale-width-text-slider">Scale
                                                                width</label>
                                                            <input type="range" id="scale-width-text-slider"
                                                                   className="slider slider-text"
                                                                   min="1"
                                                                   max="400"
                                                                   value={scaleWidthText}
                                                                   onChange={updateSliderScaleWidthTextValue}/>
                                                            <input type="text" id="slider-width-text-value"
                                                                   className="slider-value slider-text-value"
                                                                   value={`${scaleWidthText}%`}
                                                                   onInput={(e) => updateSliderWidthText(e.target.value)}/>
                                                            <div className="slider-buttons slider-width-text-buttons">
                                                                <button className="slider-up slider-width-text-up"
                                                                        onClick={() => increaseSliderWidthText()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-down slider-width-text-down"
                                                                        onClick={() => decreaseSliderWidthText()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container slider-height-container scale-height-text-edit">
                                                            <label htmlFor="scale-slider scale-height-text-slide">Scale
                                                                height</label>
                                                            <input type="range" id="scale-height-text-slider"
                                                                   className="slider slider-text"
                                                                   min="1"
                                                                   max="400"
                                                                   value={scaleHeightText}
                                                                   onChange={updateSliderScaleHeightTextValue}/>
                                                            <input type="text" id="slider-height-text-value"
                                                                   className="slider-value slider-text-value"
                                                                   value={`${scaleHeightText}%`}
                                                                   onInput={(e) => updateSliderHeightText(e.target.value)}/>
                                                            <div className="slider-buttons slider-height-text-buttons">
                                                                <button className="slider-up slider-height-text-up"
                                                                        onClick={() => increaseSliderHeightText()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-down slider-height-text-down"
                                                                        onClick={() => decreaseSliderHeightText()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem className="uniform-slider uniform-text-slider">
                                                            <span>Uniform scale</span>
                                                            <label>
                                                                <input type="checkbox"
                                                                       className="uniform-slider-check uniform-slider-text-check"
                                                                       id="uniform-slider-text-check"/>
                                                                <div className="slider-text-check"></div>
                                                            </label>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container position-video position-text-edit">
                                                            <span>position</span>
                                                            <div
                                                                className="position-video position-x position-x-text-edit">
                                                                <label htmlFor="position-x-value">X</label>
                                                                <input type="text" id="position-x-text-value"
                                                                       className="slider-value position-x-text-value"
                                                                       value={positionXText}
                                                                       onInput={(e) => updatePositionXText(Math.max(0, Math.min(e.target.value, 5000)))}/>
                                                                <div
                                                                    className="slider-buttons position-x-buttons position-x-text-buttons">
                                                                    <button className="slider-up position-x-text-up"
                                                                            onClick={() => increasePositionXText()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="slider-down position-x-down"
                                                                            onClick={() => decreasePositionXText()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="position-video position-y position-y-text-edit">
                                                                <label htmlFor="position-y-value">Y</label>
                                                                <input type="text" id="position-y-text-value"
                                                                       className="slider-value position-y-text-value"
                                                                       value={positionYText}
                                                                       onInput={(e) => updatePositionYText(Math.max(0, Math.min(e.target.value, 5000)))}/>
                                                                <div
                                                                    className="slider-buttons position-y-buttons position-y-text-buttons">
                                                                    <button className="slider-up position-y-text-up"
                                                                            onClick={() => increasePositionYText()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="slider-down position-y-text-down"
                                                                            onClick={() => decreasePositionYText()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container rotate-video rotate-text-edit">
                                                            <span>rotate</span>
                                                            <div className="position-video rotate">
                                                                <input type="text" id="rotate-text-value"
                                                                       className="slider-value rotate-value rotate-text-value"
                                                                       value={rotateText}
                                                                       onInput={(e) => updateRotateText(e.target.value)}/>
                                                                <div
                                                                    className="slider-buttons rotate-buttons rotate-text-buttons">
                                                                    <button className="slider-up rotate-text-up"
                                                                            onClick={() => increaseRotateText()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="slider-down rotate-text-down"
                                                                            onClick={() => decreaseRotateText()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </MenuItem>
                                                    </SubMenu>
                                                    <SubMenu title="Blend" label="Blend" id="btn-dropdown"
                                                             className="btn-dropdown">
                                                        <MenuItem
                                                            className="slider-container opacity-text-basic-blend text-basic-option-edit">
                                                            <label>Opacity</label>
                                                            <input
                                                                type="range"
                                                                id="opacity-text-slider"
                                                                className="slider slider-text"
                                                                min="0"
                                                                max="100"
                                                                value={opacityText}
                                                                onInput={(e) => updateOpacityValueText(e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                id="opacity-text-value"
                                                                className="slider-value slider-text-value"
                                                                value={`${opacityText}%`}
                                                                onInput={(e) => updateOpacityText(e.target.value)}
                                                            />
                                                            <div
                                                                className="slider-buttons slider-opacity-buttons slider-opacity-text-buttons">
                                                                <button className="slider-up slider-up-text-opacity"
                                                                        onClick={increaseOpacityText}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24" viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor" strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-down slider-down-text-opacity"
                                                                        onClick={decreaseOpacityText}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24" viewBox="0 0 24 24" fill="none"
                                                                         stroke="currentColor" strokeWidth="2"
                                                                         strokeLinecap="round" strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                    </SubMenu>
                                                </Menu>
                                            </Sidebar>
                                        </ul>
                                    }
                                    {editTextOption.animation &&
                                        <>
                                            <ul className="detail-edit-video-in-wrap edit-parameters-wrap"
                                                id="video-animation-in-option">
                                            </ul>
                                            <ul className="detail-edit-video-out-wrap edit-parameters-wrap"
                                                id="video-animation-out-option">
                                            </ul>
                                            <ul className="detail-edit-video-combo-wrap edit-parameters-wrap"
                                                id="video-animation-combo-option">
                                            </ul>
                                        </>
                                    }
                                    {editTextOption.text_to_speed &&
                                        <>
                                            <ul className="detail-edit-video-in-wrap edit-parameters-wrap"
                                                id="video-animation-in-option">
                                            </ul>
                                            <ul className="detail-edit-video-out-wrap edit-parameters-wrap"
                                                id="video-animation-out-option">
                                            </ul>
                                            <ul className="detail-edit-video-combo-wrap edit-parameters-wrap"
                                                id="video-animation-combo-option">
                                            </ul>
                                        </>
                                    }
                                </div>
                            </div>
                        }
                        {editType.sticker &&
                            <div className="detail-edit-sticker-type detail-edit-wrapper">
                                <div className="detail-edit-sticker-sticker detail-edit-wrap">
                                    {editStickerOption.sticker &&
                                        <ul className="detail-edit-sticker-sticker-wrap edit-parameters-wrap"
                                            id="sticker-sticker-basic-option">
                                            <Sidebar
                                                className="detail-edit-video detail-edit-sticker-sticker-transform">
                                                <Menu className="dropdown">
                                                    <SubMenu title="Transform" label="Transform" id="btn-dropdown"
                                                             className="btn-dropdown">
                                                        <MenuItem className="slider-container slider-sticker-container">
                                                            <label htmlFor="scale-slider">Scale</label>
                                                            <input
                                                                type="range"
                                                                id="scale-sticker-slider"
                                                                className="slider slider-sticker"
                                                                min="1"
                                                                max="400"
                                                                value={scaleValueSticker}
                                                                onChange={updateSliderValueSticker}
                                                            />
                                                            <input
                                                                type="text"
                                                                id="slider-sticker-value"
                                                                className="slider-value slider-sticker-value"
                                                                value={`${scaleValueSticker}%`}
                                                                onInput={(e) => updateSliderSticker(e.target.value)}
                                                            />
                                                            <div className="slider-buttons slider-sticker-buttons">
                                                                <button className="slider-sticker-up"
                                                                        onClick={() => increaseSliderSticker()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="slider-sticker-down"
                                                                        onClick={() => decreaseSliderSticker()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container slider-width-sticker-container">
                                                            <label htmlFor="scale-slider scale-width-sticker-slider">Scale
                                                                width</label>
                                                            <input type="range" id="scale-width-sticker-slider"
                                                                   className="slider slider-sticker"
                                                                   min="1"
                                                                   max="400"
                                                                   value={scaleValueWidthSticker}
                                                                   onChange={updateSliderWidthValueSticker}/>
                                                            <input type="text" id="slider-width-sticker-value"
                                                                   className="slider-value slider-sticker-value"
                                                                   value={`${scaleValueWidthSticker}%`}
                                                                   onInput={(e) => updateSliderWidthSticker(e.target.value)}/>
                                                            <div
                                                                className="slider-buttons slider-width-sticker-buttons">
                                                                <button className="slider-up slider-width-sticker-up"
                                                                        onClick={() => increaseSliderWidthSticker()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    className="slider-down slider-width-sticker-down"
                                                                    onClick={() => decreaseSliderWidthSticker()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container slider-height-sticker-container">
                                                            <label htmlFor="scale-slider scale-height-sticker-slide">Scale
                                                                height</label>
                                                            <input type="range" id="scale-height-sticker-slider"
                                                                   className="slider slider-sticker"
                                                                   min="1"
                                                                   max="400"
                                                                   value={scaleValueHeightSticker}
                                                                   onChange={updateSliderHeightValueSticker}/>
                                                            <input type="text" id="slider-height-sticker-value"
                                                                   className="slider-value slider-sticker-value"
                                                                   value={`${scaleValueHeightSticker}%`}
                                                                   onInput={(e) => updateSliderHeightSticker(e.target.value)}/>
                                                            <div
                                                                className="slider-buttons slider-height-sticker-buttons">
                                                                <button className="slider-up slider-height-sticker-up"
                                                                        onClick={() => increaseSliderHeightSticker()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-up">
                                                                        <path d="m18 15-6-6-6 6"/>
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    className="slider-down slider-height-sticker-down"
                                                                    onClick={() => decreaseSliderHeightSticker()}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                         height="24"
                                                                         viewBox="0 0 24 24"
                                                                         fill="none" stroke="currentColor"
                                                                         strokeWidth="2"
                                                                         strokeLinecap="round"
                                                                         strokeLinejoin="round"
                                                                         className="lucide lucide-chevron-down">
                                                                        <path d="m6 9 6 6 6-6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem className="uniform-slider uniform-sticker-slider">
                                                            <span>Uniform scale</span>
                                                            <label>
                                                                <input type="checkbox"
                                                                       className="uniform-slider-check uniform-slider-sticker-check"
                                                                       id="uniform-slider-sticker-check"/>
                                                                <div className="slider-sticker-check"></div>
                                                            </label>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container position-video position-sticker">
                                                            <span>position</span>
                                                            <div
                                                                className="position-video position-x position-x-sticker">
                                                                <label htmlFor="position-x-value">X</label>
                                                                <input type="text" id="position-x-sticker-value"
                                                                       className="slider-value position-x-sticker-value"
                                                                       value={positionXSticker}
                                                                       onInput={(e) => updatePositionXSticker(Math.max(0, Math.min(e.target.value, 5000)))}/>
                                                                <div
                                                                    className="slider-buttons position-x-buttons position-x-sticker-buttons">
                                                                    <button className="slider-up position-x-sticker-up"
                                                                            onClick={() => increasePositionXSticker()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        className="slider-down position-x-sticker-down"
                                                                        onClick={() => decreasePositionXSticker()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="position-video position-y position-y-sticker">
                                                                <label htmlFor="position-y-value">Y</label>
                                                                <input type="text" id="position-y-sticker-value"
                                                                       className="slider-value position-y-sticker-value"
                                                                       value={positionYSticker}
                                                                       onInput={(e) => updatePositionYSticker(Math.max(0, Math.min(e.target.value, 5000)))}/>
                                                                <div
                                                                    className="slider-buttons position-y-buttons position-y-sticker-buttons">
                                                                    <button className="slider-up position-y-sticker-up"
                                                                            onClick={() => increasePositionYSticker()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        className="slider-down position-y-sticker-down"
                                                                        onClick={() => decreasePositionYSticker()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem
                                                            className="slider-container rotate-video rotate-sticker">
                                                            <span>rotate</span>
                                                            <div className="position-video rotate">
                                                                <input type="text" id="rotate-value"
                                                                       className="slider-value rotate-value rotate-sticker-value"
                                                                       value={rotateValueSticker}
                                                                       onInput={(e) => updateRotateSticker(e.target.value)}/>
                                                                <div
                                                                    className="slider-buttons rotate-buttons rotate-sticker-buttons">
                                                                    <button className="slider-up rotate-sticker-up"
                                                                            onClick={() => increaseRotateSticker()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-up">
                                                                            <path d="m18 15-6-6-6 6"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="slider-down rotate-sticker-down"
                                                                            onClick={() => decreaseRotateSticker()}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24"
                                                                             height="24"
                                                                             viewBox="0 0 24 24"
                                                                             fill="none" stroke="currentColor"
                                                                             strokeWidth="2"
                                                                             strokeLinecap="round"
                                                                             strokeLinejoin="round"
                                                                             className="lucide lucide-chevron-down">
                                                                            <path d="m6 9 6 6 6-6"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </MenuItem>
                                                    </SubMenu>
                                                </Menu>
                                            </Sidebar>
                                        </ul>
                                    }
                                    {editStickerOption.animation &&
                                        <>
                                            <ul className="detail-edit-video-in-wrap edit-parameters-wrap"
                                                id="video-animation-in-option">
                                            </ul>
                                            <ul className="detail-edit-video-out-wrap edit-parameters-wrap"
                                                id="video-animation-out-option">
                                            </ul>
                                            <ul className="detail-edit-video-combo-wrap edit-parameters-wrap"
                                                id="video-animation-combo-option">
                                            </ul>
                                        </>
                                    }
                                </div>
                            </div>
                        }
                        {editType.effect &&
                            <div className="detail-edit-effect-type detail-edit-wrapper">
                                <div className="detail-edit-effect-effect detail-edit-wrap">
                                    <ul className="detail-edit-effect-effect-wrap edit-parameters-wrap"
                                        id="effect-effect-basic-option">
                                        <Sidebar className="detail-edit-video detail-edit-effect-effect-transform">
                                            <Menu className="dropdown">
                                                <MenuItem className="slider-container name-effect-container">
                                                    <label>Name: {effectName}</label>
                                                </MenuItem>
                                            </Menu>
                                        </Sidebar>
                                    </ul>
                                </div>
                            </div>
                        }
                        {editType.filter &&
                            <div className="detail-edit-video-type detail-edit-wrapper">
                                <div className="detail-edit-video-video detail-edit-wrap">
                                    <ul className="detail-edit-video-basic-wrap edit-parameters-wrap"
                                        id="video-video-basic-option">
                                        <Sidebar className="detail-edit-video detail-edit-filter-filter-transform">
                                            <Menu className="dropdown">
                                                <MenuItem className="slider-container name-filter-container">
                                                    <label>Name: {filterName}</label>
                                                </MenuItem>
                                            </Menu>
                                        </Sidebar>
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="edit-wrapper">
                <div className="timestamps">
                    {timestamps.map((time, index) => (
                        <div className="time-segment" style={{left: calculateLeftValue(index, timestamps.length)}}
                             key={index}>
                            {time}
                        </div>
                    ))}
                </div>
                <input
        ref={seekBarRef}
                    className="seek-bar"
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / totalDuration) * 100}
                    onInput={(e) => {
      console.log('Seek-bar input:', e.target.value);
      handleSeek(e);
  }}
                    style={{width: `${widthTime}%`}}

                />
                <div className="video-timeline">
                    {(timelineVideos?.length > 0 || timelinesText?.length > 0 || timelinesAudio?.length > 0 || timelinesSticker?.length > 0 || timelinesEffect?.length > 0 || timelinesFilter?.length > 0) && (
                        <div
                            className="some-timeline-dropzone-top some-timeline-dropzone timeline-dropzone"
                            onDrop={(e) => handleDrop(e, null)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
  onDragEnd={(e) => handleDragEnd(e)}
                        >
                        </div>
                    )}
                    {timelineVideos.map((timeline, timelineIndex) => (
                        <div
                            key={timelineIndex}
                            className="timeline"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, timelineIndex)}
                        >
                            {timeline.videos.map((file, index) => (
                                <div key={index} className="timeline-item"
                                     style={{left: `${file.position}%`, width: `${file.width}%`}}
                                     draggable="true"
                                     onDragStart={(e) => handleDragStart(e, file, timelineIndex, "video")}
                                     onClick={() => {
                                         handleMenuEditType("video");
                                         handleClick(file, "video");
                                         handleVideoSelect(file, timelineIndex, index);
                                     }}

                                     onDoubleClick={() => handleDoubleClick(file, "video")}>
                                    <div
                                        className="resize-handle resize-handle-left"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "video", "left")}
                                    />
                                    {isVideo(file.fileName) ? (
                                        <video
                                            src={file.url}
                                            style={{width: '100%'}}>
                                        </video>
                                    ) : (
                                        <img src={file.url} alt="File Thumbnail"/>
                                    )}
                                    <div
                                        className="resize-handle resize-handle-right"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "video", "right")}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                    {timelinesText.map((timeline, timelineIndex) => (
                        <div
                            key={timelineIndex}
                            className="timeline-text"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, timelineIndex)}>
                            {timeline.texts.map((textSegment, index) => (
                                <div
                                    key={index}
                                    className="text-segment"
                                    style={{
                                        left: `${textSegment.position}%`,
                                        width: `${textSegment.width}%`,
                                    }}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, textSegment, timelineIndex, "text")}
                                    onClick={() => {
                                        handleMenuEditType("text");
                                        handleClick(textSegment, "text");
                                        handleTextSelect(textSegment, timelineIndex, index);
                                    }}
                                    onDoubleClick={() => handleDoubleClick(textSegment, "text")}>
                                    <div
                                        className="resize-handle resize-handle-left"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "text", "left")}
                                    />
                                    <div className="text-img">
                                        <img src={textSegment.image}
                                             style={{width: '100%'}}
                                             alt="Text"/>
                                    </div>
                                    <div
                                        className="resize-handle resize-handle-right"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "text", "right")}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                    {timelinesAudio.map((timeline, timelineIndex) => (
                        <div
                            key={timelineIndex}
                            className="timeline-audio"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, timelineIndex)}>
                            {timeline.audios.map((audioSegment, index) => (
                                <div
                                    key={index}
                                    className="audio-segment"
                                    style={{
                                        left: `${audioSegment.position}%`,
                                        width: `${audioSegment.width}%`,
                                    }}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, audioSegment, timelineIndex, "audio")}
                                    onClick={() => {
                                        handleMenuEditType("audio");
                                        handleClick(audioSegment, "audio");
                                        handleTextSelect(audioSegment, timelineIndex, index);
                                    }}
                                    onDoubleClick={() => handleDoubleClick(audioSegment, "audio")}>
                                    <div
                                        className="resize-handle resize-handle-left"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "audio", "left")}
                                    />
                                    <div className="audio-img">
                                        <img src={audioSegment.image}
                                             style={{width: '100%'}}
                                             alt="Audio"/>
                                    </div>
                                    <div
                                        className="resize-handle resize-handle-right"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "audio", "right")}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                    {timelinesSticker.map((timeline, timelineIndex) => (
                        <div
                            key={timelineIndex}
                            className="timeline-sticker"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, timelineIndex)}>
                            {timeline.stickers.map((stickerSegment, index) => (
                                <div
                                    key={index}
                                    className="sticker-segment"
                                    style={{
                                        left: `${stickerSegment.position}%`,
                                        width: `${stickerSegment.width}%`,
                                    }}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, stickerSegment, timelineIndex, "sticker")}
                                    onClick={() => {
                                        handleMenuEditType("sticker");
                                        handleClick(stickerSegment, "sticker");
                                        handleTextSelect(stickerSegment, timelineIndex, index);
                                    }}
                                    onDoubleClick={() => handleDoubleClick(stickerSegment, "sticker")}>
                                    <div
                                        className="resize-handle resize-handle-left"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "sticker", "left")}
                                    />
                                    <div className="sticker-img">
                                        <img src={stickerSegment.url}
                                             style={{width: '100%'}}
                                             alt="Sticker"/>
                                    </div>
                                    <div
                                        className="resize-handle resize-handle-right"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "sticker", "right")}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                    {timelinesEffect.map((timeline, timelineIndex) => (
                        <div
                            key={timelineIndex}
                            className="timeline-effect"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, timelineIndex)}>
                            {timeline.effects.map((effectSegment, index) => (
                                <div
                                    key={index}
                                    className="effect-segment"
                                    style={{
                                        left: `${effectSegment.position}%`,
                                        width: `${effectSegment.width}%`,
                                    }}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, effectSegment, timelineIndex, "effect")}
                                    onClick={() => {
                                        handleMenuEditType("effect");
                                        handleClick(effectSegment, "effect");
                                        handleTextSelect(effectSegment, timelineIndex, index);
                                    }}
                                    onDoubleClick={() => handleDoubleClick(effectSegment, "effect")}>
                                    <div
                                        className="resize-handle resize-handle-left"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "effect", "left")}
                                    />
                                    <div className="effect-img">
                                        <img src={effectSegment.image}
                                             style={{width: '100%'}}
                                             alt="Effect"/>
                                    </div>
                                    <div
                                        className="resize-handle resize-handle-right"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "effect", "right")}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                    {timelinesFilter.map((timeline, timelineIndex) => (
                        <div
                            key={timelineIndex}
                            className="timeline-filter"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, timelineIndex)}>
                            {timeline.filters.map((filterSegment, index) => (
                                <div
                                    key={index}
                                    className="filter-segment"
                                    style={{
                                        left: `${filterSegment.position}%`,
                                        width: `${filterSegment.width}%`,
                                    }}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, filterSegment, timelineIndex, "filter")}
                                    onClick={() => {
                                        handleMenuEditType("filter");
                                        handleClick(filterSegment, "filter");
                                        handleTextSelect(filterSegment, timelineIndex, index);
                                    }}
                                    onDoubleClick={() => handleDoubleClick(filterSegment, "filter")}>
                                    <div
                                        className="resize-handle resize-handle-left"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "filter", "left")}
                                    />
                                    <div className="filter-img">
                                        <img src={filterSegment.image}
                                             style={{width: '100%'}}
                                             alt="Filter"/>
                                    </div>
                                    <div
                                        className="resize-handle resize-handle-right"
                                        onMouseDown={(e) => handleResizeStart(e, timelineIndex, index, "filter", "right")}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                    {(timelineVideos?.length > 0 || timelinesText?.length > 0 || timelinesAudio?.length > 0 || timelinesSticker?.length > 0 || timelinesEffect?.length > 0 || timelinesFilter?.length > 0) ? (
                        <div
                            className="some-timeline-dropzone-bottom some-timeline-dropzone timeline-dropzone"
                            onDrop={(e) => handleDrop(e, null)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
  onDragEnd={(e) => handleDragEnd(e)}
                        >
                        </div>
                    ) : (
                        <div
                            className="empty-timeline-dropzone timeline-dropzone"
                            onDrop={(e) => handleDrop(e, null)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
  onDragEnd={(e) => handleDragEnd(e)}
                        >
                        </div>
                    )}
                </div>

            </div>
        </div>
        </body>
    );
}

export default HomePage;
