
import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Zap, 
  Settings, 
  DollarSign, 
  Palette, 
  CheckCircle, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Linkedin,
  Monitor,
  Calendar,
  Gift,
  Heart,
  Sparkles,
  Play
} from 'lucide-react';

// פונקציה לחילוץ YouTube Video ID מה-URL
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

// --- Components ---

const Navbar = ({ data }: { data: SiteData }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass-card px-6 py-4 flex justify-between items-center">
    <div className="text-2xl font-bold gradient-text">{data.navbar.brandName}</div>
    <div className="hidden md:flex gap-8 text-sm font-medium">
      <a href="#about" className="hover:text-indigo-400 transition">למה AI?</a>
      <a href="#services" className="hover:text-indigo-400 transition">שירותים</a>
      <a href="#process" className="hover:text-indigo-400 transition">איך זה עובד</a>
      <a href="#gallery" className="hover:text-indigo-400 transition">עבודות</a>
      <a href="#contact" className="hover:text-indigo-400 transition">צרו קשר</a>
    </div>
    <a href={data.navbar.whatsappLink} target="_blank" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-bold transition flex items-center gap-2">
      <Phone size={16} />
      <span>WhatsApp</span>
    </a>
  </nav>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center mb-16 px-4">
    <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
    {subtitle && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
    <div className="w-24 h-1 bg-indigo-500 mx-auto mt-6 rounded-full"></div>
  </div>
);

interface SiteData {
  hero: { title: string; titleHighlight: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  navbar: { brandName: string; whatsappLink: string };
  benefits: Array<{ title: string; description: string }>;
  services: Array<{ id: string; title: string; description: string }>;
  process: Array<{ step: string; title: string; desc: string }>;
  portfolio: Array<{ youtubeUrl: string; title: string; category: string; description?: string }>;
  testimonials: Array<{ name: string; role: string; content: string }>;
  faqs: Array<{ question: string; answer: string }>;
  contact: { title: string; titleHighlight: string; description: string; phone: string; email: string; whatsappLink: string; socialLinks: { instagram: string; facebook: string; linkedin: string } };
  footer: { brandName: string; copyright: string; tagline: string };
  sections: { about: { title: string; subtitle: string }; services: { title: string; subtitle: string }; process: { title: string; subtitle: string }; gallery: { title: string; subtitle: string }; testimonials: { title: string }; faq: { title: string } };
}

const App: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // תמיד טען מ-JSON (הנתונים הרשמיים)
        // הוסף timestamp למניעת cache
        const response = await fetch(`/site-data.json?t=${Date.now()}`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback: נסה לטעון מ-localStorage אם JSON נכשל
        const savedData = localStorage.getItem('site_data');
        if (savedData) {
          try {
            setData(JSON.parse(savedData));
          } catch (e) {
            console.error('Error parsing localStorage data:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();

    // מאזין לשינויים ב-localStorage (כשהנתונים משתנים בפורטל האדמין)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'site_data' && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing updated data:', error);
        }
      }
    };

    // מאזין לשינויים ב-localStorage מאותו חלון (custom event)
    const handleCustomStorageChange = () => {
      const savedData = localStorage.getItem('site_data');
      if (savedData) {
        try {
          setData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing updated data:', error);
        }
      }
    };

    // מאזין ל-storage events (עובד בין חלונות שונים)
    window.addEventListener('storage', handleStorageChange);
    
    // מאזין ל-custom event (עובד באותו חלון)
    window.addEventListener('siteDataUpdated', handleCustomStorageChange);

    // Polling - בודק כל 5 שניות אם הנתונים ב-JSON השתנו
    let lastDataHash = '';
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/site-data.json?t=${Date.now()}`);
        const jsonData = await response.json();
        const currentHash = JSON.stringify(jsonData);
        
        if (currentHash !== lastDataHash) {
          lastDataHash = currentHash;
          setData(jsonData);
        }
      } catch (error) {
        // אם JSON לא נטען, נסה localStorage
        const savedData = localStorage.getItem('site_data');
        if (savedData && savedData !== lastDataHash) {
          try {
            const parsedData = JSON.parse(savedData);
            lastDataHash = savedData;
            setData(parsedData);
          } catch (e) {
            console.error('Error parsing data:', e);
          }
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('siteDataUpdated', handleCustomStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">טוען...</div>
      </div>
    );
  }

  // Map icons for benefits
  const benefitIcons = [<Zap className="w-8 h-8 text-indigo-400" />, <Settings className="w-8 h-8 text-indigo-400" />, <DollarSign className="w-8 h-8 text-indigo-400" />, <Palette className="w-8 h-8 text-indigo-400" />, <CheckCircle className="w-8 h-8 text-indigo-400" />, <Star className="w-8 h-8 text-indigo-400" />];
  
  // Map icons for services
  const serviceIcons: { [key: string]: React.ReactNode } = {
    business: <Monitor className="w-6 h-6" />,
    events: <Calendar className="w-6 h-6" />,
    birthday: <Gift className="w-6 h-6" />,
    mitzvah: <Star className="w-6 h-6" />,
    memorial: <Heart className="w-6 h-6" />,
    dream: <Sparkles className="w-6 h-6" />,
  };

  return (
    <div className="min-h-screen">
      <Navbar data={data} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          <img 
            src="https://picsum.photos/seed/ai-video/1920/1080" 
            alt="AI Video Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            {data.hero.title} <span className="gradient-text">{data.hero.titleHighlight}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {data.hero.subtitle}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a 
              href="#contact" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20"
            >
              {data.hero.ctaPrimary}
            </a>
            <a 
              href={data.navbar.whatsappLink} 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all"
            >
              {data.hero.ctaSecondary}
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-gray-500" size={32} />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-24 px-6 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title={data.sections.about.title} subtitle={data.sections.about.subtitle} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.benefits.map((benefit, index) => (
              <div key={index} className="glass-card p-8 rounded-2xl hover:border-indigo-500/50 transition-all group">
                <div className="mb-6 p-3 bg-indigo-500/10 rounded-lg inline-block group-hover:bg-indigo-500/20 transition">
                  {benefitIcons[index % benefitIcons.length]}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0e0e0e] to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/5">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">רוצים לשמוע עוד?</h2>
              <p className="text-gray-400 text-lg">השאירו פרטים ונחזור אליכם בהקדם</p>
            </div>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium mr-2">שם מלא</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition" placeholder="השם שלכם" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium mr-2">טלפון</label>
                  <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition" placeholder="050-0000000" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium mr-2">אימייל (אופציונלי)</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium mr-2">מה מעניין אתכם?</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition appearance-none">
                  <option className="bg-black" value="">בחרו נושא...</option>
                  <option className="bg-black">סרטון לאירוע (חתונה / בר מצווה / יום הולדת)</option>
                  <option className="bg-black">סרטון פרסומי לעסק</option>
                  <option className="bg-black">סרטון הנצחה</option>
                  <option className="bg-black">סרטון חלומי / אמנותי</option>
                  <option className="bg-black">אחר</option>
                </select>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2 text-lg">
                <Send size={20} />
                <span>שלחו לי פרטים</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title={data.sections.services.title} subtitle={data.sections.services.subtitle} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.services.map((service) => (
              <div key={service.id} className="relative overflow-hidden rounded-2xl group bg-gradient-to-br from-gray-900 to-black p-1">
                <div className="bg-black rounded-[calc(1rem-1px)] p-8 h-full flex flex-col items-start hover:bg-gray-900/40 transition">
                  <div className="bg-indigo-500 p-3 rounded-xl mb-6 shadow-lg shadow-indigo-500/40">
                    {serviceIcons[service.id] || <Monitor className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6 flex-grow">{service.description}</p>
                  <button className="text-indigo-400 font-bold hover:text-indigo-300 transition flex items-center gap-2">
                    <span>לפרטים נוספים</span>
                    <Play size={14} className="rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 px-6 bg-[#0e0e0e]">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title={data.sections.process.title} subtitle={data.sections.process.subtitle} />
          <div className="space-y-12">
            {data.process.map((p, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-8 items-start md:items-center glass-card p-6 md:p-8 rounded-3xl relative">
                <div className="text-5xl font-black text-indigo-500/20">{p.step}</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
                  <p className="text-gray-400 text-lg">{p.desc}</p>
                </div>
                <div className="hidden md:block">
                  <CheckCircle className="text-indigo-500" size={32} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title={data.sections.gallery.title} subtitle={data.sections.gallery.subtitle} />
          {data.portfolio.length > 0 ? (
            <>
              <div className="space-y-20">
                {data.portfolio.map((project, i) => {
                  const videoId = getYouTubeId(project.youtubeUrl);
                  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
                  const isEven = i % 2 === 0;
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}
                    >
                      <div 
                        className="w-full md:w-3/5 group relative aspect-video rounded-2xl overflow-hidden glass-card cursor-pointer shrink-0"
                        onClick={() => setSelectedVideo(project.youtubeUrl)}
                      >
                        <img 
                          src={thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (videoId) {
                              target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                            }
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full group-hover:scale-125 transition duration-300 border border-white/30">
                            <Play fill="white" className="text-white" size={32} />
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-2/5 text-right">
                        <span className="inline-block text-sm font-medium text-indigo-400 bg-indigo-500/10 px-4 py-1 rounded-full mb-4">{project.category}</span>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h3>
                        {project.description && (
                          <p className="text-gray-400 text-lg leading-relaxed mb-6">{project.description}</p>
                        )}
                        <button
                          onClick={() => setSelectedVideo(project.youtubeUrl)}
                          className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition"
                        >
                          <Play size={18} className="rotate-180" />
                          <span>צפו בסרטון</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Video Modal */}
              {selectedVideo && (() => {
                const videoId = getYouTubeId(selectedVideo);
                if (!videoId) return null;
                
                return (
                  <div 
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedVideo(null)}
                  >
                    <div className="relative max-w-6xl w-full aspect-video" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute -top-12 left-0 text-white text-xl font-bold hover:text-indigo-400 transition z-10"
                      >
                        ✕ סגור
                      </button>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube video player"
                      />
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">אין סרטונים להצגה כרגע</p>
              <p className="text-gray-600 text-sm">הכנס את קבצי הסרטונים לתיקיית videos/ ועדכן את מערך portfolioVideos בקוד</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title={data.sections.testimonials.title} />
        </div>
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-6 px-6 md:px-12 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {data.testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl relative flex-shrink-0 w-[340px] md:w-[400px] snap-start flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />)}
                  </div>
                  <p className="text-gray-300 mb-8 italic leading-relaxed">"{t.content}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#0e0e0e] to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#0e0e0e] to-transparent pointer-events-none"></div>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">גללו לצדדים לעוד המלצות</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title={data.sections.faq.title} />
          <div className="space-y-4">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex justify-between items-center text-right hover:bg-white/5 transition"
                >
                  <span className="text-lg font-bold">{faq.question}</span>
                  {openFaq === idx ? <ChevronUp /> : <ChevronDown />}
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-[#0e0e0e] to-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{data.contact.title} <br/><span className="gradient-text">{data.contact.titleHighlight}</span></h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
              {data.contact.description}
            </p>
            <div className="space-y-6">
              <a href={`tel:${data.contact.phone}`} className="flex items-center gap-4 group">
                <div className="bg-indigo-500/10 p-4 rounded-xl text-indigo-400 group-hover:bg-indigo-500/20 transition"><Phone size={24}/></div>
                <div>
                  <div className="text-sm text-gray-500">טלפון</div>
                  <div className="text-lg font-bold group-hover:text-indigo-400 transition">{data.contact.phone}</div>
                </div>
              </a>
              <a href={`mailto:${data.contact.email}`} className="flex items-center gap-4 group">
                <div className="bg-indigo-500/10 p-4 rounded-xl text-indigo-400 group-hover:bg-indigo-500/20 transition"><Mail size={24}/></div>
                <div>
                  <div className="text-sm text-gray-500">אימייל</div>
                  <div className="text-lg font-bold group-hover:text-indigo-400 transition">{data.contact.email}</div>
                </div>
              </a>
              <a href={data.contact.whatsappLink} target="_blank" className="flex items-center gap-4 group">
                <div className="bg-green-500/10 p-4 rounded-xl text-green-400 group-hover:bg-green-500/20 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">WhatsApp</div>
                  <div className="text-lg font-bold group-hover:text-green-400 transition">שלחו לנו הודעה</div>
                </div>
              </a>
            </div>
          </div>

          <div className="glass-card p-8 md:p-10 rounded-3xl shadow-2xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium mr-2">שם מלא</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition" placeholder="השם שלכם" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium mr-2">טלפון</label>
                  <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition" placeholder="050-0000000" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium mr-2">אימייל</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium mr-2">סוג הסרט</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition appearance-none">
                  <option className="bg-black" value="">בחרו סוג סרט...</option>
                  <option className="bg-black">סרטון פרסומי לעסק</option>
                  <option className="bg-black">אירוע משפחתי (חתונה / בר מצווה / יום הולדת)</option>
                  <option className="bg-black">סרטון הנצחה</option>
                  <option className="bg-black">סרטון חלומי / אמנותי</option>
                  <option className="bg-black">אחר</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium mr-2">מה עוד תרצו שנדע?</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition" placeholder="ספרו לנו עוד על מה שאתם מחפשים..."></textarea>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2 text-lg">
                <Send size={20} />
                <span>בואו נדבר</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <div className="text-2xl font-bold gradient-text mb-2">{data.footer.brandName}</div>
            <p className="text-gray-500 text-sm">{data.footer.copyright} &copy; {new Date().getFullYear()}</p>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#about" className="hover:text-white transition">אודות</a>
            <a href="#services" className="hover:text-white transition">שירותים</a>
            <a href="#gallery" className="hover:text-white transition">תיק עבודות</a>
            <a href="#contact" className="hover:text-white transition">צרו קשר</a>
          </div>
          <div className="text-gray-500 text-xs text-center md:text-left">
            {data.footer.tagline}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
