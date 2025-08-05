import { Shield, AlertTriangle, CheckCircle, Globe, Clock, Eye } from "lucide-react";

interface VirusTotalResult {
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
}

interface VirusTotalResultsProps {
  result: VirusTotalResult;
}

const VirusTotalResults = ({ result }: VirusTotalResultsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-cyber-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-cyber-warning" />;
      case 'danger':
        return <Shield className="h-5 w-5 text-cyber-danger" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'text-cyber-success border-cyber-success/30 bg-cyber-success/5';
      case 'warning':
        return 'text-cyber-warning border-cyber-warning/30 bg-cyber-warning/5';
      case 'danger':
        return 'text-cyber-danger border-cyber-danger/30 bg-cyber-danger/5';
      default:
        return '';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'harmless':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'malicious':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'suspicious':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'undetected':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'harmless':
        return <CheckCircle className="h-3 w-3" />;
      case 'malicious':
        return <Shield className="h-3 w-3" />;
      case 'suspicious':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${getStatusColor(result.status)} space-y-6 backdrop-blur-sm`}>
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-background/40 to-background/20 border border-border/50">
        <div className="flex items-center gap-4">
          {getStatusIcon(result.status)}
          <div>
            <span className="font-bold text-xl capitalize">{result.status}</span>
            <p className="text-sm opacity-75 mt-1">{result.details}</p>
          </div>
        </div>
        {result.score !== undefined && (
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {result.score}%
            </div>
            <div className="text-xs opacity-75 font-medium">Safety Score</div>
          </div>
        )}
      </div>

      {/* URL Section */}
      {result.url && (
        <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-sm font-semibold text-primary">Analyzed URL</p>
          </div>
          <p className="text-sm font-mono break-all px-3 py-2 rounded bg-background/50 border border-border/30">
            {result.url}
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      {result.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(result.stats).map(([key, value]) => (
            <div 
              key={key}
              className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${getCategoryColor(key)} backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium uppercase tracking-wide opacity-80">{key}</span>
                {getCategoryIcon(key)}
              </div>
              <div className="text-xl font-bold">{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Threats Alert */}
      {result.threats && result.threats.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50/80 to-red-100/60 dark:from-red-950/40 dark:to-red-900/20 border-2 border-red-200/70 dark:border-red-800/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-bold text-red-800 dark:text-red-200">Detected Threats</h3>
            <span className="px-2 py-1 rounded-full bg-red-200/70 dark:bg-red-800/50 text-xs font-bold text-red-800 dark:text-red-200">
              {result.threats.length}
            </span>
          </div>
          <div className="space-y-2">
            {result.threats.slice(0, 5).map((threat, index) => (
              <div key={index} className="p-3 rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{threat}</p>
              </div>
            ))}
            {result.threats.length > 5 && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                +{result.threats.length - 5} more threats detected
              </p>
            )}
          </div>
        </div>
      )}

      {/* Analysis Info */}
      {(result.lastAnalysis || result.analysisId) && (
        <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/30 to-secondary/20 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold text-primary">Analysis Information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {result.analysisId && (
              <div>
                <span className="opacity-70">Analysis ID:</span>
                <p className="font-mono text-xs mt-1 break-all">{result.analysisId}</p>
              </div>
            )}
            {result.lastAnalysis && (
              <div>
                <span className="opacity-70">Last Analysis:</span>
                <p className="font-medium mt-1">{new Date(result.lastAnalysis).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Engine Results */}
      {result.engines && result.engines.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-primary">Engine Results ({result.engines.length})</h3>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {result.engines.map((engine, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/40 hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getCategoryIcon(engine.category)}
                  <span className="font-medium">{engine.engine}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(engine.category)}`}>
                    {engine.category}
                  </span>
                  {engine.result !== 'clean' && engine.result !== 'undetected' && (
                    <span className="text-xs opacity-70 max-w-[100px] truncate">{engine.result}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VirusTotalResults;