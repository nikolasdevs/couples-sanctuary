"use client";
import { useRef, useState } from "react";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";

export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src="https://res.cloudinary.com/dpnzmcban/video/upload/v1768079634/Making_Love_Music_Ensemble_-_Moment_of_Love__mp3.pm_miy137.mp3"
      />
      <button
        onClick={toggle}
        className={`${playing ? "text-red-400" : "text-emerald-600"} text-2xl`}
      >
        {playing ? <MdPauseCircle /> : <MdPlayCircle />}
      </button>
    </>
  );
}
