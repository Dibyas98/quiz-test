import React, { useState, useEffect } from "react";
import "./quiz.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Quiz({ data }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [checkedOption, setCheckedOption] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          'https://opentdb.com/api.php?amount=10&type=multiple'
        );
        setQuestions(response.data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer > 0 && !isGameOver) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        clearInterval(timerInterval);
        handleSkipClick();
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timer, isGameOver]);

  const handleAnswerClick = (isCorrect, selectedOption) => {
    // console.log(selectedOption);
    if(selectedOption == null){
        console.log("hh");
        toast.warning("Please click your option");
    }
   else{
    if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
  
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setTimer(10);
        setCheckedOption(null);
      } else {
        setIsGameOver(true);
      }
   }
  };

  const handleSkipClick = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimer(10);
      setCheckedOption(null); // Reset the selected option for the next question
    } else {
      setIsGameOver(true);
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (isGameOver) {
    return (
      <div>
        <h1>Game Over!</h1>
        <p>Your Score: {score}</p>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const answers = [...currentQuestionData.incorrect_answers, currentQuestionData.correct_answer];

  return (
    <div className="quiz-cont">
      <h1 className="quiz-heading">Question</h1>
      <p className="quiz-question">
        Question {currentQuestion + 1}/{questions.length}
      </p>
      <p dangerouslySetInnerHTML={{ __html: currentQuestionData.question }} className="quiz-question"/>
      <div className="quiz-option">
        {answers.map((answer, index) => (
          <div key={index} className="quiz-opti">
            <input
              type="radio"
              name="option"
              onChange={() => setCheckedOption(answer)}
              checked={checkedOption === answer}
            />
            <label htmlFor="">{answer}</label>
          </div>
        ))}
      </div>

      <div className="quiz-skipTime">
        <p>Time left: {timer} seconds</p>
        <button className="button-3" onClick={() => handleAnswerClick(checkedOption === currentQuestionData.correct_answer, checkedOption)}>
          Submit Answer
        </button>
        <ToastContainer/>
        <button className="button-3" onClick={handleSkipClick}>
          Skip Question
        </button>
      </div>
    </div>
  );
}
