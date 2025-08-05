import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { sanitizeInput, validateUrl, validateIpAddress } from "@/utils/security";
import VirusTotalResults from "./VirusTotalResults";
import AbuseIPDBResults from "./AbuseIPDBResults";

interface ScanResult {
  status: 'safe' | 'warning' | 'danger';
  score?: number;
  details?: string;
  threats?: string[];
  url?: string;
  lastAnalysis?: string;
  stats?: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
  };
  engines?: Array<{
    engine: string;
    category: string;
    result: string;
    method?: string;
  }>;
  analysisId?: string;
  analysisDate?: number;
  // IP scan specific fields
  ipAddress?: string;
  isPublic?: boolean;
  ipVersion?: number;
  isWhitelisted?: boolean;
  abuseConfidenceScore?: number;
  countryCode?: string;
  usageType?: string;
  isp?: string;
  domain?: string;
  hostnames?: string[];
  isTor?: boolean;
  totalReports?: number;
  numDistinctUsers?: number;
  lastReportedAt?: string;
}

interface ScannerCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  placeholder: string;
  endpoint: string;
  inputType?: string;
}

const ScannerCard = ({ title, description, icon, placeholder, endpoint, inputType = "text" }: ScannerCardProps) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Determine scan type from endpoint
  const isIPScan = endpoint.includes('check-ip');
  const isURLScan = endpoint.includes('check-url');

  const handleScan = async () => {
    // Input validation and sanitization
    const sanitizedInput = sanitizeInput(input);
    
    if (!sanitizedInput) {
      toast({
        title: "Input Required",
        description: "Please enter a value to scan",
        variant: "destructive",
      });
      return;
    }

    // Additional validation based on scan type
    if (isURLScan) {
      if (!validateUrl(sanitizedInput)) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid, public URL",
          variant: "destructive",
        });
        return;
      }
    }

    if (isIPScan) {
      if (!validateIpAddress(sanitizedInput)) {
        toast({
          title: "Invalid IP Address",
          description: "Please enter a valid, public IP address",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    setResult(null);

    try {
      // Security: Use AbortController for request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: sanitizedInput }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        
        // Try to parse error message
        let errorMessage = `Scan failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.hint) {
            errorMessage += ` - ${errorData.hint}`;
          }
        } catch (e) {
          // If parsing fails, use the raw error text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Secure data parsing with validation
      let apiResult = Array.isArray(data) ? data[0] : data;
      
      // Handle nested data structure for IP scans
      if (isIPScan && apiResult && apiResult.data) {
        apiResult = apiResult.data;
      }
      
      if (!apiResult || typeof apiResult !== 'object') {
        throw new Error('Invalid response format');
      }

      let scanResult: ScanResult;

      if (isIPScan) {
        // Parse AbuseIPDB IP scan result
        
        // Check if we have valid data
        if (!apiResult || Object.keys(apiResult).length === 0) {
          throw new Error('No data received from IP scan API. Please check if the webhook is active.');
        }
        
        const abuseScore = apiResult.abuseConfidenceScore || 0;
        const status = abuseScore === 0 ? 'safe' : abuseScore < 50 ? 'warning' : 'danger';
        
        scanResult = {
          status,
          score: 100 - abuseScore, // Invert abuse score to safety score
          details: `IP Analysis Complete - Abuse Confidence: ${abuseScore}%`,
          threats: abuseScore > 0 ? [`High abuse confidence score: ${abuseScore}%`] : [],
          ipAddress: apiResult.ipAddress || sanitizedInput,
          isPublic: apiResult.isPublic,
          ipVersion: apiResult.ipVersion,
          isWhitelisted: apiResult.isWhitelisted,
          abuseConfidenceScore: abuseScore,
          countryCode: apiResult.countryCode,
          usageType: apiResult.usageType,
          isp: apiResult.isp,
          domain: apiResult.domain,
          hostnames: apiResult.hostnames || [],
          isTor: apiResult.isTor,
          totalReports: apiResult.totalReports,
          numDistinctUsers: apiResult.numDistinctUsers,
          lastReportedAt: apiResult.lastReportedAt,
          lastAnalysis: apiResult.lastReportedAt
        };
      } else if (isURLScan) {
        // Parse VirusTotal response structure
        const vtData = apiResult.data || apiResult;
        const vtAttrs = vtData.attributes || {};
        const vtStats = vtAttrs.stats || {};
        const vtResults = vtAttrs.results || {};
        const urlInfo = apiResult.meta?.url_info || {};

        // Convert results to engines array
        const engines = Object.entries(vtResults).map(([engineName, engineData]: [string, any]) => ({
          engine: engineName,
          category: engineData.category || 'unknown',
          result: engineData.result || 'unknown',
          method: engineData.method || 'unknown'
        }));

        const totalEngines = vtStats.harmless + vtStats.malicious + vtStats.suspicious + vtStats.undetected;
        const safetyScore = totalEngines > 0 ? Math.round((vtStats.harmless / totalEngines) * 100) : 0;

        scanResult = {
          status: (vtStats.malicious > 0) ? 'danger' : 
                  (vtStats.suspicious > 0) ? 'warning' : 'safe',
          score: safetyScore,
          details: `Analysis ${vtAttrs.status || 'completed'} - ${engines.length} engines checked`,
          threats: engines
            .filter((engine: any) => engine.category === 'malicious' || engine.category === 'suspicious')
            .map((engine: any) => `${engine.engine}: ${engine.result}`),
          url: urlInfo.url || vtData.url || '',
          lastAnalysis: vtAttrs.date ? new Date(vtAttrs.date * 1000).toISOString() : undefined,
          stats: {
            harmless: Number(vtStats.harmless) || 0,
            malicious: Number(vtStats.malicious) || 0,
            suspicious: Number(vtStats.suspicious) || 0,
            undetected: Number(vtStats.undetected) || 0
          },
          engines: engines,
          analysisId: vtData.id || '',
          analysisDate: vtAttrs.date || 0
        };
      } else {
        throw new Error('Unknown scan type');
      }
      
      setResult(scanResult);
      
      toast({
        title: "Scan Complete",
        description: `${title} scan finished`,
      });
    } catch (error) {
      let errorMessage = "Unable to complete the scan. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Scan timeout. Please try again.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Scan Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="scan-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <CardTitle className="text-xl gradient-text">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type={inputType}
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-secondary/50 border-border focus:border-cyber-primary/50"
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleScan()}
          />
          <Button
            onClick={handleScan}
            disabled={loading}
            variant="cyber"
            className="px-6"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t('scan.now')
            )}
          </Button>
        </div>

        {result && (
          <>
            {isIPScan && <AbuseIPDBResults result={{ data: result as any }} />}
            {isURLScan && <VirusTotalResults result={result} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScannerCard;