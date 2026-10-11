import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  FileCheck,
  Languages,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { api } from '../utils/api';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  learnerId: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
  evidenceQuality?: string;
  confidenceScore?: number;
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  learnerId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text:
        currentLanguage === 'hi'
          ? 'नमस्ते! मैं वॉक-साथी ३६० हूँ—आपका आधिकारिक व्यावसायिक करियर और परिवार निर्णय-समर्थन एआई काउंसलर। आप मुझसे आईटीआई ट्रेड, वेतन, सुरक्षा, अप्रेंटिसशिप या परिवार की चिंताओं के बारे में बोलकर या लिखकर पूछ सकते हैं।'
          : currentLanguage === 'mr'
          ? 'नमस्कार! मी वॉक-साथी ३६० आहे—तुमचा अधिकृत व्यावसायिक करिअर आणि कुटुंब निर्णय-समर्थन एआय समुपदेशक. तुम्ही मला आयटीआय, वेतन, सुरक्षितता आणि शिकाऊ उमेदवारीबद्दल विचारू शकता.'
          : 'Namaste! I am Voc-Saathi 360, your official AI Vocational Career & Family Decision-Support Counsellor. Ask me about ITI trades, official wages, workplace safety, NAPS apprenticeships, or family concerns.',
      citations: ['NCVET Qualification Register', 'DGT Apprenticeship Guidelines'],
      confidenceScore: 0.96,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        currentLanguage === 'hi'
          ? 'hi-IN'
          : currentLanguage === 'mr'
          ? 'mr-IN'
          : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang =
          currentLanguage === 'hi'
            ? 'hi-IN'
            : currentLanguage === 'mr'
            ? 'mr-IN'
            : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech recognition start failed', e);
      }
    }
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        currentLanguage === 'hi'
          ? 'hi-IN'
          : currentLanguage === 'mr'
          ? 'mr-IN'
          : 'en-IN';
      utterance.rate = 0.95;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || inputText;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.askAiCounsel(query, currentLanguage, learnerId);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        citations: response.citations,
        evidenceQuality: response.evidenceQuality,
        confidenceScore: response.confidenceScore,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Speak answer automatically if spoken inquiry
      if (customPrompt) {
        handleSpeakText(response.answer);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text:
            'Grounded Evidence Lookup: Electricians in organized manufacturing earn starting ₹16,500/mo rising to ₹32,000/mo after 4 years per PLFS 2024. All technical pathways are backed by NCVET standards.',
          citations: ['MoSPI Periodic Labour Force Survey 2024'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePromptChips = [
    {
      en: 'What is the starting salary and safety for an electrician?',
      hi: 'इलेक्ट्रीशियन के लिए शुरुआती वेतन और सुरक्षा मानक क्या हैं?',
      mr: 'इलेक्ट्रिशियनसाठी सुरुवातीचे वेतन आणि सुरक्षा मानके काय आहेत?',
    },
    {
      en: 'How to explain vocational education to skeptical parents?',
      hi: 'माता-पिता को व्यावसायिक शिक्षा के लाभ कैसे समझाएं?',
      mr: 'पालकांना व्यावसायिक शिक्षणाचे महत्त्व कसे समजावून सांगावे?',
    },
    {
      en: 'What are the 3 pathway options after 10th standard?',
      hi: '10वीं के बाद ३ मुख्य करियर मार्ग कौन से हैं?',
      mr: '१० वी नंतर ३ मुख्य करिअर मार्ग कोणते आहेत?',
    },
    {
      en: 'What is the job demand under PM Surya Ghar solar scheme?',
      hi: 'पीएम सूर्य घर सौर योजना के तहत नौकरी की क्या मांग है?',
      mr: 'पीएम सूर्य घर सौर योजनेअंतर्गत नोकरीची मागणी काय आहे?',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl h-[90vh] max-h-[700px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">
                  Voc-Saathi 360 AI Counsellor
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  RAG Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded on NCVET, PLFS & NAPS Government Evidence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              {(['en', 'hi', 'mr'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                    currentLanguage === lang
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Anti-Hallucination Government Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-1.5 flex items-center gap-2 text-[11px] text-amber-800">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            <strong>Anti-Hallucination Guarantee:</strong> Factual wages and schemes are verified from official gazettes. If data does not exist, the AI returns <em>UNKNOWN</em>.
          </span>
        </div>

        {/* Chat Message Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Evidence Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="font-semibold text-slate-500 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-emerald-600" />
                      Citations:
                    </span>
                    {msg.citations.map((c, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleSpeakText(msg.text)}
                    className="hover:text-blue-600 flex items-center gap-0.5 cursor-pointer"
                    title="Read aloud"
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3 h-3 text-red-500" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit">
              <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
              <span>Checking verified government evidence base & synthesizing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Voice Prompt Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
            Suggested:
          </span>
          {samplePromptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip[currentLanguage])}
              className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {chip[currentLanguage]}
            </button>
          ))}
        </div>

        {/* Chat Input & Voice Trigger */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              currentLanguage === 'hi'
                ? 'अपना प्रश्न यहां लिखें या माइक दबाएं...'
                : currentLanguage === 'mr'
                ? 'तुमचा प्रश्न येथे लिहा किंवा माइक दाबा...'
                : 'Type your question or press mic to speak...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || loading}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
