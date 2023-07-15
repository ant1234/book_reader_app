import React, { useState, useEffect } from 'react';
import './TextToSpeech.css'; // Import CSS styles for the component

const TextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const populateVoices = () => {
      const speechVoices = speechSynthesis.getVoices();
      setVoices(speechVoices);
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices;
    }

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleTogglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    const speech = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }
    speech.volume = volume;
    speech.rate = rate;
    speech.pitch = pitch;

    speechSynthesis.speak(speech);
    setIsPlaying(true);
  };

  const stopPlayback = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleRateChange = (e) => {
    setRate(e.target.value);
  };

  const handlePitchChange = (e) => {
    setPitch(e.target.value);
  };

  const handleVoiceChange = (e) => {
    const voiceName = e.target.value;
    const selectedVoice = voices.find((voice) => voice.name === voiceName);
    setSelectedVoice(selectedVoice);
  };

  return (
    <div className="container">
      <div className="circle" onClick={handleTogglePlayback}>
        <span className={`icon ${isPlaying ? 'stop' : 'play'}`} />
      </div>
      <label className="label">
        Voice:
        <select
          value={selectedVoice?.name}
          onChange={handleVoiceChange}
          className="select-input"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </label>
      <label className="label">
        Volume:
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="range-input"
        />
      </label>
      <label className="label">
        Rate:
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={rate}
          onChange={handleRateChange}
          className="range-input"
        />
      </label>
      <label className="label">
        Pitch:
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={pitch}
          onChange={handlePitchChange}
          className="range-input"
        />
      </label>
      <textarea
        value={text}
        onChange={handleTextChange}
        className="text-input"
      />
    </div>
  );
};

export default TextToSpeech;
