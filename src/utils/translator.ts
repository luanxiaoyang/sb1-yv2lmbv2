import LanguageDetect from 'languagedetect';

const lngDetector = new LanguageDetect();

const LANGUAGES: Record<string, string> = {
  english: '英语',
  chinese: '中文',
  spanish: '西班牙语',
  french: '法语',
  german: '德语',
  japanese: '日语',
  korean: '韩语',
  russian: '俄语',
};

export const detectLanguage = (text: string): string => {
  const results = lngDetector.detect(text);
  if (results && results.length > 0) {
    const [lang] = results[0];
    return LANGUAGES[lang.toLowerCase()] || '未知语言';
  }
  return '未知语言';
};

export const translateToZh = async (text: string): Promise<string> => {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|zh`);
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};