'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Music2, Sparkles, Star, ChevronRight, Menu, X, Camera, GalleryHorizontalEnd, LetterText, Clock3, Play, Pause, Volume2, Repeat } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type TimelineEvent = {
  title: string;
  date: string;
  description: string;
  icon: string;
};

type AppState = {
  title: string;
  subtitle: string;
  timeline: TimelineEvent[];
  firstPhoto: string;
  gallery: string[];
  loveLetter: string;
  musicEnabled: boolean;
  background: string;
};

const defaultState: AppState = {
  title: 'Happy Girlfriend\'s Day',
  subtitle: 'I Love You Mika ♾️❤️',
  timeline: [
    { title: 'First Chat', date: '8 April 2026', description: 'Meowww', icon: '💌' },
    { title: 'First Call', date: '19 April 2026', description: 'Our voices made the distance feel tiny.', icon: '📞' },
    { title: 'First Meet', date: '16 May 2026', description: 'The day everything became real.', icon: '🌸' },
    { title: 'Proposal Day', date: '7 July 2026', description: 'A promise I will keep for every tomorrow.', icon: '💍' },
  ],
  firstPhoto: '/first-photo.jpeg',
  gallery: ['/memory1.jpg', '/memory2.jpg', '/memory3.jpg', '/memory4.jpg', '/memory5.jpg'],
  loveLetter: `Meowww, Akshita. Ayush here from Vapi. ❤️

I know I wasn't from Kota, but you still chose to keep talking to me for almost 1.5 months. Then we met for the first time, and honestly, it felt unreal. Those six days in Kota became one of the most beautiful memories of my life.

After that, you stole my heart, and now it'll always belong to you. Even when there was no guarantee we'd meet again, you still stayed with me and kept talking to me for another 1.5 months. When we met the second time, I realized I was completely and madly in love with you.

Even now, we don't know when we'll meet again, but you still choose me every single day. That means more to me than you know. Just a few more months, and we'll finally be together.

Jab puchre kaun hai best
It's Mikaa I guess♾️❤️`,
  musicEnabled: true,
  background: 'rose',
};

const navItems = [
  { id: 'home', label: 'Home', icon: Heart },
  { id: 'journey', label: 'Journey', icon: Clock3 },
  { id: 'photo', label: 'Photo', icon: Camera },
  { id: 'gallery', label: 'Gallery', icon: GalleryHorizontalEnd },
  { id: 'letter', label: 'Letter', icon: LetterText },
];

