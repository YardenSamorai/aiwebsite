import React, { useState, useEffect } from 'react';
import { 
  Save, 
  LogOut, 
  Eye, 
  Edit, 
  Plus, 
  Trash2,
  Lock,
  X
} from 'lucide-react';

interface SiteData {
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  navbar: {
    brandName: string;
    whatsappLink: string;
  };
  benefits: Array<{ title: string; description: string }>;
  services: Array<{ id: string; title: string; description: string }>;
  process: Array<{ step: string; title: string; desc: string }>;
  portfolio: Array<{ youtubeUrl: string; title: string; category: string }>;
  testimonials: Array<{ name: string; role: string; content: string }>;
  faqs: Array<{ question: string; answer: string }>;
  contact: {
    title: string;
    titleHighlight: string;
    description: string;
    phone: string;
    email: string;
    whatsappLink: string;
    socialLinks: {
      instagram: string;
      facebook: string;
      linkedin: string;
    };
  };
  footer: {
    brandName: string;
    copyright: string;
    tagline: string;
  };
  sections: {
    about: { title: string; subtitle: string };
    services: { title: string; subtitle: string };
    process: { title: string; subtitle: string };
    gallery: { title: string; subtitle: string };
    testimonials: { title: string };
    faq: { title: string };
  };
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<SiteData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showPreview, setShowPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // פונקציה להשוואת סיסמה - לא חושפת את הסיסמה בקונסול
  const comparePassword = (inputPassword: string): boolean => {
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'SagiSamurai2024!@#Secure';
    // השוואה בטוחה - לא מדפיסה את הסיסמה
    return inputPassword === envPassword;
  };

  useEffect(() => {
    // בדיקה אם המשתמש כבר מחובר
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/site-data.json');
      const jsonData = await response.json();
      // טעינה מ-localStorage אם יש שינויים לא שמורים
      const savedData = localStorage.getItem('site_data');
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        setData(jsonData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // נסה לטעון מ-localStorage
      const savedData = localStorage.getItem('site_data');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // השוואה בטוחה - הסיסמה לא מופיעה בקונסול
    if (comparePassword(password)) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      loadData();
      // נקה את השדה סיסמה מהזיכרון
      setPassword('');
    } else {
      alert('סיסמה שגויה');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  const handleSave = () => {
    if (!data) return;
    localStorage.setItem('site_data', JSON.stringify(data));
    setHasChanges(false);
    alert('הנתונים נשמרו בהצלחה!');
  };

  const updateData = (path: string, value: any) => {
    if (!data) return;
    const newData = { ...data };
    const keys = path.split('.');
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (Array.isArray(current[keys[i]])) {
        current = current[keys[i]];
        break;
      }
      current = current[keys[i]];
    }
    
    if (Array.isArray(current)) {
      const index = parseInt(keys[keys.length - 2]);
      const field = keys[keys.length - 1];
      current[index][field] = value;
    } else {
      current[keys[keys.length - 1]] = value;
    }
    
    setData(newData);
    setHasChanges(true);
  };

  const addItem = (arrayPath: string, newItem: any) => {
    if (!data) return;
    const newData = { ...data };
    const keys = arrayPath.split('.');
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]].push(newItem);
    setData(newData);
    setHasChanges(true);
  };

