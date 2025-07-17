interface LogLevel {
  DEBUG: 0
  INFO: 1
  WARN: 2
  ERROR: 3
  FATAL: 4
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
}

interface LogEntry {
  timestamp: string
  level: keyof LogLevel
  message: string
  service: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
  error?: {
    name: string
    message: string
    stack?: string
  }
}

interface LoggerConfig {
  level: keyof LogLevel
  service: string
  enableConsole: boolean
  enableFile: boolean
  enableRemote: boolean
  remoteEndpoint?: string
  filePath?: string
}

class Logger {
  private config: LoggerConfig
  private logQueue: LogEntry[] = []
  private isProcessing = false

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: (process.env.LOG_LEVEL as keyof LogLevel) || 'INFO',
      service: process.env.NEXT_PUBLIC_APP_NAME || 'SIMRYO',
      enableConsole: process.env.NODE_ENV === 'development',
      enableFile: process.env.NODE_ENV === 'production',
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.LOG_ENDPOINT,
      filePath: './logs/app.log',
      ...config
    }

    // Process log queue periodically
    if (typeof window === 'undefined') { // Server-side only
      setInterval(() => this.processLogQueue(), 5000)
    }
  }

  private shouldLog(level: keyof LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level]
  }

  private createLogEntry(
    level: keyof LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.config.service,
      context,
      requestId: this.generateRequestId(),
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  private formatConsoleOutput(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString()
    const context = entry.context ? JSON.stringify(entry.context) : ''
    const error = entry.error ? `\n${entry.error.stack}` : ''
    
    return `[${timestamp}] ${entry.level}: ${entry.message} ${context}${error}`
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    if (typeof window !== 'undefined') return // Client-side skip

    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      const logLine = JSON.stringify(entry) + '\n'
      const logDir = path.dirname(this.config.filePath!)
      
      // Ensure log directory exists
      await fs.mkdir(logDir, { recursive: true })
      
      // Append to log file
      await fs.appendFile(this.config.filePath!, logLine)
    } catch (error) {
      console.error('Failed to write to log file:', error)
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint) return

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LOG_API_KEY || ''}`
        },
        body: JSON.stringify(entry)
      })
    } catch (error) {
      console.error('Failed to send log to remote endpoint:', error)
    }
  }

  private async processLogQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) return

    this.isProcessing = true
    const batch = this.logQueue.splice(0, 10) // Process 10 at a time

    for (const entry of batch) {
      try {
        if (this.config.enableFile) {
          await this.writeToFile(entry)
        }
        
        if (this.config.enableRemote) {
          await this.sendToRemote(entry)
        }
      } catch (error) {
        console.error('Error processing log entry:', error)
      }
    }

    this.isProcessing = false
  }

  private log(
    level: keyof LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return

    const entry = this.createLogEntry(level, message, context, error)

    // Console output
    if (this.config.enableConsole) {
      const output = this.formatConsoleOutput(entry)
      
      switch (level) {
        case 'DEBUG':
          console.debug(output)
          break
        case 'INFO':
          console.info(output)
          break
        case 'WARN':
          console.warn(output)
          break
        case 'ERROR':
        case 'FATAL':
          console.error(output)
          break
      }
    }

    // Queue for file/remote logging
    if (this.config.enableFile || this.config.enableRemote) {
      this.logQueue.push(entry)
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('DEBUG', message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('INFO', message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('WARN', message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('ERROR', message, context, error)
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('FATAL', message, context, error)
  }

  // Specific business event loggers
  logApiRequest(method: string, path: string, duration: number, status: number, userId?: string): void {
    this.info('API Request', {
      method,
      path,
      duration,
      status,
      userId,
      type: 'api_request'
    })
  }

  logUserAction(action: string, userId: string, details?: Record<string, any>): void {
    this.info('User Action', {
      action,
      userId,
      ...details,
      type: 'user_action'
    })
  }

  logPaymentEvent(event: string, amount: number, currency: string, userId?: string, orderId?: string): void {
    this.info('Payment Event', {
      event,
      amount,
      currency,
      userId,
      orderId,
      type: 'payment'
    })
  }

  logESIMActivation(planId: string, country: string, userId?: string, providerId?: string): void {
    this.info('eSIM Activation', {
      planId,
      country,
      userId,
      providerId,
      type: 'esim_activation'
    })
  }

  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>): void {
    const level = severity === 'critical' ? 'FATAL' : severity === 'high' ? 'ERROR' : 'WARN'
    this.log(level, `Security Event: ${event}`, {
      ...details,
      severity,
      type: 'security'
    })
  }
}

// Performance monitoring
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  startTimer(): () => number {
    const start = performance.now()
    return () => performance.now() - start
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  getMetrics(name: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return null

    const sum = values.reduce((a, b) => a + b, 0)
    return {
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    }
  }

  getAllMetrics(): Record<string, ReturnType<typeof this.getMetrics>> {
    const result: Record<string, any> = {}
    for (const [name] of this.metrics) {
      result[name] = this.getMetrics(name)
    }
    return result
  }
}

// Create singleton instances
export const logger = new Logger()
export const performanceMonitor = new PerformanceMonitor()

// Utility functions
export function logApiCall(
  handler: (...args: any[]) => Promise<any>
): (...args: any[]) => Promise<any> {
  return async (...args: any[]) => {
    const timer = performanceMonitor.startTimer()
    const startTime = Date.now()
    
    try {
      const result = await handler(...args)
      const duration = timer()
      
      performanceMonitor.recordMetric('api_call_duration', duration)
      logger.logApiRequest('UNKNOWN', 'UNKNOWN', duration, 200)
      
      return result
    } catch (error) {
      const duration = timer()
      logger.error('API call failed', error as Error, { duration })
      throw error
    }
  }
}

export function createRequestLogger(req: any, res: any, next: any) {
  const timer = performanceMonitor.startTimer()
  const requestId = logger['generateRequestId']()
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId)
  
  res.on('finish', () => {
    const duration = timer()
    logger.logApiRequest(req.method, req.path, duration, res.statusCode)
    performanceMonitor.recordMetric('request_duration', duration)
  })
  
  next()
}

// Health check endpoint data
export function getHealthMetrics() {
  return {
    timestamp: new Date().toISOString(),
    service: process.env.NEXT_PUBLIC_APP_NAME || 'SIMRYO',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    performance: performanceMonitor.getAllMetrics()
  }
} 