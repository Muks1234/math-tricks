import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [step, setStep] = useState(0);
  const [num1] = useState(2);
  const [num2] = useState(3);
  const [sum] = useState(5);

  useEffect(() => {
    const timings = [
      0,    // Step 0: Title
      2000, // Step 1: Show problem
      4000, // Step 2: Highlight first digit
      6000, // Step 3: Highlight second digit
      8000, // Step 4: Show addition
      11000, // Step 5: Show sum
      13000, // Step 6: Place sum in middle
      15000, // Step 7: Show final answer
      18000  // Step 8: Celebrate
    ];

    const timeouts = timings.map((timing, index) => {
      return setTimeout(() => setStep(index), timing);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="container">
      <div className="content">
        {step === 0 && (
          <div className="title-screen">
            <h1 className="main-title">The 11x Trick</h1>
            <p className="subtitle">Mind-Blowing Math! 🤯</p>
          </div>
        )}

        {step >= 1 && (
          <div className="animation-content">
            {step === 1 && (
              <div className="problem-intro">
                <div className="equation">
                  <span className="number large">11</span>
                  <span className="operator">×</span>
                  <span className="number large">23</span>
                  <span className="operator">=</span>
                  <span className="question">?</span>
                </div>
              </div>
            )}

            {step >= 2 && step < 7 && (
              <div className="breakdown">
                <div className="original-number">
                  <span className={`digit ${step >= 2 ? 'highlight-blue' : ''}`}>{num1}</span>
                  <span className={`digit ${step >= 3 ? 'highlight-green' : ''}`}>{num2}</span>
                </div>

                {step >= 4 && (
                  <div className="addition-step">
                    <div className="add-animation">
                      <span className="add-num">{num1}</span>
                      <span className="plus">+</span>
                      <span className="add-num">{num2}</span>
                      {step >= 5 && (
                        <>
                          <span className="equals">=</span>
                          <span className="sum-result">{sum}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="placement-animation">
                    <div className="instruction">Put {sum} in the middle!</div>
                    <div className="building-answer">
                      <span className="digit-slot">{num1}</span>
                      <span className="digit-slot middle-slot">{sum}</span>
                      <span className="digit-slot">{num2}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step >= 7 && (
              <div className="final-answer">
                <div className="result-equation">
                  <span className="small-eq">11 × 23 =</span>
                  <span className="answer-large">253</span>
                </div>
                {step === 8 && (
                  <div className="celebrate">
                    <div className="emoji-burst">✨ 🎉 ✨</div>
                    <p className="try-text">Try it yourself!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}