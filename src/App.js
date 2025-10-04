import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [
      0,     // Step 0: Title + Hook
      4000,  // Step 1: The Rule Introduction
      9000,  // Step 2: Show general format
      14000, // Step 3: Example problem
      17000, // Step 4: Highlight first digit
      19000, // Step 5: Highlight second digit
      21000, // Step 6: Show addition
      25000, // Step 7: Place sum in middle
      29000, // Step 8: Final answer + CTA
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
            <div className="hook">Did you know?</div>
            <h1 className="main-title">Multiply by 11</h1>
            <p className="subtitle">in 3 seconds!</p>
          </div>
        )}

        {step >= 1 && step < 3 && (
          <div className="rule-intro">
            <h2 className="section-title">The Rule:</h2>
            <div className="rule-box">
              <p className="rule-text">When multiplying any 2-digit number by 11...</p>
              <div className="rule-steps">
                <div className="rule-step">1. Take the two digits</div>
                <div className="rule-step">2. Add them together</div>
                <div className="rule-step">3. Place sum in the middle</div>
              </div>
            </div>
          </div>
        )}

        {step >= 2 && step < 3 && (
          <div className="general-format">
            <div className="format-display">
              <span className="format-letter">A</span>
              <span className="format-letter">B</span>
              <span className="format-arrow">→</span>
              <span className="format-letter">A</span>
              <span className="format-letter sum">(A+B)</span>
              <span className="format-letter">B</span>
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="example-section">
            <h2 className="section-title">Example:</h2>
            
            {step === 3 && (
              <div className="problem-display">
                <div className="equation">
                  <span className="number large">11</span>
                  <span className="operator">×</span>
                  <span className="number large">23</span>
                  <span className="operator">=</span>
                  <span className="question">?</span>
                </div>
              </div>
            )}

            {step >= 4 && step < 8 && (
              <div className="breakdown">
                <div className="step-label">Step 1: Identify the digits</div>
                <div className="original-number">
                  <span className={`digit ${step >= 4 ? 'highlight-first' : ''}`}>2</span>
                  <span className={`digit ${step >= 5 ? 'highlight-second' : ''}`}>3</span>
                </div>

                {step >= 6 && (
                  <>
                    <div className="step-label">Step 2: Add them</div>
                    <div className="addition-step">
                      <div className="add-animation">
                        <span className="add-num">2</span>
                        <span className="plus">+</span>
                        <span className="add-num">3</span>
                        <span className="equals">=</span>
                        <span className="sum-result">5</span>
                      </div>
                    </div>
                  </>
                )}

                {step >= 7 && (
                  <>
                    <div className="step-label">Step 3: Place in middle</div>
                    <div className="placement-animation">
                      <div className="building-answer">
                        <span className="digit-slot">2</span>
                        <span className="digit-slot middle-slot">5</span>
                        <span className="digit-slot">3</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {step >= 8 && (
              <div className="final-answer">
                <div className="result-equation">
                  <span className="small-eq">11 × 23 =</span>
                  <span className="answer-large">253</span>
                  <div className="checkmark">✓</div>
                </div>
                <div className="cta">
                  <p className="cta-text">Try: 11 × 45</p>
                  <p className="cta-follow">Follow for more math tricks!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}