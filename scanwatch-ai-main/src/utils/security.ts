// Security utilities for input validation and sanitization

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input.trim()
    .replace(/[<>'"]/g, '') // Remove HTML/script injection chars
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .substring(0, 2048); // Limit length
};

export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Block localhost and private IPs
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname === 'localhost' || 
        hostname.startsWith('127.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const validateIpAddress = (ip: string): boolean => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  if (!ipRegex.test(ip)) {
    return false;
  }
  
  // Block private IP ranges
  const parts = ip.split('.').map(Number);
  
  // 127.x.x.x (localhost)
  if (parts[0] === 127) return false;
  
  // 10.x.x.x (private)
  if (parts[0] === 10) return false;
  
  // 192.168.x.x (private)
  if (parts[0] === 192 && parts[1] === 168) return false;
  
  // 172.16.x.x - 172.31.x.x (private)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
  
  return true;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed'
  ];
  
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 100): boolean => {
  const maxSize = maxSizeMB * 1024 * 1024;
  return file.size <= maxSize;
};