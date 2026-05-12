import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FiMic, FiMicOff, FiTrash2, FiCopy, FiRefreshCw } from "react-icons/fi";

const SpeechRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingPrompt, setReadingPrompt] = useState("");
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [trueWpm, setTrueWpm] = useState(0);

  const complexPhrases = [
    "The bright morning sun shines over the quiet valley.",
    "She quickly packed her bags and left for the airport.",
    "A beautiful melody played softly in the background.",
    "The tall ancient trees swayed gently in the wind.",
    "He carefully read the instructions before starting the project.",
    "The cheerful children played games in the large park.",
    "A sudden rainstorm interrupted our peaceful afternoon picnic."
  ];

  const generateNewPrompt = () => {
    let newPrompt;
    do {
      newPrompt = complexPhrases[Math.floor(Math.random() * complexPhrases.length)];
    } while (newPrompt === readingPrompt && complexPhrases.length > 1);
    setReadingPrompt(newPrompt);
  };

  useEffect(() => {
    // Select a random tough sentence on load to test cognitive load
    generateNewPrompt();
  }, []);

  const {
    transcript,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  const startRecording = () => {
    resetTranscript();
    setTrueWpm(0);
    setRecordingStartTime(Date.now());
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  const stopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    
    // Calculate True WPM
    if (recordingStartTime && transcript) {
      const durationSeconds = (Date.now() - recordingStartTime) / 1000;
      const finalWordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
      if (durationSeconds > 0) {
        const wpm = Math.round((finalWordCount / durationSeconds) * 60);
        setTrueWpm(wpm);
      }
    }
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wordCount = transcript ? transcript.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div
      className="glass-card"
      style={{ padding: "40px", marginTop: "32px", position: "relative", overflow: "hidden" }}
    >
      <div className="scan-line" />

      <h2
        className="font-heading section-title gradient-text"
        style={{ marginBottom: "4px" }}
      >
        Speech Analysis
      </h2>
      <p className="section-subtitle">
        Speak clearly — our AI analyzes speech patterns for cognitive biomarkers
      </p>

      {/* Cognitive Load Reading Test */}
      <div
        style={{
          background: "rgba(30, 58, 138, 0.1)",
          border: "1px solid rgba(115, 199, 227, 0.3)",
          borderRadius: "var(--radius-md)",
          padding: "20px",
          marginBottom: "30px",
          textAlign: "center",
          position: "relative"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
            Reading Prompt
          </span>
          <motion.button
            onClick={generateNewPrompt}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            title="Try another line"
            style={{
              background: "none", border: "none", color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center"
            }}
          >
            <FiRefreshCw size={16} />
          </motion.button>
        </div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: "8px", marginBottom: "16px" }}>
          To test phonetic articulation and semantic vocabulary, please read the following sentence aloud before speaking freely:
        </p>
        <div style={{ padding: "15px", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--accent)" }}>
          <p style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text-primary)", letterSpacing: "0.5px" }}>
            "{readingPrompt}"
          </p>
        </div>
      </div>

      {/* Mic Button */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          animate={
            isRecording
              ? { scale: [1, 1.06, 1], boxShadow: ["0 0 0 0 rgba(255,77,109,0.5)", "0 0 0 20px rgba(255,77,109,0)", "0 0 0 0 rgba(255,77,109,0)"] }
              : {}
          }
          transition={{ repeat: isRecording ? Infinity : 0, duration: 1.6 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            border: "none",
            cursor: "none",
            background: isRecording
              ? "linear-gradient(135deg, #ff4d6d, #c9184a)"
              : "var(--grad-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.2rem",
            color: "#fff",
            boxShadow: isRecording
              ? "0 0 30px rgba(255,77,109,0.5), 0 0 60px rgba(255,77,109,0.2)"
              : "var(--shadow-btn)",
            transition: "background 0.3s, box-shadow 0.3s",
          }}
        >
          {isRecording ? <FiMicOff /> : <FiMic />}
        </motion.button>

        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "-8px" }}>
          {isRecording ? "Tap to stop recording" : "Tap to start recording"}
        </p>

        {/* Wave Visualizer */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "flex-end",
            height: "60px",
            padding: "8px 0",
          }}
        >
          {[...Array(28)].map((_, i) => (
            <motion.div
              key={i}
              className="wave-bar"
              animate={
                isRecording
                  ? { height: [8, Math.random() * 44 + 10, 8] }
                  : { height: 8 }
              }
              transition={{
                repeat: Infinity,
                duration: 0.45 + Math.random() * 0.3,
                delay: i * 0.04,
                ease: "easeInOut",
              }}
              style={{ height: "8px" }}
            />
          ))}
        </div>

        {/* Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <motion.div
            animate={isRecording ? { opacity: [1, 0.3, 1] } : { opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--danger)",
              boxShadow: "0 0 8px var(--danger)",
            }}
          />
          <span style={{ fontSize: "0.82rem", color: isRecording ? "var(--danger)" : "var(--text-muted)" }}>
            {isRecording ? "Recording Live..." : "Ready"}
          </span>
        </div>
      </div>

      {/* Transcript Box */}
      <div
        style={{
          marginTop: "32px",
          background: "rgba(0,212,255,0.03)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              className="font-body"
              style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
              Speech Transcript
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
                background: "rgba(0,212,255,0.1)",
                color: "var(--primary)",
                fontWeight: "600",
              }}
            >
              {wordCount} words
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Copy transcript"
              style={{
                background: "none",
                border: "none",
                cursor: "none",
                color: copied ? "var(--accent)" : "var(--text-muted)",
                transition: "color 0.2s",
                padding: "4px",
              }}
            >
              <FiCopy />
            </motion.button>
            <motion.button
              onClick={resetTranscript}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Clear transcript"
              style={{
                background: "none",
                border: "none",
                cursor: "none",
                color: "var(--text-muted)",
                padding: "4px",
              }}
            >
              <FiTrash2 />
            </motion.button>
          </div>
        </div>

        {/* Transcript content */}
        <div style={{ padding: "20px", minHeight: "100px" }}>
          <AnimatePresence mode="wait">
            {transcript ? (
              <motion.p
                id="transcript-text"
                data-wpm={trueWpm > 0 ? trueWpm : "ongoing"}
                key="transcript"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.8",
                  color: "var(--text-primary)",
                }}
              >
                {transcript}
              </motion.p>
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontSize: "0.92rem",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                {isRecording
                  ? "Listening... speak clearly into your microphone"
                  : "Press the microphone to start speech analysis"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Browser not supported */}
      {!browserSupportsSpeechRecognition && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "rgba(255,77,109,0.1)",
            border: "1px solid rgba(255,77,109,0.3)",
            borderRadius: "var(--radius-md)",
            fontSize: "0.85rem",
            color: "var(--danger)",
          }}
        >
          ⚠️ Your browser doesn't support speech recognition. Try Chrome or Edge.
        </div>
      )}
    </div>
  );
};

export default SpeechRecorder;
