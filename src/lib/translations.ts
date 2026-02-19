/**
 * Centralized translation dictionary for KisanMitra AI
 * Supports English (en) and Hindi (hi)
 */

export type Language = "en" | "hi";

export interface Translations {
  // Common UI
  eligible: string;
  notEligible: string;
  topPick: string;
  benefitAmount: string;
  matchScore: string;
  requiredDocuments: string;
  whyEligible: string;
  whyNotEligible: string;
  expandDetails: string;
  collapseDetails: string;
  
  // Summary Banner
  schemesAvailable: string;
  schemeAvailable: string;
  totalPotentialBenefit: string;
  topRecommendations: string;
  topRecommendation: string;
  
  // Sections
  eligibleSchemes: string;
  notEligibleSection: string;
  
  // Buttons & Actions
  next: string;
  send: string;
  startOver: string;
  stop: string;
  voiceInput: string;
  
  // Placeholders
  typeAnswer: string;
  askOrStartOver: string;
  example: string;
  
  // Messages
  thanksFetching: string;
  checkingSchemes: string;
  getRecommendations: string;
  couldNotFetch: string;
  somethingWentWrong: string;
  
  // Profile Questions
  landSizeQuestion: string;
  cropTypeQuestion: string;
  annualIncomeQuestion: string;
  irrigationQuestion: string;
  stateQuestion: string;
  
  // Language toggle hint
  languageToggleHint: string;
  
  // Hero subtitle
  heroSubtitle: string;

  // Landing page
  landingProblemTitle: string;
  landingProblemText: string;
  landingCta: string;
  landingTrustTitle: string;
  landingTrust1: string;
  landingTrust2: string;
  landingTrust3: string;
  landingHowTitle: string;
  landingHow1Title: string;
  landingHow1Text: string;
  landingHow2Title: string;
  landingHow2Text: string;
  landingHow3Title: string;
  landingHow3Text: string;
  landingFeaturesTitle: string;
  landingFeature1Title: string;
  landingFeature1Text: string;
  landingFeature2Title: string;
  landingFeature2Text: string;
  landingFeature3Title: string;
  landingFeature3Text: string;
  landingFeature4Title: string;
  landingFeature4Text: string;
  
  // Documents
  documents: string;
  document: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    eligible: "Eligible",
    notEligible: "Not Eligible",
    topPick: "Top Pick",
    benefitAmount: "Benefit Amount",
    matchScore: "Match Score",
    requiredDocuments: "Required Documents",
    whyEligible: "Why eligible?",
    whyNotEligible: "Why not eligible?",
    expandDetails: "Expand",
    collapseDetails: "Collapse",
    
    schemesAvailable: "Schemes Available",
    schemeAvailable: "Scheme Available",
    totalPotentialBenefit: "Total Potential Benefit",
    topRecommendations: "Top Recommendations",
    topRecommendation: "Top Recommendation",
    
    eligibleSchemes: "Eligible Schemes",
    notEligibleSection: "Not Eligible",
    
    next: "Next",
    send: "Send",
    startOver: "Start Over",
    stop: "Stop",
    voiceInput: "Voice Input",
    
    typeAnswer: "Type your answer…",
    askOrStartOver: "Ask something or start over",
    example: "e.g.",
    
    thanksFetching: "Thanks! Fetching your scheme recommendations...",
    checkingSchemes: "Checking schemes…",
    getRecommendations: "Get my scheme recommendations.",
    couldNotFetch: "Could not fetch recommendations. Please try again.",
    somethingWentWrong: "Something went wrong.",
    
    landSizeQuestion: "What is your land size in hectares?",
    cropTypeQuestion: "Which crop do you mainly grow?",
    annualIncomeQuestion: "What is your approximate annual income in ₹?",
    irrigationQuestion: "Do you have irrigation facility? (yes/no)",
    stateQuestion: "Which state do you farm in?",
    
    languageToggleHint: "Use the language toggle above to get the explanation in हिंदी or English.",
    heroSubtitle: "Discover government schemes you are eligible for",

    landingProblemTitle: "Scheme discovery, made simple and explainable",
    landingProblemText:
      "Farmers often miss benefits due to confusing criteria and unclear paperwork. KisanMitra AI collects your profile, checks eligibility with deterministic rules, and explains results clearly in your language.",
    landingCta: "Start eligibility check",
    landingTrustTitle: "Government-ready by design",
    landingTrust1: "Rule-based eligibility (no AI decisions)",
    landingTrust2: "Clear reasons & required documents",
    landingTrust3: "Fast recommendations with top picks",
    landingHowTitle: "How it works",
    landingHow1Title: "Answer 5 quick questions",
    landingHow1Text: "Land size, crop, income, irrigation, and state.",
    landingHow2Title: "We run rule-based checks",
    landingHow2Text: "Deterministic conditions are evaluated per scheme.",
    landingHow3Title: "Get ranked results + explanation",
    landingHow3Text: "Top schemes by benefit and match score, explained simply.",
    landingFeaturesTitle: "Key features",
    landingFeature1Title: "Explainable eligibility",
    landingFeature1Text: "Matched and failed conditions shown per scheme.",
    landingFeature2Title: "Top 3 recommendations",
    landingFeature2Text: "Ranked by benefit amount and eligibility score.",
    landingFeature3Title: "Hindi + English",
    landingFeature3Text: "Full UI switching and AI explanation in selected language.",
    landingFeature4Title: "Document checklist",
    landingFeature4Text: "See required documents for each scheme in one place.",
    
