import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const Metronome = () => {
  const [bpm, setBpm] = useState(100); // Beats per minute
  const [playing, setPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const audioContext = useRef(null);
  const oscillator = useRef(null);

  // Start the metronome
  const startMetronome = () => {
    if (!playing) {
      setPlaying(true);
      const interval = setInterval(playSound, (60 / bpm) * 1000);
      setIntervalId(interval);
    }
  };

  // Stop the metronome
  const stopMetronome = () => {
    if (playing) {
      clearInterval(intervalId);
      setPlaying(false);
    }
  };

  // Play the metronome tick sound
  const playSound = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioContext.current.createOscillator();
    osc.frequency.value = 1000; // frequency in Hz (tick sound)
    osc.connect(audioContext.current.destination);
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.05); // short beep
  };

  return (
    <Container>
      <Row className="text-center">
        <Col>
          <h1>Metronome</h1>
          <p>{bpm} BPM</p>
          <Form>
            <Form.Range
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
            />
          </Form>
          <Button onClick={playing ? stopMetronome : startMetronome}>
            {playing ? 'Stop' : 'Start'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Metronome;