export default function Home() {
  const [state, setState] = useState<AppState>(defaultState);
  const [screen, setScreen] = useState<'home' | 'journey' | 'photo' | 'gallery' | 'letter'>('home');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.65);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heartClicks, setHeartClicks] = useState(0);
  const [easterText, setEasterText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1200, once: false, easing: 'ease-out-cubic' });
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = document.querySelectorAll('.reveal');
    el.forEach((section) => {
      gsap.fromTo(section, { autoAlpha: 0, y: 50, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 85%' } });
    });
  }, [screen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % state.gallery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [state.gallery.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      setDuration(audio.duration || 0);
      setProgress(audio.currentTime || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    audio.volume = volume;
    audio.preload = 'metadata';
    audio.playsInline = true;
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    if (isPlaying) {
      audio
        .play()
        .then(() => setAutoplayBlocked(false))
        .catch(() => {
          setIsPlaying(false);
          setAutoplayBlocked(true);
        });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isPlaying, volume]);

  const formatTime = (seconds: number) => {
    const floored = Math.floor(seconds);
    const minutes = Math.floor(floored / 60);
    const secs = String(floored % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleSeek = (nextTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextTime;
    setProgress(nextTime);
  };

  const startAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setAutoplayBlocked(false);
      setIsPlaying(true);
    } catch {
      setAutoplayBlocked(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') setEasterText('Mika is my forever ❤️');
      if (event.key.toLowerCase() === 'l') {
        setEasterText('Love is floating around us ✨');
        const hearts = Array.from({ length: 24 }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 1.5}s`,
        }));
        hearts.forEach((heart) => {
          const el = document.createElement('div');
          el.className = 'fixed z-50 text-2xl animate-[float_3s_ease-in-out_infinite]';
          el.style.left = heart.left;
          el.style.top = '-5%';
          el.style.animationDelay = heart.delay;
          el.textContent = '💖';
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 3000);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHeartClick = () => {
    const next = heartClicks + 1;
    setHeartClicks(next);
    if (next >= 5) {
      setEasterText('I Love You More ❤️');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1600);
    }
  };

  const handleDoubleClick = () => {
    const roses = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.2}s`,
    }));
    roses.forEach((rose) => {
      const el = document.createElement('div');
      el.className = 'fixed z-40 text-2xl animate-[fall_2.6s_linear_forwards]';
      el.style.left = rose.left;
      el.style.top = '-10%';
      el.style.animationDelay = rose.delay;
      el.textContent = '🌹';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    });
  };

  const goTo = (page: typeof screen) => {
    setScreen(page);
    setMenuOpen(false);
  };

  const currentImage = state.gallery[activeImage] || state.gallery[0];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,192,203,0.55),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(230,190,255,0.45),_transparent_30%)] text-slate-800" onDoubleClick={handleDoubleClick}>
      <audio ref={audioRef} id="bg-music" src="/song.mp3" preload="metadata" autoPlay loop />
      {autoplayBlocked && (
        <div className="fixed inset-x-4 top-20 z-50 rounded-3xl border border-pink-200/70 bg-white/90 p-4 text-center shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-semibold text-pink-700">Tap to start music</p>
          <button onClick={startAudio} className="mt-3 rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            Play A Thousand Years
          </button>
        </div>
      )}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, idx) => (
          <div key={idx} className="absolute animate-[float_5s_ease-in-out_infinite]" style={{ left: `${(idx * 7) % 100}%`, top: `${(idx * 11) % 100}%`, animationDelay: `${idx * 0.2}s` }}>
            {idx % 2 === 0 ? '💖' : '✨'}
          </div>
        ))}
      </div>
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {[...Array(40)].map((_, idx) => (
            <motion.div key={idx} initial={{ y: -20, x: 0, opacity: 1 }} animate={{ y: 1200, x: (idx % 2 === 0 ? 1 : -1) * 180, opacity: 0 }} transition={{ duration: 2.2, delay: idx * 0.02 }} className="absolute left-1/2 top-0 text-2xl" style={{ transform: 'translateX(-50%)' }}>
              {idx % 3 === 0 ? '💗' : idx % 3 === 1 ? '✨' : '🌟'}
            </motion.div>
          ))}
        </div>
      )}
      <div className="fixed top-4 right-4 z-50 w-[min(220px,calc(100%-1rem))] rounded-2xl border border-white/60 bg-white/90 px-2 py-2 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Music2 className="h-4 w-4 text-pink-500" />
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-pink-700">A Thousand Years</p>
            <p className="truncate text-[9px] text-slate-500">Love song</p>
          </div>
          <button onClick={() => setIsPlaying((v) => !v)} className="ml-auto rounded-full bg-pink-500/90 p-1 text-white shadow-sm">
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-slate-500">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input type="range" min="0" max={duration || 1} step="0.1" value={progress} onChange={(e) => handleSeek(Number(e.target.value))} className="h-1 w-full cursor-pointer appearance-none rounded-full bg-pink-100 accent-pink-500" />
          <div className="flex items-center gap-2">
            <Volume2 className="h-3.5 w-3.5 text-pink-500" />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="h-1 w-full cursor-pointer appearance-none rounded-full bg-pink-100 accent-pink-500" />
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full border border-white/60 bg-white/30 px-3 py-2 shadow-lg backdrop-blur-xl md:hidden">
        <button onClick={() => setMenuOpen((v) => !v)} className="rounded-full bg-pink-500/80 p-2 text-white">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <nav className={`fixed left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/60 bg-white/25 px-3 py-2 shadow-2xl backdrop-blur-2xl md:flex`}> 
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = screen === item.id;
          return (
            <button key={item.id} onClick={() => goTo(item.id as typeof screen)} className={`rounded-full px-3 py-2 text-sm font-medium transition ${active ? 'bg-pink-500 text-white' : 'text-slate-700 hover:bg-white/70'}`}>
              <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{item.label}</span>
            </button>
          );
        })}
      </nav>
      {menuOpen && <div className="fixed inset-x-4 top-20 z-40 rounded-3xl border border-white/60 bg-white/70 p-4 shadow-2xl backdrop-blur-xl md:hidden">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => goTo(item.id as typeof screen)} className="rounded-2xl bg-pink-100/70 px-3 py-3 text-left text-sm font-semibold text-slate-700"> <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{item.label}</span></button>;
          })}
        </div>
      </div>}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.section key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-screen items-center justify-center px-4">
            <div className="rounded-[2rem] border border-white/70 bg-white/30 px-8 py-12 text-center shadow-[0_0_60px_rgba(255,182,193,0.25)] backdrop-blur-2xl">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-pink-300/70 bg-gradient-to-br from-pink-200 via-rose-100 to-lavender-100 shadow-[0_0_50px_rgba(255,105,180,0.4)]">
                <Heart className="h-12 w-12 fill-pink-500 text-pink-500" />
              </motion.div>
              <motion.h1 initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-3xl font-semibold tracking-wide text-pink-700 sm:text-4xl">
                Preparing Something Special For Mika ❤️
              </motion.h1>
            </div>
          </motion.section>
        ) : screen === 'home' ? (
          <motion.section key="home" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="flex min-h-screen items-center justify-center px-4 py-20">
            <div className="mx-auto max-w-5xl text-center">
              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-4xl font-semibold tracking-[0.2em] text-pink-700 sm:text-6xl">
                Happy Girlfriend Day
              </motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="mt-4 text-xl text-rose-700 sm:text-2xl">
                I Love You Mika ♾️❤️
              </motion.p>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }} className="mt-8 flex justify-center">
                <div onClick={handleHeartClick} className="relative flex h-48 w-48 cursor-pointer items-center justify-center rounded-full border border-pink-300/70 bg-gradient-to-br from-pink-200 via-rose-100 to-lavender-100 shadow-[0_0_70px_rgba(255,105,180,0.35)]">
                  <motion.div animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }} transition={{ duration: 2.6, repeat: Infinity }} className="absolute inset-0 rounded-full border border-pink-200/60" />
                  <Heart className="h-24 w-24 fill-pink-500 text-pink-500" />
                </div>
              </motion.div>
              <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }} onClick={() => goTo('journey')} className="mt-10 rounded-full border border-white/70 bg-white/50 px-8 py-4 text-lg font-semibold text-pink-700 shadow-[0_0_30px_rgba(255,182,193,0.3)] backdrop-blur-xl transition hover:scale-105">
                Open My Heart ❤️
              </motion.button>
              {easterText && <p className="mt-5 text-lg font-semibold text-rose-700">{easterText}</p>}
            </div>
          </motion.section>
        ) : screen === 'journey' ? (
          <section className="px-4 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="reveal text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-pink-500">Our Beautiful Journey</p>
                <h2 className="mt-3 text-4xl font-semibold text-pink-700 sm:text-5xl">Our Beautiful Journey</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Every chapter of us glows softly, and I would choose this love again and again.</p>
              </div>
              <div className="mt-12 space-y-8">
                {state.timeline.map((event, index) => (
                  <motion.div key={event.title} data-aos="fade-up" data-aos-delay={index * 120} className="relative flex flex-col items-start gap-4 rounded-[2rem] border border-white/70 bg-white/35 p-6 shadow-[0_0_35px_rgba(255,182,193,0.15)] backdrop-blur-xl md:flex-row md:items-center">
                    <div className="absolute left-8 top-0 hidden h-full w-[2px] bg-gradient-to-b from-pink-300 to-rose-200 md:block" />
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-lavender-100 text-2xl shadow-lg">
                      {event.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm uppercase tracking-[0.2em] text-pink-500">{event.date}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-pink-700">{event.title}</h3>
                      <p className="mt-2 text-slate-600">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : screen === 'photo' ? (
          <section className="px-4 py-24">
            <div className="reveal mx-auto flex max-w-5xl flex-col items-center text-center">
              <div className="rounded-[2.5rem] border border-white/70 bg-white/30 p-6 shadow-[0_0_70px_rgba(255,182,193,0.2)] backdrop-blur-2xl">
                <motion.div whileHover={{ scale: 1.03, rotate: -1 }} className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-pink-200/70 bg-white/70 p-4 shadow-[0_0_50px_rgba(255,105,180,0.25)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.7),_transparent_70%)]" />
                  <img src={state.firstPhoto} alt="First photo" className="relative h-[480px] w-full rounded-[1.5rem] object-cover" />
                  <div className="absolute left-6 top-6 text-2xl">💖</div>
                  <div className="absolute bottom-6 right-6 text-2xl">✨</div>
                  <div className="absolute left-1/2 top-8 -translate-x-1/2 text-2xl">🌹</div>
                </motion.div>
              </div>
              <p className="mt-8 max-w-2xl text-lg text-slate-700">This was the beginning of my favorite memory.</p>
            </div>
          </section>
        ) : screen === 'gallery' ? (
          <section className="px-4 py-24">
            <div className="reveal mx-auto max-w-6xl rounded-[2.5rem] border border-white/70 bg-white/35 p-6 shadow-[0_0_70px_rgba(255,182,193,0.2)] backdrop-blur-2xl">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-pink-500">Memory Gallery</p>
                <h2 className="mt-3 text-4xl font-semibold text-pink-700">A little gallery of our sweetest days</h2>
              </div>
              <div className="mt-8 flex flex-col gap-6">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-xl">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-slate-100">
                    <img src={currentImage} alt="Gallery memory" className="h-full w-full object-contain" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 to-transparent pointer-events-none" />
                  <div className="absolute left-6 top-6 flex gap-2">
                    <button onClick={() => setActiveImage((prev) => (prev - 1 + state.gallery.length) % state.gallery.length)} className="rounded-full bg-white/80 p-3 text-pink-700 shadow-lg">←</button>
                    <button onClick={() => setActiveImage((prev) => (prev + 1) % state.gallery.length)} className="rounded-full bg-white/80 p-3 text-pink-700 shadow-lg">→</button>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {state.gallery.map((image, idx) => (
                    <button key={image} onClick={() => setActiveImage(idx)} className={`rounded-2xl border p-1 transition ${idx === activeImage ? 'border-pink-400 shadow-[0_0_18px_rgba(255,105,180,0.24)]' : 'border-transparent'}`}>
                      <img src={image} alt={`Memory ${idx + 1}`} className="h-20 w-20 rounded-xl bg-slate-100 object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="px-4 py-24">
            <div className="reveal mx-auto max-w-5xl rounded-[2.5rem] border border-white/70 bg-[radial-gradient(circle,_rgba(120,55,90,0.95),_rgba(70,15,45,0.98))] p-8 text-rose-100 shadow-[0_0_70px_rgba(255,182,193,0.25)]">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-500/30 text-4xl shadow-[0_0_35px_rgba(255,182,193,0.45)]">💗</div>
                <h2 className="mt-6 text-4xl font-semibold sm:text-5xl">I Love You Mika ❤️</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-rose-200">{state.loveLetter.split('\n')[0]}</p>
              </div>
              <div className="mt-10 rounded-[2rem] border border-white/20 bg-white/10 p-6 text-xl leading-10 shadow-inner backdrop-blur-xl" style={{ fontFamily: 'cursive' }}>
                {state.loveLetter.split('\n').slice(1).join('\n')}
              </div>
            </div>
          </section>
        )}
      </AnimatePresence>
      <footer className="px-6 pb-10 pt-4 text-center text-sm text-slate-700">
        <p>My Forever Love ❤️</p>
      </footer>
    </main>
  );
}
