import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'cyber.threat.analysis': 'Cyber Threat Analysis',
    'advanced.security.scanning': 'Advanced security scanning for URLs, IP addresses, and files. Protect your digital assets with real-time threat detection.',
    'real.time.analysis': 'Real-time Analysis',
    'advanced.detection': 'Advanced Detection',
    'secure.processing': 'Secure Processing',
    'url.scanner': 'URL Scanner',
    'ip.scanner': 'IP Scanner',
    'file.scanner': 'File Scanner',
    'enter.url': 'Enter URL to analyze',
    'enter.ip': 'Enter IP address to analyze',
    'scan.now': 'Scan Now',
    'scanning': 'Scanning...',
    'upload.file': 'Upload File',
    'drag.drop.files': 'Drag and drop files here, or click to select',
    'supported.formats': 'Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)',
    'threat.analysis.results': 'Threat Analysis Results',
    'clean': 'Clean',
    'malicious': 'Malicious',
    'suspicious': 'Suspicious',
    'harmless': 'Harmless',
    'undetected': 'Undetected',
    'detected.threats': 'Detected Threats',
    'analysis.date': 'Analysis Date',
    'view.full.report': 'View Full Report',
    'powered.by': 'Powered by advanced AI and machine learning algorithms for comprehensive security analysis',
    'language': 'Language'
  },
  ar: {
    'cyber.threat.analysis': 'تحليل التهديدات السيبرانية',
    'advanced.security.scanning': 'فحص أمني متقدم للروابط وعناوين IP والملفات. احمِ أصولك الرقمية بكشف التهديدات في الوقت الفعلي.',
    'real.time.analysis': 'تحليل في الوقت الفعلي',
    'advanced.detection': 'كشف متقدم',
    'secure.processing': 'معالجة آمنة',
    'url.scanner': 'فاحص الروابط',
    'ip.scanner': 'فاحص عناوين IP',
    'file.scanner': 'فاحص الملفات',
    'enter.url': 'أدخل الرابط للتحليل',
    'enter.ip': 'أدخل عنوان IP للتحليل',
    'scan.now': 'فحص الآن',
    'scanning': 'جاري الفحص...',
    'upload.file': 'رفع ملف',
    'drag.drop.files': 'اسحب وأفلت الملفات هنا، أو انقر للاختيار',
    'supported.formats': 'الصيغ المدعومة: PDF, DOC, DOCX, TXT (حد أقصى 10 ميجا)',
    'threat.analysis.results': 'نتائج تحليل التهديدات',
    'clean': 'نظيف',
    'malicious': 'ضار',
    'suspicious': 'مشبوه',
    'harmless': 'غير ضار',
    'undetected': 'غير مكتشف',
    'detected.threats': 'التهديدات المكتشفة',
    'analysis.date': 'تاريخ التحليل',
    'view.full.report': 'عرض التقرير الكامل',
    'powered.by': 'مدعوم بخوارزميات الذكاء الاصطناعي والتعلم الآلي المتقدمة للتحليل الأمني الشامل',
    'language': 'اللغة'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};