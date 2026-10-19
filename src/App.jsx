import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Questions and answers
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Who is your favourite:",
    options: [
      "Cristiano",
      "Loukie",
      "Me,teddy and loukie"
    ],
    correctAnswer: "Me,teddy and loukie"
  },
  {
    id: 2,
    question: "Whats your favourite thing about us",
    options: [
      "Our Conversation",
      "Our Stickers",
      "Our stupidity"
    ],
    correctAnswer: "Our Stickers"
  },
  {
    id: 3,
    question: "Who gets upset more easily",
    options: [
      "Me",
      "You",
      "Both of us,obviously"
    ],
    correctAnswer: "You"
  },
  {
    id: 4,
    question: "Do you promise to keep choosing us, even when things get difficult",
    options: [
      "Always",
      "Of course baby",
      "Come here and let me hug you"
    ],
    correctAnswer: "Come here and let me hug you"
  }
];

// 4 Photos for the bottom collage: pairs facing each other with classic tilts
const PHOTOS = [
  { id: 1, src: '/images/photo3.jpg', rotate: -8 },
  { id: 2, src: '/images/photo4.jpg', rotate: 9 },
  { id: 3, src: '/images/photo5.jpg', rotate: -6 },
  { id: 4, src: '/images/photo6.jpg', rotate: 8 },
];