    documents: "Documents",
    document: "Document",
  },
  hi: {
    eligible: "पात्र",
    notEligible: "अपात्र",
    topPick: "शीर्ष पसंद",
    benefitAmount: "लाभ राशि",
    matchScore: "मिलान स्कोर",
    requiredDocuments: "आवश्यक दस्तावेज",
    whyEligible: "क्यों पात्र हैं?",
    whyNotEligible: "क्यों अपात्र हैं?",
    expandDetails: "विस्तार करें",
    collapseDetails: "संक्षिप्त करें",
    
    schemesAvailable: "उपलब्ध योजनाएं",
    schemeAvailable: "उपलब्ध योजना",
    totalPotentialBenefit: "कुल संभावित लाभ",
    topRecommendations: "शीर्ष अनुशंसाएं",
    topRecommendation: "शीर्ष अनुशंसा",
    
    eligibleSchemes: "पात्र योजनाएं",
    notEligibleSection: "अपात्र",
    
    next: "अगला",
    send: "भेजें",
    startOver: "फिर से शुरू करें",
    stop: "रोकें",
    voiceInput: "आवाज इनपुट",
    
    typeAnswer: "अपना उत्तर टाइप करें…",
    askOrStartOver: "कुछ पूछें या फिर से शुरू करें",
    example: "उदा.",
    
    thanksFetching: "धन्यवाद! आपकी योजना सिफारिशें प्राप्त की जा रही हैं...",
    checkingSchemes: "योजनाएं जांची जा रही हैं…",
    getRecommendations: "मेरी योजना सिफारिशें प्राप्त करें।",
    couldNotFetch: "सिफारिशें प्राप्त नहीं कर सके। कृपया पुनः प्रयास करें।",
    somethingWentWrong: "कुछ गलत हुआ।",
    
    landSizeQuestion: "आपका जमीन का आकार हेक्टेयर में क्या है?",
    cropTypeQuestion: "आप मुख्य रूप से कौन सी फसल उगाते हैं?",
    annualIncomeQuestion: "₹ में आपकी अनुमानित वार्षिक आय क्या है?",
    irrigationQuestion: "क्या आपके पास सिंचाई सुविधा है? (हाँ/नहीं)",
    stateQuestion: "आप किस राज्य में खेती करते हैं?",
    
    languageToggleHint: "व्याख्या को हिंदी या अंग्रेजी में प्राप्त करने के लिए ऊपर दिए गए भाषा टॉगल का उपयोग करें।",
    heroSubtitle: "सरकारी योजनाएं खोजें जिनके लिए आप पात्र हैं",

    landingProblemTitle: "योजना खोज अब आसान और स्पष्ट",
    landingProblemText:
      "कई किसान जटिल पात्रता नियमों और अस्पष्ट दस्तावेज़ों के कारण लाभ से वंचित रह जाते हैं। KisanMitra AI आपकी जानकारी लेकर नियम-आधारित पात्रता जांच करता है और परिणाम आपकी भाषा में साफ़-साफ़ समझाता है।",
    landingCta: "पात्रता जांच शुरू करें",
    landingTrustTitle: "सरकारी उपयोग के लिए तैयार",
    landingTrust1: "नियम-आधारित पात्रता (AI निर्णय नहीं करता)",
    landingTrust2: "स्पष्ट कारण और आवश्यक दस्तावेज़",
    landingTrust3: "तेज़ सिफारिशें और शीर्ष योजनाएं",
    landingHowTitle: "यह कैसे काम करता है",
    landingHow1Title: "5 छोटे प्रश्नों के उत्तर दें",
    landingHow1Text: "जमीन, फसल, आय, सिंचाई और राज्य।",
    landingHow2Title: "हम नियम-आधारित जांच करते हैं",
    landingHow2Text: "हर योजना के लिए शर्तें निर्धारित तरीके से जांची जाती हैं।",
    landingHow3Title: "रैंक किए हुए परिणाम + व्याख्या",
    landingHow3Text: "लाभ और मिलान स्कोर के आधार पर शीर्ष योजनाएं, सरल भाषा में।",
    landingFeaturesTitle: "मुख्य विशेषताएं",
    landingFeature1Title: "समझने योग्य पात्रता",
    landingFeature1Text: "हर योजना में कौन-सी शर्तें मिलीं/नहीं मिलीं—स्पष्ट।",
    landingFeature2Title: "शीर्ष 3 अनुशंसाएं",
    landingFeature2Text: "लाभ राशि और पात्रता स्कोर के आधार पर रैंकिंग।",
    landingFeature3Title: "हिंदी + अंग्रेज़ी",
    landingFeature3Text: "पूरा UI और AI व्याख्या चुनी हुई भाषा में।",
    landingFeature4Title: "दस्तावेज़ सूची",
    landingFeature4Text: "हर योजना के लिए जरूरी दस्तावेज़ एक जगह।",
    
    documents: "दस्तावेज",
    document: "दस्तावेज",
  },
};

/**
 * Get translation for a key in the specified language
 */
export function t(key: keyof Translations, lang: Language): string {
  return translations[lang][key] || translations.en[key] || "";
}
