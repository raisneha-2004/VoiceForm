import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import {
  Mic,
  Volume2,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BookOpen,
  Terminal,
  Languages,
  Check,
  Copy,
  Layers,
  MessageSquareCode
} from 'lucide-react';

interface VoiceCommandItem {
  id: string;
  category: 'navigation' | 'actions' | 'data' | 'formats' | 'privacy';
  title: string;
  description: string;
  englishPhrases: string[];
  hindiPhrases: string[];
  exampleContext: string;
  triggerResult: string;
  audioPreviewPhrase: string;
  audioLang: 'en-US' | 'hi-IN';
}

const VOICE_COMMANDS_DATA: VoiceCommandItem[] = [
  // 1. Navigation
  {
    id: 'cmd-next',
    category: 'navigation',
    title: 'Next Field Navigation',
    description: 'Moves input focus forward to the immediate next field in the form sequence.',
    englishPhrases: ['"Next field"', '"Next"', '"Forward"', '"Go to next"'],
    hindiPhrases: ['"अगला"', '"अगला फील्ड"', '"आगे बढ़ो"', '"Agla field"', '"Aage chalo"'],
    exampleContext: 'Say when finished answering the current input without touching keyboard/mouse.',
    triggerResult: 'Advances active focus index and auto-announces next question prompt if TTS is active.',
    audioPreviewPhrase: 'Next field. अगला फील्ड।',
    audioLang: 'en-US'
  },
  {
    id: 'cmd-prev',
    category: 'navigation',
    title: 'Previous Field Navigation',
    description: 'Moves input focus backward to the preceding field in the form sequence.',
    englishPhrases: ['"Previous field"', '"Previous"', '"Back"', '"Prev"'],
    hindiPhrases: ['"पिछला"', '"पिछला फील्ड"', '"पीछे जाओ"', '"Pichla field"', '"Peeche"'],
    exampleContext: 'Say when you need to re-visit or correct an earlier answer.',
    triggerResult: 'Highlights the previous input and opens its voice capture panel.',
    audioPreviewPhrase: 'Previous field. पिछला फील्ड।',
    audioLang: 'en-US'
  },

  // 2. Actions & Lifecycle
  {
    id: 'cmd-review',
    category: 'actions',
    title: 'Review Form Summary',
    description: 'Opens the comprehensive form review modal to inspect all entered field values.',
    englishPhrases: ['"Review my form"', '"Review form"', '"Review"', '"Inspect form"'],
    hindiPhrases: ['"रिव्यू"', '"फॉर्म चेक करो"', '"फॉर्म दिखाओ"', '"समीक्षा करो"', '"Form check karo"'],
    exampleContext: 'Say before final submission to verify all answers and check validation readiness.',
    triggerResult: 'Opens the slide-out / modal Review Drawer with field summary cards.',
    audioPreviewPhrase: 'Review my form. फॉर्म चेक करो।',
    audioLang: 'en-US'
  },
  {
    id: 'cmd-submit',
    category: 'actions',
    title: 'Submit Completed Form',
    description: 'Triggers the final submission pipeline, validation check, and PDF generation.',
    englishPhrases: ['"Submit form"', '"Submit"', '"Form submit"', '"Finish form"'],
    hindiPhrases: ['"सबमिट"', '"फॉर्म सबमिट"', '"जमा करो"', '"फॉर्म जमा करो"', '"Form jama karo"'],
    exampleContext: 'Say when all mandatory fields are green/valid to persist to database.',
    triggerResult: 'Runs Zod validation, stores submission, fires confetti, and generates downloadable PDF.',
    audioPreviewPhrase: 'Submit form. फॉर्म जमा करो।',
    audioLang: 'en-US'
  },
  {
    id: 'cmd-clear',
    category: 'actions',
    title: 'Clear Field Value',
    description: 'Resets and erases the contents of the active or specifically named field.',
    englishPhrases: ['"Clear field"', '"Clear [field name]"', '"Remove [field name]"', '"Clear email"'],
    hindiPhrases: ['"हटाओ"', '"साफ़ करो"', '"मिटाओ"', '"खाली करो"', '"Email hatao"', '"Shehar saaf karo"'],
    exampleContext: 'Say "Clear phone" or "हटाओ" to blank out mistakes immediately.',
    triggerResult: 'Erases the value in form state and updates UI error validations instantly.',
    audioPreviewPhrase: 'Clear field. साफ़ करो।',
    audioLang: 'en-US'
  },

  // 3. Conversational Natural Language Extraction
  {
    id: 'cmd-name-assignment',
    category: 'data',
    title: 'Named Field Natural Assignment',
    description: 'Intelligently identifies field names and sets extracted values from conversational sentences.',
    englishPhrases: [
      '"My name is John Doe"',
      '"Set email to rahul@gmail.com"',
      '"My phone is 9876543210"',
      '"Change city to Mumbai"'
    ],
    hindiPhrases: [
      '"मेरा नाम स्नेहा है"',
      '"ईमेल sneha@indicdata.ai कर दो"',
      '"फोन नंबर ९८७६५४३२१० है"',
      '"मेरा शहर दिल्ली है"'
    ],
    exampleContext: 'Speak naturally in full sentences in English, Hindi or Hinglish.',
    triggerResult: 'Regex entity engine extracts key-value pair, sets field, and logs AI detection badge.',
    audioPreviewPhrase: 'My name is Sneha. मेरा नाम स्नेहा है।',
    audioLang: 'en-US'
  },
  {
    id: 'cmd-direct-fill',
    category: 'data',
    title: 'Direct Focused Field Answering',
    description: 'When any input field is currently active, whatever you speak is directly assigned as its value.',
    englishPhrases: ['"Software Engineer"', '"Bangalore, Karnataka"', '"420001"', '"28"'],
    hindiPhrases: ['"सॉफ्टवेयर इंजीनियर"', '"बेंगलुरु"', '"४२०००१"', '"२८ साल"'],
    exampleContext: 'No command prefix required — just speak the answer when field is highlighted.',
    triggerResult: 'Transcribes speech directly into the input with live visual typing simulation.',
    audioPreviewPhrase: 'Senior Product Manager. बेंगलुरु शहर।',
    audioLang: 'en-US'
  },

  // 4. Special Formats & Phonetic Handling
  {
    id: 'cmd-email-phonetics',
    category: 'formats',
    title: 'Email & Symbols Phonetic Replacement',
    description: 'Automatically converts spoken words into email syntax and symbols.',
    englishPhrases: ['"rahul at gmail dot com"', '"contact at company dot org"'],
    hindiPhrases: ['"स्नेहा एट जीमेल डॉट कॉम"', '"user एट domain डॉट इन"'],
    exampleContext: 'Speak "at" for @ and "dot" for . without needing to spell punctuation.',
    triggerResult: 'Auto-replaces " at " -> "@" and " dot " -> "." and strips accidental spaces.',
    audioPreviewPhrase: 'rahul at gmail dot com',
    audioLang: 'en-US'
  },
  {
    id: 'cmd-hindi-numerals',
    category: 'formats',
    title: 'Devanagari Digits Normalization',
    description: 'Converts Hindi Devanagari numerals (०-९) to international standard digits (0-9).',
    englishPhrases: ['"Phone 9876543210"', '"Pincode 400001"'],
    hindiPhrases: ['"फोन ९८७६५४३२१०"', '"पिनकोड ४००००१"', '"उम्र २५"'],
    exampleContext: 'Speak numbers in pure Hindi pronunciation or Devanagari numerals.',
    triggerResult: 'Normalizes Devanagari glyphs [०-९] -> [0-9] for numeric & phone validation compliance.',
    audioPreviewPhrase: 'फोन नंबर ९८७६५४३२१०',
    audioLang: 'hi-IN'
  },

  // 5. Privacy & Verification
  {
    id: 'cmd-sensitive-confirm',
    category: 'privacy',
    title: 'Sensitive Data Voice Confirmation',
    description: 'Safety gate modal that asks for explicit voice confirmation before saving Aadhaar/PAN/Phone.',
    englishPhrases: ['"Yes, confirm"', '"Confirm"', '"Correct"', '"No, cancel"'],
    hindiPhrases: ['"हाँ, सही है"', '"हाँ"', '"कन्फर्म"', '"नहीं, रोको"'],
    exampleContext: 'Triggered whenever a field marked as sensitive is populated via voice.',
    triggerResult: 'Displays modal with spoken preview. Saying "Yes / हाँ" persists; "No / नहीं" discards.',
    audioPreviewPhrase: 'Yes, confirm. हाँ, कन्फर्म।',
    audioLang: 'en-US'
  }
];