  const removeItem = (arrayPath: string, index: number) => {
    if (!data) return;
    const newData = { ...data };
    const keys = arrayPath.split('.');
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]].splice(index, 1);
    setData(newData);
    setHasChanges(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">פורטל אדמין</h1>
            <p className="text-gray-400">הזן סיסמה כדי להמשיך</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition"
                placeholder="הזן סיסמה"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition"
            >
              התחבר
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            הסיסמה מוגדרת בקובץ .env
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">טוען...</div>
      </div>
    );
  }

  const sections = [
    { id: 'hero', label: 'סעיף ראשי' },
    { id: 'navbar', label: 'תפריט עליון' },
    { id: 'benefits', label: 'יתרונות' },
    { id: 'services', label: 'שירותים' },
    { id: 'process', label: 'תהליך עבודה' },
    { id: 'portfolio', label: 'תיק עבודות' },
    { id: 'testimonials', label: 'המלצות' },
    { id: 'faqs', label: 'שאלות נפוצות' },
    { id: 'contact', label: 'צור קשר' },
    { id: 'footer', label: 'תחתית' },
    { id: 'sections', label: 'כותרות סעיפים' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">פורטל אדמין</h1>
          {hasChanges && (
            <span className="text-yellow-400 text-sm">יש שינויים לא שמורים</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Eye size={18} />
            <span>תצוגה מקדימה</span>
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            disabled={!hasChanges}
          >
            <Save size={18} />
            <span>שמור</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <LogOut size={18} />
            <span>התנתק</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-right px-4 py-3 rounded-lg transition ${
                  activeSection === section.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-73px)]">
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">סעיף ראשי</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">כותרת ראשית</label>
                  <input
                    type="text"
                    value={data.hero.title}
                    onChange={(e) => updateData('hero.title', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">כותרת מודגשת</label>
                  <input
                    type="text"
                    value={data.hero.titleHighlight}
                    onChange={(e) => updateData('hero.titleHighlight', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">תת-כותרת</label>
                  <textarea
                    value={data.hero.subtitle}
                    onChange={(e) => updateData('hero.subtitle', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">כפתור ראשי</label>
                  <input
                    type="text"
                    value={data.hero.ctaPrimary}
                    onChange={(e) => updateData('hero.ctaPrimary', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">כפתור משני</label>
                  <input
                    type="text"
                    value={data.hero.ctaSecondary}
                    onChange={(e) => updateData('hero.ctaSecondary', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'navbar' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">תפריט עליון</h2>
              <div>
                <label className="block mb-2">שם המותג</label>
                <input
                  type="text"
                  value={data.navbar.brandName}
                  onChange={(e) => updateData('navbar.brandName', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-2">קישור WhatsApp</label>
                <input
                  type="text"
                  value={data.navbar.whatsappLink}
                  onChange={(e) => updateData('navbar.whatsappLink', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          )}

          {activeSection === 'benefits' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">יתרונות</h2>
                <button
                  onClick={() => addItem('benefits', { title: '', description: '' })}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  הוסף יתרון
                </button>
              </div>
              {data.benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={benefit.title}
                        onChange={(e) => {
                          const newBenefits = [...data.benefits];
                          newBenefits[index].title = e.target.value;
                          setData({ ...data, benefits: newBenefits });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="כותרת"
                      />
                      <textarea
                        value={benefit.description}
                        onChange={(e) => {
                          const newBenefits = [...data.benefits];
                          newBenefits[index].description = e.target.value;
                          setData({ ...data, benefits: newBenefits });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="תיאור"
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={() => removeItem('benefits', index)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">שירותים</h2>
                <button
                  onClick={() => addItem('services', { id: '', title: '', description: '' })}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  הוסף שירות
                </button>
              </div>
              {data.services.map((service, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={service.id}
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].id = e.target.value;
                          setData({ ...data, services: newServices });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="ID"
                      />
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].title = e.target.value;
                          setData({ ...data, services: newServices });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="כותרת"
                      />
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].description = e.target.value;
                          setData({ ...data, services: newServices });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="תיאור"
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={() => removeItem('services', index)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'portfolio' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">תיק עבודות</h2>
                <button
                  onClick={() => addItem('portfolio', { youtubeUrl: '', title: '', category: '' })}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  הוסף סרטון
                </button>
              </div>
              {data.portfolio.map((video, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={video.youtubeUrl}
                        onChange={(e) => {
                          const newPortfolio = [...data.portfolio];
                          newPortfolio[index].youtubeUrl = e.target.value;
                          setData({ ...data, portfolio: newPortfolio });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="קישור YouTube"
                      />
                      <input
                        type="text"
                        value={video.title}
                        onChange={(e) => {
                          const newPortfolio = [...data.portfolio];
                          newPortfolio[index].title = e.target.value;
                          setData({ ...data, portfolio: newPortfolio });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="כותרת"
                      />
                      <input
                        type="text"
                        value={video.category}
                        onChange={(e) => {
                          const newPortfolio = [...data.portfolio];
                          newPortfolio[index].category = e.target.value;
                          setData({ ...data, portfolio: newPortfolio });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="קטגוריה"
                      />
                    </div>
                    <button
                      onClick={() => removeItem('portfolio', index)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'testimonials' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">המלצות</h2>
                <button
                  onClick={() => addItem('testimonials', { name: '', role: '', content: '' })}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  הוסף המלצה
                </button>
              </div>
              {data.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => {
                          const newTestimonials = [...data.testimonials];
                          newTestimonials[index].name = e.target.value;
                          setData({ ...data, testimonials: newTestimonials });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="שם"
                      />
                      <input
                        type="text"
                        value={testimonial.role}
                        onChange={(e) => {
                          const newTestimonials = [...data.testimonials];
                          newTestimonials[index].role = e.target.value;
                          setData({ ...data, testimonials: newTestimonials });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="תפקיד"
                      />
                      <textarea
                        value={testimonial.content}
                        onChange={(e) => {
                          const newTestimonials = [...data.testimonials];
                          newTestimonials[index].content = e.target.value;
                          setData({ ...data, testimonials: newTestimonials });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="תוכן ההמלצה"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={() => removeItem('testimonials', index)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'faqs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">שאלות נפוצות</h2>
                <button
                  onClick={() => addItem('faqs', { question: '', answer: '' })}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  הוסף שאלה
                </button>
              </div>
              {data.faqs.map((faq, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaqs = [...data.faqs];
                          newFaqs[index].question = e.target.value;
                          setData({ ...data, faqs: newFaqs });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="שאלה"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaqs = [...data.faqs];
                          newFaqs[index].answer = e.target.value;
                          setData({ ...data, faqs: newFaqs });
                          setHasChanges(true);
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="תשובה"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={() => removeItem('faqs', index)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">צור קשר</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">כותרת</label>
                  <input
                    type="text"
                    value={data.contact.title}
                    onChange={(e) => updateData('contact.title', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">כותרת מודגשת</label>
                  <input
                    type="text"
                    value={data.contact.titleHighlight}
                    onChange={(e) => updateData('contact.titleHighlight', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">תיאור</label>
                  <textarea
                    value={data.contact.description}
                    onChange={(e) => updateData('contact.description', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">טלפון</label>
                  <input
                    type="text"
                    value={data.contact.phone}
                    onChange={(e) => updateData('contact.phone', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">אימייל</label>
                  <input
                    type="email"
                    value={data.contact.email}
                    onChange={(e) => updateData('contact.email', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">קישור WhatsApp</label>
                  <input
                    type="text"
                    value={data.contact.whatsappLink}
                    onChange={(e) => updateData('contact.whatsappLink', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sections' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">כותרות סעיפים</h2>
              {Object.entries(data.sections).map(([key, section]: [string, any]) => (
                <div key={key} className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <h3 className="font-bold">{key}</h3>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      const newSections = { ...data.sections };
                      newSections[key as keyof typeof newSections].title = e.target.value;
                      setData({ ...data, sections: newSections });
                      setHasChanges(true);
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    placeholder="כותרת"
                  />
                  {section.subtitle && (
                    <input
                      type="text"
                      value={section.subtitle}
                      onChange={(e) => {
                        const newSections = { ...data.sections };
                        newSections[key as keyof typeof newSections].subtitle = e.target.value;
                        setData({ ...data, sections: newSections });
                        setHasChanges(true);
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                      placeholder="תת-כותרת"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full h-full max-w-7xl max-h-[90vh] rounded-lg overflow-hidden relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 left-4 bg-red-600 text-white p-2 rounded-full z-10"
            >
              <X size={20} />
            </button>
            <iframe
              src="/"
              className="w-full h-full"
              title="Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
