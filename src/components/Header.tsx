import cyberLogo from "@/assets/cyber-logo.svg";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { t, language } = useLanguage();
  
  return (
    <header className="relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/20 via-transparent to-cyber-secondary/20 blur-3xl"></div>
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full blur-2xl opacity-50 scale-110"></div>
              <img 
                src={cyberLogo} 
                alt="Cyber Threat Analysis" 
                className="relative h-20 w-20 mx-auto drop-shadow-2xl object-contain"
                key={Date.now()}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="gradient-text">{t('cyber.threat.analysis')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('advanced.security.scanning')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-cyber-primary">
              <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse"></div>
              <span className="text-sm font-medium">{t('real.time.analysis')}</span>
            </div>
            <div className="flex items-center gap-2 text-cyber-secondary">
              <div className="w-2 h-2 rounded-full bg-cyber-secondary animate-pulse"></div>
              <span className="text-sm font-medium">{t('advanced.detection')}</span>
            </div>
            <div className="flex items-center gap-2 text-cyber-accent">
              <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse"></div>
              <span className="text-sm font-medium">{t('secure.processing')}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;