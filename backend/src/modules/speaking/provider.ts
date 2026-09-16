import { env } from '../../config/env.js';

export interface SpeakingScore {
  transcript: string;
  fluency: number;
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  overall: number;
  feedback: string;
  provider: string;
}

export interface ISpeechProvider {
  score(audio: Buffer, opts: { promptText: string; durationSeconds: number }): Promise<SpeakingScore>;
}

class MockProvider implements ISpeechProvider {
  async score(_audio: Buffer, { promptText, durationSeconds }: { promptText: string; durationSeconds: number }): Promise<SpeakingScore> {
    const seed = promptText.length + durationSeconds;
    const r = (n: number) => 5 + ((seed * n) % 5);
    const fluency = r(3);
    const pronunciation = r(5);
    const grammar = r(7);
    const vocabulary = r(11);
    const overall = Math.round(((fluency + pronunciation + grammar + vocabulary) / 4) * 10) / 10;
    return {
      transcript: `[mock transcript of ${durationSeconds}s response]`,
      fluency, pronunciation, grammar, vocabulary, overall,
      feedback: 'Solid attempt. Focus on reducing filler words and linking ideas with discourse markers.',
      provider: 'mock',
    };
  }
}

class AzureProvider implements ISpeechProvider {
  async score(): Promise<SpeakingScore> {
    if (!process.env.AZURE_SPEECH_KEY) throw new Error('AZURE_SPEECH_KEY not set');
    throw new Error('Azure provider not implemented — set SPEECH_PROVIDER=mock for now');
  }
}

export function getSpeechProvider(): ISpeechProvider {
  switch (env.speechProvider) {
    case 'azure': return new AzureProvider();
    default:      return new MockProvider();
  }
}
