"use client";

import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const Metronome = () => {
  const [bpm, setBpm] = useState<number>(100);
  const [playing, setPlaying] = useState<boolean>(false);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [buttonVariant, setButtonVariant] = useState<string>("success");
  const [inputBpm, setInputBpm] = useState<string>(bpm.toString());

  const audioContext = useRef<AudioContext | null>(null);

  const playSound = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.AudioContext)();
    }
    const osc = audioContext.current.createOscillator();
    osc.frequency.value = 432;
    osc.connect(audioContext.current.destination);
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.05);
  };

  const startMetronome = () => {
    setPlaying(true);
    setButtonVariant("danger");
  };

  const stopMetronome = () => {
    setPlaying(false);
    setButtonVariant("success");
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  };

  useEffect(() => {
    if (playing) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      intervalId.current = setInterval(playSound, (60 / bpm) * 1000);
    } else if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [bpm, playing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && Number(value) > 0) {
      setInputBpm(value);
    }
  };

  const handleBpmSubmit = () => {
    const newBpm = Number(inputBpm);
    if (newBpm >= 40 && newBpm <= 240) {
      setBpm(newBpm);
    } else {
      alert("please introduce a value between 40 and 240");
    }
  };

  return (
    <Container className="main-container">
      <Container className="app-container">
        <Row className="text-center">
          <Col>
            <h1 className="header">metronome</h1>
            <p>{bpm} bpm</p>
            <Form>
              <Form.Range
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => {
                  setBpm(Number(e.target.value));
                  setInputBpm(e.target.value);
                }}
              />
            </Form>
            <Form.Group id="control" className="control-container">
              <Form.Label>beats per minute:</Form.Label>
              <Form.Control
                className="input-box"
                type="text"
                value={inputBpm}
                onChange={handleInputChange}
                placeholder="setear"
              />
              <div className="input-group">
              <Button
                onClick={handleBpmSubmit}
                className=""
                variant="warning"
              >
                adjust bpm
              </Button>
              <Button
                onClick={playing ? stopMetronome : startMetronome}
                variant={buttonVariant}
              >
                {playing ? "stop" : "start"}
              </Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Metronome;
