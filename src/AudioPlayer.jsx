import React, { useState, useEffect } from "react";
import card from "../src/assets/Card.png";

function App() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("audioFiles"));
    if (storedFiles) {
      setAudioFiles(storedFiles);
    }
  }, []);

  useEffect(() => {
    if (audioFiles.length > 0) {
      const storedIndex = parseInt(localStorage.getItem("currentTrackIndex"));
      if (
        !isNaN(storedIndex) &&
        storedIndex >= 0 &&
        storedIndex < audioFiles.length
      ) {
        setCurrentTrackIndex(storedIndex);
      }
    }
  }, [audioFiles]);

  useEffect(() => {
    const audioElement = document.getElementById("audio");
    const handleEnded = () => {
      if (currentTrackIndex < audioFiles.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setCurrentTrackIndex(0); // Loop back to the first track
      }
    };
    audioElement.addEventListener("ended", handleEnded);
    return () => {
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex, audioFiles]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newAudioFiles = [
        ...audioFiles,
        { id: Date.now(), name: file.name, src: reader.result },
      ];
      setAudioFiles(newAudioFiles);
      localStorage.setItem("audioFiles", JSON.stringify(newAudioFiles));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTrack = (id) => {
    const updatedAudioFiles = audioFiles.filter((track) => track.id !== id);
    setAudioFiles(updatedAudioFiles);
    localStorage.setItem("audioFiles", JSON.stringify(updatedAudioFiles));
    if (id === currentTrackIndex) {
      setCurrentTrackIndex(0);
    }
  };

  const handleTrackChange = (index) => {
    setCurrentTrackIndex(index);
    localStorage.setItem("currentTrackIndex", index);
  };

  const handlePlay = () => {
    audio.play();
  };

  const handlePause = () => {
    audio.pause();
  };

  const handleNext = () => {
    if (currentTrackIndex < audioFiles.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(audioFiles.length - 1);
    }
  };

  return (
    <>
      <h1 className="text-3xl md:text-4xl w-full font-bold mb-2 text-center text-white bg-slate-800 p-4">
        Audio Player
      </h1>
      <div className="container flex flex-col lg:flex-row gap-2 px-4 py-8">
        <div className="lg:w-[30%]">
        <h5 className="text-white">Upload music files here</h5>
          <input
            type="file"
            accept="audio/mp3"
            onChange={handleFileChange}
            className="mb-4 p-2 bg-slate-300 text-gray-800 w-full  lg:inline rounded-lg"
          />
          <div className="relative ">
            <div className="bg-slate-200 rounded-lg text-center p-4 mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-2">Playlist</h2>
              <ul className="mb-4">
                {audioFiles.map((track, index) => (
                  <li
                    key={track.id}
                    onClick={() => handleTrackChange(index)}
                    className={`cursor-pointer p-2 ${
                      index === currentTrackIndex ? "font-bold" : ""
                    }`}
                  >
                    {track.name}
                    {index === currentTrackIndex && (
                      <span className="text-green-500"> (Now Playing)</span>
                    )}
                    <button
                      className="ml-2 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTrack(track.id);
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:w-[70%]">
          <div className="bg-slate-800 items-center flex justify-center flex-col rounded-lg shadow-md overflow-hidden mb-4">
            <img src={card} width={400} alt="Album Cover" />
            <div className=" flex mb-5 justify-center items-center">
              <button
                onClick={handlePrevious}
                className="p-3 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handlePlay}
                className="p-3 rounded-full bg-blue-500 text-white mx-4 hover:bg-blue-600 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg" >
            <audio
              id="audio"
              src={audioFiles[currentTrackIndex]?.src}
              autoPlay
              controls
              className="w-full rounded-lg shadow-m"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default 
