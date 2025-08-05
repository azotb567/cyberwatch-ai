import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex gap-1">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="h-8 px-2 text-xs"
        >
          EN
        </Button>
        <Button
          variant={language === 'ar' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('ar')}
          className="h-8 px-2 text-xs"
        >
          ع
        </Button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;