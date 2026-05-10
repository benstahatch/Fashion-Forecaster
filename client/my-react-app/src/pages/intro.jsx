import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Butterfly from '../components/Butterfly.jsx'

const TimelineStep = ({ title, children, index, statusClass }) => {
  const [isCentered, setIsCentered] = useState(false);
  const stepRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCentered(entry.isIntersecting);
      },
      {
        rootMargin: '-45% 0% -45% 0%', // Tight focus window for center of screen
        threshold: 0.1,
      }
    );
    if (stepRef.current) observer.observe(stepRef.current);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div 
      ref={stepRef} 
      className={`timeline-step ${statusClass} ${isCentered ? 'in-focus' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        minHeight: '150px',
        transition: 'all 0.6s ease-in-out',
        transform: isCentered ? 'scale(1.15)' : 'scale(1)',
        opacity: isCentered ? 1 : 0.3
      }}
    >
      {/* LEFT CONTENT */}
      <div style={{ flex: 1, textAlign: 'right', paddingRight: '50px' }}>
        {isLeft && (
          <>
            <h3 className="timeline-title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{title}</h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{children}</div>
          </>
        )}
      </div>

      <div>
        {/* The Vertical Line */}
    <div className="timeline-line" style={{ 
            position: 'absolute',
            marginTop: '-3%',
            height: '100px',
            left: '50%',
            width: '2px',
            backgroundColor: 'black',
            transform: 'translateX(-50%)',
            zIndex: 1
    }} />
      </div>

      {/* RIGHT CONTENT */}
      <div style={{ flex: 1, textAlign: 'left', paddingLeft: '50px' }}>
        {!isLeft && (
          <>
            <h3 className="timeline-title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{title}</h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{children}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default function IntroPage() {
  const [phase, setPhase] = useState('entering')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setPhase('leaving'), 6000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '40px' }}>
            <h1 style={{ marginBottom: '20px' }}>What is Fashion Forecasting?</h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontStyle: 'italic', padding: '0 20px' }}>
               "The practice of predicting upcoming trends based on past and present style-related information, 
               the interpretation and analysis of the motivation behind a trend, 
               and an explanation of why the prediction is likely to occur (Rousso and Ostroff, 2024)."
            </p>
            <h2 style={{ marginTop: '60px', textTransform: 'uppercase', letterSpacing: '2px' }}>The Forecasting Process</h2>
        </div>

        {/* Timeline Wrapper */}
        <div style={{ 
            position: 'relative', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0' 
        }}>
          <TimelineStep index={0} title="Observation">
             Analyzing current trends and cultural shifts. Identify how the *Zeitgeist (Spirit of the time) shapes fashion.
          </TimelineStep>

          <TimelineStep index={1} title="Synthesis">
            Connecting data points to predict the next big thing.
          </TimelineStep>

          <TimelineStep index={2} title="Visualization">
            Creating mood boards, trend reports, and presentations.
          </TimelineStep>

          <TimelineStep index={3} title="Application" >
            Developing products aligned with predicted, in-demand trends.
          </TimelineStep>
          <TimelineStep index={4} title="Types of Forecasting">
            Trend/Color/Consumer Forecasting
          </TimelineStep>
          <TimelineStep index={5} title="Duration of Forecasting" statusClass="timeline-complete">
            <ol>
              <li>
                Long-term (Macro) Forecasting: Predicts lifestyle and consumer shifts 2–5 years ahead.
              </li>
              <li>
                Short-term (Micro) Forecasting: Focuses on upcoming seasons (6–18 months), tracking, colors, and styles.
              </li>
            </ol>
          </TimelineStep>
        </div>

        <div style={{ height: '30vh' }} />
      </div>
    )
  }

  // Butterfly animation
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 2.5s ease-in-out', 
        opacity: phase === 'leaving' ? 0 : 1,
        pointerEvents: 'all' 
      }}
      onTransitionEnd={() => setIsVisible(false)}
    >
      <div className="nav-logo" style={{ position: 'relative', fontSize: '48px' }}>
        ForeMT <span className="logo-thin">FASHION</span>
      </div>

      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
          <ambientLight intensity={2} />
          <pointLight position={[5, 5, 5]} />
          <Butterfly phase={phase} />
        </Canvas>
      </div>
    </div>
  )
}
