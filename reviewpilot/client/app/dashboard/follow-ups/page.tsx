"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Smartphone, 
  Settings, 
  PhoneCall, 
  PhoneMissed, 
  UserCheck, 
  Check, 
  Save, 
  Variable,
  Building
} from "lucide-react";

type TriggerRule = {
  id: string;
  name: string;
  description: string;
  icon: React.FC<any>;
  enabled: boolean;
  messageTemplate: string;
  delay: string;
};

const DEFAULT_RULES: TriggerRule[] = [
  {
    id: "post-call",
    name: "Post-Call Promo & Review",
    description: "Send immediately after finishing a call with a customer.",
    icon: PhoneCall,
    enabled: true,
    messageTemplate: "Hi {CustomerName}, thanks for calling {BusinessName}! We'd love your feedback. Leave a review here: {ReviewLink} and get 10% off your next visit! 🌟",
    delay: "5 mins",
  },
  {
    id: "missed-call",
    name: "Missed Call Auto-Responder",
    description: "Send when you miss a call to capture the lead.",
    icon: PhoneMissed,
    enabled: false,
    messageTemplate: "Hi! Sorry we missed your call to {BusinessName}. How can we help you today? Reply to this text and we'll get right back to you!",
    delay: "Immediate",
  },
  {
    id: "post-visit",
    name: "Post-Visit Follow-up",
    description: "Send after a customer is marked as visited in your POS.",
    icon: UserCheck,
    enabled: false,
    messageTemplate: "Thanks for visiting {BusinessName} today, {CustomerName}! How was your experience? Let us know: {ReviewLink}",
    delay: "2 hours",
  }
];

export default function FollowUpsPage() {
  const [rules, setRules] = useState<TriggerRule[]>(DEFAULT_RULES);
  const [activeRuleId, setActiveRuleId] = useState<string>("post-call");
  
  const activeRule = rules.find(r => r.id === activeRuleId)!;

  const handleToggle = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleTemplateChange = (text: string) => {
    setRules(rules.map(r => r.id === activeRuleId ? { ...r, messageTemplate: text } : r));
  };

  const insertVariable = (variable: string) => {
    const newText = activeRule.messageTemplate + variable;
    handleTemplateChange(newText);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1.5 uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Growth Automation</span>
          </div>
          <h2 className="text-xl font-black text-blue-950 tracking-tight">SMS & WhatsApp Follow-ups</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">Automatically text customers after calls or visits to capture leads and drive 5-star reviews.</p>
        </div>
        <button className="bg-blue-950 text-[#14142B] text-xs font-bold px-4 py-2.5 rounded-[14px] hover:bg-blue-900 transition-colors flex items-center gap-1.5 shadow-md shadow-blue-950/10">
          <Save className="w-4 h-4" />
          <span>Save Automations</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Rules List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-blue-950 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-400" />
            Automation Triggers
          </h3>
          
          <div className="space-y-3">
            {rules.map((rule) => {
              const Icon = rule.icon;
              const isActive = rule.id === activeRuleId;
              
              return (
                <div 
                  key={rule.id}
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`p-4 rounded-[14px] border transition-all cursor-pointer ${
                    isActive 
                      ? "bg-white border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500" 
                      : "bg-white border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-[14px] ${rule.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-gray-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-blue-950">{rule.name}</h4>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{rule.description}</p>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(rule.id);
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${rule.enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-4.5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Template Editor */}
          <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-3xl p-6 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Message Template
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                Delay: {activeRule.delay}
              </span>
            </div>
            
            <textarea
              value={activeRule.messageTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full h-32 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] p-4 text-sm font-medium text-blue-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
            
            <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Insert Variables</span>
              <div className="flex flex-wrap gap-2">
                {["{CustomerName}", "{BusinessName}", "{ReviewLink}"].map((v) => (
                  <button
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="flex items-center gap-1 bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] text-gray-500 hover:text-emerald-600 hover:border-emerald-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Variable className="w-3 h-3" />
                    <span>{v}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Side: Phone Preview */}
        <div className="lg:col-span-5 flex justify-center items-center">
          
          <div className="relative w-[300px] h-[600px] bg-blue-950 rounded-[3rem] p-3 shadow-2xl flex flex-col shrink-0 border-8 border-blue-950 ring-1 ring-blue-900">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-blue-950 rounded-b-2xl z-20 flex justify-center items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
              <div className="w-12 h-1.5 rounded-full bg-blue-900" />
            </div>

            {/* Screen */}
            <div className="flex-1 bg-slate-50 rounded-[2.25rem] overflow-hidden flex flex-col relative">
              {/* iOS Header */}
              <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 pt-10 pb-3 px-4 flex flex-col items-center justify-center relative z-10">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-1">
                  <Building className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-xs font-bold text-blue-950">Your Business</span>
                <span className="text-[10px] text-gray-400 font-medium">SMS Message</span>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-50">
                <div className="flex flex-col items-center gap-1 my-2">
                  <span className="text-[10px] font-bold text-gray-400">Today {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                
                {/* Simulated message bubble */}
                <div className="bg-slate-200 text-blue-900 text-sm font-medium p-3.5 rounded-[14px] rounded-tl-sm self-start max-w-[85%] leading-relaxed shadow-sm">
                  {activeRule.messageTemplate
                    .replace("{CustomerName}", "Alex")
                    .replace("{BusinessName}", "Luxe Cafe")
                    .replace("{ReviewLink}", "intuik.com/rev/123")}
                </div>
              </div>
              
              {/* iOS Footer input */}
              <div className="bg-white border-t border-slate-200 p-3 pb-8">
                <div className="bg-slate-100 rounded-full h-8 flex items-center px-4">
                  <span className="text-xs text-gray-400">Text Message</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
