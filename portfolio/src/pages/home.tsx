import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Brain, Terminal, Database, Code, ShieldAlert, Cpu, Lock, FileText,
  Github, Linkedin, Mail, MapPin, ChevronUp, Download, ArrowRight, CheckCircle2,
  Menu, X, Server, Network, User, ExternalLink, XCircle
} from "lucide-react";
import {
  SiPython, SiJavascript, SiHtml5, SiReact, SiFlask, SiDjango,
  SiGit, SiGithub, SiLinux, SiDocker, SiMysql, SiMongodb, SiNetlify, SiRender
} from "react-icons/si";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// ==========================================
// CUSTOM CURSOR
// ==========================================
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  const [isHovering, setIsHovering] = useState(false);
  const hoverTarget = useRef<HTMLElement | null>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };

    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    }

    const target = e.target as HTMLElement;
    const interactiveEl = target.closest('a, button, input, textarea, [data-interactive="true"]') as HTMLElement | null;
    setIsHovering(!!interactiveEl);
    hoverTarget.current = interactiveEl;
  }, []);

  const updateRing = useCallback(() => {
    let targetX = mouse.current.x;
    let targetY = mouse.current.y;

    if (hoverTarget.current) {
      const rect = hoverTarget.current.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }
    } else {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }
    }

    ring.current.x += (targetX - ring.current.x) * 0.15;
    ring.current.y += (targetY - ring.current.y) * 0.15;

    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
    }
    requestRef.current = requestAnimationFrame(updateRing);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    requestRef.current = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [onMouseMove, updateRing]);

  return (
    <>
      {/* Primary dot — snaps to cursor instantly */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-colors duration-200
          ${isHovering
            ? "w-2.5 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            : "w-2 h-2 bg-primary shadow-[0_0_12px_rgba(0,212,255,1)]"}`}
      />
      {/* Secondary ring — lerps behind */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border transition-all duration-400 ease-out
          ${isHovering
            ? "w-12 h-12 border-white/70 bg-white/5 backdrop-blur-[2px] shadow-[0_0_24px_rgba(0,212,255,0.3)]"
            : "w-9 h-9 border-primary/60"}`}
      />
    </>
  );
}

// ==========================================
// ==========================================
// SUPER ANIMATED BACKGROUND
// ==========================================
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{ x: number, y: number, vx: number, vy: number, radius: number, color: string }> = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 10000);
      for (let i = 0; i < Math.min(numParticles, 150); i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 0.8,
          color: Math.random() > 0.4 ? "rgba(0, 212, 255, 0.8)" : "rgba(157, 78, 221, 0.8)"
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 1.5;
          p.y += (dy / dist) * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for lines

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color.replace('0.8', `${0.25 * (1 - dist2 / 140)}`);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOut = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[0] opacity-80" />;
}

function Spotlight() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Smooth lerping could be added here, but direct follow is snappier for spotlight
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Interactive Cursor Spotlight */}
      <div
        className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 212, 255, 0.08), transparent 80%)`
        }}
      />
      {/* Ambient Drifting Orbs */}
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 bg-primary/40"
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 80, 0],
            y: [0, 100, -60, 0],
            scale: [1, 0.9, 1.3, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 bg-secondary/40"
        />
      </div>
    </>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress((totalScroll / windowHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-[2px] bg-primary z-[100] shadow-[0_0_15px_rgba(0,212,255,1)] transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
  );
}

// ==========================================
// SECTIONS
// ==========================================

const NAV_LINKS = ["Home", "About", "Education", "Skills", "Experience", "Projects", "Certifications", "Achievements", "Contact"];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map(link => document.getElementById(link.toLowerCase()));
      const scrollPos = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(NAV_LINKS[i].toLowerCase());
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/70 backdrop-blur-xl border-b border-white/5 py-4 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollTo("home")} data-interactive="true" data-testid="nav-logo">
          <Shield className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-mono font-bold text-2xl tracking-tight text-foreground">Taya.</span>
        </div>

        <div className="hidden md:flex gap-5 lg:gap-7 items-center">
          {NAV_LINKS.map(link => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className={`text-sm font-medium transition-colors relative group py-1 ${activeSection === link.toLowerCase() ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              data-interactive="true"
            >
              {link}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 shadow-[0_0_8px_rgba(0,212,255,0.8)] ${activeSection === link.toLowerCase() ? "w-full" : "w-0 group-hover:w-full"}`} />
            </button>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="ml-2 flex items-center gap-1.5 text-sm font-semibold text-primary border border-primary/40 bg-primary/8 hover:bg-primary hover:text-primary-foreground px-4 py-1.5 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(0,212,255,0.12)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            data-interactive="true"
          >
            <Download className="w-3.5 h-3.5" /> Resume
          </a>
        </div>

        <button className="md:hidden text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-interactive="true" aria-label="Toggle Menu">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/5 overflow-hidden md:hidden shadow-lg"
          >
            <div className="flex flex-col items-center gap-6 py-8">
              {NAV_LINKS.map(link => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className={`text-lg font-medium transition-colors ${activeSection === link.toLowerCase() ? "text-primary" : "text-muted-foreground"}`}
                  data-interactive="true"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  const [typedText, setTypedText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const photoRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animateParallax = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.06;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.06;
      if (photoRef.current) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (currentPos.current.x - cx) / cx;
        const dy = (currentPos.current.y - cy) / cy;
        photoRef.current.style.transform = `translate(${dx * 18}px, ${dy * 12}px)`;
      }
      rafId.current = requestAnimationFrame(animateParallax);
    };
    rafId.current = requestAnimationFrame(animateParallax);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);
  const roles = [
    "Building Intelligent Systems.",
    "Transforming Ideas into AI Solutions.",
    "Exploring the Future with Machine Learning.",
    "Creating Secure and Scalable Technologies.",
    "Turning Data into Meaningful Insights.",
    "Engineering AI for Real-World Impact.",
    "Innovating Through Artificial Intelligence.",
    "Securing Digital Futures."
  ];

  useEffect(() => {
    let currentText = "";
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const targetText = roles[roleIndex];

      if (!isDeleting) {
        currentText = targetText.substring(0, currentText.length + 1);
        setTypedText(currentText);
        if (currentText === targetText) {
          isDeleting = true;
          timeout = setTimeout(type, 2500); // Wait longer when fully typed
        } else {
          timeout = setTimeout(type, 60);
        }
      } else {
        currentText = targetText.substring(0, currentText.length - 1);
        setTypedText(currentText);
        if (currentText === "") {
          isDeleting = false;
          setRoleIndex((prev) => (prev + 1) % roles.length);
          timeout = setTimeout(type, 300);
        } else {
          timeout = setTimeout(type, 30);
        }
      }
    };

    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, [roleIndex]);

  return (
    <section id="home" className="min-h-[100dvh] relative overflow-hidden bg-grid-pattern">

      {/* ── PHOTO — full-height right column, bleeds inward ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.15 }}
        className="absolute right-0 top-[4%] w-[48%] lg:w-[44%] xl:w-[41%] h-[96%] pointer-events-none select-none scale-85 origin-bottom-right"
      >
        {/* Ambient bloom — subtle only */}
        {/* <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 65% 45% at 55% 88%, rgba(0,212,255,0.10) 0%, transparent 68%)' }} /> */}
        {/* <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 38% at 35% 93%, rgba(139,92,246,0.08) 0%, transparent 65%)' }} /> */}

        {/* Floating + parallax wrapper */}
        <div ref={photoRef} className="w-full h-full" style={{ willChange: 'transform' }}>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            <img
              src="/profile-cutout.png"
              alt="Tayanithaa N S"
              className="w-full h-full object-contain object-bottom"
              style={{
                filter: [
                  'drop-shadow(-6px 0 35px rgba(0,212,255,0.20))',
                  'drop-shadow(6px 0 20px rgba(139,92,246,0.12))',
                ].join(' '),
                maskImage: [
                  'linear-gradient(to right, transparent 0%, black 22%)',
                  'linear-gradient(to bottom, black 38%, black 58%, rgba(0,0,0,0.45) 76%, transparent 92%)',
                ].join(', '),
                WebkitMaskImage: [
                  'linear-gradient(to right, transparent 0%, black 22%)',
                  'linear-gradient(to bottom, black 38%, black 58%, rgba(0,0,0,0.45) 76%, transparent 92%)',
                ].join(', '),
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              } as React.CSSProperties}
              draggable={false}
            />
          </motion.div>
        </div>
        {/* Bottom fade reinforcement */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </motion.div>

      {/* ── TEXT — left side, full-height flex center ── */}
      <div className="relative z-10 min-h-[100dvh] flex items-center pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="flex flex-col gap-5 items-start text-left w-full md:max-w-[56%] lg:max-w-[50%] md:pl-[10%]"
          >
            <Badge variant="outline" className="font-mono text-primary border-primary/30 bg-primary/5 py-1 px-3">
              {">"} BE CSE (Cybersecurity)
            </Badge>

            <div>
              <h1 className="text-[2.8rem] sm:text-6xl md:text-[4.5rem] lg:text-[5.2rem] font-black tracking-tight leading-none mb-4 whitespace-nowrap">
                Tayanithaa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">N S</span>
              </h1>
              <div className="h-14 md:h-10 flex items-center">
                <p className="font-mono text-lg md:text-xl text-muted-foreground flex items-center font-medium">
                  <span className="text-primary mr-2 hidden sm:inline">{">"}</span>
                  {typedText}
                  <span className="w-2.5 h-6 bg-primary ml-1 animate-pulse" />
                </p>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm md:text-base text-muted-foreground/80 max-w-[38ch] leading-relaxed">
                Computer Science and Engineering student specializing in Cybersecurity — building AI-driven, secure, real-world systems through research, hackathons, and open-source work.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Button size="icon" variant="outline" className="w-12 h-12 rounded-full border-white/10 bg-white/5 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300" asChild data-testid="btn-github">
                <a href="https://github.com/Tayanithaa" target="_blank" rel="noreferrer"><Github className="w-5 h-5" /></a>
              </Button>
              <Button size="icon" variant="outline" className="w-12 h-12 rounded-full border-white/10 bg-white/5 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300" asChild data-testid="btn-linkedin">
                <a href="https://www.linkedin.com/in/tayanithaans/" target="_blank" rel="noreferrer"><Linkedin className="w-5 h-5" /></a>
              </Button>
              <Button size="lg" className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/50 shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-all duration-300 h-12 px-8" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} data-testid="btn-contact">
                Contact Me
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ children, title, icon: Icon }: { children?: React.ReactNode, title: string, icon: React.ElementType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex items-center gap-4 mb-16"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.15)]">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
      <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1 ml-4 md:ml-8 hidden sm:block" />
    </motion.div>
  );
}

function AboutEducation() {
  return (
    <section id="about" className="py-24 relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* About Me */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <SectionHeading title="About Me" icon={Terminal} />
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-transparent rounded-full shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
              <div className="pl-6 space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Technology, for me, is more than code—it is a way to create intelligent solutions that have real-world impact. My interests lie at the intersection of Artificial Intelligence, Machine Learning, Computer Vision, and Cybersecurity, where I enjoy transforming complex challenges into practical and scalable systems.
                </p>
                <p>
                  Through internships, hackathons, technical communities, and hands-on projects, I have developed expertise in building AI-driven applications, secure software systems, and computer vision solutions.
                </p>
                <p className="text-foreground font-medium">
                  I believe in continuous learning, problem-solving, and building technology that is not only powerful but also secure, accessible, and impactful.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            id="education"
            initial={{ opacity: 0, x: 40, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="lg:pl-[20%]"
          >
            <SectionHeading title="Education" icon={CheckCircle2} />
            <div className="space-y-8">

              {/* B.E. */}
              <div className="relative pl-6 border-l-2 border-primary/40 before:content-[''] before:absolute before:w-3 before:h-3 before:bg-background before:border-2 before:border-primary before:rounded-full before:-left-[7px] before:top-1.5 before:shadow-[0_0_10px_rgba(0,212,255,0.8)]">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 mb-2 inline-block">2024 – Present</span>
                <h3 className="text-xl font-bold text-foreground">Bachelor of Engineering</h3>
                <h4 className="text-base text-primary font-medium mb-1">Computer Science and Engineering (Cybersecurity)</h4>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> KGiSL Institute of Technology
                </p>
                <Badge variant="outline" className="bg-white/5 border-white/10">
                  CGPA: <span className="text-primary font-mono ml-1 font-bold">8.77/10</span>
                </Badge>
              </div>

              {/* HSC */}
              <div className="relative pl-6 border-l-2 border-white/10 before:content-[''] before:absolute before:w-3 before:h-3 before:bg-background before:border-2 before:border-muted-foreground/40 before:rounded-full before:-left-[7px] before:top-1.5">
                <span className="text-xs font-mono text-muted-foreground mb-2 inline-block">2024</span>
                <h3 className="text-xl font-bold text-foreground">Higher Secondary Education</h3>
                <h4 className="text-base text-muted-foreground font-medium mb-1">Computer Science – Mathematics</h4>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> Keartiman Academy Matric and Higher Secondary School
                </p>
                <Badge variant="outline" className="bg-white/5 border-white/10">
                  Percentage: <span className="text-foreground font-mono ml-1 font-bold">91.7%</span>
                </Badge>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const SKILLS = [
  {
    category: "Artificial Intelligence & Machine Learning",
    icon: Brain,
    primary: true,
    items: [
      { name: "Machine Learning", icon: Brain },
      { name: "Deep Learning", icon: Brain },
      { name: "Computer Vision", icon: Brain },
      { name: "Generative AI", icon: Brain },
      { name: "Scikit-Learn", icon: Brain },
      { name: "TensorFlow", icon: Brain }, // Replaced with lucide since react-icons might fail
      { name: "PyTorch", icon: Brain },
      { name: "Pandas", icon: Database },
      { name: "NumPy", icon: Code },
      { name: "Predictive Modeling", icon: Brain },
      { name: "Model Development", icon: Terminal },
      { name: "Model Optimization", icon: Cpu }
    ]
  },
  {
    category: "Programming",
    icon: Code,
    items: [
      { name: "Python", icon: SiPython },
      { name: "C", icon: Terminal }
    ]
  },
  {
    category: "Full Stack Development",
    icon: Server,
    items: [
      { name: "React.js", icon: SiReact },
      { name: "Flask", icon: SiFlask },
      { name: "Django", icon: SiDjango },
      { name: "FastAPI", icon: Server },
      { name: "Streamlit", icon: Server },
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: Code }
    ]
  },
  {
    category: "Databases & Deployment",
    icon: Database,
    items: [
      { name: "MySQL", icon: SiMysql },
      { name: "SQLite", icon: Database },
      { name: "MongoDB Atlas", icon: SiMongodb },
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Render", icon: SiRender },
      { name: "Netlify", icon: SiNetlify }
    ]
  },
  {
    category: "Cybersecurity & Systems",
    icon: Shield,
    items: [
      { name: "Linux (Kali)", icon: SiLinux },
      { name: "Nmap", icon: Network },
      { name: "Wireshark", icon: Network },
      { name: "Burp Suite", icon: ShieldAlert },
      { name: "Splunk", icon: Database },
      { name: "Autopsy", icon: FileText },
      { name: "Cryptography", icon: Lock },
      { name: "Network Fundamentals", icon: Network }
    ]
  }
];

function Skills() {
  return (
    <section id="skills" className="py-24 relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Skills & Arsenal" icon={Cpu} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {SKILLS.map((skillGroup, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              animate={{ y: [0, skillGroup.primary ? -4 : -3, 0] }}
              className={skillGroup.primary ? "md:col-span-2 xl:col-span-4" : ""}
              style={{ animationDuration: `${3.5 + idx * 0.6}s`, animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }}
            >
              <Card className={`bg-white/[0.02] border-white/5 backdrop-blur-sm overflow-hidden group hover:border-primary/25 hover:shadow-[0_8px_25px_rgba(0,212,255,0.07)] transition-all duration-400 ${skillGroup.primary ? "border-primary/15 shadow-[0_0_15px_rgba(0,212,255,0.04)]" : ""}`}>
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`p-1.5 rounded-lg ${skillGroup.primary ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"} transition-colors`}>
                      <skillGroup.icon className={skillGroup.primary ? "w-4 h-4" : "w-3.5 h-3.5"} />
                    </div>
                    <h3 className={`${skillGroup.primary ? "text-base text-foreground font-bold" : "text-sm text-foreground font-semibold"}`}>
                      {skillGroup.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGroup.items.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium transition-all duration-200
                          ${skillGroup.primary
                            ? "bg-primary/10 border-primary/25 text-cyan-200 hover:bg-primary/20 hover:border-primary/50 hover:text-white"
                            : "bg-background border-white/8 text-muted-foreground hover:bg-white/5 hover:border-white/20 hover:text-foreground"}`}
                      >
                        <skill.icon className={`w-3 h-3 ${skillGroup.primary ? "text-primary" : "opacity-50"}`} />
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const experiences = [
    {
      title: "Developer",
      company: "Pinesphere Solutions pvt.ltd",
      period: "June 2026 – Present",
      points: [
        "Developing backend APIs for the SIMP Internship Management System using FastAPI.",
        "Implementing authentication, student, college, and attendance management modules.",
        "Collaborating with frontend and database teams to deliver scalable solutions."
      ]
    },
    {
      title: "AI & ML Intern",
      company: "IPS Tech Community",
      period: "August 2025 – Present",
      points: [
        "Contributed to 5+ AI and web-based projects focused on healthcare technology, automation, and intelligent systems.",
        "Developed an MRI Scan Manipulation Detection System using AI and Computer Vision concepts with approximately 85% accuracy.",
        "Collaborated in developing AI-driven solutions using OpenCV, real-time monitoring, and technical problem-solving.",
        "Organized and conducted PyExpo featuring 11+ technical competitions.",
        "Strengthened communication, collaboration, management, and project coordination skills."
      ]
    },
    {
      title: "Cybersecurity Intern",
      company: "ShadowFox Technologies",
      period: "February 2026",
      points: [
        "Performed port scanning, directory enumeration, and network traffic analysis using Nmap and Wireshark.",
        "Conducted penetration testing and vulnerability assessment exercises using Metasploit and VulnWeb.",
        "Explored reverse engineering, payload generation, reverse shell connections, and wireless security testing.",
        "Strengthened knowledge in ethical hacking, cryptography, and network security.",
        "Gained practical exposure to modern cybersecurity practices."
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 relative bg-black/20 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Experience" icon={Terminal} />

        <div className="max-w-4xl mx-auto space-y-16">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="md:w-1/3 flex flex-col items-start md:items-end md:text-right shrink-0">
                  <h3 className="text-2xl font-bold text-foreground">{exp.title}</h3>
                  <h4 className="text-xl text-primary font-medium mt-1 mb-3">{exp.company}</h4>
                  <Badge variant="outline" className="font-mono bg-white/5 border-white/10">{exp.period}</Badge>
                </div>

                <div className="md:w-2/3 relative">
                  <div className="hidden md:block absolute -left-[30px] top-2 bottom-0 w-px bg-white/10">
                    <div className="absolute top-0 -left-[4px] w-[9px] h-[9px] rounded-full bg-primary shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
                  </div>

                  <Card className="bg-white/[0.02] border-white/5 backdrop-blur-sm h-full hover:border-white/10 transition-colors">
                    <CardContent className="p-6 md:p-8">
                      <ul className="space-y-4">
                        {exp.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                            <span className="text-primary mt-1.5 opacity-70"><ArrowRight className="w-4 h-4" /></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    id: 1,
    thumb: "",
    thumbIcon: Shield,
    title: "Multi-Agent Cybersecurity Intelligent System",
    badge: "Pre-Incubation Status — Top 6",
    tech: ["Python", "FastAPI", "PyTorch", "Transformers (DistilBERT)", "Vanilla JS", "HTML", "CSS"],
    overview: "Developed a multi-agent cybersecurity system using Python, FastAPI, and advanced NLP transformer models (DistilBERT) to automatically identify, classify, correlate, and respond to security threats.",
    features: [
      "Built scalable backend APIs with FastAPI",
      "Real-time web dashboard using Vanilla JavaScript",
      "Integrated PyTorch and HuggingFace Transformers for threat classification",
      "Automated incident response and SOC workflow optimization"
    ],
    impact: "Selected among the Top 6 teams for Pre-Incubation status, proving real-world applicability in modern Security Operations Centers.",
    github: "https://github.com/Tayanithaa"
  },
  {
    id: 2,
    thumb: "",
    thumbIcon: Network,
    title: "Digital Contact Tracing and Screening Tool for MDR Pathogens",
    badge: "Smart India Hackathon Winner 2025",
    tech: ["Python", "YOLO", "DeepSORT", "InsightFace", "FastAPI", "OpenCV"],
    overview: "Developed an AI-powered digital contact tracing platform using YOLO, DeepSORT, and InsightFace for real-time patient tracking within healthcare facilities.",
    features: [
      "Real-time patient and staff tracking using advanced Computer Vision",
      "Engineered secure backend pipelines using FastAPI",
      "Integration of tracking data with hospital EHR systems",
      "Robust Role-Based Access Controls to protect sensitive medical data"
    ],
    impact: "Won the national-level Smart India Hackathon 2025. The system drastically reduces the spread of Multi-Drug Resistant pathogens in clinical environments.",
    github: "https://github.com/Tayanithaa"
  },
  {
    id: 3,
    thumb: "",
    thumbIcon: Lock,
    title: "Secure Chat Application with End-to-End Encryption",
    tech: ["React.js", "Python", "AES Encryption"],
    overview: "Engineered a secure messaging platform using React.js and Python with AES-based end-to-end encryption to secure user communication and guarantee privacy and integrity.",
    features: [
      "Implemented strong AES-256 end-to-end encryption",
      "Real-time message delivery with WebSocket integration",
      "Secure key exchange mechanisms",
      "Responsive, intuitive user interface built with React.js"
    ],
    impact: "Ensured complete message confidentiality, preventing man-in-the-middle attacks and data interception.",
    github: "https://github.com/Tayanithaa"
  },
  {
    id: 4,
    thumb: "",
    thumbIcon: Brain,
    title: "Deepfake-Based Tumour Detection System",
    tech: ["Python", "PyTorch", "OpenCV", "Scikit-Learn", "NumPy", "CUDA"],
    overview: "Developed a deep learning pipeline using transfer learning to automate deepfake and tampering detection in brain MRI scans. Integrated Grad-CAM visualization and OpenCV-based medical image processing for model interpretability.",
    features: [
      "Automated deepfake detection in medical imagery",
      "Transfer learning utilizing state-of-the-art CNN architectures",
      "Grad-CAM implementation for visual model interpretability",
      "GPU-accelerated processing via CUDA"
    ],
    impact: "Enhanced the integrity of medical diagnoses by providing radiologists with a reliable tool to identify manipulated MRI scans.",
    github: "https://github.com/Tayanithaa"
  },
  {
    id: 5,
    thumb: "",
    thumbIcon: Code,
    title: "Coming Soon",
    badge: "",
    tech: [],
    overview: "Details for this project will be added soon.",
    features: [],
    impact: "",
    github: "https://github.com/Tayanithaa"
  },
  {
    id: 6,
    thumb: "",
    thumbIcon: Code,
    title: "Coming Soon",
    badge: "",
    tech: [],
    overview: "Details for this project will be added soon.",
    features: [],
    impact: "",
    github: "https://github.com/Tayanithaa"
  }
];

function Projects() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section id="projects" className="py-24 relative border-t border-white/5 min-h-[80vh]">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Featured Projects" icon={Code} />

        <AnimatePresence mode="wait">
          {expandedId === null ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {PROJECTS.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className="h-full bg-white/[0.02] border-white/10 backdrop-blur-sm overflow-hidden group cursor-pointer hover:border-primary/50 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,212,255,0.1)] flex flex-col"
                    onClick={() => setExpandedId(project.id)}
                  >
                    {/* Project Image Placeholder */}
                    <div className="h-44 w-full relative overflow-hidden border-b border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-3">
                      <div className="absolute inset-3 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-2">
                        <project.thumbIcon className="w-10 h-10 text-white/15" />
                        <span className="text-xs font-mono text-white/20">image placeholder</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {project.tech.length > 0 && (
                        <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 flex-wrap">
                          {project.tech.slice(0, 3).map((t, i) => (
                            <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-white/60">{t}</span>
                          ))}
                          {project.tech.length > 3 && <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-white/60">+{project.tech.length - 3}</span>}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      {project.badge && (
                        <Badge className="w-fit mb-4 bg-accent/20 text-accent hover:bg-accent/30 border border-accent/20">
                          {project.badge}
                        </Badge>
                      )}
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                        {project.overview}
                      </p>
                      <div className="flex items-center text-primary font-medium text-sm mt-auto group/btn">
                        View Details <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="bg-[#050B14] border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.1)] overflow-hidden">
                {/* Large Project Image Placeholder */}
                <div className="w-full aspect-video md:aspect-[21/9] relative overflow-hidden bg-gradient-to-br from-[#0a1128] to-[#1a0b2e]">
                  <div className="absolute inset-0 opacity-30 bg-grid-pattern mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050B14]" />

                  {/* Abstract shapes to make placeholder look good */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border border-white/10 rounded-2xl flex items-center justify-center bg-black/20 backdrop-blur-sm shadow-2xl">
                    <Code className="w-24 h-24 text-primary/20" />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full bg-black/40 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 backdrop-blur-md"
                    onClick={() => setExpandedId(null)}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <CardContent className="p-8 md:p-12 -mt-10 relative z-10">
                  {PROJECTS.find(p => p.id === expandedId)?.badge && (
                    <Badge className="mb-6 bg-accent/20 text-accent border border-accent/30 px-4 py-1.5 text-sm">
                      {PROJECTS.find(p => p.id === expandedId)?.badge}
                    </Badge>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight max-w-4xl">
                      {PROJECTS.find(p => p.id === expandedId)?.title}
                    </h2>
                    <Button asChild className="shrink-0 bg-white text-black hover:bg-gray-200">
                      <a href={PROJECTS.find(p => p.id === expandedId)?.github} target="_blank" rel="noreferrer">
                        <Github className="w-5 h-5 mr-2" /> View Source
                      </a>
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-white/10">
                    {PROJECTS.find(p => p.id === expandedId)?.tech.map((t, i) => (
                      <span key={i} className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-sm">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" /> Overview
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {PROJECTS.find(p => p.id === expandedId)?.overview}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Settings className="w-5 h-5 text-primary" /> Key Features
                        </h3>
                        <ul className="grid gap-3">
                          {PROJECTS.find(p => p.id === expandedId)?.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/5">
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Brain className="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-primary relative z-10">Impact</h3>
                        <p className="text-muted-foreground leading-relaxed relative z-10">
                          {PROJECTS.find(p => p.id === expandedId)?.impact}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/10 flex justify-center">
                    <Button variant="outline" onClick={() => setExpandedId(null)} className="px-8 border-white/20 hover:bg-white/5">
                      Close Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Temporary icon component since Settings wasn't imported from lucide above
function Settings(props: any) {
  return <Cpu {...props} />;
}

function Certifications() {
  const certs = [
    "Oracle Global Certification – Data Science Professional",
    "Deloitte Cyber Job Simulation Certificate",
    "Machine Learning with Python"
  ];

  return (
    <section id="certifications" className="py-24 relative bg-black/20 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Certifications" icon={FileText} />

        <div className="grid md:grid-cols-3 gap-6">
          {certs.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 backdrop-blur-md hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300 group">
                <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{cert}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ACHIEVEMENTS = [
  {
    title: "Smart India Hackathon Winner",
    year: "2025",
    rank: "🏆 National Winner",
    icon: Shield,
    gradient: "from-amber-950/80 via-yellow-950/50 to-transparent",
    glow: "rgba(245,158,11,0.18)",
    accent: "#f59e0b",
    desc: "Won the national Smart India Hackathon 2025 with a Digital Contact Tracing System for MDR Pathogens. Competed against 1,000+ teams across India.",
    highlight: true
  },
  {
    title: "Student Achiever – Cybersecurity Dept.",
    year: "2025–2026",
    rank: "⭐ Department Award",
    icon: CheckCircle2,
    gradient: "from-cyan-950/70 via-primary/10 to-transparent",
    glow: "rgba(0,212,255,0.15)",
    accent: "#00d4ff",
    desc: "Recognized for outstanding academic performance and extracurricular contributions in the Cybersecurity domain."
  },
  {
    title: "Multi-Agent Cybersecurity System",
    year: "2025",
    rank: "🚀 Top 6 — Pre-Incubation",
    icon: Brain,
    gradient: "from-violet-950/70 via-accent/10 to-transparent",
    glow: "rgba(139,92,246,0.15)",
    accent: "#8b5cf6",
    desc: "Selected among Top 6 teams for Pre-Incubation status at a national-level innovation challenge for building an AI-powered threat detection platform."
  },
  {
    title: "Executive Member – Cybersecurity Dept.",
    year: "2024–Present",
    rank: "👥 Leadership Role",
    icon: Network,
    gradient: "from-emerald-950/70 via-emerald-900/20 to-transparent",
    glow: "rgba(16,185,129,0.12)",
    accent: "#10b981",
    desc: "Active leadership role organizing PyExpo, technical workshops, and department events. Drove community engagement across 100+ members."
  },
  {
    title: "Mentored Team — 2nd Place, PyExpo",
    year: "2025",
    rank: "🥈 2nd Place (Mentor)",
    icon: User,
    gradient: "from-rose-950/70 via-rose-900/20 to-transparent",
    glow: "rgba(244,63,94,0.12)",
    accent: "#f43f5e",
    desc: "Guided a junior team through ideation to implementation, earning 2nd place in the PyExpo inter-college hackathon organized by the department."
  }
];

function Achievements() {
  const [selected, setSelected] = useState<typeof ACHIEVEMENTS[0] | null>(null);

  return (
    <section id="achievements" className="py-24 relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Achievements" icon={ShieldAlert} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACHIEVEMENTS.map((ach, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.09 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`cursor-pointer ${ach.highlight ? "md:col-span-2 lg:col-span-2" : ""}`}
              onClick={() => setSelected(ach)}
            >
              <div
                className="relative h-full rounded-xl border border-white/8 overflow-hidden group transition-all duration-400"
                style={{ boxShadow: `0 0 0 0 ${ach.glow}`, ['--glow' as string]: ach.glow }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${ach.gradient} opacity-80`} />
                {/* Hover glow ring */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-xl" style={{ boxShadow: `inset 0 0 30px ${ach.glow}` }} />
                {/* Shimmer sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />

                <div className="relative z-10 p-6 flex flex-col h-full gap-4">
                  {/* Image Placeholder */}
                  <div className="w-full h-36 border-2 border-dashed border-white/10 rounded-lg bg-white/[0.015] flex flex-col items-center justify-center gap-1.5">
                    <ach.icon className="w-8 h-8" style={{ color: ach.accent, opacity: 0.2 }} />
                    <span className="text-xs font-mono text-white/20">image placeholder</span>
                  </div>

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                        <ach.icon className="w-5 h-5" style={{ color: ach.accent }} />
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded-full border border-white/10 bg-white/5 text-muted-foreground">{ach.year}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-1 shrink-0" />
                  </div>

                  {/* Rank badge */}
                  <span className="text-xs font-semibold" style={{ color: ach.accent }}>{ach.rank}</span>

                  {/* Title */}
                  <h3 className={`font-bold text-foreground leading-tight ${ach.highlight ? "text-2xl" : "text-lg"}`}>{ach.title}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground/70 text-sm leading-relaxed flex-1">{ach.desc}</p>

                  {/* Bottom accent line */}
                  <div className="h-px w-full rounded-full" style={{ background: `linear-gradient(to right, ${ach.accent}40, transparent)` }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 md:p-16"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 24 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10"
                style={{ boxShadow: `0 0 60px ${selected.glow}, 0 25px 50px rgba(0,0,0,0.5)` }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`bg-gradient-to-br ${selected.gradient} p-8 md:p-12 relative overflow-hidden`}>
                  {/* Background decoration */}
                  <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10" style={{ background: selected.accent }} />
                  <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full opacity-5" style={{ background: selected.accent }} />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={() => setSelected(null)}
                  >
                    <XCircle className="w-6 h-6" />
                  </Button>

                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                        <selected.icon className="w-7 h-7" style={{ color: selected.accent }} />
                      </div>
                      <span className="text-sm font-mono px-3 py-1 rounded-full border border-white/15 bg-white/8 text-muted-foreground">{selected.year}</span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2" style={{ color: selected.accent }}>{selected.rank}</p>
                      <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{selected.title}</h2>
                    </div>

                    <p className="text-white/70 text-base leading-relaxed">{selected.desc}</p>

                    <div className="h-px" style={{ background: `linear-gradient(to right, ${selected.accent}60, transparent)` }} />
                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest">ACHIEVEMENT · TAYANITHAA N S · {selected.year}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" }
  });

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast({
      title: "Message sent successfully!",
      description: "Thank you for reaching out. I will get back to you soon.",
    });

    form.reset();
  };

  return (
    <section id="contact" className="py-24 relative bg-black/20 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Get In Touch" icon={Mail} />

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-3xl font-bold mb-6">Let's Connect</h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              I am currently open to new opportunities, collaborations, and projects. Whether you have a question or just want to say hi, feel free to reach out!
            </p>

            <div className="space-y-6">
              <a href="mailto:tayanithaans2196@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                  <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">tayanithaans2196@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">9629349239</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">Coimbatore, Tamil Nadu, India</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all h-14 text-lg" data-testid="btn-resume-download">
                <Download className="mr-3 w-5 h-5" /> Download Resume
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-background/50 border-white/10 focus-visible:ring-primary h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" className="bg-background/50 border-white/10 focus-visible:ring-primary h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Project Inquiry" className="bg-background/50 border-white/10 focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Hello, I'd like to talk about..."
                            className="bg-background/50 border-white/10 focus-visible:ring-primary min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-white text-black hover:bg-gray-200 text-base font-semibold transition-colors">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5 bg-background relative z-10">
      <div className="container mx-auto px-4 py-12 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-muted-foreground text-sm text-center md:text-left">
          © 2025 Tayanithaa N S. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" className="rounded-full hover:text-primary hover:bg-primary/10 transition-colors" asChild>
            <a href="https://github.com/Tayanithaa" target="_blank" rel="noreferrer" aria-label="GitHub"><Github className="w-5 h-5" /></a>
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full hover:text-primary hover:bg-primary/10 transition-colors" asChild>
            <a href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full hover:text-primary hover:bg-primary/10 transition-colors" asChild>
            <a href="mailto:tayanithaans2196@gmail.com" aria-label="Email"><Mail className="w-5 h-5" /></a>
          </Button>
        </div>
      </div>

      <Button
        size="icon"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-all z-50 backdrop-blur-sm"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
    </footer>
  );
}

// ==========================================
// LANDING PAGE
// ==========================================
const TYPEWRITER_ROLES = [
    "Building Intelligent Systems.",
    "Transforming Ideas into AI Solutions.",
    "Exploring the Future with Machine Learning.",
    "Creating Secure and Scalable Technologies.",
    "Turning Data into Meaningful Insights.",
    "Engineering AI for Real-World Impact.",
    "Innovating Through Artificial Intelligence.",
    "Securing Digital Futures."
];

function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  // Typewriter
  useEffect(() => {
    const role = TYPEWRITER_ROLES[roleIdx];
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (charIdx < role.length) {
        timer = setTimeout(() => {
          setDisplayed(role.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, 55);
      } else {
        timer = setTimeout(() => setDeleting(true), 1800);
      }
    } else {
      if (charIdx > 0) {
        timer = setTimeout(() => {
          setDisplayed(role.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        }, 30);
      } else {
        setDeleting(false);
        setRoleIdx(r => (r + 1) % TYPEWRITER_ROLES.length);
      }
    }
    return () => clearTimeout(timer);
  }, [charIdx, deleting, roleIdx]);

  // No more custom canvas here, we use the global ParticleBackground

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-transparent"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)" }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ambient radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(0,212,255,0.35) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.4) 0%, transparent 70%)" }} />
      </div>

      {/* Holographic orb */}
      <div className="absolute top-[12%] right-[10%] pointer-events-none hidden lg:block">
        <div className="relative w-48 h-48">
          {/* Core sphere */}
          <div className="absolute inset-0 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle at 35% 30%, rgba(0,212,255,0.6) 0%, rgba(0,100,180,0.3) 45%, transparent 75%)" }} />
          {/* Outer ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] rounded-full border border-cyan-400/20"
            style={{ borderStyle: "dashed" }}
          />
          {/* Outer ring 2 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-22px] rounded-full border border-violet-400/15"
            style={{ borderStyle: "dashed" }}
          />
          {/* Glint dot */}
          <div className="absolute top-[22%] left-[28%] w-2 h-2 rounded-full bg-white/40 blur-[1px]" />
        </div>
      </div>

      {/* Grid overlay — subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center max-w-3xl">
        {/* Mono badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-mono text-xs text-primary/70 border border-primary/20 px-4 py-1.5 rounded-full bg-primary/5 tracking-widest uppercase"
        >
          {"Welcome to the Portfolio"}
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="text-white">Tayanithaa</span>
          <br />
          <span style={{ background: "linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #00d4ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto" }}>
            N S
          </span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="h-8 flex items-center"
        >
          <span className="font-mono text-lg text-muted-foreground">{displayed}</span>
          <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="text-sm text-muted-foreground/70 max-w-md leading-relaxed font-mono"
        >
          BE CSE (Cybersecurity)
        </motion.p>
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="text-sm text-muted-foreground/70 max-w-md leading-relaxed font-mono"
        >
          Building intelligent systems!!
        </motion.p>

        {/* Enter button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
        >
          <button
            onClick={onEnter}
            className="group relative px-10 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(139,92,246,0.15) 100%)", border: "1px solid rgba(0,212,255,0.35)", color: "#fff" }}
            data-interactive="true"
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            {/* Glow on hover */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{ boxShadow: "0 0 30px rgba(0,212,255,0.35)" }} />
            <span className="relative z-10 flex items-center gap-2.5">
              Enter Portfolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        {/* Scroll hint / decorative line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex items-center gap-3 text-white/15 text-xs font-mono mt-2"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/15" />
          <span>NST 2026</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/15" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <CustomCursor />
      
      {/* Backgrounds run globally across the entire site */}
      <ParticleBackground />
      <Spotlight />

      <AnimatePresence mode="wait">
        {!hasEntered && (
          <LandingPage key="landing" onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      {hasEntered && (
        <motion.div
          key="portfolio"
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
            <AboutEducation />
            <Skills />
            <Experience />
            <Projects />
            <Certifications />
            <Achievements />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
