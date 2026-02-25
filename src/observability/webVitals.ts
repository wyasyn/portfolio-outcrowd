type WebVitalMetric = {
  name: string;
  value: number;
  unit?: string;
};

function reportMetric(metric: WebVitalMetric) {
  if (import.meta.env.DEV) {
    console.info(`[web-vitals] ${metric.name}: ${metric.value}${metric.unit ?? ''}`);
  }
}

export function observeWebVitals() {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return;
  }

  try {
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          reportMetric({ name: 'FCP', value: entry.startTime, unit: 'ms' });
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });

    let lcp = 0;
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.visibilityState === 'hidden' && lcp > 0) {
          reportMetric({ name: 'LCP', value: lcp, unit: 'ms' });
        }
      },
      { once: true },
    );

    let cls = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!shift.hadRecentInput && typeof shift.value === 'number') {
          cls += shift.value;
        }
      }
      reportMetric({ name: 'CLS', value: Number(cls.toFixed(4)) });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Keep observability non-blocking in unsupported browsers.
  }
}
