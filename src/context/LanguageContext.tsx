import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, Record<Language, string>>;
}

const translations = {
  // Common translations
  welcome: {
    en: 'Welcome',
    hi: 'स्वागत',
    ta: 'வரவேற்கிறோம்'
  },
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    ta: 'டாஷ்போர்ட்'
  },
  forum: {
    en: 'Forum',
    hi: 'फोरम',
    ta: 'மன்றம்'
  },
  resources: {
    en: 'Resources',
    hi: 'संसाधन',
    ta: 'வளங்கள்'
  },
  assessment: {
    en: 'Assessment',
    hi: 'मूल्यांकन',
    ta: 'மதிப்பீடு'
  },
  chatbot: {
    en: 'Chat with Aasha',
    hi: 'आशा से चैट करें',
    ta: 'ஆஷாவுடன் அரட்டை'
  },
  booking: {
    en: 'Book Session',
    hi: 'सत्र बुक करें',
    ta: 'அமர்வு முன்பதிவு'
  },
  logout: {
    en: 'Logout',
    hi: 'लॉग आउट',
    ta: 'வெளியேறு'
  },
  // Mental health related translations
  mentalHealth: {
    en: 'Mental Health',
    hi: 'मानसिक स्वास्थ्य',
    ta: 'மனநலம்'
  },
  support: {
    en: 'Support',
    hi: 'सहायता',
    ta: 'ஆதரவு'
  },
  counseling: {
    en: 'Counseling',
    hi: 'परामर्श',
    ta: 'ஆலோசனை'
  },
  wellness: {
    en: 'Wellness',
    hi: 'कल्याण',
    ta: 'நல்வாழ்வு'
  },
  anxiety: {
    en: 'Anxiety',
    hi: 'चिंता',
    ta: 'கவலை'
  },
  depression: {
    en: 'Depression',
    hi: 'अवसाद',
    ta: 'மனச்சோர்வு'
  },
  stress: {
    en: 'Stress',
    hi: 'तनाव',
    ta: 'மன அழுத்தம்'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper function to get translation
export const useTranslation = () => {
  const { language, translations } = useLanguage();
  
  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };
  
  return { t, language };
};

export default LanguageContext;