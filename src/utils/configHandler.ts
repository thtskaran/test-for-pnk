// src/utils/configHandler.ts
import { useEffect, useState } from 'react';

interface ImageConfig {
  path: string;
  resolution: {
    width: number;
    height: number;
  };
}

interface Track {
  id: number;
  title: string;
  caption: string;
  musicPath: string;
  startTime?: number;
  endTime?: number;
}

interface Config {
  landing: {
    welcome: string;
    title: string;
    subtitle: string;
    lastLine: string;
    button: string;
    footer: string;
    images: {
      background: ImageConfig;
      buttonIcon: ImageConfig;
    };
  };
  letter: {
    headerTitle: string;
    headerSubtitle: string;
    letterHeaderTitle: string;
    letterMessage: string;
    letterSignature: string;
    envelopeClickHint: string;
    specialDeliveryText: string;
    continueButton: string;
    images: {
      envelope: ImageConfig;
      letterBackground: ImageConfig;
      headerDecoration: ImageConfig;
    };
  };
  chillZone: {
    heading: string;
    subheading: string;
    chooseTrackHint: string;
    continueButton: string;
    tracks: Track[];
    images: {
      background: ImageConfig;
      musicPlayerIcon: ImageConfig;
    };
  };
  cards: {
    heading: string;
    subheading: string;
    instruction: string;
    continueButton: string;
    card1Front: string;
    card1BackTitle: string;
    card1BackText: string;
    card1BackEmoji: string;
    card2Front: string;
    card2BackTitle: string;
    card2BackText: string;
    card3Front: string;
    card3BackTitle: string;
    card3BackText: string;
    card3BackStamp: string;
    card4Front: string;
    card4BackQuote: string;
    card4BackText: string;
    images: {
      cardBackground: ImageConfig;
      card1Image: ImageConfig;
      card2Image: ImageConfig;
      card3Image: ImageConfig;
      card4Image: ImageConfig;
    };
  };
  finalLetter: {
    title: string;
    sealingText: string;
    sealButton: string;
    restartButton: string;
    sealedTitle: string;
    sealedSubtitle: string;
    typedDefault: string;
    experienceAgain: string;
    sendKissButton: string;
    dateLocale: string;
    letterGreeting: string;
    letterParagraphs: string[];
    sealingNote: string;
    images: {
      seal: ImageConfig;
      finalLetterBackground: ImageConfig;
      kissIcon: ImageConfig;
    };
  };
  common: {
    continue: string;
    close: string;
    ok: string;
  };
}

let cachedConfig: Config | null = null;

/**
 * Load and cache the configuration from config.json
 */
export async function loadConfig(): Promise<Config> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    const config: Config = await response.json();
    cachedConfig = config;
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    throw error;
  }
}

/**
 * Get the full asset path (prepends /public/ if needed)
 */
export function getAssetPath(relativePath: string): string {
  // If path already starts with /, return as is
  if (relativePath.startsWith('/')) {
    return relativePath;
  }
  // Otherwise prepend /
  return `/${relativePath}`;
}

/**
 * Helper to get image src with proper path
 */
export function getImageSrc(imageConfig: ImageConfig): string {
  return getAssetPath(imageConfig.path);
}

/**
 * Helper to get music src with proper path
 */
export function getMusicSrc(musicPath: string): string {
  return getAssetPath(musicPath);
}

/**
 * React hook to use config
 */
export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadConfig()
      .then(setConfig)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}

export type { Config, Track, ImageConfig };
