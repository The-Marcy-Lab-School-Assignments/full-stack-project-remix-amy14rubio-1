// utils/getProvider.js

export const getProvider = (url) => {
  try {
    const hostname = new URL(url).hostname;

    if (hostname.includes('musescore')) {
      return 'musescore';
    }

    if (hostname.includes('imslp')) {
      return 'imslp';
    }

    if (hostname.includes('youtube')) {
      return 'youtube';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
};
