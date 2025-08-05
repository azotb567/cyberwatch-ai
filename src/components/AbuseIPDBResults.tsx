import { Shield, AlertTriangle, CheckCircle, Globe, MapPin, Server, Clock, Flag, Users, Calendar, Eye } from "lucide-react";

interface AbuseIPDBData {
  ipAddress: string;
  isPublic: boolean;
  ipVersion: number;
  isWhitelisted: boolean;
  abuseConfidenceScore: number;
  countryCode: string;
  usageType: string;
  isp: string;
  domain: string;
  hostnames: string[];
  isTor: boolean;
  totalReports: number;
  numDistinctUsers: number;
  lastReportedAt: string;
}

interface AbuseIPDBResult {
  data: AbuseIPDBData;
}

interface AbuseIPDBResultsProps {
  result: AbuseIPDBResult;
}

const AbuseIPDBResults = ({ result }: AbuseIPDBResultsProps) => {
  const { data } = result;
  
  // Validate data structure
  if (!data || typeof data !== 'object') {
    return (
      <div className="rounded-xl border-2 p-6 border-cyber-danger/30 bg-cyber-danger/10 dark:border-cyber-danger/20 dark:bg-cyber-danger/5">
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-6 w-6 text-cyber-danger" />
          <div>
            <h2 className="text-2xl font-bold text-cyber-danger">Invalid Data</h2>
            <p className="text-sm opacity-75 mt-1">The IP scan returned invalid data structure</p>
          </div>
        </div>
      </div>
    );
  }
  
  const getStatusInfo = (abuseScore: number) => {
    if (abuseScore <= 20) {
      return {
        status: 'Clean',
        icon: <CheckCircle className="h-6 w-6" />,
        color: 'border-cyber-success/30 bg-cyber-success/10 dark:border-cyber-success/20 dark:bg-cyber-success/5',
        textColor: 'text-cyber-success',
        badgeColor: 'bg-cyber-success/20 text-cyber-success dark:bg-cyber-success/10 dark:text-cyber-success',
        iconColor: 'text-cyber-success',
        confidenceColor: 'bg-cyber-success'
      };
    } else if (abuseScore <= 60) {
      return {
        status: 'Suspicious',
        icon: <AlertTriangle className="h-6 w-6" />,
        color: 'border-cyber-warning/30 bg-cyber-warning/10 dark:border-cyber-warning/20 dark:bg-cyber-warning/5',
        textColor: 'text-cyber-warning',
        badgeColor: 'bg-cyber-warning/20 text-cyber-warning dark:bg-cyber-warning/10 dark:text-cyber-warning',
        iconColor: 'text-cyber-warning',
        confidenceColor: 'bg-cyber-warning'
      };
    } else {
      return {
        status: 'Malicious',
        icon: <Shield className="h-6 w-6" />,
        color: 'border-cyber-danger/30 bg-cyber-danger/10 dark:border-cyber-danger/20 dark:bg-cyber-danger/5',
        textColor: 'text-cyber-danger',
        badgeColor: 'bg-cyber-danger/20 text-cyber-danger dark:bg-cyber-danger/10 dark:text-cyber-danger',
        iconColor: 'text-cyber-danger',
        confidenceColor: 'bg-cyber-danger'
      };
    }
  };

  const statusInfo = getStatusInfo(data.abuseConfidenceScore);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getDisplayValue = (value: any, type: 'string' | 'number' | 'boolean' = 'string') => {
    if (value === null || value === undefined || value === '') return 'N/A';
    
    if (type === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (type === 'number') {
      return isNaN(value) ? 'N/A' : value.toString();
    }
    
    return value.toString();
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${statusInfo.color} space-y-6 backdrop-blur-sm bg-gradient-to-br from-card/80 to-card/60 border-border/50`}>
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-background/70 dark:bg-background/50 ${statusInfo.iconColor} backdrop-blur-sm`}>
            {statusInfo.icon}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${statusInfo.textColor}`}>
              {statusInfo.status}
            </h2>
            <p className="text-sm opacity-75 mt-1 text-muted-foreground">
              AbuseIPDB Analysis Report
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full ${statusInfo.confidenceColor} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {data.abuseConfidenceScore}%
          </div>
          <div className="text-xs mt-1 font-medium text-muted-foreground">Confidence</div>
        </div>
      </div>

      {/* IP Address Section */}
      <div className="bg-background/60 dark:bg-background/30 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-cyber-primary/20 dark:bg-cyber-primary/10">
              <Globe className="h-5 w-5 text-cyber-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-cyber-primary uppercase tracking-wider">
                IP Address
              </p>
              <p className="text-3xl font-mono font-bold text-foreground">
                {getDisplayValue(data.ipAddress)}
              </p>
            </div>
          </div>
          {data.isWhitelisted && (
            <div className="bg-cyber-success/20 dark:bg-cyber-success/10 text-cyber-success px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
              ✓ Whitelisted
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border border-border/30">
            <div className="text-2xl font-bold text-foreground">
              {getDisplayValue(data.totalReports, 'number')}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Reports
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border border-border/30">
            <div className="text-2xl font-bold text-foreground">
              {getDisplayValue(data.numDistinctUsers, 'number')}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Users
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border border-border/30">
            <div className="text-2xl font-bold text-foreground">
              IPv{getDisplayValue(data.ipVersion, 'number')}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Version
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location & Network */}
        <div className="bg-background/60 dark:bg-background/30 rounded-xl p-5 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-cyber-primary" />
            <h3 className="font-bold text-foreground">Location & Network</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Country:</span>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {getDisplayValue(data.countryCode)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ISP:</span>
              <span className="font-semibold text-foreground text-right max-w-[200px] truncate">
                {getDisplayValue(data.isp)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Usage:</span>
              <span className="font-semibold text-foreground">
                {getDisplayValue(data.usageType)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Domain:</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {getDisplayValue(data.domain)}
              </span>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-background/60 dark:bg-background/30 rounded-xl p-5 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-cyber-accent" />
            <h3 className="font-bold text-foreground">Security Information</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Public IP:</span>
              <span className={`font-semibold ${
                data.isPublic 
                  ? 'text-cyber-warning' 
                  : 'text-cyber-success'
              }`}>
                {getDisplayValue(data.isPublic, 'boolean')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">TOR Exit:</span>
              <span className={`font-semibold ${
                data.isTor 
                  ? 'text-cyber-danger' 
                  : 'text-cyber-success'
              }`}>
                {getDisplayValue(data.isTor, 'boolean')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Reports:</span>
              <span className={`font-semibold ${
                data.totalReports > 0 
                  ? 'text-cyber-danger' 
                  : 'text-cyber-success'
              }`}>
                {getDisplayValue(data.totalReports, 'number')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Report:</span>
              <span className="font-semibold text-foreground text-sm">
                {formatDate(data.lastReportedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hostnames */}
      {data.hostnames && data.hostnames.length > 0 && (
        <div className="bg-background/60 dark:bg-background/30 rounded-xl p-5 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5 text-cyber-success" />
            <h3 className="font-bold text-foreground">Associated Hostnames</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.hostnames.map((hostname, index) => (
              <span 
                key={index}
                className="px-3 py-1 rounded-full bg-cyber-success/20 dark:bg-cyber-success/10 text-cyber-success text-sm font-medium border border-cyber-success/30 dark:border-cyber-success/20 backdrop-blur-sm"
              >
                {hostname}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AbuseIPDBResults;