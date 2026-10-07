import { useVoiceStore } from '../store/useVoiceStore';
import type { SupportedLanguage } from '../types';

export const translations = {
  'en-US': {
    // Navbar
    navDashboard: 'Dashboard',
    navTemplates: 'Templates',
    navConversational: 'Conversational Mode',
    navMyForms: 'My Forms',
    navAdmin: 'Admin Builder',
    navUserView: 'User View',
    navAdminView: 'Admin',
    navSignIn: 'Sign In',
    navGetStarted: 'Get Started',
    navLogOut: 'Log Out',
    navProfile: 'Profile & Settings',

    // Dashboard
    dashWelcome: 'Welcome back',
    dashVoiceActive: 'AI Multilingual Voice Active',
    dashSubtitle: 'Fill your forms hands-free using natural speech in English, Hindi, or Hinglish. Your draft and completed submissions are synced below.',
    dashStartNew: 'Start New Form',
    dashVoiceWizard: 'Voice Wizard',
    dashTotalForms: 'Total Forms',
    dashCompleted: 'Completed',
    dashActiveDrafts: 'Active Drafts',
    dashVoiceInputs: 'Voice Inputs',
    dashRecentForms: 'Recent Forms',
    dashRecentSubtitle: 'Continue working on your drafts or export submitted forms',
    dashViewAll: 'View All',
    dashNoForms: 'No forms created yet',
    dashNoFormsSubtitle: 'Choose a template from our library to start filling your first voice-powered form.',
    dashExploreTemplates: 'Explore Templates',
    dashResumeForm: 'Resume Form',
    dashPopularTemplates: 'Popular Form Templates',
    dashPopularSubtitle: 'Choose a starter schema to launch voice filling',
    dashExploreAllTemplates: 'Explore All Templates →',
    dashUseTemplate: 'Use Template',

    // Templates
    tplTitle: 'Form Templates Library',
    tplSubtitle: 'Choose a verified schema to start filling with multilingual AI voice commands',
    tplSearchPlaceholder: 'Search templates...',
    tplAllCategories: 'All',
    tplConversationalMode: 'Conversational Mode',
    tplMinFill: 'min fill',

    // Voice Mic Panel
    voiceSpeechLanguage: 'Speech Language:',
    voiceLiveListening: 'Live Listening',
    voiceMicStandby: 'Mic Standby',
    voiceTapToStart: 'Tap to start speaking',
    voiceListeningSpeak: 'Listening... Speak naturally',
    voiceSubtextStandby: 'Fill fields, update data, or navigate using your voice',
    voiceSubtextListening: 'Say commands like "Next field" or field values like "City is Delhi"',
    voiceLiveTranscript: 'Live Speech Transcript',
    voiceAwaiting: 'Awaiting voice input...',
    voiceRecognizing: 'Recognizing...',
    voiceCommands: 'Voice Commands',
    voiceTestCommand: 'Test Command',
    voiceTestPlaceholder: 'Type command or speech test (e.g. "change my city to Delhi")...',

    // Actions & Common
    btnSubmit: 'Submit Form',
    btnReview: 'Review Form',
    btnNext: 'Next Field',
    btnBack: 'Previous Field',
    btnClear: 'Clear',
    btnCancel: 'Cancel',
    btnSaveDraft: 'Save Draft',
    btnExportPdf: 'Export PDF',
    loading: 'Loading...'
  },
  'hi-IN': {
    // Navbar
    navDashboard: 'डैशबोर्ड',
    navTemplates: 'टेम्पलेट्स',
    navConversational: 'बातचीत मोड',
    navMyForms: 'मेरे फॉर्म्स',
    navAdmin: 'एडमिन बिल्डर',
    navUserView: 'यूज़र व्यू',
    navAdminView: 'एडमिन',
    navSignIn: 'साइन इन',
    navGetStarted: 'शुरू करें',
    navLogOut: 'लॉग आउट',
    navProfile: 'प्रोफ़ाइल और सेटिंग्स',

    // Dashboard
    dashWelcome: 'वापसी पर स्वागत है',
    dashVoiceActive: 'AI बहुभाषी वॉयस सक्रिय',
    dashSubtitle: 'अंग्रेजी, हिंदी या हिंग्लिश में अपनी प्राकृतिक आवाज से फॉर्म भरें। आपके सभी ड्राफ्ट और सबमिशन नीचे सुरक्षित हैं।',
    dashStartNew: 'नया फॉर्म शुरू करें',
    dashVoiceWizard: 'वॉयस विज़ार्ड',
    dashTotalForms: 'कुल फॉर्म्स',
    dashCompleted: 'पूर्ण फॉर्म्स',
    dashActiveDrafts: 'सक्रिय ड्राफ्ट्स',
    dashVoiceInputs: 'वॉयस इनपुट्स',
    dashRecentForms: 'हाल के फॉर्म्स',
    dashRecentSubtitle: 'अपने ड्राफ्ट जारी रखें या सबमिट किए गए फॉर्म्स को PDF में एक्सपोर्ट करें',
    dashViewAll: 'सभी देखें',
    dashNoForms: 'अभी तक कोई फॉर्म नहीं बनाया गया',
    dashNoFormsSubtitle: 'अपनी आवाज से पहला फॉर्म भरने के लिए टेम्पलेट्स लाइब्रेरी से एक फॉर्म चुनें।',
    dashExploreTemplates: 'टेम्पलेट्स देखें',
    dashResumeForm: 'फॉर्म जारी रखें',
    dashPopularTemplates: 'लोकप्रिय फॉर्म टेम्पलेट्स',
    dashPopularSubtitle: 'वॉयस फिलिंग शुरू करने के लिए कोई भी टेम्पलेट चुनें',
    dashExploreAllTemplates: 'सभी टेम्पलेट्स देखें →',
    dashUseTemplate: 'उपयोग करें',

    // Templates
    tplTitle: 'फॉर्म टेम्पलेट्स लाइब्रेरी',
    tplSubtitle: 'AI बहुभाषी वॉयस कमांड्स के साथ भरने के लिए प्रमाणित स्कीमा चुनें',
    tplSearchPlaceholder: 'टेम्पलेट्स खोजें...',
    tplAllCategories: 'सभी',
    tplConversationalMode: 'बातचीत मोड',
    tplMinFill: 'मिनट में भरें',

    // Voice Mic Panel
    voiceSpeechLanguage: 'वॉयस भाषा:',
    voiceLiveListening: 'लाइव सुन रहा है',
    voiceMicStandby: 'माइक स्टैंडबाय',
    voiceTapToStart: 'बोलना शुरू करने के लिए टैप करें',
    voiceListeningSpeak: 'सुन रहा है... खुलकर बोलें',
    voiceSubtextStandby: 'अपनी आवाज से फील्ड भरें, डेटा बदलें या नेविगेट करें',
    voiceSubtextListening: '"अगला फ़ील्ड" या "मेरा नाम राहुल है" जैसे वाक्य बोलें',
    voiceLiveTranscript: 'लाइव वॉयस ट्रांसक्रिप्ट',
    voiceAwaiting: 'आवाज की प्रतीक्षा है...',
    voiceRecognizing: 'पहचान रहा है...',
    voiceCommands: 'वॉयस कमांड्स',
    voiceTestCommand: 'कमांड टेस्ट',
    voiceTestPlaceholder: 'कमांड लिखें (जैसे: "मेरा शहर दिल्ली है")...',

    // Actions & Common
    btnSubmit: 'फॉर्म जमा करें',
    btnReview: 'फॉर्म जांचें (रिव्यू)',
    btnNext: 'अगला फ़ील्ड',
    btnBack: 'पिछला फ़ील्ड',
    btnClear: 'साफ़ करें',
    btnCancel: 'रद्द करें',
    btnSaveDraft: 'ड्राफ्ट सेव करें',
    btnExportPdf: 'PDF डाउनलोड करें',
    loading: 'लोड हो रहा है...'
  },
  'hinglish': {
    // Navbar
    navDashboard: 'Dashboard',
    navTemplates: 'Templates',
    navConversational: 'Conversational Mode',
    navMyForms: 'Mere Forms',
    navAdmin: 'Admin Builder',
    navUserView: 'User View',
    navAdminView: 'Admin',
    navSignIn: 'Sign In',
    navGetStarted: 'Shuru Karein',
    navLogOut: 'Log Out',
    navProfile: 'Profile & Settings',

    // Dashboard
    dashWelcome: 'Welcome back',
    dashVoiceActive: 'AI Multilingual Voice Active',
    dashSubtitle: 'English, Hindi ya Hinglish mein natural speech se forms bharein. Aapke draft aur completed submissions niche synced hain.',
    dashStartNew: 'Naya Form Shuru Karein',
    dashVoiceWizard: 'Voice Wizard',
    dashTotalForms: 'Total Forms',
    dashCompleted: 'Completed',
    dashActiveDrafts: 'Active Drafts',
    dashVoiceInputs: 'Voice Inputs',
    dashRecentForms: 'Recent Forms',
    dashRecentSubtitle: 'Apne drafts continue karein ya PDF export karein',
    dashViewAll: 'Saare Dekhein',
    dashNoForms: 'Koi form nahi bana abhi',
    dashNoFormsSubtitle: 'Templates library se ek template choose karke voice form filling shuru karein.',
    dashExploreTemplates: 'Templates Explore Karein',
    dashResumeForm: 'Resume Karein',
    dashPopularTemplates: 'Popular Form Templates',
    dashPopularSubtitle: 'Voice filling shuru karne ke liye starter template select karein',
    dashExploreAllTemplates: 'Explore All Templates →',
    dashUseTemplate: 'Use Template',

    // Templates
    tplTitle: 'Form Templates Library',
    tplSubtitle: 'Multilingual AI voice commands ke saath bharne ke liye schema choose karein',
    tplSearchPlaceholder: 'Templates search karein...',
    tplAllCategories: 'All',
    tplConversationalMode: 'Conversational Mode',
    tplMinFill: 'min fill',

    // Voice Mic Panel
    voiceSpeechLanguage: 'Speech Language:',
    voiceLiveListening: 'Live Listening',
    voiceMicStandby: 'Mic Standby',
    voiceTapToStart: 'Bolne ke liye tap karein',
    voiceListeningSpeak: 'Listening... Naturally boliye',
    voiceSubtextStandby: 'Voice se field bharein, update karein ya navigate karein',
    voiceSubtextListening: '"Next field" ya "City is Delhi" bolo',
    voiceLiveTranscript: 'Live Speech Transcript',
    voiceAwaiting: 'Voice input ka wait kar rahe hain...',
    voiceRecognizing: 'Recognizing...',
    voiceCommands: 'Voice Commands',
    voiceTestCommand: 'Test Command',
    voiceTestPlaceholder: 'Command type karein (e.g. "change my city to Delhi")...',

    // Actions & Common
    btnSubmit: 'Submit Karein',
    btnReview: 'Review Form',
    btnNext: 'Next Field',
    btnBack: 'Pichla Field',
    btnClear: 'Clear',
    btnCancel: 'Cancel',
    btnSaveDraft: 'Save Draft',
    btnExportPdf: 'PDF Download',
    loading: 'Loading...'
  }
};

export type TranslationKey = keyof typeof translations['en-US'];

export function useTranslation() {
  const { language, setLanguage } = useVoiceStore();
  
  const currentLang: SupportedLanguage = language in translations ? language : 'en-US';
  const t = (key: TranslationKey): string => {
    return translations[currentLang]?.[key] || translations['en-US'][key] || key;
  };

  return {
    t,
    language: currentLang,
    setLanguage
  };
}
