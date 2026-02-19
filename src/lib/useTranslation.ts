/**
 * Translation hook for easy access to translations
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { t, type Translations } from "./translations";

export function useTranslation() {
  const { language } = useLanguage();
  
  return {
    t: (key: keyof Translations) => t(key, language),
    language,
  };
}