export default function App() {
  // Screens: 'intro' | 'quiz' | 'envelope' | 'main'
  const [screen, setScreen] = useState('intro');

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Envelope state
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  // Audio state
  const audioRef = useRef(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Floral borders helper component
  const FloralBorders = () => (
    <>
      <div
        className="absolute left-0 top-0 h-full w-16 sm:w-32 pointer-events-none z-0 opacity-80"
        style={{
          backgroundImage: "url('/images/flowers-left.png')",
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: 'left top'
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-16 sm:w-32 pointer-events-none z-0 opacity-80"
        style={{
          backgroundImage: "url('/images/flowers-right.png')",
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: 'right top'
        }}
      />
    </>
  );

  // Handle Option Click in Quiz
  const handleSelectOption = (option) => {
    if (isSuccess || isShaking) return;

    setSelectedOption(option);
    const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

    const isCorrect = option.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      setErrorMessage('');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedOption(null);
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          // Completed all questions! Move to envelope
          setScreen('envelope');
        }
      }, 700);
    } else {
      setErrorMessage('no try again');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setSelectedOption(null);
      }, 700);
    }
  };

  // Open envelope and start music
  const handleEnvelopeClick = () => {
    setIsEnvelopeOpened(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch((err) => console.log('Audio playback initiated:', err));
    }
  };

  // Toggle music playback
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch((err) => console.log('Audio play error:', err));
    }
  };

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#3a0a18] via-[#480f21] to-[#2c0612] text-[#f3e3ce] font-serif relative selection:bg-[#721d38] selection:text-white">

      {/* Background Audio */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* Floating Music Control Button: icon only with no text */}
      {(screen === 'main' || isPlayingMusic) && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? "Pause music" : "Play music"}
          className="fixed top-4 right-4 z-50 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#24050d]/85 backdrop-blur-md border border-[#f3e3ce]/30 shadow-xl text-[#f3e3ce] hover:border-[#f3e3ce]/60 transition-all cursor-pointer"
        >
          <span className={`text-xl sm:text-2xl select-none ${isPlayingMusic ? 'animate-pulse' : 'opacity-60'}`}>
            {isPlayingMusic ? '🎵' : '🔇'}
          </span>
        </motion.button>
      )}

      {/* ================= 1. INTRO / WELCOME PAGE ================= */}
      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <motion.div
            key="screen-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#3a0a18] via-[#480f21] to-[#2c0612] overflow-hidden"
          >
            <FloralBorders />

            {/* Glowing ambient background orbs */}
            <div className="absolute w-72 h-72 rounded-full bg-[#7a1c36]/20 blur-3xl pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10 max-w-md w-full mx-auto p-8 sm:p-10 rounded-3xl bg-[#2b0712]/80 backdrop-blur-xl border border-[#f3e3ce]/20 shadow-[0_15px_40px_rgba(0,0,0,0.45)] text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-4xl sm:text-5xl mb-5"
              >
                ❤️🥹
              </motion.div>

              <h1 className="font-serif text-2xl sm:text-3xl text-[#f3e3ce] font-semibold leading-relaxed mb-4 drop-shadow-sm">
                Hey baby, I have a little surprise for you…
              </h1>

              <p className="font-serif text-lg sm:text-xl text-[#f3e3ce]/85 italic mb-8">
                Are you ready?
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setScreen('quiz')}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#5e182f] to-[#7d203e] text-[#f3e3ce] font-serif text-base uppercase tracking-widest border border-[#f3e3ce]/30 shadow-xl hover:shadow-[0_0_25px_rgba(243,227,206,0.3)] transition-all cursor-pointer"
              >
                Open the gift ✨
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 2. QUIZ QUESTIONS PAGE ================= */}
      <AnimatePresence mode="wait">
        {screen === 'quiz' && (
          <motion.div
            key="screen-quiz"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#3a0a18] via-[#480f21] to-[#2c0612] overflow-hidden"
          >
            <FloralBorders />

            <div className="relative z-10 max-w-lg w-full mx-auto p-6 sm:p-10 rounded-3xl bg-[#2b0712]/85 backdrop-blur-xl border border-[#f3e3ce]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">

              {/* Progress counter */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#f3e3ce]/15 text-xs sm:text-sm tracking-widest uppercase text-[#f3e3ce]/75">
                <span>Little Quiz For My Love</span>
                <span className="font-bold text-[#f3e3ce]">
                  {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {QUIZ_QUESTIONS.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentQuestionIndex
                      ? 'w-8 bg-[#f3e3ce]'
                      : idx < currentQuestionIndex
                        ? 'w-2 bg-[#7d203e]'
                        : 'w-2 bg-[#f3e3ce]/20'
                      }`}
                  />
                ))}
              </div>

              {/* Question Text */}
              <motion.h2
                key={`q-${currentQuestionIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-serif text-xl sm:text-2xl text-[#f3e3ce] font-medium leading-relaxed min-h-[64px] flex items-center justify-center mb-6"
              >
                {QUIZ_QUESTIONS[currentQuestionIndex].question}
              </motion.h2>

              {/* Options */}
              <div className="flex flex-col gap-3.5 mb-4">
                {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, idx) => {
                  const isThisSelected = selectedOption === option;
                  const isCurrentSuccess = isThisSelected && isSuccess;
                  const isCurrentWrong = isThisSelected && isShaking;

                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: isSuccess || isShaking ? 1 : 1.02 }}
                      whileTap={{ scale: isSuccess || isShaking ? 1 : 0.98 }}
                      onClick={() => handleSelectOption(option)}
                      className={`relative w-full py-3.5 px-5 rounded-2xl text-sm sm:text-base font-serif transition-all duration-200 border text-center cursor-pointer ${isCurrentSuccess
                        ? 'bg-[#2e5a3c]/90 border-emerald-400 text-white shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                        : isCurrentWrong
                          ? 'bg-[#7a1428] border-red-400 text-white animate-shake shadow-[0_0_20px_rgba(248,113,113,0.4)]'
                          : 'bg-[#420d1d]/70 hover:bg-[#5a1429] border-[#f3e3ce]/25 text-[#f3e3ce] shadow-md'
                        }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {option}
                        {isCurrentSuccess && <span>✓</span>}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Error / Success Feedback */}
              <div className="min-h-[28px] flex items-center justify-center">
                <AnimatePresence>
                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm sm:text-base font-serif text-[#ffb0bd] tracking-wide"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                  {isSuccess && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm sm:text-base font-serif text-[#a7f3d0] tracking-wide"
                    >
                      You got it right! 🥰❤️
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 3. ENVELOPE SCREEN ================= */}
      <AnimatePresence mode="wait">
        {screen === 'envelope' && (
          <motion.section
            key="screen-envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#3a0a18] via-[#480f21] to-[#2c0612] overflow-hidden"
          >
            <FloralBorders />

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 sm:mb-10 -rotate-6 font-hand text-4xl sm:text-5xl text-[#f3e3ce] relative right-8 sm:right-12 drop-shadow-md z-30"
            >
              open me!
            </motion.p>

            <div
              className="relative flex items-center justify-center w-full max-w-sm cursor-pointer mt-4"
              onClick={handleEnvelopeClick}
            >
              <motion.img
                src="/images/envelope-closed.png"
                alt="Closed Envelope"
                className="relative z-20 w-72 sm:w-84 object-contain drop-shadow-2xl cursor-pointer"
                animate={isEnvelopeOpened ? { scale: 1.6, opacity: 0 } : { scale: 1, opacity: 1, rotate: -4 }}
                transition={{ duration: 0.8 }}
                onAnimationComplete={() => {
                  if (isEnvelopeOpened) {
                    setScreen('main');
                  }
                }}
                whileHover={!isEnvelopeOpened ? { scale: 1.05, rotate: -2 } : {}}
                whileTap={!isEnvelopeOpened ? { scale: 0.95 } : {}}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.6 }}
              className="mt-8 font-serif text-xs uppercase tracking-[0.25em] text-[#f3e3ce]/70"
            >
              Tap the envelope to reveal ✨
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= 4. MAIN CONTENT (WEBSITE) ================= */}
      {screen === 'main' && (
        <div className="w-full overflow-y-auto">

          {/* ===== SECTION 1: GREETING HERO ===== */}
          <section id="hero-section" className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center overflow-hidden py-16">
            <FloralBorders />

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="z-10 mt-6 font-serif text-sm uppercase tracking-[0.18em] text-[#f3e3ce] drop-shadow-sm max-w-xs sm:max-w-md"
            >
              To the most beautiful girl!
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="z-10 my-3 font-script text-[6.5rem] leading-none text-[#f3e3ce] drop-shadow-lg sm:text-[9.5rem]"
            >
              Tee
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="z-10 font-serif text-sm uppercase tracking-[0.2em] text-[#f3e3ce] drop-shadow-sm mb-16 sm:mb-20"
            >
              Happy one year of us
            </motion.p>

            {/* Envelope with peek photos - moved down so they do not cover Happy birthday text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10 mt-16 sm:mt-24 h-64 w-[310px] sm:h-80 sm:w-[420px] flex items-end justify-center"
            >
              <div className="absolute bottom-0 h-44 w-full bg-[#dcc6ad] rounded-md shadow-inner sm:h-56" />

              <div className="absolute bottom-28 left-4 z-10 h-44 w-32 -rotate-12 bg-white p-2 shadow-polaroid sm:bottom-36 sm:left-6 sm:h-56 sm:w-40 transition-transform hover:scale-105 hover:z-30">
                <img src="/images/photo2.jpg" className="h-full w-full object-cover" alt="Pic 1" />
              </div>
              <div className="absolute bottom-24 right-4 z-10 h-44 w-32 rotate-12 bg-white p-2 shadow-polaroid sm:bottom-32 sm:right-6 sm:h-56 sm:w-40 transition-transform hover:scale-105 hover:z-30">
                <img src="/images/photo1.jpg" className="h-full w-full object-cover" alt="Pic 2" />
              </div>

              <div
                className="relative z-20 h-32 w-full bg-[#f3e3ce] shadow-[-2px_-4px_12px_rgba(0,0,0,0.12)] rounded-b-md sm:h-40"
                style={{ clipPath: 'polygon(0 0, 50% 15%, 100% 0, 100% 100%, 0 100%)' }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="z-10 mt-16 mb-4 rounded-full bg-[#5a1429] px-14 py-3.5 font-serif text-sm uppercase tracking-[0.3em] text-[#f3e3ce] shadow-xl hover:scale-105 transition-transform cursor-pointer border border-[#f3e3ce]/25"
            >
              I love u
            </motion.div>
          </section>

          {/* ===== SECTION 2: THE ROMANTIC LETTER (VIDEO REMOVED) ===== */}
          <section className="relative flex min-h-screen flex-col items-center justify-center py-20 px-4 overflow-hidden">
            <FloralBorders />

            {/* The Letter on Lace Paper Background */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="z-10 relative w-[95%] sm:w-[85%] max-w-[700px] mx-auto drop-shadow-2xl flex flex-col items-center justify-center text-center"
              style={{
                backgroundImage: "url('/images/lace paper.png')",
                backgroundSize: '150% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '780px'
              }}
            >
              <div className="w-full pt-[24%] pb-[28%] px-[18%] sm:pt-[22%] sm:pb-[26%] sm:px-[22%]">
                <p className="font-letter text-[17px] sm:text-2xl lg:text-3xl font-bold text-[#4a362f] mb-3 sm:mb-5">
                  To my favorite person,
                </p>
                <p className="font-letter text-[12px] sm:text-[15.5px] lg:text-[17.5px] leading-[1.9] sm:leading-[2.2] font-bold text-[#4a362f]">
                  Happy one year of us, baby, Despite all the problems, blocking, and fights, I’m still here, still caring, and still looking at you with the same excitement as the first time I saw you. I’ve grown so attached to you, and I love you so much. I hope we get to celebrate many more years together. ❤️🥹
                </p>
              </div>
            </motion.div>
          </section>

          {/* ===== SECTION 3: PHOTO COLLAGE (PAIRS FACING EACH OTHER ON MOBILE & DESKTOP) ===== */}
          <section className="relative w-full overflow-hidden px-3 sm:px-10 py-16 min-h-screen">
            <FloralBorders />

            <div className="relative mx-auto w-full max-w-4xl z-10">

              <motion.div
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8 sm:mb-14 text-center"
              >
                <h2 className="font-serif text-3xl sm:text-5xl uppercase leading-snug tracking-widest text-[#f3e3ce] drop-shadow-md">
                  MY FAV PICS OF YOU
                </h2>
              </motion.div>

              {/* Grid 2-columns on all screens: pairs facing each other with classic tilts and slim frame */}
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-7 sm:gap-y-12 max-w-sm sm:max-w-2xl mx-auto items-start">
                {PHOTOS.map((photo, i) => (
                  <div
                    key={photo.id}
                    className="flex justify-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                      whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
                      style={{ rotate: `${photo.rotate}deg` }}
                      className="z-10 w-full max-w-[155px] sm:max-w-[270px] bg-white p-1.5 sm:p-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.35)] rounded-[2px] transition-all duration-300"
                    >
                      {/* Slim, natural-fit image container: uncropped, sharp, tight border */}
                      <img
                        src={photo.src}
                        alt={`Pic ${photo.id}`}
                        className="w-full h-auto block select-none rounded-[1px]"
                        style={{ imageRendering: 'auto' }}
                        loading="lazy"
                      />
                    </motion.div>
                  </div>
                ))}
              </div>

            </div>

            {/* Read It Again Button */}
            <div className="relative z-20 mt-12 sm:mt-16 pb-12 flex justify-center">
              <motion.button
                type="button"
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-[#5a1429] px-9 sm:px-10 py-3.5 sm:py-4 font-serif text-xs sm:text-sm uppercase tracking-widest text-[#f3e3ce] shadow-xl border border-[#f3e3ce]/25 hover:shadow-[0_0_25px_rgba(243,227,206,0.3)] transition-all cursor-pointer"
              >
                Read it again ↑
              </motion.button>
            </div>

          </section>

        </div>
      )}

    </div>
  );
}