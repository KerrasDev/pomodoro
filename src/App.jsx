import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, CardHeader } from '@mui/material';
import { Pause, PlayArrow, Replay, SkipNext } from '@mui/icons-material';
import './App.css';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    if (currentSession === 'work') {
      setSessionCount((prevCount) => prevCount + 1);
      setCurrentSession(sessionCount % 4 === 3 ? 'longBreak' : 'shortBreak');
    } else {
      setCurrentSession('work');
    }
    resetTimer();
  };

  const resetTimer = () => {
    setTimeLeft(getSessionTime());
    setIsRunning(false);
  };

  const getSessionTime = () => {
    switch (currentSession) {
      case 'work': return workDuration * 60;
      case 'shortBreak': return shortBreakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
      default: return workDuration * 60;
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const skipSession = () => {
    handleSessionComplete();
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <div className="timer">
        <div className="time-display">{formatTime(timeLeft)}</div>
      </div>
      <div className="session-type">{currentSession.charAt(0).toUpperCase() + currentSession.slice(1)}</div>
      <div className="controls">
        <div className="input-wrapper">
          <label htmlFor="workMinutes" className="input-label">Work</label>
          <input
            type="number"
            id="workMinutes"
            value={workDuration}
            onChange={(e) => setWorkDuration(Number(e.target.value))}
            min="1"
            max="60"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="shortBreakMinutes" className="input-label">Short Break</label>
          <input
            type="number"
            id="shortBreakMinutes"
            value={shortBreakDuration}
            onChange={(e) => setShortBreakDuration(Number(e.target.value))}
            min="1"
            max="30"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="longBreakMinutes" className="input-label">Long Break</label>
          <input
            type="number"
            id="longBreakMinutes"
            value={longBreakDuration}
            onChange={(e) => setLongBreakDuration(Number(e.target.value))}
            min="1"
            max="60"
          />
        </div>
        <Button variant="contained" color="error" onClick={toggleTimer} startIcon={isRunning ? <Pause /> : <PlayArrow />}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button variant="contained" color="error" onClick={resetTimer} startIcon={<Replay />}>Reset</Button>
        <Button variant="contained" color="error" onClick={skipSession} startIcon={<SkipNext />}>Skip</Button>
      </div>
      <div className="session-count">Sessions completed: {sessionCount}</div>
      <div className="task-management">
        <h3>Tasks</h3>
        <input
          type="text"
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <Button variant="contained" color="error" onClick={addTask}>Add Task</Button>
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li key={index} className="task-item">
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
              <div>
                <Button variant="contained" color="success" onClick={() => toggleTask(index)}>
                  {task.completed ? 'Undo' : 'Complete'}
                </Button>
                <Button variant="contained" color="error" onClick={() => setTasks(tasks.filter((_, i) => i !== index))}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PomodoroTimer;
