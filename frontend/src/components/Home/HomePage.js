import React, {useEffect, useRef, useState} from "react";
import './HomePage.scss'
import logo from '../../assets/images/file.png';
import {NavLink, Outlet, Link} from "react-router-dom";
import {Menu, MenuItem, Sidebar, SubMenu} from "react-pro-sidebar";
import imgTest from '../../assets/images/Nitro_Wallpaper_01_3840x2400.jpg';
import imgTest1
    from '../../assets/images/cach-chen-chu-vao-anh-them-hieu-ung-trong-photoshop-bangabc-800x450-Photoroom.png';
import axios from 'axios';
import ReactPlayer from 'react-player';

const HomePage = () => {

    const videoRef = useRef(null);
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);

    const [listVideo, setListVideo] = useState([]);
    const [timelineVideos, setTimelineVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState({});
    const [timestamps, setTimestamps] = useState([]);
    const [timelines, setTimelines] = useState([{videos: []}]);

    const [playVideo, setPlayVideo] = useState(false);
    const [isShowVideoBasic, setShowVideoBasic] = useState(true);

    const [currentTime, setCurrentTime] = useState(0);
    const [widthTime, setWidthTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [durationTimeLine, setDurationTimeLine] = useState(0);
    const [textToAdd, setTextToAdd] = useState('');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [accumulatedTime, setAccumulatedTime] = useState(0);

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
        proEffect: false,
        basicEffect: false,
        multicolorEffect: false,

    });

    const handleMenuTextOptionClick = (option) => {
        setActiveTextOption({
            addText: false,
            trendingEffect: false,
            proEffect: false,
            basicEffect: false,
            multicolorEffect: false,
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (isVideo(file.name)) {
            const videoURL = URL.createObjectURL(file);

            const videoElement = document.createElement('video');
            videoElement.src = videoURL;

            videoElement.onloadedmetadata = () => {
                const fileTime = videoElement.duration;
                setListVideo([{url: videoURL, fileName: file.name, fileTime},
                    ...listVideo
                ]);

            };

        } else if (file) {
            const videoURL = URL.createObjectURL(file);
            setListVideo([{url: videoURL, fileName: file.name},
                ...listVideo
            ]);
        }
    };

    const handleVideoClick = (url, time) => {
        setSelectedVideo({url, time});
        setVideoUrl(url);
        setCurrentTime(0);
        setDuration(time);
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    const handleDragStart = (event, video) => {
        event.dataTransfer.setData("videoUrl", video.url);
        event.dataTransfer.setData("fileName", video.fileName);
    };

    const handleDrop = (event, timelineIndex = null) => {
        event.preventDefault();
        const videoUrl = event.dataTransfer.getData("videoUrl");
        const fileName = event.dataTransfer.getData("fileName");
        const video = listVideo.find(video => video.url === videoUrl);

        if (!video) {
            console.error("Video not found in listVideo");
            return;
        }

        const videoDuration = video.fileTime;
        const segmentWidth = videoDuration * 10;

        let updatedTimelines = [...timelines];

        if (timelineIndex === null) {
            updatedTimelines.push({
                videos: [{
                    url: videoUrl,
                    fileName,
                    duration: videoDuration,
                    width: segmentWidth,
                }]
            });
        } else {
            updatedTimelines[timelineIndex].videos.push({
                url: videoUrl,
                fileName,
                duration: videoDuration,
                width: segmentWidth,
            });
        }

        setTimelines(updatedTimelines);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleProgress = (progress) => {
        setCurrentTime(progress.playedSeconds);
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handleVideoEnd = () => {
        if (currentVideoIndex + 1 < timelineVideos.length) {
            setAccumulatedTime(accumulatedTime + timelineVideos[currentVideoIndex].duration);
            setCurrentVideoIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                return nextIndex < timelineVideos.length ? nextIndex : 0;
            });
        } else {
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
        }
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * durationTimeLine;
        let accumulated = 0;

        for (let i = 0; i < timelineVideos.length; i++) {
            if (accumulated + timelineVideos[i].duration >= seekTime) {
                setCurrentVideoIndex(i);
                const timeInCurrentVideo = seekTime - accumulated;
                videoRef.current.currentTime = timeInCurrentVideo;
                setCurrentTime(timeInCurrentVideo);
                setAccumulatedTime(accumulated);
                break;
            }
            accumulated += timelineVideos[i].duration;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        const fetchResponse = await fetch(selectedVideo.url);
        const blob = await fetchResponse.blob();

        formData.append('file', blob, 'video.mp4');
        formData.append('start', startTime);
        formData.append('end', endTime);

        const response = await fetch('http://localhost:8000/myapp/cut_video/', {
            method: 'POST',
            body: formData,
        });

        // Handle the response
        if (response.ok) {
            const data = await response.json();
            setVideoUrl(`http://localhost:8000${data.video_url}`);

            // Create a video element and set the source to the received video URL
            const videoElement = document.createElement('video');
            videoElement.src = `http://localhost:8000${data.video_url}`;

            videoElement.onloadedmetadata = () => {
                const fileTime = videoElement.duration;
                handleVideoClick(videoElement.src, fileTime);
            };
        } else {
            console.error('Failed to cut video');
        }
    };

    const handleTextSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        const fetchResponse = await fetch(selectedVideo.url);
        const blob = await fetchResponse.blob();

        formData.append('file', blob, 'video.mp4'); // Đảm bảo bạn đã có videoFile
        formData.append('text', textToAdd); // Gửi text đến backend

        const response = await fetch('http://localhost:8000/myapp/add_text_to_video/', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            setVideoUrl(`http://localhost:8000${data.video_url}`);

            // Create a video element and set the source to the received video URL
            const videoElement = document.createElement('video');
            videoElement.src = `http://localhost:8000${data.video_url}`;

            videoElement.onloadedmetadata = () => {
                const fileTime = videoElement.duration;
                handleVideoClick(videoElement.src, fileTime);
            };
        } else {
            console.error('Failed to add text to video');
        }

    };

    const handleTextChange = (e) => {
        setTextToAdd(e.target.value);
    };

    const handleExport = async () => {
        const formData = new FormData();

        for (const video of timelineVideos) {
            const response = await fetch(video.url);
            const blob = await response.blob();
            formData.append('videos', blob, video.fileName);
        }

        try {
            const response = await fetch('http://localhost:8000/myapp/merge_videos/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const videoUrl = `http://localhost:8000${data.merged_video_url}`;
                console.log('Video URL:', videoUrl);

                try {
                    const videoResponse = await fetch(videoUrl);
                    const videoBlob = await videoResponse.blob();

                    const videoObjectURL = URL.createObjectURL(videoBlob);

                    const link = document.createElement('a');
                    link.href = videoObjectURL;
                    link.download = 'merged_video.mp4';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    URL.revokeObjectURL(videoObjectURL);
                } catch (error) {
                    console.error('Error fetching or downloading video:', error);
                }
            } else {
                console.error('Failed to fetch the merged video URL.');
            }
        } catch (error) {
            console.error('Error:', error);
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

        return timestamps;
    };


    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            const handleTimeUpdate = () => {
                setCurrentTime(videoElement.currentTime);
            };

            videoElement.addEventListener('timeupdate', handleTimeUpdate);
            return () => {
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [selectedVideo])

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
        const totalDuration = timelineVideos.reduce((acc, video) => acc + video.duration, 0);
        setDurationTimeLine(totalDuration);
        setTimestamps(generateTimestamps(totalDuration, 5));
    }, [timelineVideos]);


    return (
        <body>
        <div className="body-wrapper">
            <div className="header">
                <div className="logo-wrap">
                    <img src={logo} alt="Video Thum"/>
                    <p>EditEase</p>
                </div>
                <div className="export-btn">
                    <button className="export" onClick={handleExport}>
                        Export
                    </button>
                </div>
                <div className="login-btn">
                    <Link className="btn-login-link" to="/login">Login</Link>
                </div>
                {/*<div className="profile-user">*/}
                {/*    <img src={logo} alt="User image"/>*/}
                {/*</div>*/}
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
                                                             onDragStart={(event) => handleDragStart(event, file)}
                                                            // onClick={() => {
                                                            //     handleVideoClick(file.url, file.fileTime);
                                                            // }}
                                                        >
                                                            <div className="file">
                                                                {isVideo(file.fileName) ? (
                                                                    <>
                                                                        <video
                                                                            src={file.url} width="200">
                                                                        </video>
                                                                        <span
                                                                            className="file-time">{formatTime(file.fileTime)}</span>
                                                                    </>
                                                                ) : (
                                                                    <img src={file.url} alt="File Thumbnail"/>
                                                                )}
                                                                <span className="file-add">Added</span>
                                                            </div>
                                                            <div
                                                                className="file-name">{file.fileName || 'Unknown File'}</div>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                            </div>
                                        </div>
                                    </div>
                                }
                                {activeAudioOption.tourismMusic &&
                                    <div className="tourism-music-wrapper effect-option" id="tourism-music-wrapper">
                                        <h3>Tourism</h3>
                                        <div className="list-file-tourism-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-tourism-music list-audio-file">
                                                <div className="file-tourism-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.springMusic &&
                                    <div className="spring-music-wrapper effect-option" id="spring-music-wrapper">
                                        <h3>Spring</h3>
                                        <div className="list-file-spring-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-spring-music list-audio-file">
                                                <div className="file-spring-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.loveMusic &&
                                    <div className="love-music-wrapper effect-option" id="love-music-wrapper">
                                        <h3>Love</h3>
                                        <div className="list-file-love-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-love-music list-audio-file">
                                                <div className="file-love-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.beatMusic &&
                                    <div className="beat-music-wrapper effect-option" id="beat-music-wrapper">
                                        <h3>Beat</h3>
                                        <div className="list-file-beat-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-beat-music list-audio-file">
                                                <div className="file-beat-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.healMusic &&
                                    <div className="heal-music-wrapper effect-option" id="heal-music-wrapper">
                                        <h3>Heal</h3>
                                        <div className="list-file-heal-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-heal-music list-audio-file">
                                                <div className="file-heal-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                            </div>
                                        </div>
                                    </div>
                                }

                                {activeAudioOption.warmMusic &&
                                    <div className="warm-music-wrapper effect-option" id="warm-music-wrapper">
                                        <h3>Warm</h3>
                                        <div className="list-file-warm-music-wrapper list-audio-file-wrapper">
                                            <div className="list-file-warm-music list-audio-file">
                                                <div className="file-warm-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-trend-sound audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-revenue-sound audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-horrified-sound audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-laugh-sound audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                                <div className="file-vlog-music audio-file">
                                                    <div className="file">
                                                        <div className="file-image">
                                                            <img src={logo}
                                                                 alt="Video Thumbnail"/>
                                                        </div>
                                                        <div className="file-information">
                                                            <span className="file-name">Goodbye</span>
                                                            <span className="file-artist">finetune</span>
                                                            <span className="file-time">04:26</span>
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
                                            <MenuItem className={`pro-effect dropdown-item
                                ${activeTextOption.proEffect ? 'active' : ''}`}
                                                      id="pro-effect" title="Pro"
                                                      onClick={() => handleMenuTextOptionClick('proEffect')}> Pro </MenuItem>
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
                                <div className="default-text-wrapper effect-option" id="default-text-wrapper">
                                    <h3>Default</h3>
                                    <div className="list-file-default-text-wrapper list-text-file-wrapper">
                                        <div className="list-file-default-text list-text-file">
                                            <div className="file-default-text text-file">
                                                <div className="file">
                                                    <label>Default text</label>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="trending-effect-wrapper effect-option" id="trending-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Trending</h3>
                                    <div className="list-file-trending-effect-wrapper list-text-file-wrapper">
                                        <div className="list-file-trending-effect list-text-file">
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pro-effect-wrapper effect-option" id="pro-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Pro</h3>
                                    <div className="list-file-pro-effect-wrapper list-text-file-wrapper">
                                        <div className="list-file-pro-effect list-text-file">
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="basic-effect-wrapper effect-option" id="basic-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Basic</h3>
                                    <div className="list-file-basic-effect-wrapper list-text-file-wrapper">
                                        <div className="list-file-basic-effect list-text-file">
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img
                                                        src={imgTest1} alt="Description"
                                                        alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-basic-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="multicolor-effect-wrapper effect-option" id="multicolor-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Multicolor</h3>
                                    <div className="list-file-multicolor-effect-wrapper list-text-file-wrapper">
                                        <div className="list-file-multicolor-effect list-text-file">
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-multicolor-effect text-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {activeWrapper.sticker &&
                        <div className="effect-list-sticker-wrapper effect-list-option-wrapper"
                             id="effect-list-sticker-wrapper">
                            <div className="effect-list-sticker effect-list-option">
                                <ul className="effect-type-importaudio effect-type-option">
                                    <li className="#">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                                Sticker
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                                <a className="trending-sticker" id="trending-sticker"
                                                >Trending</a>
                                                <a className="easter-holiday-sticker" id="easter-holiday-sticker"
                                                >Easter
                                                    holiday</a>
                                                <a className="fun-sticker" id="fun-sticker">Fun</a>
                                                <a className="troll-face-sticker" id="troll-face-sticker">Troll
                                                    face</a>
                                                <a className="gaming-sticker" id="gaming-sticker">Gaming</a>
                                                <a className="emoji-sticker" id="emoji-sticker">Emoji</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
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

                                <div className="trending-sticker-wrapper effect-option" id="trending-sticker-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Trending</h3>
                                    <div className="list-file-trending-sticker-wrapper list-sticker-file-wrapper">
                                        <div className="list-file-trending-effect list-sticker-file">
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="easter-holiday-sticker-wrapper effect-option"
                                     id="easter-holiday-sticker-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Easter holiday</h3>
                                    <div className="list-file-easter-holiday-sticker-wrapper list-sticker-file-wrapper">
                                        <div className="list-file-easter-holiday-effect list-sticker-file">
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-easter-holiday-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="fun-sticker-wrapper effect-option" id="fun-sticker-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Fun</h3>
                                    <div className="list-file-fun-sticker-wrapper list-sticker-file-wrapper">
                                        <div className="list-file-fun-effect list-sticker-file">
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-fun-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="troll-face-sticker-wrapper effect-option"
                                     id="troll-face-sticker-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Troll face</h3>
                                    <div className="list-file-troll-face-sticker-wrapper list-sticker-file-wrapper">
                                        <div className="list-file-troll-face-effect list-sticker-file">
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-troll-face-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="gaming-sticker-wrapper effect-option" id="gaming-sticker-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Gaming</h3>
                                    <div className="list-file-gaming-sticker-wrapper list-sticker-file-wrapper">
                                        <div className="list-file-gaming-effect list-sticker-file">
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-gaming-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="emoji-sticker-wrapper effect-option" id="emoji-sticker-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Emoji</h3>
                                    <div className="list-file-emoji-sticker-wrapper list-sticker-file-wrapper">
                                        <div className="list-file-emoji-effect list-sticker-file">
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-emoji-effect sticker-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {activeWrapper.effect &&
                        <div className="effect-list-effect-wrapper effect-list-option-wrapper"
                             id="effect-list-effect-wrapper">
                            <div className="effect-list-effect effect-list-option">
                                <ul className="effect-type-importaudio effect-type-option">
                                    <li className="#">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                                Video effect
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                                <a className="trending-video-effect" id="trending-video-effect"
                                                >Trending</a>
                                                <a className="pro-video-effect" id="pro-video-effect">Pro</a>
                                                <a className="nightclub-video-effect" id="nightclub-video-effect"
                                                >Nightclub</a>
                                                <a className="lens-video-effect" id="lens-video-effect"
                                                >Lens</a>
                                                <a className="retro-video-effect" id="retro-video-effect"
                                                >Retro</a>
                                                <a className="tv-video-effect" id="tv-video-effect">TV</a>
                                                <a className="star-video-effect" id="star-video-effect"
                                                >Star</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="#">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                                Body effect
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                                <a className="trending-body-effect" id="trending-body-effect"
                                                >Trending</a>
                                                <a className="pro-body-effect" id="pro-body-effect">Pro</a>
                                                <a className="mood-body-effect" id="mood-body-effect">Mood</a>
                                                <a className="mask-body-effect" id="mask-body-effect">Mask</a>
                                                <a className="selfie-body-effect" id="selfie-body-effect"
                                                >Selfie</a>
                                                <a className="dark-body-effect" id="dark-body-effect">Dark</a>
                                                <a className="image-body-effect" id="image-body-effect"
                                                >Image</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
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

                                <div className="trending-video-effect-wrapper effect-option"
                                     id="trending-video-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Trending</h3>
                                    <div className="list-file-trending-video-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-trending-effect list-effect-file">
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pro-video-effect-wrapper effect-option" id="pro-video-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Pro</h3>
                                    <div className="list-file-pro-video-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-pro-effect list-effect-file">
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="nightclub-video-effect-wrapper effect-option"
                                     id="nightclub-video-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>nightclub</h3>
                                    <div className="list-file-nightclub-video-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-nightclub-effect list-effect-file">
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-nightclub-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lens-video-effect-wrapper effect-option" id="lens-video-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>lens</h3>
                                    <div className="list-file-lens-video-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-lens-effect list-effect-file">
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-lens-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="retro-video-effect-wrapper effect-option"
                                     id="retro-video-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>retro</h3>
                                    <div className="list-file-retro-video-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-retro-effect list-effect-file">
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tv-video-effect-wrapper effect-option" id="tv-video-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>tv</h3>
                                    <div className="list-file-tv-video-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-tv-effect list-effect-file">
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-tv-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="star-video-effect-wrapper effect-option" id="star-video-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>star</h3>
                                    <div className="list-file-star-video-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-star-effect list-effect-file">
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-star-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="trending-body-effect-wrapper effect-option"
                                     id="trending-body-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>Trending</h3>
                                    <div className="list-file-trending-body-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-trending-effect list-effect-file">
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-trending-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pro-body-effect-wrapper effect-option" id="pro-body-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>pro</h3>
                                    <div className="list-file-pro-body-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-pro-effect list-effect-file">
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mood-body-effect-wrapper effect-option" id="mood-body-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>mood</h3>
                                    <div className="list-file-mood-body-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-mood-effect list-effect-file">
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mood-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mask-body-effect-wrapper effect-option" id="mask-body-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>mask</h3>
                                    <div className="list-file-mask-body-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-mask-effect list-effect-file">
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-mask-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="selfie-body-effect-wrapper effect-option"
                                     id="selfie-body-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>selfie</h3>
                                    <div className="list-file-selfie-body-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-selfie-effect list-effect-file">
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-selfie-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dark-body-effect-wrapper effect-option" id="dark-body-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>dark</h3>
                                    <div className="list-file-dark-body-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-dark-effect list-effect-file">
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-dark-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="image-body-effect-wrapper effect-option" id="image-body-effect-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>image</h3>
                                    <div className="list-file-image-body-effect-wrapper list-effect-file-wrapper">
                                        <div className="list-file-image-effect list-effect-file">
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-image-effect effect-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {activeWrapper.filter &&
                        <div className="effect-list-filter-wrapper effect-list-option-wrapper"
                             id="effect-list-filter-wrapper">
                            <div className="effect-list-filter effect-list-option">
                                <ul className="effect-type-importaudio effect-type-option">
                                    <li className="#">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                                Filter
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                                <a className="featured-filter" id="featured-filter"
                                                >Featured</a>
                                                <a className="pro-filter" id="pro-filter">Pro</a>
                                                <a className="life-filter" id="life-filter">Life</a>
                                                <a className="scenery-filter" id="scenery-filter">Scenery</a>
                                                <a className="movies-filter" id="movies-filter">Movies</a>
                                                <a className="retro-filter" id="retro-filter">Retro</a>
                                                <a className="style-filter" id="style-filter">Style</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
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

                                <div className="featured-filter-wrapper effect-option" id="featured-filter-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>featured</h3>
                                    <div className="list-file-featured-filter-wrapper list-filter-file-wrapper">
                                        <div className="list-file-featured-effect list-filter-file">
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-featured-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pro-filter-wrapper effect-option" id="pro-filter-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>pro</h3>
                                    <div className="list-file-pro-filter-wrapper list-filter-file-wrapper">
                                        <div className="list-file-pro-effect list-filter-file">
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-pro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="life-filter-wrapper effect-option" id="life-filter-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>life</h3>
                                    <div className="list-file-life-filter-wrapper list-filter-file-wrapper">
                                        <div className="list-file-life-effect list-filter-file">
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-life-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="scenery-filter-wrapper effect-option" id="scenery-filter-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>scenery</h3>
                                    <div className="list-file-scenery-filter-wrapper list-filter-file-wrapper">
                                        <div className="list-file-scenery-effect list-filter-file">
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-scenery-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="movies-filter-wrapper effect-option" id="movies-filter-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>movies</h3>
                                    <div className="list-file-movies-filter-wrapper list-filter-file-wrapper">
                                        <div className="list-file-movies-effect list-filter-file">
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-movies-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="retro-filter-wrapper effect-option" id="retro-filter-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>retro</h3>
                                    <div className="list-file-retro-filter-wrapper list-filter-file-wrapper">
                                        <div className="list-file-retro-effect list-filter-file">
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-retro-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="style-filter-wrapper effect-option" id="style-filter-wrapper"
                                     style={{display: 'none'}}>
                                    <h3>style</h3>
                                    <div className="list-file-style-filter-wrapper list-filter-file-wrapper">
                                        <div className="list-file-style-effect list-filter-file">
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="file-style-effect filter-file">
                                                <div className="file">
                                                    <img src={imgTest1} alt="Description"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round" className="lucide lucide-circle-plus">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 12h8"/>
                                                        <path d="M12 8v8"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                </div>
                <div className="player-wrapper">
                    <div className="player-nav">
                        <span>Player</span>
                    </div>
                    <div className="player-wrap">
                        {timelineVideos.length > 0 ? (
                            <video
                                id="player"
                                ref={videoRef}
                                className="player-show"
                                src={timelineVideos[currentVideoIndex]?.url || ''}
                                onEnded={handleVideoEnd}
                                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                                onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                            />
                        ) : (
                            <video
                                id="player"
                                className="player-show">

                            </video>
                        )
                        }
                        {/*<video*/}
                        {/*    id="player"*/}
                        {/*    className="player-show"*/}
                        {/*    ref={videoRef}*/}
                        {/*    onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}*/}
                        {/*    onLoadedMetadata={() => setDuration(videoRef.current.duration)}*/}
                        {/*>*/}
                        {/*    {selectedVideo && <source src={selectedVideo.url} type="video/mp4"/>}*/}
                        {/*</video>*/}

                        <div className="player-actions">
                            <div className="time-play-player">
                                <span>{currentTime ? formatTime(accumulatedTime + currentTime) : "0:00"}</span>
                            </div>
                            <div className="time-player">
                                <span>{durationTimeLine ? formatTime(durationTimeLine) : "0:00"}</span>
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
                            <div className="detail-video detail-type">
                                <div className="detail-wrap" id="video-video">
                                    <button>Video</button>
                                </div>
                                <div className="detail-wrap" id="video-audio">
                                    <button>Audio</button>
                                </div>
                                <div className="detail-wrap" id="video-speed">
                                    <button>Speed</button>
                                </div>
                                <div className="detail-wrap" id="video-animation">
                                    <button>Animation</button>
                                </div>
                                <div className="detail-wrap" id="video-adjustment">
                                    <button>Adjustment</button>
                                </div>
                            </div>
                            <div className="detail-audio detail-type" style={{display: 'none'}}>
                                <div className="detail-wrap">
                                    <button>Basic</button>
                                </div>
                                <div className="detail-wrap">
                                    <button>Voice changer</button>
                                </div>
                                <div className="detail-wrap">
                                    <button>Speed</button>
                                </div>
                            </div>
                            <div className="detail-text detail-type" style={{display: 'none'}}>
                                <div className="detail-wrap">
                                    <button>Text</button>
                                </div>
                                <div className="detail-wrap">
                                    <button>Animation</button>
                                </div>
                                <div className="detail-wrap">
                                    <button>Tracking</button>
                                </div>
                                <div className="detail-wrap">
                                    <button>Text-to-speech</button>
                                </div>
                            </div>
                            <div className="detail-sticker detail-type" style={{display: 'none'}}>
                                <div className="detail-wrap">
                                    <button>Sticker</button>
                                </div>
                                <div className="detail-wrap">
                                    <button>Animation</button>
                                </div>
                                <div className="detail-wrap">
                                    <button>Tracking</button>
                                </div>
                            </div>
                            <div className="detail-effect detail-type" style={{display: 'none'}}>
                                <div className="detail-wrap">
                                    <button>Special effect</button>
                                </div>
                            </div>
                            <div className="detail-filter detail-type" style={{display: 'none'}}>
                                <div className="detail-wrap">
                                    <button>Filter</button>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div className="detail-option">
                        <div className="detail-option-type">
                            <div className="detail-option-video-type detail-option-wrapper">
                                <div className="detail-option-video-video detail-option-wrap"
                                     id="detail-option-video-video">
                                    <button onClick={() => {
                                        setShowVideoBasic(!isShowVideoBasic)
                                    }} id="video-video-basic" className="edit-parameters-option active">Basic
                                    </button>
                                    <button id="video-video-removeBG" className="edit-parameters-option">Remove BG
                                    </button>
                                    <button id="video-video-mask" className="edit-parameters-option">Mask</button>
                                    <button id="video-video-retouch" className="edit-parameters-option">Retouch
                                    </button>
                                </div>
                                <div className="detail-option-video-audio detail-option-wrap"
                                     id="detail-option-video-audio"
                                     style={{display: 'none'}}>
                                    <button id="video-audio-basic" className="edit-parameters-option">Basic</button>
                                    <button id="video-audio-voiceChanger" className="edit-parameters-option">Voice
                                        Changer
                                    </button>
                                </div>
                                <div className="detail-option-video-speed detail-option-wrap"
                                     id="detail-option-video-speed"
                                     style={{display: 'none'}}>
                                    <button id="video-speed-standard" className="edit-parameters-option">Standard
                                    </button>
                                    <button id="video-speed-curve" className="edit-parameters-option">Curve</button>
                                </div>
                                <div className="detail-option-video-animation detail-option-wrap"
                                     id="detail-option-video-animation"
                                     style={{display: 'none'}}>
                                    <button id="video-animation-in" className="edit-parameters-option">In</button>
                                    <button id="video-animation-out" className="edit-parameters-option">Out</button>
                                    <button id="video-animation-combo" className="edit-parameters-option">Combo
                                    </button>
                                </div>
                                <div className="detail-option-video-adjustment detail-option-wrap"
                                     id="detail-option-video-adjustment" style={{display: 'none'}}>
                                    <button id="video-adjustment-basic" className="edit-parameters-option">Basic
                                    </button>
                                    <button id="video-adjustment-hls" className="edit-parameters-option">HSL
                                    </button>
                                </div>
                            </div>
                            <div className="detail-option-text-type detail-option-wrapper"
                                 style={{display: 'none'}}>
                                <div className="detail-option-text-text detail-option-wrap"
                                     style={{display: 'none'}}>
                                    <button>Basic</button>
                                    <button>Bubble</button>
                                    <button>Effects</button>
                                </div>
                                <div className="detail-option-text-animation detail-option-wrap"
                                     style={{display: 'none'}}>
                                    <button>In</button>
                                    <button>Out</button>
                                    <button>Loop</button>
                                </div>
                            </div>
                            <div className="detail-option-effect-type detail-option-wrapper"
                                 style={{display: 'none'}}>
                                <div className="detail-option-effect-animation detail-option-wrap"
                                     style={{display: 'none'}}>
                                    <button>In</button>
                                    <button>Out</button>
                                    <button>Loop</button>
                                </div>
                            </div>
                            <div className="break-line">
                            </div>
                        </div>
                    </div>
                    <div className="detail-edit">
                        <div className="detail-edit-video-type detail-edit-wrapper">
                            <div className="detail-edit-video-video detail-edit-wrap">
                                {isShowVideoBasic &&
                                    <ul className="detail-edit-video-basic-wrap edit-parameters-wrap"
                                        id="video-video-basic-option">
                                        <li className="detail-edit-video-basic-transform">
                                            <div className="dropdown">
                                                <button id="btn-dropdown" className="btn-dropdown">
                                                    <label>
                                                        <input type="checkbox"
                                                               className="basic-transform-slider-check uniform-slider-check"
                                                               id="basic-transform-slider-check uniform-slider-check"/>
                                                    </label>
                                                    transform
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2"
                                                         strokeLinecap="round" strokeLinejoin="round"
                                                         className="lucide lucide-chevron-right">
                                                        <path d="m9 18 6-6-6-6"/>
                                                    </svg>
                                                </button>
                                                <div id="dropdown-content" className="dropdown-content">
                                                    <div className="slider-container">
                                                        <label htmlFor="scale-slider">Scale</label>
                                                        <input type="range" id="scale-slider" className="slider"
                                                               min="1"
                                                               max="400"
                                                               value="94" onInput="updateSliderValue(this.value)"/>
                                                        <input type="text" id="slider-value"
                                                               className="slider-value"
                                                               value="94%" onInput="updateSlider(this.value)"/>
                                                        <div className="slider-buttons">
                                                            <button className="slider-up"
                                                                    onClick="increaseSlider()">
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
                                                                    onClick="decreaseSlider()">
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
                                                    </div>
                                                    <div className="slider-container slider-width-container"
                                                         style={{display: 'none'}}>
                                                        <label htmlFor="scale-slider scale-width-slider">Scale
                                                            width</label>
                                                        <input type="range" id="scale-width-slider"
                                                               className="slider"
                                                               min="1"
                                                               max="400"
                                                               value="94" onInput="updateSliderValue(this.value)"/>
                                                        <input type="text" id="slider-width-value"
                                                               className="slider-value"
                                                               value="94%" onInput="updateSlider(this.value)"/>
                                                        <div className="slider-buttons slider-width-buttons">
                                                            <button className="slider-up slider-width-up"
                                                                    onClick="increaseSlider()">
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
                                                                    onClick="decreaseSlider()">
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
                                                    </div>
                                                    <div className="slider-container slider-height-container"
                                                         style={{display: 'none'}}>
                                                        <label htmlFor="scale-slider scale-height-slide">Scale
                                                            height</label>
                                                        <input type="range" id="scale-height-slider"
                                                               className="slider"
                                                               min="1"
                                                               max="400"
                                                               value="94" onInput="updateSliderValue(this.value)"/>
                                                        <input type="text" id="slider-height-value"
                                                               className="slider-value"
                                                               value="94%" onInput="updateSlider(this.value)"/>
                                                        <div className="slider-buttons slider-height-buttons">
                                                            <button className="slider-up slider-height-up"
                                                                    onClick="increaseSlider()">
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
                                                                    onClick="decreaseSlider()">
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
                                                    </div>
                                                    <div className="uniform-slider">
                                                        <span>Uniform scale</span>
                                                        <label>
                                                            <input type="checkbox" className="uniform-slider-check"
                                                                   id="uniform-slider-check"/>
                                                            <div className="slider-check"></div>
                                                        </label>
                                                    </div>
                                                    <div className="slider-container position-video">
                                                        <span>position</span>
                                                        <div className="position-video position-x">
                                                            <label htmlFor="position-x-value">X</label>
                                                            <input type="text" id="position-x-value"
                                                                   className="slider-value position-x-value"
                                                                   value="94%"
                                                                   onInput="updatePositionX(this.value)"/>
                                                            <div className="slider-buttons position-x-buttons">
                                                                <button className="slider-up position-x-up"
                                                                        onClick="increasePositionX()">
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
                                                                        onClick="decreasePositionX()">
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
                                                                   value="94"
                                                                   onInput="updatePositionY(this.value)"/>
                                                            <div className="slider-buttons position-y-buttons">
                                                                <button className="slider-up position-y-up"
                                                                        onClick="increasePositionY()">
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
                                                                        onClick="decreasePositionY()">
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
                                                    </div>
                                                    <div className="slider-container rotate-video">
                                                        <span>rotate</span>
                                                        <div className="position-video rotate">
                                                            <label htmlFor="rotate-value">X</label>
                                                            <input type="text" id="rotate-value"
                                                                   className="slider-value rotate-value"
                                                                   value="94%" onInput="updateRotate(this.value)"/>
                                                            <div className="slider-buttons rotate-buttons">
                                                                <button className="slider-up rotate-up"
                                                                        onClick="increaseRotate()">
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
                                                                        onClick="decreaseRotate()">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <div className="break-line"></div>
                                        <li className="detail-edit-video-basic-blend">
                                            <div className="dropdown">
                                                <label>
                                                    <input type="checkbox"
                                                           className="basic-blend-slider-check uniform-slider-check"
                                                           id="basic-blend-slider-check uniform-slider-check"/>
                                                </label>
                                                <button id="btn-dropdown" className="btn-dropdown">
                                                    blend
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2"
                                                         strokeLinecap="round" strokeLinejoin="round"
                                                         className="lucide lucide-chevron-right">
                                                        <path d="m9 18 6-6-6-6"/>
                                                    </svg>
                                                </button>
                                                {/*<button class="detail-edit-video-basic-transform-reset-btn">*/}
                                                {/*<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"*/}
                                                {/*viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"*/}
                                                {/*strokeLinecap="round" strokeLinejoin="round"*/}
                                                {/*class="lucide lucide-rotate-ccw">*/}
                                                {/*<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>*/}
                                                {/*<path d="M3 3v5h5"/>*/}
                                                {/*</svg>*/}
                                                {/*</button>*/}
                                                <div id="dropdown-content" className="dropdown-content">
                                                    <div className="mode-video-basic-blend video-basic-option-edit">
                                                        <span>Mode</span>
                                                        <select name="mode-video-type" id="mode-video-type"
                                                                className="video-type-option mode-video-type">
                                                            <option value="default">Default</option>
                                                            <option value="brighten">Brighten</option>
                                                            <option value="screen">Screen</option>
                                                            <option value="darken">Darken</option>
                                                            <option value="overlay">Overlay</option>
                                                            <option value="hardLight">Hard light</option>
                                                            <option value="multiply">Multiply</option>
                                                        </select>
                                                    </div>
                                                    <div
                                                        className="slider-container opacity-video-basic-blend video-basic-option-edit">
                                                        <label>Opacity</label>
                                                        <input type="range" id="opacity-slider" className="slider"
                                                               min="0"
                                                               max="100"
                                                               value="94" onInput="updateOpacityValue(this.value)"/>
                                                        <input type="text" id="opacity-value"
                                                               className="slider-value"
                                                               value="94%" onInput="updateOpacity(this.value)"/>
                                                        <div className="slider-buttons slider-opacity-buttons">
                                                            <button className="slider-up slider-up-opacity"
                                                                    onClick="increaseOpacity()">
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
                                                            <button className="slider-down slider-down-opacity"
                                                                    onClick="decreaseOpacity()">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <div className="break-line"></div>
                                        <li className="detail-edit-video-basic-stabilize">
                                            <div className="dropdown">
                                                <button id="btn-dropdown" className="btn-dropdown">
                                                    <label>
                                                        <input type="checkbox"
                                                               className="basic-stabilize-slider-check uniform-slider-check"
                                                               id="basic-stabilize-slider-check uniform-slider-check"/>
                                                    </label>
                                                    stabilize
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2"
                                                         strokeLinecap="round" strokeLinejoin="round"
                                                         className="lucide lucide-chevron-right">
                                                        <path d="m9 18 6-6-6-6"/>
                                                    </svg>
                                                </button>
                                                <div id="dropdown-content" className="dropdown-content">
                                                    <div
                                                        className="level-video-basic-stabilize video-basic-option-edit">
                                                        <span>Level</span>
                                                        <select name="stabilize-video-type"
                                                                id="stabilize-video-type"
                                                                className="video-type-option stabilize-video-type">
                                                            <option value="recommended">Recommended</option>
                                                            <option value="minimumCut">Minimum cut</option>
                                                            <option value="mostStable">Most stable</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <div className="break-line"></div>
                                        <li className="detail-edit-video-basic-motionBlur">
                                            <div className="dropdown">
                                                <button id="btn-dropdown" className="btn-dropdown">
                                                    <label>
                                                        <input type="checkbox"
                                                               className="basic-motionBlur-slider-check uniform-slider-check"
                                                               id="basic-motionBlur-slider-check uniform-slider-check"/>
                                                    </label>
                                                    motion blur
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2"
                                                         strokeLinecap="round" strokeLinejoin="round"
                                                         className="lucide lucide-chevron-right">
                                                        <path d="m9 18 6-6-6-6"/>
                                                    </svg>
                                                </button>
                                                <div id="dropdown-content" className="dropdown-content">
                                                    <div className="slider-container slider-blur-container">
                                                        <label htmlFor="scale-slider">Blur</label>
                                                        <input type="range" id="scale-slider scale-slider-blur"
                                                               className="slider"
                                                               min="1" max="400"
                                                               value="94" onInput="updateBlurValue(this.value)"/>
                                                        <input type="text" id="slider-value slider-value-blur"
                                                               className="slider-value"
                                                               value="94%" onInput="updateBlur(this.value)"/>
                                                        <div className="slider-buttons slider-buttons-motionBlur">
                                                            <button className="slider-up slider-blur-up"
                                                                    onClick="increaseBlur()">
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
                                                            <button className="slider-down slider-blur-down"
                                                                    onClick="decreaseBlur()">
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
                                                    </div>
                                                    <div className="slider-container slider-blend-container">
                                                        <label htmlFor="scale-slider">Blend</label>
                                                        <input type="range" id="scale-slider scale-slider-blend"
                                                               className="slider"
                                                               min="1" max="400"
                                                               value="94" onInput="updateSliderValue(this.value)"/>
                                                        <input type="text" id="slider-value slider-value-blend"
                                                               className="slider-value"
                                                               value="94%" onInput="updateBlend(this.value)"/>
                                                        <div className="slider-buttons slider-buttons">
                                                            <button className="slider-up slider-blend-up"
                                                                    onClick="increaseBlend()">
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
                                                            <button className="slider-down slider-blend-down"
                                                                    onClick="decreaseBlend()">
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
                                                    </div>
                                                    <div
                                                        className="direction-video-basic-direction video-basic-option-edit">
                                                        <span>Direction</span>
                                                        <select name="direction-video-type"
                                                                id="direction-video-type"
                                                                className="video-type-option direction-video-type">
                                                            <option value="both">Both</option>
                                                            <option value="forward">Forward</option>
                                                            <option value="backward">Backward</option>
                                                        </select>
                                                    </div>
                                                    <div
                                                        className="speed-video-basic-speed video-basic-option-edit">
                                                        <span>Speed</span>
                                                        <select name="speed-video-type" id="speed-video-type"
                                                                className="video-type-option speed-video-type">
                                                            <option value="once">Once</option>
                                                            <option value="twice">Twice</option>
                                                            <option value="4Times">4 times</option>
                                                            <option value="6Times">6 times</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <div className="break-line"></div>
                                        <li className="detail-edit-video-basic-canvas">
                                            <div className="dropdown">
                                                <button id="btn-dropdown" className="btn-dropdown">
                                                    <label>
                                                        <input type="checkbox"
                                                               className="basic-canvas-slider-check uniform-slider-check"
                                                               id="basic-canvas-slider-check uniform-slider-check"/>
                                                    </label>
                                                    canvas
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2"
                                                         strokeLinecap="round" strokeLinejoin="round"
                                                         className="lucide lucide-chevron-right">
                                                        <path d="m9 18 6-6-6-6"/>
                                                    </svg>
                                                </button>
                                                <div id="dropdown-content" className="dropdown-content">
                                                    <div
                                                        className="type-video-basic-canvas video-basic-option-edit">
                                                        <select name="video-basic-canvas-option"
                                                                className="video-basic-canvas-option">
                                                            <option value="none">None</option>
                                                            <option value="blur">Blur</option>
                                                            <option value="color">Color</option>
                                                            <option value="pattern">Pattern</option>
                                                        </select>
                                                    </div>
                                                    <div className="video-basic-blur-option"
                                                         style={{display: 'none'}}>
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
                                                    </div>
                                                    <div className="video-basic-color-option"
                                                         style={{display: 'none'}}>
                                                        <div className="color-option-wrap">
                                                            <label htmlFor="color-picker">
                                                                <img className="color-display" alt=""
                                                                     src="../../assets/images/rainbow.jpg"/></label>
                                                            <input type="color" id="color-picker"
                                                                   name="color-picker"
                                                                   value="#ff0000" style={{display: 'none'}}/>
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
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CCCCCC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CCCC99}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CCCC66}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CCCC33}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CCCC00}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #99CCFF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #99CCCC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #99CC99}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #99CC66}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #99CC33}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #99CC00}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #66CCFF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #66CCCC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #66CC99}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #66CC66}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #66CC33}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #66CC00}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #33CCFF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #33CCCC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #33CC99}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #33CC66}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #33CC33}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #33CC00}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #00CCFF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #00CCCC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #00CC99}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #00CC66}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #00CC33}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #00CC00}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #FF99FF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #FF99CC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #FF9999}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #FF9966}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #FF9933}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #FF9900}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CC99FF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CC99CC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CC9999}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CC9966}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CC9933}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #CC9900}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #9999FF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #9999CC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #999999}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #999966}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #999933}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #999900}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #6699FF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #6699CC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #669999}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #669966}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #669933}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #669900}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #3399FF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #3399CC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #339999}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #339966}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #339933}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #339900}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #0099FF}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #0099CC}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #009999}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #009966}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #009933}}></div>*/}
                                                        {/*</div>*/}
                                                        {/*<div class="color-option-wrap">*/}
                                                        {/*    <div class="color-display"*/}
                                                        {/*         style={{backgroundColor: #009900}}></div>*/}
                                                        {/*</div>*/}
                                                    </div>
                                                    <div className="video-basic-pattern-option">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <div className="break-line"></div>
                                        <form onSubmit={handleSubmit}>
                                            <input type="number" placeholder="Start Time"
                                                   onChange={(e) => setStartTime(e.target.value)}/>
                                            <input type="number" placeholder="End Time"
                                                   onChange={(e) => setEndTime(e.target.value)}/>
                                            <button type="submit">Cut Video</button>
                                        </form>
                                        <form onSubmit={handleTextSubmit}>
                                            <input type="file" accept="video/*"
                                                   onChange={(e) => setVideoFile(e.target.files[0])}/>
                                            <input type="text" value={textToAdd} onChange={handleTextChange}
                                                   placeholder="Enter text to add"/>
                                            <button type="submit">Add Text to Video</button>
                                        </form>
                                    </ul>
                                }
                                <ul className="detail-edit-video-removeBG-wrap edit-parameters-wrap"
                                    id="video-video-removeBG-option" style={{display: 'none'}}>
                                    <li className="detail-edit-video-removeBG-autoRemoval">
                                        <div className="autoRemoval-option">
                                            <label>
                                                <input type="checkbox"
                                                       className="removeBG-autoRemoval-slider-check uniform-slider-check"
                                                       id="removeBG-autoRemoval-slider-check uniform-slider-check"/>
                                            </label>
                                            <span>auto removal</span>
                                        </div>
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                stroke
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                                <div className="stroke-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="stroke-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="stroke-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="stroke-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="stroke-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="stroke-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-removeBG-customRemoval">
                                        <div className="dropdown">
                                            <label>
                                                <input type="checkbox"
                                                       className="removeBG-customRemoval-slider-check uniform-slider-check"
                                                       id="removeBG-customRemoval-slider-check uniform-slider-check"/>
                                            </label>
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                custom removal
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            {/*{#                                    <button class="detail-edit-video-basic-transform-reset-btn">#}*/}
                                            {/*{#                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"#}*/}
                                            {/*{#                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"#}*/}
                                            {/*{#                                             strokeLinecap="round" strokeLinejoin="round"#}*/}
                                            {/*{#                                             class="lucide lucide-rotate-ccw">#}*/}
                                            {/*{#                                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>#}*/}
                                            {/*{#                                            <path d="M3 3v5h5"/>#}*/}
                                            {/*{#                                        </svg>#}*/}
                                            {/*{#                                    </button>#}*/}
                                            <div id="dropdown-content" className="dropdown-content">
                                                <div className="slider-container slider-customRemoval-container">
                                                    <label htmlFor="scale-slider">Size</label>
                                                    <input type="range" id="scale-slider scale-slider-customRemoval"
                                                           className="slider"
                                                           min="1" max="400"
                                                           value="94" onInput="updateBlurValue(this.value)"/>
                                                    <input type="text" id="slider-value slider-value-customRemoval"
                                                           className="slider-value"
                                                           value="94%" onInput="updateBlur(this.value)"/>
                                                    <div className="slider-buttons slider-buttons-motionBlur">
                                                        <button className="slider-up slider-customRemoval-up"
                                                                onClick="increaseCustomRemoval()">
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
                                                        <button className="slider-down slider-customRemoval-down"
                                                                onClick="decreaseCustomRemoval()">
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
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-removeBG-chromaKey">
                                        <div className="dropdown">
                                            <label>
                                                <input type="checkbox"
                                                       className="removeBG-chromaKey-slider-check uniform-slider-check"
                                                       id="removeBG-chromaKey-slider-check uniform-slider-check"/>
                                            </label>
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                chroma key
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="detail-edit-video-mask-wrap edit-parameters-wrap"
                                    id="video-video-mask-option"
                                    style={{display: 'none'}}>
                                    <li className="detail-edit-video-mask-mask">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <label>
                                                    <input type="checkbox"
                                                           className="mask-mask-slider-check uniform-slider-check"
                                                           id="mask-mask-slider-check uniform-slider-check"/>
                                                </label>
                                                mask
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                                <div className="mask-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="mask-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="mask-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="mask-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="mask-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="mask-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                                <div className="mask-option-wrap">
                                                    <img src={imgTest} alt="Description"/>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="detail-edit-video-retouch-wrap edit-parameters-wrap"
                                    id="video-video-retouch-option"
                                    style={{display: 'none'}}>
                                    <li className="detail-edit-video-retouch-retouch">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <label>
                                                    <input type="checkbox"
                                                           className="retouch-retouch-slider-check uniform-slider-check"
                                                           id="retouch-retouch-slider-check uniform-slider-check"/>
                                                </label>
                                                retouch
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-basic-autoReshape">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <label>
                                                    <input type="checkbox"
                                                           className="basic-autoReshape-slider-check uniform-slider-check"
                                                           id="basic-autoReshape-slider-check uniform-slider-check"/>
                                                </label>
                                                auto reshape
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-basic-manual">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <label>
                                                    <input type="checkbox"
                                                           className="basic-manual-slider-check uniform-slider-check"
                                                           id="basic-manual-slider-check uniform-slider-check"/>
                                                </label>
                                                manual
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-basic-makeup">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <label>
                                                    <input type="checkbox"
                                                           className="basic-makeup-slider-check uniform-slider-check"
                                                           id="basic-makeup-slider-check uniform-slider-check"/>
                                                </label>
                                                makeup
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-basic-body">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                <label>
                                                    <input type="checkbox"
                                                           className="basic-body-slider-check uniform-slider-check"
                                                           id="basic-body-slider-check uniform-slider-check"/>
                                                </label>
                                                body
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="detail-edit-video-basic-wrap edit-parameters-wrap"
                                    id="video-audio-basic-option"
                                    style={{display: 'none'}}>
                                    <li className="detail-edit-video-basic-basic">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                basic
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-basic-reduceNoise">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                reduce noise
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-basic-channels">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                channels
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="detail-edit-video-voiceChanger-wrap edit-parameters-wrap"
                                    id="video-audio-voiceChanger-option" style={{display: 'none'}}>
                                </ul>

                                <ul className="detail-edit-video-standard-wrap edit-parameters-wrap"
                                    id="video-speed-standard-option" style={{display: 'none'}}>

                                </ul>
                                <ul className="detail-edit-video-curve-wrap edit-parameters-wrap"
                                    id="video-speed-curve-option"
                                    style={{display: 'none'}}>
                                </ul>

                                <ul className="detail-edit-video-in-wrap edit-parameters-wrap"
                                    id="video-animation-in-option"
                                    style={{display: 'none'}}>

                                </ul>
                                <ul className="detail-edit-video-out-wrap edit-parameters-wrap"
                                    id="video-animation-out-option"
                                    style={{display: 'none'}}>
                                </ul>
                                <ul className="detail-edit-video-combo-wrap edit-parameters-wrap"
                                    id="video-animation-combo-option"
                                    style={{display: 'none'}}>
                                </ul>

                                <ul className="detail-edit-video-basic-wrap edit-parameters-wrap"
                                    id="video-adjustment-basic-option"
                                    style={{display: 'none'}}>
                                    <li className="detail-edit-video-basic-autoAdjust">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                auto adjust
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-basic-lut">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                LUT
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-basic-adjust">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                adjust
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="detail-edit-video-removeBG-wrap edit-parameters-wrap"
                                    id="video-adjustment-hls-option" style={{display: 'none'}}>
                                    <li className="detail-edit-video-hls-autoRemoval">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                auto removal
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-hls-customRemoval">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                custom removal
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                    <div className="break-line"></div>
                                    <li className="detail-edit-video-hls-chromaKey">
                                        <div className="dropdown">
                                            <button id="btn-dropdown" className="btn-dropdown">
                                                chroma key
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-chevron-right">
                                                    <path d="m9 18 6-6-6-6"/>
                                                </svg>
                                            </button>
                                            <button className="detail-edit-video-basic-transform-reset-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2"
                                                     strokeLinecap="round" strokeLinejoin="round"
                                                     className="lucide lucide-rotate-ccw">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                                    <path d="M3 3v5h5"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-content" className="dropdown-content">
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="edit-wrapper">
                <div className="timestamps">
                    {timestamps.map((timestamp, index) => (
                        <span key={index}>
                            <p>|</p>
                            {timestamp}
                            <p>|</p>
                            <p>|</p>
                            <p>|</p>
                            <p>|</p>
                            <p>|</p>
                            <p>|</p>
                            <p>|</p>
                        </span>
                    ))}
                </div>
                <div className="video-timeline">
                    {timelines.map((timeline, index) => (
                        <div
                            key={index}
                            className="timeline"
                            onDrop={(e) => handleDrop(e, index)}  // Thả video vào timeline có sẵn
                            onDragOver={handleDragOver}
                        >
                            {timeline.videos.map((video, i) => (
                                <div key={i}>
                                    <video src={video.url} width="200"/>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div
                        className="empty-timeline-dropzone"
                        onDrop={(e) => handleDrop(e, null)}
                        onDragOver={handleDragOver}
                        style={{
                            border: '2px dashed #ccc',
                            padding: '20px',
                            marginTop: '20px',
                            textAlign: 'center'
                        }}
                    >
                        Drag and drop video here to create a new timeline
                    </div>

                    {timelineVideos[0] &&
                        <input
                            className="level"
                            type="range"
                            min="0"
                            max="100"
                            value={(Math.floor(accumulatedTime + currentTime) / durationTimeLine) * 100}
                            onChange={(e) => handleSeek(e)}
                            style={{width: widthTime * 4 + 'px'}}
                        />
                    }
                </div>
            </div>
        </div>
        </body>
    );
}

export default HomePage;
