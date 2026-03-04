
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  PieChart, 
  ArrowRight, 
  ChevronRight, 
  BookOpen, 
  User, 
  ExternalLink, 
  Loader2 
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Page, TopicId } from './types';
import { TOPICS, LESSONS_DATA, CONTACT_EMAIL } from './constants';
import { Chatbot } from './components/Chatbot';
import { PriceIsRight, LoanShark, StockSim } from './components/Games';
import { CollegeEstimator } from './components/Calculators';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTopic, setSelectedTopic] = useState<TopicId | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Lesson completion state
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('moneyish_completed_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  // Use a ref for the selected lesson so the event listener always has the "current" value
  // This is the "magic" that makes 1.1 work and will now fix 1.2, 1.3, and 1.4
  const selectedLessonRef = useRef<string | null>(null);
  const currentPageRef = useRef<Page>('home');

  useEffect(() => {
    selectedLessonRef.current = selectedLesson;
  }, [selectedLesson]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('moneyish_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  // Specialized effect for the Vimeo Player SDK
  useEffect(() => {
    if (currentPage === 'lesson' && selectedLesson) {
      const iframe = document.getElementById('lesson-player') as HTMLIFrameElement;
      if (iframe && iframe.src.includes('vimeo')) {
        try {
          // @ts-ignore - Vimeo is loaded in index.html
          const player = new window.Vimeo.Player(iframe);
          player.on('ended', () => {
            const currentId = selectedLessonRef.current;
            if (currentId) {
              setCompletedLessons(prev => {
                if (prev.includes(currentId)) return prev;
                return [...prev, currentId];
              });
            }
          });
        } catch (e) {
          console.warn("Vimeo SDK not yet ready or failed to init", e);
        }
      }
    }
  }, [currentPage, selectedLesson]);

  // Enhanced postMessage listener for Dailymotion and YouTube
  useEffect(() => {
    const handleVideoMessage = (event: MessageEvent) => {
      let data: any;
      const rawData = event.data;

      // Catch Dailymotion string events directly
      if (typeof rawData === 'string') {
        const lowerData = rawData.toLowerCase();
        if (lowerData.includes('video_end') || lowerData.includes('ended') || lowerData.includes('finish')) {
          const currentId = selectedLessonRef.current;
          if (currentPageRef.current === 'lesson' && currentId) {
            setCompletedLessons(prev => prev.includes(currentId) ? prev : [...prev, currentId]);
          }
          return;
        }
        try {
          data = JSON.parse(rawData);
        } catch (e) {
          data = rawData; 
        }
      } else {
        data = rawData;
      }

      if (!data) return;

      // Handle Object-based events (YouTube/Other Dailymotion versions)
      let isVideoEnded = false;
      if (typeof data === 'object') {
        isVideoEnded = 
          data.event === 'finish' || 
          data.event === 'video_end' || 
          data.type === 'video_end' ||
          data.event === 'ended' ||
          data.type === 'ended' ||
          (data.event === 'onStateChange' && (data.info === 0 || data.data === 0));
      } 

      if (isVideoEnded) {
        const currentId = selectedLessonRef.current;
        if (currentPageRef.current === 'lesson' && currentId) {
          setCompletedLessons(prev => prev.includes(currentId) ? prev : [...prev, currentId]);
        }
      }
    };

    window.addEventListener('message', handleVideoMessage);
    return () => window.removeEventListener('message', handleVideoMessage);
  }, []);

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  const getTopicProgress = (topicId: TopicId) => {
    const topicLessons = LESSONS_DATA.filter(l => l.topic === topicId);
    if (topicLessons.length === 0) return 0;
    const completedCount = topicLessons.filter(l => completedLessons.includes(l.id)).length;
    
    // THE MATH YOU ASKED ABOUT:
    // (Completed Lessons / 4 Total Lessons) * 100
    const progress = (completedCount / topicLessons.length) * 100;
    return Math.round(progress);
  };

  const HeroImage = () => (
    <div className="relative">
      <div className="rounded-[40px] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700 ease-out border-8 border-white">
        <img 
          src="https://media.istockphoto.com/id/1389976863/photo/university-students-helping-each-other.jpg?s=612x612&w=0&k=20&c=YijT_ZwzTqyUkKH5ZEsL0tHGxMoxF81C5LWkFsu6LVA=" 
          alt="Diverse students studying together" 
          className="w-full h-[450px] object-cover" 
        />
      </div>
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center p-4 border-2 border-teal-50">
        <DollarSign className="text-green-600 w-16 h-16" />
      </div>
    </div>
  );

  const handleTopicClick = (topicId: TopicId) => {
    setSelectedTopic(topicId);
    const firstLesson = LESSONS_DATA.find(l => l.topic === topicId);
    if (firstLesson) {
      setSelectedLesson(firstLesson.id);
      setCurrentPage('lesson');
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim() || !feedbackName.trim() || !feedbackEmail.trim()) {
      alert("Please fill out all fields.");
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    try {
      const response = await fetch(`https://formspree.io/f/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: feedbackName,
          email: feedbackEmail,
          message: feedback,
          _subject: `New Moneyish App Feedback from ${feedbackName}`
        })
      });
      
      if (response.ok) {
        setFeedback("");
        setFeedbackName("");
        setFeedbackEmail("");
        setFeedbackSuccess(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setFeedbackSuccess(true);
      setFeedback("");
      setFeedbackName("");
      setFeedbackEmail("");
    } finally {
      setIsSubmittingFeedback(false);
      setTimeout(() => setFeedbackSuccess(false), 15000);
    }
  };

  const renderNavbar = () => (
    <nav className="bg-teal-800 text-white px-6 py-6 sticky top-0 z-40 shadow-xl border-b border-teal-700">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
        <div 
          className="text-4xl font-light tracking-[0.2em] cursor-pointer hover:text-teal-200 transition-colors"
          onClick={() => { setCurrentPage('home'); setSelectedTopic(null); }}
        >
          moneyish
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {Object.values(TOPICS).map(t => (
            <button 
              key={t.id} 
              onClick={() => handleTopicClick(t.id as TopicId)}
              className={`px-5 py-2 rounded-xl text-sm font-bold tracking-wider transition-all border ${
                selectedTopic === t.id 
                ? 'bg-teal-400 text-teal-900 border-teal-300 shadow-lg' 
                : 'bg-teal-700/50 hover:bg-teal-600 border-teal-600 text-white'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
        <div className="hidden lg:block w-32"></div>
      </div>
    </nav>
  );

  const renderHero = () => (
    <section className="px-6 py-20 bg-[#FDF5E6]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 order-2 md:order-1 text-center md:text-left">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl text-gray-800 leading-[1.1] tracking-wide font-light">
              financial literacy<br />
              <span className="font-bold">made easy!</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-500 font-light">for teens, by teens</p>
          </div>
          <button 
            onClick={() => {
                const about = document.getElementById('about');
                about?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-teal-800 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-teal-700 transition-all shadow-xl transform hover:-translate-y-1"
          >
            About Me
          </button>
        </div>
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <HeroImage />
        </div>
      </div>
    </section>
  );

  const renderProgressCards = () => (
    <section className="bg-white py-24 px-6 border-y border-teal-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-teal-800 mb-16 tracking-widest uppercase">Your Financial Journey</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { id: TopicId.EARNING, icon: TrendingUp, label: "Earning", color: "text-teal-600", border: "border-teal-100" },
            { id: TopicId.CREDIT, icon: CheckCircle, label: "Credit", color: "text-emerald-600", border: "border-emerald-100" },
            { id: TopicId.SAVING, icon: DollarSign, label: "Saving", color: "text-green-600", border: "border-green-100" },
            { id: TopicId.BUDGETING, icon: PieChart, label: "Budgeting", color: "text-cyan-600", border: "border-cyan-100" },
          ].map((stat) => {
            const progress = getTopicProgress(stat.id);
            return (
              <div 
                key={stat.id} 
                className={`bg-white p-8 rounded-[32px] border-2 ${stat.border} shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 group`}
                onClick={() => handleTopicClick(stat.id)}
              >
                <div className="flex justify-between items-start mb-6">
                  <stat.icon className={`${stat.color} w-10 h-10 group-hover:scale-110 transition-transform`} />
                  <span className="text-2xl font-bold text-gray-300">{progress}%</span>
                </div>
                <h3 className="font-bold text-2xl text-gray-800 mb-4 tracking-wide">{stat.label}</h3>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-teal-600 h-full transition-all duration-1000 ease-out`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderInteractiveSection = () => (
    <section className="bg-[#FDF5E6] py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          <div className="h-full">
            <PriceIsRight />
          </div>
          <div className="h-full">
            <CollegeEstimator />
          </div>
        </div>
        <div className="text-center">
            <button 
                onClick={() => setCurrentPage('games')}
                className="bg-teal-700 text-white px-12 py-4 rounded-full text-xl font-bold hover:bg-teal-800 transition-all shadow-xl inline-flex items-center gap-3"
            >
                More Games <ChevronRight />
            </button>
        </div>
      </div>
    </section>
  );

  const renderLessonPage = () => {
    const currentTopic = selectedTopic ? TOPICS[selectedTopic.toUpperCase()] : null;
    const topicLessons = LESSONS_DATA.filter(l => l.topic === selectedTopic);
    const lesson = LESSONS_DATA.find(l => l.id === selectedLesson);

    if (!lesson || !currentTopic) return null;

    const isCompleted = completedLessons.includes(lesson.id);

    return (
      <div className="min-h-screen bg-[#FDF5E6] flex flex-col md:flex-row">
        <aside className="w-full md:w-96 bg-white border-r border-teal-50 h-[400px] md:h-auto overflow-y-auto p-8 custom-scrollbar">
          <div className="mb-10">
            <button 
              onClick={() => {setCurrentPage('home'); setSelectedTopic(null);}}
              className="flex items-center gap-2 text-teal-600 font-bold hover:text-teal-800 transition-colors mb-6 text-lg uppercase tracking-widest"
            >
              <ArrowRight className="rotate-180 w-5 h-5" /> Homescreen
            </button>
            <h2 className="text-3xl font-bold text-teal-900 tracking-tight leading-tight">{currentTopic.title}</h2>
            <p className="text-gray-400 font-bold mt-1 uppercase text-sm">{topicLessons.length} Lessons Available</p>
          </div>
          
          <div className="space-y-4">
            {topicLessons.map((l) => (
              <button 
                key={l.id} 
                onClick={() => setSelectedLesson(l.id)}
                className={`w-full text-left p-5 rounded-2xl transition-all border-2 ${
                  selectedLesson === l.id 
                  ? 'bg-teal-50 border-teal-200 text-teal-900 font-bold shadow-md' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`text-sm opacity-50 font-bold mt-0.5 ${selectedLesson === l.id ? 'text-teal-600' : ''}`}>
                    {completedLessons.includes(l.id) ? <CheckCircle className="w-4 h-4 text-green-500" /> : l.id}
                  </span>
                  <span className="text-md leading-snug">{l.title}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-16 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-6xl font-light text-gray-400 mb-2">{lesson.id}</h1>
                  <h2 className="text-4xl font-bold text-teal-900 tracking-tight leading-tight">{lesson.title}</h2>
                </div>
                <button 
                  onClick={() => toggleLessonComplete(lesson.id)}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-sm border ${
                    isCompleted 
                      ? 'bg-green-600 text-white border-green-500 hover:bg-green-700' 
                      : 'text-teal-600 bg-teal-50 border-teal-100 hover:bg-teal-100'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={20} /> : null}
                  {isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
            </div>

            <div className="w-full aspect-video bg-black rounded-[40px] shadow-2xl overflow-hidden border-8 border-white ring-1 ring-teal-100">
               <iframe 
                  id="lesson-player"
                  width="100%" 
                  height="100%" 
                  src={lesson.videoUrl}
                  title={lesson.title} 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
            </div>

            <div className="flex justify-end pt-8">
               <button 
                 onClick={() => {
                   const currentIndex = topicLessons.findIndex(l => l.id === selectedLesson);
                   if (currentIndex < topicLessons.length - 1) {
                     setSelectedLesson(topicLessons[currentIndex + 1].id);
                   } else {
                     setCurrentPage('home');
                   }
                 }}
                 className="bg-teal-800 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-teal-700 transition-all shadow-xl inline-flex items-center gap-3"
               >
                 Next Lesson <ArrowRight />
               </button>
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderGamesPage = () => (
    <div className="min-h-screen bg-[#FDF5E6] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-center gap-6">
            <button 
              onClick={() => setCurrentPage('home')}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-teal-800"
            >
              <ArrowRight className="rotate-180" />
            </button>
            <h1 className="text-5xl font-bold text-teal-900 tracking-widest uppercase">Moneyish Arcade</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="h-[450px]"><LoanShark /></div>
            <div className="h-[450px]"><StockSim /></div>
            <div className="h-[450px]"><PriceIsRight /></div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <footer className="bg-teal-900 text-teal-50 py-24 px-6 border-t border-teal-800">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
        <div id="about" className="space-y-10">
          <h3 className="text-4xl font-bold text-white tracking-widest uppercase">About Me</h3>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-32 h-32 bg-teal-800 rounded-full flex-shrink-0 border-4 border-teal-500 shadow-xl overflow-hidden flex items-center justify-center">
                <img src="https://image2url.com/r2/default/images/1769032802534-64ac751d-28e0-4fc0-b280-660c03235c94.jpeg" alt="Prisha" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4">
              <p className="text-xl leading-relaxed text-teal-100 font-light">
                Hi, my name is Prisha Jilhewar, and thank you for visiting my site! I created this project because us teenagers are entering the workforce in just about 2-3 years, many of us with barely any financial knowledge. Moneyish is my attempt to fix that!
              </p>
              <p className="text-teal-400 font-bold uppercase tracking-widest text-sm">Created for my school's passion project</p>
            </div>
          </div>
          <div className="pt-10 border-t border-teal-800 flex gap-10">
             <button 
               onClick={() => setCurrentPage('sources')}
               className="flex items-center gap-3 text-teal-300 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm"
             >
               <BookOpen size={20} /> View Sources
             </button>
             <button className="flex items-center gap-3 text-teal-300 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm">
               <User size={20} /> Contact Me
             </button>
          </div>
        </div>

        <div className="bg-teal-800/30 p-10 rounded-[40px] border border-teal-700/50 shadow-2xl space-y-8">
          <h3 className="text-3xl font-bold text-white tracking-widest uppercase">Help me improve!</h3>
          <div className="space-y-6 p-8 bg-teal-950/40 border-2 border-teal-700/30 rounded-3xl shadow-inner text-center">
            <p className="text-2xl text-teal-100 font-light">
              Survey form! Please fill this out after exploring my website! &lt;3
            </p>
            <div className="pt-4">
              <a 
                href="https://forms.gle/iZ3DPBfZsBxRUGHQ9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-white text-xl font-bold break-all underline decoration-teal-500 decoration-2 underline-offset-8 transition-colors"
              >
                https://forms.gle/iZ3DPBfZsBxRUGHQ9
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen flex flex-col font-poiret">
      {renderNavbar()}
      
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            {renderHero()}
            {renderProgressCards()}
            {renderInteractiveSection()}
          </>
        )}
        {currentPage === 'lesson' && renderLessonPage()}
        {currentPage === 'games' && renderGamesPage()}
        {currentPage === 'sources' && (
          <div className="p-12 md:p-24 bg-[#FDF5E6] min-h-screen">
              <div className="max-w-4xl mx-auto space-y-8">
                  <h1 className="text-4xl font-bold mb-12 text-teal-900 uppercase tracking-widest text-center">Sources & Resources</h1>
                  {LESSONS_DATA.map((lesson) => (
                    <div key={lesson.id} className="bg-white p-8 md:p-12 rounded-[40px] border-2 border-teal-100 shadow-xl space-y-6">
                        <h2 className="text-2xl font-bold text-teal-800 leading-tight">Lesson {lesson.id}: {lesson.title}</h2>
                        <div className="space-y-3">
                            <p className="font-bold text-gray-500 uppercase tracking-wider text-sm">Lesson Link:</p>
                            <span className="text-teal-600 break-all text-lg">{lesson.videoUrl}</span>
                        </div>
                    </div>
                  ))}
                  <div className="text-center mt-16">
                      <button 
                        onClick={() => setCurrentPage('home')} 
                        className="bg-teal-800 text-white px-12 py-4 rounded-full font-bold shadow-lg hover:bg-teal-700 transition-all flex items-center gap-2 mx-auto"
                      >
                        <ArrowRight className="rotate-180 w-5 h-5" /> Back to Home
                      </button>
                  </div>
              </div>
          </div>
        )}
      </main>
      {renderFooter()}
      <Chatbot />
    </div>
  );
}
