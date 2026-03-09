import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../constants/translations";

type Language = "en" | "hi";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLang] = useState<Language>("en");

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem("language");
      if (saved === "en" || saved === "hi") {
        setLang(saved);
      }
    } catch (err) {
      console.log("Language load error:", err);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      setLang(lang);
      await AsyncStorage.setItem("language", lang);
    } catch (err) {
      console.log("Language save error:", err);
    }
  };

  const t = (key: keyof typeof translations.en): string => {
    const value = translations?.[language]?.[key];
    return typeof value === "string" ? value : String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};