export const VoiceCommandsGuidePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  const categories = [
    { id: 'all', label: 'All Commands (9)', icon: BookOpen },
    { id: 'navigation', label: 'Navigation (2)', icon: ArrowRight },
    { id: 'actions', label: 'Form Actions (3)', icon: Zap },
    { id: 'data', label: 'Conversational Data (2)', icon: MessageSquareCode },
    { id: 'formats', label: 'Email & Digits (2)', icon: Languages },
    { id: 'privacy', label: 'Privacy & Confirm (1)', icon: ShieldCheck }
  ];

  const filteredCommands = VOICE_COMMANDS_DATA.filter((cmd) => {
    const matchesCat = selectedCategory === 'all' || cmd.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesQuery =
      cmd.title.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.englishPhrases.some((p) => p.toLowerCase().includes(query)) ||
      cmd.hindiPhrases.some((p) => p.toLowerCase().includes(query)) ||
      cmd.triggerResult.toLowerCase().includes(query);

    return matchesCat && matchesQuery;
  });

  const handleCopyPhrase = (phrase: string, id: string) => {
    navigator.clipboard.writeText(phrase.replace(/"/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayAudio = (cmd: VoiceCommandItem) => {
    if (activeAudioId === cmd.id && isSpeaking) {
      cancel();
      setActiveAudioId(null);
      return;
    }

    cancel();
    setActiveAudioId(cmd.id);
    speak(cmd.audioPreviewPhrase, { language: cmd.audioLang });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Hero Banner */}
      <div className="rounded-[32px] p-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/40 to-pink-500/30 shadow-2xl relative overflow-hidden">
        <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-6">
          {/* Ambient Glowing Orbs */}
          <div className="w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl absolute -top-16 -left-16 pointer-events-none" />
          <div className="w-80 h-80 bg-purple-500/20 rounded-full blur-3xl absolute -bottom-20 -right-20 pointer-events-none" />

          {/* Left Hero Content */}
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Complete Hands-Free Speech Reference</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Voice Commands &{' '}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Cheat Sheet
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-normal">
              VoiceForm supports over 40+ speech variations across English, हिन्दी (Hindi) and Hinglish. Control navigation, field editing, instant review, and submission completely hands-free.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-indigo-200/80 font-medium">
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span>Zero Latency Local Parser</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <Languages className="w-3 h-3 text-sky-300" />
                <span>Bilingual English + Hindi Devanagari</span>
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <Link
              to="/conversational"
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/35 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-purple-200" />
              <span>Try Conversational Mode</span>
            </Link>

            <Link
              to="/templates"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-indigo-200" />
              <span>Browse Form Templates</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search commands by phrase (e.g. 'Next', 'रिव्यू', 'Clear', 'Email')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCommands.map((cmd) => {
          const isAudioPlaying = activeAudioId === cmd.id && isSpeaking;

          return (
            <div
              key={cmd.id}
              className="group p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Header with Category Badge & Audio Preview Button */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60 shadow-2xs">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {cmd.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Category: {cmd.category}
                      </span>
                    </div>
                  </div>

                  {/* Audio Preview Button */}
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(cmd)}
                    title="Listen to how this command is spoken (TTS)"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      isAudioPlaying
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/80 dark:hover:text-brand-400 border border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{isAudioPlaying ? 'Playing...' : 'Pronounce'}</span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {cmd.description}
                </p>

                {/* Bilingual Phrases Comparison Box */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 mb-4">
                  {/* English Phrases */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                      <span className="flex items-center gap-1">
                        <span className="w-3.5 h-3.5 rounded-md bg-indigo-500/15 text-indigo-600 font-extrabold flex items-center justify-center text-[9px]">EN</span>
                        <span>English Spoken Variations</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cmd.englishPhrases.map((phrase, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopyPhrase(phrase, `${cmd.id}-en-${idx}`)}
                          title="Click to copy phrase"
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{phrase}</span>
                          {copiedId === `${cmd.id}-en-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-slate-400 opacity-50" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hindi & Hinglish Phrases */}
                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                      <span className="flex items-center gap-1">
                        <span className="w-3.5 h-3.5 rounded-md bg-amber-500/15 text-amber-600 font-extrabold flex items-center justify-center text-[9px]">HI</span>
                        <span>हिन्दी / Hinglish Variations</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cmd.hindiPhrases.map((phrase, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopyPhrase(phrase, `${cmd.id}-hi-${idx}`)}
                          title="Click to copy phrase"
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{phrase}</span>
                          {copiedId === `${cmd.id}-hi-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-slate-400 opacity-50" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Trigger Effect */}
              <div className="p-3 rounded-2xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60 flex items-start gap-2.5 text-xs text-brand-800 dark:text-brand-200">
                <Zap className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-[11px]">System Action:</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                    {cmd.triggerResult}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCommands.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Search className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No voice commands found for "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-400">
            Try searching for "Next", "Submit", "Review", "Email", or clear the filter to see all commands.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceCommandsGuidePage;
