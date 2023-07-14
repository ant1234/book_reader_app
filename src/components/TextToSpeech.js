import React, { useState, useEffect } from 'react';

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
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const speakText = () => {
    const speech = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }
    speech.volume = volume;
    speech.rate = rate;
    speech.pitch = pitch;

    speechSynthesis.speak(speech);
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
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        style={{
          width: '500px',
          height: '500px',
          margin: '0 auto',
          display: 'block',
        }}
      />
      <br />
      <label>
        Voice:
        <select value={selectedVoice?.name} onChange={handleVoiceChange}>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Volume:
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
      </label>
      <br />
      <label>
        Rate:
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={rate}
          onChange={handleRateChange}
        />
      </label>
      <br />
      <label>
        Pitch:
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={pitch}
          onChange={handlePitchChange}
        />
      </label>
      <br />
      <button onClick={handleTogglePlayback}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
      {isPlaying && <button onClick={stopPlayback}>Stop Playback</button>}
      {!isPlaying && <button onClick={speakText}>Play Text</button>}
    </div>
  );
};

export default TextToSpeech;