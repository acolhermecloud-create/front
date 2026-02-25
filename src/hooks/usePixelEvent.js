export default function usePixelEvent() {
    return (eventName, params = {}, eventOptions = {}) => {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, params, eventOptions);
      }
    };
  }
  