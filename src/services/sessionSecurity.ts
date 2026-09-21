
interface SessionConfig {
  maxInactiveTime: number; // 30 minutes in milliseconds
  warningTime: number; // 5 minutes in milliseconds
  checkInterval: number; // 1 minute in milliseconds
}

class SessionSecurityService {
  private config: SessionConfig = {
    maxInactiveTime: 30 * 60 * 1000, // 30 minutes
    warningTime: 25 * 60 * 1000, // 25 minutes (warn 5 min before timeout)
    checkInterval: 60 * 1000 // 1 minute
  };

  private lastActivity: number = Date.now();
  private warningShown: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private listeners: Array<() => void> = [];

  public startSessionMonitoring(): void {
    this.resetSession();
    this.setupActivityListeners();
    this.startInactivityCheck();
  }

  public stopSessionMonitoring(): void {
    this.removeActivityListeners();
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  public resetSession(): void {
    this.lastActivity = Date.now();
    this.warningShown = false;
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      this.resetSession();
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Store reference for cleanup
    this.listeners.push(() => {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
    });
  }

  private removeActivityListeners(): void {
    this.listeners.forEach(cleanup => cleanup());
    this.listeners = [];
  }

  private startInactivityCheck(): void {
    this.checkInterval = setInterval(() => {
      const inactiveTime = Date.now() - this.lastActivity;

      if (inactiveTime >= this.config.maxInactiveTime) {
        this.handleSessionTimeout();
      } else if (inactiveTime >= this.config.warningTime && !this.warningShown) {
        this.showInactivityWarning();
      }
    }, this.config.checkInterval);
  }

  private showInactivityWarning(): void {
    this.warningShown = true;
    
    // Show a toast warning about session timeout
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      const event = new CustomEvent('session-warning', {
        detail: {
          message: 'Your session will expire in 5 minutes due to inactivity',
          remainingTime: this.config.maxInactiveTime - (Date.now() - this.lastActivity)
        }
      });
      window.dispatchEvent(event);
    }
  }

  private handleSessionTimeout(): void {
    this.stopSessionMonitoring();
    
    // Dispatch session timeout event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      const event = new CustomEvent('session-timeout', {
        detail: {
          message: 'Your session has expired due to inactivity',
          reason: 'inactivity'
        }
      });
      window.dispatchEvent(event);
    }

    // Force logout - redirect to auth page
    setTimeout(() => {
      window.location.href = '/auth';
    }, 100);
  }

  public getSessionInfo(): { lastActivity: number; isActive: boolean; timeRemaining: number } {
    const inactiveTime = Date.now() - this.lastActivity;
    const timeRemaining = Math.max(0, this.config.maxInactiveTime - inactiveTime);
    
    return {
      lastActivity: this.lastActivity,
      isActive: inactiveTime < this.config.maxInactiveTime,
      timeRemaining
    };
  }
}

export const sessionSecurity = new SessionSecurityService();
