import { useState } from "react";
import { Globe, Server, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import ScannerCard from "@/components/ScannerCard";
import FileUpload from "@/components/FileUpload";

const Index = () => {
  const { t, language } = useLanguage();
  const [activeScanner, setActiveScanner] = useState<'url' | 'ip' | 'file'>('url');
  const [scannerKey, setScannerKey] = useState(0); // Force re-render when switching

  const scanners = [
    {
      id: 'url' as const,
      title: t('url.scanner'),
      description: "Analyze websites and URLs for security threats and malicious content",
      icon: <Globe className="h-8 w-8 text-cyber-primary" />,
      placeholder: t('enter.url'),
      endpoint: "https://n8n-main.2wcwas.easypanel.host/webhook/check-url",
      inputType: "url"
    },
    {
      id: 'ip' as const,
      title: t('ip.scanner'), 
      description: "Check IP addresses for reputation and potential security risks",
      icon: <Server className="h-8 w-8 text-cyber-primary" />,
      placeholder: t('enter.ip'),
      endpoint: "https://n8n-main.2wcwas.easypanel.host/webhook/check-ip",
      inputType: "text"
    },
    {
      id: 'file' as const,
      title: t('file.scanner'),
      description: "Upload and scan files for malware and security threats",
      icon: <Upload className="h-8 w-8 text-cyber-primary" />,
      placeholder: "",
      endpoint: "https://n8n-main.2wcwas.easypanel.host/webhook-test/check-file",
      inputType: "file"
    }
  ];

  const handleScannerChange = (scannerId: 'url' | 'ip' | 'file') => {
    setActiveScanner(scannerId);
    setScannerKey(prev => prev + 1); // Force component re-render to clear previous results
  };

  const activeConfig = scanners.find(s => s.id === activeScanner)!;

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Scanner Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {scanners.map((scanner) => (
              <Button
                key={scanner.id}
                variant={activeScanner === scanner.id ? "cyber" : "outline"}
                onClick={() => handleScannerChange(scanner.id)}
                className="flex items-center gap-2 px-6 py-3 h-auto"
              >
                {scanner.icon}
                <span className="font-medium">{scanner.title}</span>
              </Button>
            ))}
          </div>

          {/* Active Scanner */}
          <div className="space-y-8">
            {activeScanner === 'file' ? (
              <FileUpload key={scannerKey} />
            ) : (
              <ScannerCard
                key={scannerKey}
                title={activeConfig.title}
                description={activeConfig.description}
                icon={activeConfig.icon}
                placeholder={activeConfig.placeholder}
                endpoint={activeConfig.endpoint}
                inputType={activeConfig.inputType}
              />
            )}
          </div>
        </div>

        <footer className="mt-20 text-center text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div className="text-sm">
              <span className="font-medium text-cyber-primary">{t('real.time.analysis')}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-cyber-secondary">{t('advanced.detection')}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-cyber-accent">{t('secure.processing')}</span>
            </div>
          </div>
          <p className="text-sm">
            {t('powered.by')}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
