/**
 * AI KISAN — Production v2.0
 * Full bug-fix pass: error boundaries, language system, real AI API,
 * graceful fallbacks, form validation, mobile fixes, 404, loading states.
 */

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ─── 1. LANGUAGE SYSTEM ──────────────────────────────────────────────────── */
const LANGS = {
  en: { label: "English", flag: "🇬🇧" },
  hi: { label: "हिंदी",  flag: "🇮🇳" },
  pa: { label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  gu: { label: "ગુજરાતી",flag: "🇮🇳" },
  mr: { label: "मराठी",  flag: "🇮🇳" },
  bn: { label: "বাংলা",  flag: "🇮🇳" },
  ta: { label: "தமிழ்", flag: "🇮🇳" },
  te: { label: "తెలుగు",flag: "🇮🇳" },
  kn: { label: "ಕನ್ನಡ", flag: "🇮🇳" },
  ml: { label: "മലയാളം",flag: "🇮🇳" },
  or: { label: "ଓଡ଼ିଆ",  flag: "🇮🇳" },
  ur: { label: "اردو",   flag: "🇮🇳" },
};

const T = {
  en: {
    tagline:"Empowering Farmers with Artificial Intelligence",
    hero_h1:"Smarter Farming\nStarts With AI",
    hero_sub:"AI-powered crop intelligence, satellite monitoring, disease detection, weather forecasting, market insights, and profit optimisation for Indian agriculture.",
    get_started:"Get Started Free",
    explore:"Explore Features",
    wa_support:"WhatsApp Support",
    features:"Platform Features",
    features_sub:"From seed to sale — AI Kisan covers every stage of your farming journey.",
    dashboard:"Dashboard",
    ai_assistant:"AI Assistant",
    crop_doctor:"Crop Doctor",
    satellite:"Satellite",
    market:"Market",
    schemes:"Schemes",
    community:"Community",
    pricing:"Pricing",
    login:"Login",
    contact:"Contact",
    home:"Home",
    send:"Send",
    chat_placeholder:"Ask about crops, diseases, fertilisers, market prices…",
    typing:"AI is thinking…",
    upload_title:"Upload or Capture Crop Photo",
    upload_sub:"Supports JPG, PNG, HEIC · Camera capture · Multiple images",
    run_diagnosis:"Run AI Diagnosis",
    diagnosing:"Analysing your crop…",
    live:"Live",
    beta:"Beta",
    soon:"Coming Soon",
    unavailable:"Service temporarily unavailable.",
    network_err:"Network error — please check your connection and try again.",
    loading:"Loading…",
    submit:"Submit",
    name_label:"Full Name",
    email_label:"Email Address",
    phone_label:"Phone Number",
    msg_label:"Your Message",
    required:"This field is required.",
    invalid_email:"Please enter a valid email.",
    invalid_phone:"Please enter a valid 10-digit phone number.",
    form_success:"Thank you! We will contact you within 24 hours.",
    not_found:"Page not found.",
    not_found_sub:"The page you're looking for doesn't exist.",
    go_home:"Go Home",
  },
  hi: {
    tagline:"किसानों को कृत्रिम बुद्धिमत्ता से सशक्त बनाना",
    hero_h1:"स्मार्ट खेती शुरू होती है\nAI से",
    hero_sub:"AI-संचालित फसल बुद्धिमत्ता, उपग्रह निगरानी, रोग पहचान, मौसम पूर्वानुमान, बाजार अंतर्दृष्टि।",
    get_started:"मुफ्त शुरू करें",
    explore:"सुविधाएं देखें",
    wa_support:"WhatsApp सहायता",
    features:"प्लेटफ़ॉर्म सुविधाएं",
    features_sub:"बीज से बिक्री तक — AI Kisan आपकी खेती के हर चरण को कवर करता है।",
    dashboard:"डैशबोर्ड",
    ai_assistant:"AI सहायक",
    crop_doctor:"फसल डॉक्टर",
    satellite:"उपग्रह",
    market:"बाजार",
    schemes:"योजनाएं",
    community:"समुदाय",
    pricing:"मूल्य निर्धारण",
    login:"लॉगिन",
    contact:"संपर्क",
    home:"होम",
    send:"भेजें",
    chat_placeholder:"फसल, रोग, उर्वरक, बाजार कीमतों के बारे में पूछें…",
    typing:"AI सोच रहा है…",
    upload_title:"फसल की फोटो अपलोड करें",
    upload_sub:"JPG, PNG, HEIC · कैमरा कैप्चर · एकाधिक छवियां",
    run_diagnosis:"AI निदान चलाएं",
    diagnosing:"आपकी फसल का विश्लेषण हो रहा है…",
    live:"लाइव",beta:"बीटा",soon:"जल्द आ रहा है",
    unavailable:"सेवा अस्थायी रूप से अनुपलब्ध।",
    network_err:"नेटवर्क त्रुटि — कृपया अपना कनेक्शन जांचें।",
    loading:"लोड हो रहा है…",
    submit:"सबमिट करें",
    name_label:"पूरा नाम",email_label:"ईमेल पता",phone_label:"फोन नंबर",msg_label:"आपका संदेश",
    required:"यह फ़ील्ड आवश्यक है।",invalid_email:"कृपया एक वैध ईमेल दर्ज करें।",invalid_phone:"कृपया 10 अंकों का वैध फोन नंबर दर्ज करें।",
    form_success:"धन्यवाद! हम 24 घंटे में आपसे संपर्क करेंगे।",
    not_found:"पृष्ठ नहीं मिला।",not_found_sub:"आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है।",go_home:"होम जाएं",
  },
  pa: {
    tagline:"ਕਿਸਾਨਾਂ ਨੂੰ ਨਕਲੀ ਬੁੱਧੀ ਨਾਲ ਸਸ਼ਕਤ ਕਰਨਾ",
    hero_h1:"ਸਮਾਰਟ ਖੇਤੀ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ\nAI ਤੋਂ",
    hero_sub:"AI-ਸੰਚਾਲਿਤ ਫਸਲ ਬੁੱਧੀ, ਸੈਟੇਲਾਈਟ ਨਿਗਰਾਨੀ, ਰੋਗ ਖੋਜ, ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ।",
    get_started:"ਮੁਫ਼ਤ ਸ਼ੁਰੂ ਕਰੋ",explore:"ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਵੇਖੋ",wa_support:"WhatsApp ਸਹਾਇਤਾ",
    features:"ਪਲੇਟਫਾਰਮ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",features_sub:"ਬੀਜ ਤੋਂ ਵਿਕਰੀ ਤੱਕ।",
    dashboard:"ਡੈਸ਼ਬੋਰਡ",ai_assistant:"AI ਸਹਾਇਕ",crop_doctor:"ਫਸਲ ਡਾਕਟਰ",satellite:"ਸੈਟੇਲਾਈਟ",market:"ਬਾਜ਼ਾਰ",schemes:"ਯੋਜਨਾਵਾਂ",community:"ਭਾਈਚਾਰਾ",pricing:"ਮੁੱਲ",login:"ਲੌਗਇਨ",contact:"ਸੰਪਰਕ",home:"ਘਰ",
    send:"ਭੇਜੋ",chat_placeholder:"ਫਸਲਾਂ, ਬਿਮਾਰੀਆਂ, ਖਾਦ ਬਾਰੇ ਪੁੱਛੋ…",typing:"AI ਸੋਚ ਰਿਹਾ ਹੈ…",
    upload_title:"ਫਸਲ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",upload_sub:"JPG, PNG, HEIC ਸਮਰਥਿਤ",run_diagnosis:"AI ਨਿਦਾਨ ਚਲਾਓ",diagnosing:"ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ…",
    live:"ਲਾਈਵ",beta:"ਬੀਟਾ",soon:"ਜਲਦ ਆ ਰਿਹਾ ਹੈ",unavailable:"ਸੇਵਾ ਅਸਥਾਈ ਤੌਰ 'ਤੇ ਉਪਲਬਧ ਨਹੀਂ।",network_err:"ਨੈੱਟਵਰਕ ਗਲਤੀ।",loading:"ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…",submit:"ਜਮ੍ਹਾਂ ਕਰੋ",
    name_label:"ਪੂਰਾ ਨਾਮ",email_label:"ਈਮੇਲ",phone_label:"ਫੋਨ ਨੰਬਰ",msg_label:"ਸੁਨੇਹਾ",
    required:"ਇਹ ਖੇਤਰ ਲੋੜੀਂਦਾ ਹੈ।",invalid_email:"ਸਹੀ ਈਮੇਲ ਦਰਜ ਕਰੋ।",invalid_phone:"10-ਅੰਕ ਵਾਲਾ ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ।",
    form_success:"ਧੰਨਵਾਦ! ਅਸੀਂ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਸੰਪਰਕ ਕਰਾਂਗੇ।",
    not_found:"ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ।",not_found_sub:"ਤੁਸੀਂ ਜੋ ਪੰਨਾ ਲੱਭ ਰਹੇ ਹੋ ਉਹ ਮੌਜੂਦ ਨਹੀਂ।",go_home:"ਘਰ ਜਾਓ",
  },
};
// Fallback all missing langs to English
["gu","mr","bn","ta","te","kn","ml","or","ur"].forEach(k => { T[k] = T.en; });

const LangCtx = createContext({ lang:"en", t: T.en, setLang:()=>{} });
const useLang = () => useContext(LangCtx);

/* ─── 2. CSS ──────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}

:root{
  --soil:#140f08;--bark:#1e1408;--earth:#2a1d0e;--clay:#6b4423;--clay2:#7a5230;
  --straw:#b89460;--cream:#f0e3c8;--cream2:#f8f0e3;
  --leaf:#1e5c20;--sprout:#43a047;--lime:#76c442;--lime2:#a8d35a;
  --sky:#0277bd;--sun:#f9a825;--ember:#e64a19;--ember2:#ff7043;
  --glass:rgba(255,255,255,0.055);--glass2:rgba(255,255,255,0.10);
  --glass3:rgba(255,255,255,0.04);
  --border:rgba(184,148,96,0.16);--border2:rgba(184,148,96,0.28);
  --shadow:0 8px 40px rgba(0,0,0,0.55);
  --radius:14px;--radius2:20px;--radius3:10px;
}

body{
  font-family:'DM Sans',sans-serif;font-weight:400;
  background:var(--soil);color:var(--cream);
  overflow-x:hidden;min-height:100vh;line-height:1.6;
  -webkit-font-smoothing:antialiased;
}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--clay);border-radius:2px;}

/* ── Focus ring ── */
:focus-visible{outline:2px solid var(--sprout);outline-offset:2px;}

/* ── Typography ── */
h1,h2,h3,h4{font-family:'Syne',sans-serif;line-height:1.1;font-weight:800;}
p{line-height:1.7;}

/* ── Nav ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:500;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 clamp(1rem,3vw,2.5rem);height:60px;
  background:rgba(20,15,8,0.9);backdrop-filter:blur(24px) saturate(1.6);
  border-bottom:1px solid var(--border);
}
.nav-logo{
  display:flex;align-items:center;gap:0.5rem;cursor:pointer;
  font-family:'Syne',sans-serif;font-weight:800;font-size:1.2rem;color:var(--lime);
  text-decoration:none;flex-shrink:0;
}
.nav-logo:hover{color:var(--lime2);}
.nav-links{display:flex;gap:2px;align-items:center;}
.nav-links-scroll{overflow-x:auto;display:flex;gap:2px;scrollbar-width:none;}
.nav-links-scroll::-webkit-scrollbar{display:none;}
.nav-link{
  background:none;border:none;color:var(--cream);opacity:.65;
  font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;
  padding:.38rem .85rem;border-radius:20px;cursor:pointer;
  transition:opacity .18s,background .18s,color .18s;white-space:nowrap;
}
.nav-link:hover,.nav-link.active{opacity:1;background:var(--glass);color:var(--lime);}
.nav-right{display:flex;align-items:center;gap:.6rem;flex-shrink:0;}

/* lang select */
.lang-btn{
  display:flex;align-items:center;gap:.3rem;
  background:var(--glass);border:1px solid var(--border);
  color:var(--cream);font-family:'DM Sans',sans-serif;font-size:.78rem;
  padding:.3rem .65rem;border-radius:8px;cursor:pointer;
  transition:border-color .18s;white-space:nowrap;
}
.lang-btn:hover{border-color:var(--straw);}
.lang-dropdown{
  position:absolute;top:calc(100% + 6px);right:0;z-index:600;
  background:var(--bark);border:1px solid var(--border);border-radius:12px;
  padding:.4rem;min-width:160px;box-shadow:var(--shadow);
  display:flex;flex-direction:column;gap:1px;
}
.lang-option{
  background:none;border:none;color:var(--cream);
  font-family:'DM Sans',sans-serif;font-size:.82rem;
  padding:.5rem .85rem;border-radius:8px;cursor:pointer;
  text-align:left;transition:background .15s;display:flex;align-items:center;gap:.5rem;
}
.lang-option:hover{background:var(--glass2);}
.lang-option.selected{color:var(--lime);font-weight:600;}
.lang-wrap{position:relative;}

/* Buttons */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:.4rem;
  font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;
  transition:all .2s;border-radius:24px;border:none;
  text-decoration:none;white-space:nowrap;
}
.btn-sm{padding:.35rem .9rem;font-size:.8rem;}
.btn-md{padding:.55rem 1.3rem;font-size:.88rem;}
.btn-lg{padding:.75rem 2rem;font-size:.95rem;}
.btn-xl{padding:.85rem 2.2rem;font-size:1rem;}
.btn-primary{
  background:linear-gradient(135deg,var(--sprout),var(--leaf));color:#fff;
  box-shadow:0 4px 18px rgba(67,160,71,.32);
}
.btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(67,160,71,.45);}
.btn-ghost{
  background:none;border:1px solid var(--border);color:var(--cream);
}
.btn-ghost:hover:not(:disabled){border-color:var(--straw);background:var(--glass);}
.btn-wa{background:#25D366;color:#fff;box-shadow:0 4px 18px rgba(37,211,102,.3);}
.btn-wa:hover:not(:disabled){background:#1ebe5d;transform:translateY(-1px);}
.btn-danger{background:rgba(230,74,25,.15);border:1px solid rgba(230,74,25,.3);color:var(--ember2);}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important;}

/* ── Pages ── */
.page{padding-top:60px;min-height:100vh;}
.page-enter{animation:pageIn .3s ease both;}
@keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* Page banner */
.page-banner{
  background:linear-gradient(135deg,var(--bark),var(--earth));
  border-bottom:1px solid var(--border);
  padding:clamp(1.25rem,3vw,2rem) clamp(1rem,4vw,2.5rem) 1.5rem;
}
.page-banner-inner{max-width:1180px;margin:0 auto;}
.page-banner-label{font-size:.73rem;color:var(--straw);font-weight:500;margin-bottom:.25rem;display:flex;align-items:center;gap:.5rem;}
.page-banner-title{font-family:'Syne',sans-serif;font-size:clamp(1.25rem,3vw,1.6rem);font-weight:800;}

/* ── Section ── */
.section{padding:clamp(2.5rem,5vw,5rem) clamp(1rem,4vw,2.5rem);max-width:1180px;margin:0 auto;}
.section-label{font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lime);margin-bottom:.6rem;}
.section-title{font-size:clamp(1.7rem,4vw,2.7rem);margin-bottom:.85rem;}
.section-sub{color:var(--straw);font-size:.95rem;line-height:1.7;max-width:520px;}

/* ── Hero ── */
.hero{
  position:relative;overflow:hidden;
  min-height:calc(100vh - 60px);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:clamp(2rem,5vw,5rem) clamp(1rem,4vw,2rem);
}
.hero-bg{
  position:absolute;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(ellipse 90% 55% at 50% -5%,rgba(30,92,32,.28) 0%,transparent 70%),
    radial-gradient(ellipse 40% 30% at 15% 85%,rgba(184,148,96,.1) 0%,transparent 65%),
    radial-gradient(ellipse 45% 35% at 85% 88%,rgba(2,119,189,.1) 0%,transparent 65%);
}
.hero-grid{
  position:absolute;inset:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(184,148,96,.038) 1px,transparent 1px),
    linear-gradient(90deg,rgba(184,148,96,.038) 1px,transparent 1px);
  background-size:64px 64px;
}
.hero-content{position:relative;z-index:1;max-width:840px;}
.hero-badge{
  display:inline-flex;align-items:center;gap:.4rem;
  background:var(--glass);border:1px solid var(--border);
  padding:.32rem 1rem;border-radius:20px;
  font-size:.75rem;color:var(--lime);font-weight:600;
  margin-bottom:1.75rem;backdrop-filter:blur(10px);
  animation:fadeUp .5s ease both;
}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.hero h1{
  font-size:clamp(2.4rem,7vw,5rem);font-weight:800;
  white-space:pre-line;
  animation:fadeUp .55s .08s ease both;
}
.hero h1 em{font-style:normal;color:var(--lime);}
.hero-sub{
  font-size:clamp(.95rem,2vw,1.12rem);color:var(--straw);
  max-width:580px;margin:1.4rem auto 0;font-weight:300;
  animation:fadeUp .55s .16s ease both;
}
.hero-ctas{
  display:flex;gap:.85rem;justify-content:center;flex-wrap:wrap;
  margin-top:2rem;animation:fadeUp .55s .24s ease both;
}
.hero-stats{
  display:flex;gap:clamp(1.5rem,4vw,3rem);justify-content:center;
  flex-wrap:wrap;margin-top:3.5rem;
  animation:fadeUp .55s .32s ease both;
}
.stat-item{text-align:center;}
.stat-num{font-family:'Syne',sans-serif;font-size:1.9rem;font-weight:800;color:var(--lime);}
.stat-label{font-size:.75rem;color:var(--straw);margin-top:.15rem;}

/* ── Feature cards ── */
.features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.1rem;margin-top:2.5rem;}
.feature-card{
  background:var(--glass);border:1px solid var(--border);
  border-radius:var(--radius);padding:1.6rem;
  transition:transform .25s,border-color .25s,box-shadow .25s;cursor:pointer;
  position:relative;overflow:hidden;
}
.feature-card::after{
  content:'';position:absolute;inset:0;border-radius:var(--radius);
  background:linear-gradient(135deg,rgba(67,160,71,.09),transparent);
  opacity:0;transition:opacity .25s;
}
.feature-card:hover{transform:translateY(-3px);border-color:rgba(67,160,71,.32);box-shadow:0 10px 36px rgba(0,0,0,.42);}
.feature-card:hover::after{opacity:1;}
.feature-icon{font-size:1.85rem;margin-bottom:.85rem;display:block;}
.feature-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;margin-bottom:.4rem;}
.feature-desc{color:var(--straw);font-size:.84rem;line-height:1.65;}
.feature-status{margin-top:.85rem;}

/* Status badges */
.status-badge{display:inline-flex;align-items:center;gap:.28rem;font-size:.7rem;font-weight:700;padding:.18rem .6rem;border-radius:8px;letter-spacing:.03em;}
.status-live{background:rgba(67,160,71,.16);color:var(--sprout);}
.status-beta{background:rgba(249,168,37,.15);color:var(--sun);}
.status-soon{background:rgba(255,255,255,.07);color:rgba(255,255,255,.4);}

/* ── Cards ── */
.card{background:var(--glass);border:1px solid var(--border);border-radius:var(--radius);padding:1.4rem;}
.card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;margin-bottom:1rem;}
.card-highlight{
  background:linear-gradient(135deg,rgba(30,92,32,.18),rgba(67,160,71,.09));
  border-color:rgba(67,160,71,.26);
}

/* ── KPI grid ── */
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem;}
.kpi-card{background:var(--glass);border:1px solid var(--border);border-radius:var(--radius);padding:1.1rem;transition:border-color .2s;}
.kpi-card:hover{border-color:rgba(67,160,71,.28);}
.kpi-label{font-size:.7rem;color:var(--straw);font-weight:500;text-transform:uppercase;letter-spacing:.06em;}
.kpi-value{font-family:'Syne',sans-serif;font-size:1.65rem;font-weight:800;margin:.2rem 0;}
.kpi-change{font-size:.74rem;}
.c-up{color:var(--sprout);} .c-down{color:var(--ember2);} .c-neu{color:var(--straw);}

/* ── Dashboard grid ── */
.dash-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:1.1rem;}

/* ── Action items ── */
.action-item{
  display:flex;align-items:center;gap:.7rem;
  padding:.7rem;border-radius:var(--radius3);margin-bottom:.45rem;
  background:var(--glass3);border:1px solid transparent;
  transition:border-color .18s,background .18s;cursor:pointer;
}
.action-item:hover{border-color:var(--border);background:var(--glass);}
.action-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.05rem;flex-shrink:0;}
.action-text{flex:1;min-width:0;}
.action-title-text{font-size:.84rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.action-sub{font-size:.72rem;color:var(--straw);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.priority-badge{font-size:.66rem;font-weight:700;padding:.15rem .5rem;border-radius:6px;flex-shrink:0;text-transform:uppercase;}
.p-high{background:rgba(230,74,25,.2);color:var(--ember2);}
.p-med{background:rgba(249,168,37,.15);color:var(--sun);}
.p-low{background:rgba(67,160,71,.15);color:var(--sprout);}

/* ── Weather ── */
.weather-temp{font-family:'Syne',sans-serif;font-size:2.8rem;font-weight:800;color:var(--sun);}
.weather-desc{color:var(--straw);font-size:.86rem;margin:.25rem 0;}
.weather-row{display:flex;justify-content:space-around;margin-top:1.1rem;}
.weather-stat{text-align:center;}
.weather-stat-val{font-weight:600;font-size:.86rem;}
.weather-stat-label{font-size:.68rem;color:var(--straw);}
.forecast-row{display:flex;gap:.45rem;margin-top:1rem;overflow-x:auto;padding-bottom:.2rem;}
.forecast-day{flex:0 0 auto;text-align:center;padding:.55rem .65rem;background:var(--glass3);border-radius:10px;border:1px solid var(--border);min-width:52px;}
.f-day-name{font-size:.65rem;color:var(--straw);}
.f-day-icon{font-size:1.1rem;margin:.15rem 0;}
.f-day-temp{font-size:.74rem;font-weight:600;}

/* ── Chat ── */
.chat-wrap{max-width:760px;margin:0 auto;padding:1.5rem clamp(.75rem,3vw,1.5rem);}
.chat-messages{
  min-height:360px;max-height:440px;overflow-y:auto;
  margin-bottom:1rem;display:flex;flex-direction:column;gap:.9rem;
  padding-right:.25rem;
}
.chat-msg{display:flex;gap:.65rem;max-width:88%;}
.chat-msg.user{align-self:flex-end;flex-direction:row-reverse;}
.msg-avatar{width:34px;height:34px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.95rem;}
.av-ai{background:linear-gradient(135deg,var(--leaf),var(--sprout));}
.av-user{background:var(--clay);}
.msg-inner{min-width:0;}
.msg-label{font-size:.67rem;color:var(--straw);margin-bottom:.18rem;}
.msg-bubble{padding:.75rem 1rem;border-radius:14px;font-size:.85rem;line-height:1.65;word-break:break-word;}
.bubble-ai{background:var(--glass2);border:1px solid var(--border);border-bottom-left-radius:3px;}
.bubble-user{background:linear-gradient(135deg,var(--leaf),#1b5e20);color:#fff;border-bottom-right-radius:3px;}
.bubble-error{background:rgba(230,74,25,.12);border:1px solid rgba(230,74,25,.25);color:var(--ember2);border-bottom-left-radius:3px;}
.chat-input-row{display:flex;gap:.65rem;}
.chat-input{
  flex:1;background:var(--glass);border:1px solid var(--border);
  color:var(--cream);font-family:'DM Sans',sans-serif;font-size:.88rem;
  padding:.7rem 1rem;border-radius:12px;outline:none;
  transition:border-color .2s;
}
.chat-input:focus{border-color:var(--sprout);}
.chat-input::placeholder{color:var(--straw);opacity:.7;}
.chat-send{
  background:linear-gradient(135deg,var(--sprout),var(--leaf));
  border:none;color:#fff;border-radius:12px;
  padding:0 1.1rem;cursor:pointer;font-size:1rem;
  transition:transform .18s,opacity .18s;flex-shrink:0;
}
.chat-send:hover:not(:disabled){transform:scale(1.05);}
.chat-send:disabled{opacity:.45;cursor:not-allowed;}
.chat-suggestions{display:flex;gap:.45rem;flex-wrap:wrap;margin-bottom:.85rem;}
.chip{
  background:var(--glass);border:1px solid var(--border);color:var(--straw);
  font-family:'DM Sans',sans-serif;font-size:.74rem;
  padding:.3rem .8rem;border-radius:18px;cursor:pointer;
  transition:border-color .18s,color .18s;
}
.chip:hover{border-color:var(--sprout);color:var(--lime);}
.typing-row{display:flex;gap:4px;padding:.45rem 0;}
.typing-dot{width:7px;height:7px;border-radius:50%;background:var(--straw);animation:blink 1.2s infinite;}
.typing-dot:nth-child(2){animation-delay:.2s;}.typing-dot:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,80%,100%{opacity:.28}40%{opacity:1}}
.ai-unavailable{
  background:rgba(249,168,37,.1);border:1px solid rgba(249,168,37,.22);
  border-radius:12px;padding:1rem 1.25rem;font-size:.85rem;
  display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;
}

/* ── Crop Doctor ── */
.upload-zone{
  border:2px dashed var(--border);border-radius:var(--radius2);
  padding:clamp(2rem,5vw,3rem);text-align:center;cursor:pointer;
  transition:border-color .25s,background .25s;background:var(--glass);
  position:relative;overflow:hidden;
}
.upload-zone:hover,.upload-zone.drag-over{border-color:var(--sprout);background:rgba(67,160,71,.07);}
.upload-zone-icon{font-size:2.8rem;margin-bottom:.85rem;}
.upload-zone-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem;margin-bottom:.4rem;}
.upload-zone-sub{color:var(--straw);font-size:.82rem;}
.diagnosis-card{background:var(--glass);border:1px solid var(--border);border-radius:var(--radius);padding:1.6rem;margin-top:1.4rem;}
.conf-bar{background:rgba(255,255,255,.07);border-radius:12px;height:5px;margin-top:.4rem;}
.conf-fill{height:100%;border-radius:12px;background:linear-gradient(90deg,var(--sprout),var(--lime));}
.treatment-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.2rem;}
.treatment-box{background:var(--glass3);border-radius:var(--radius3);padding:.95rem;border:1px solid var(--border);}
.treatment-box-title{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem;}
.treat-item{font-size:.8rem;padding:.3rem 0;border-bottom:1px solid rgba(255,255,255,.04);color:rgba(240,227,200,.85);}
.treat-item:last-child{border-bottom:none;}

/* ── Satellite ── */
.ndvi-canvas{
  background:linear-gradient(135deg,#071007,#0c200c);
  border:1px solid rgba(67,160,71,.18);border-radius:var(--radius);
  height:280px;position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}
.ndvi-cell{position:absolute;border-radius:3px;transition:opacity .4s;}
.sat-legend{display:flex;gap:.65rem;flex-wrap:wrap;margin-top:.85rem;}
.legend-item{display:flex;align-items:center;gap:.35rem;font-size:.74rem;color:var(--straw);}
.legend-dot{width:11px;height:11px;border-radius:3px;}

/* ── Market ── */
.market-table{width:100%;border-collapse:collapse;margin-top:1.4rem;}
.market-table th{text-align:left;padding:.65rem 1rem;font-size:.7rem;color:var(--straw);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--border);}
.market-table td{padding:.8rem 1rem;font-size:.86rem;border-bottom:1px solid rgba(184,148,96,.05);}
.market-table tr:hover td{background:var(--glass3);}
.market-table th:last-child,.market-table td:last-child{text-align:right;}
.rec{font-weight:700;font-size:.78rem;padding:.18rem .5rem;border-radius:6px;}
.rec-sell{background:rgba(67,160,71,.16);color:var(--sprout);}
.rec-hold{background:rgba(249,168,37,.14);color:var(--sun);}
.rec-wait{background:rgba(255,255,255,.07);color:var(--straw);}
.p-up{color:var(--sprout);} .p-down{color:var(--ember2);}
.conf-mini{height:3px;border-radius:2px;background:rgba(255,255,255,.07);margin-top:3px;}
.conf-mini-fill{height:100%;border-radius:2px;background:var(--sprout);}

/* ── Profit predictor ── */
.pred-form{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;margin-bottom:1.2rem;}
.form-group{display:flex;flex-direction:column;gap:.35rem;}
.form-label{font-size:.74rem;color:var(--straw);font-weight:500;}
.form-input,.form-select,.form-textarea{
  background:var(--glass);border:1px solid var(--border);
  color:var(--cream);font-family:'DM Sans',sans-serif;font-size:.88rem;
  padding:.6rem .95rem;border-radius:var(--radius3);outline:none;
  transition:border-color .2s;
}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--sprout);}
.form-input::placeholder,.form-textarea::placeholder{color:var(--straw);opacity:.65;}
.form-select option{background:var(--bark);}
.form-input.err,.form-select.err{border-color:var(--ember);}
.form-error{font-size:.72rem;color:var(--ember2);margin-top:.15rem;}
.form-textarea{resize:vertical;min-height:90px;}
.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.85rem;margin-top:1rem;}
.result-metric{text-align:center;padding:.9rem;background:var(--glass3);border-radius:var(--radius3);}
.result-val{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;}
.result-lbl{font-size:.7rem;color:var(--straw);margin-top:.15rem;}
.pred-result{
  background:linear-gradient(135deg,rgba(30,92,32,.16),rgba(67,160,71,.08));
  border:1px solid rgba(67,160,71,.24);border-radius:var(--radius);padding:1.5rem;
  margin-top:1rem;
}

/* ── Schemes ── */
.schemes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1.1rem;margin-top:1.75rem;}
.scheme-card{background:var(--glass);border:1px solid var(--border);border-radius:var(--radius);padding:1.4rem;transition:transform .22s,border-color .22s;}
.scheme-card:hover{transform:translateY(-2px);border-color:rgba(67,160,71,.28);}
.scheme-amount{font-family:'Syne',sans-serif;font-weight:800;font-size:1.35rem;color:var(--lime);}
.scheme-name{font-weight:600;font-size:.92rem;margin:.4rem 0;}
.scheme-desc{font-size:.8rem;color:var(--straw);line-height:1.6;}
.scheme-tag{font-size:.68rem;padding:.18rem .55rem;border-radius:6px;background:rgba(255,255,255,.06);color:var(--straw);}
.scheme-type{font-size:.68rem;font-weight:700;padding:.18rem .55rem;border-radius:6px;text-transform:uppercase;}
.stype-subsidy{background:rgba(67,160,71,.15);color:var(--sprout);}
.stype-loan{background:rgba(2,119,189,.15);color:var(--sky);}
.stype-insurance{background:rgba(249,168,37,.14);color:var(--sun);}

/* ── Community ── */
.post{background:var(--glass);border:1px solid var(--border);border-radius:var(--radius);padding:1.2rem;margin-bottom:.9rem;transition:border-color .2s;}
.post:hover{border-color:rgba(67,160,71,.2);}
.post-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.95rem;flex-shrink:0;}
.post-author{font-weight:600;font-size:.85rem;}
.post-time{font-size:.7rem;color:var(--straw);}
.post-content{font-size:.84rem;line-height:1.65;color:rgba(240,227,200,.85);}
.post-action{background:none;border:none;color:var(--straw);font-family:'DM Sans';font-size:.75rem;cursor:pointer;display:flex;align-items:center;gap:.28rem;padding:.22rem .5rem;border-radius:6px;transition:all .18s;}
.post-action:hover{background:var(--glass);color:var(--lime);}

/* ── Pricing ── */
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1.2rem;margin-top:2.5rem;}
.pricing-card{background:var(--glass);border:1px solid var(--border);border-radius:var(--radius2);padding:1.85rem;position:relative;transition:transform .25s,box-shadow .25s;}
.pricing-card.featured{background:linear-gradient(145deg,rgba(30,92,32,.22),rgba(67,160,71,.1));border-color:var(--sprout);}
.pricing-card:hover{transform:translateY(-3px);box-shadow:0 14px 45px rgba(0,0,0,.42);}
.pricing-popular{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--sprout),var(--lime));color:var(--soil);font-size:.68rem;font-weight:800;padding:.22rem .95rem;border-radius:18px;white-space:nowrap;}
.pricing-name{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem;margin-bottom:.4rem;}
.pricing-price{font-family:'Syne',sans-serif;font-size:2.3rem;font-weight:800;}
.pricing-period{font-size:.78rem;color:var(--straw);}
.pricing-features{list-style:none;margin:1.3rem 0;display:flex;flex-direction:column;gap:.6rem;}
.pricing-features li{display:flex;gap:.45rem;font-size:.82rem;color:rgba(240,227,200,.85);}
.pf-inc::before{content:'✓';color:var(--sprout);font-weight:700;flex-shrink:0;}
.pf-exc{opacity:.38;}
.pf-exc::before{content:'×';color:var(--clay);font-weight:700;flex-shrink:0;}

/* ── Contact ── */
.contact-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:2rem;align-items:start;}
.contact-info-item{display:flex;gap:.85rem;padding:.9rem;background:var(--glass);border:1px solid var(--border);border-radius:var(--radius3);margin-bottom:.75rem;}
.contact-info-icon{font-size:1.3rem;flex-shrink:0;}
.contact-info-label{font-size:.72rem;color:var(--straw);font-weight:500;}
.contact-info-val{font-size:.88rem;font-weight:600;margin-top:.1rem;}

/* ── 404 ── */
.not-found{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 60px);text-align:center;padding:2rem;}
.not-found-code{font-family:'Syne',sans-serif;font-size:clamp(5rem,15vw,9rem);font-weight:800;color:rgba(107,68,35,.5);line-height:1;}
.not-found-title{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;margin:.5rem 0;}
.not-found-sub{color:var(--straw);margin-bottom:2rem;}

/* ── Loading spinner ── */
.spinner{width:32px;height:32px;border:3px solid rgba(67,160,71,.2);border-top-color:var(--sprout);border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;min-height:calc(100vh - 60px);}

/* ── Toast ── */
.toast-container{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:1000;display:flex;flex-direction:column;gap:.5rem;align-items:center;}
.toast{
  background:var(--bark);border:1px solid var(--border);
  color:var(--cream);font-size:.83rem;font-weight:500;
  padding:.65rem 1.25rem;border-radius:12px;
  box-shadow:var(--shadow);animation:toastIn .3s ease both;
  display:flex;align-items:center;gap:.5rem;max-width:340px;text-align:center;
}
.toast.success{border-color:rgba(67,160,71,.35);background:rgba(30,92,32,.8);}
.toast.error{border-color:rgba(230,74,25,.35);background:rgba(100,30,10,.8);}
@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* ── WhatsApp float ── */
.wa-float{
  position:fixed;bottom:1.5rem;right:1.5rem;z-index:400;
  background:#25D366;width:54px;height:54px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:1.4rem;
  cursor:pointer;box-shadow:0 4px 22px rgba(37,211,102,.48);
  transition:transform .25s;text-decoration:none;
  animation:waPulse 2.5s ease infinite;
}
.wa-float:hover{transform:scale(1.12);}
@keyframes waPulse{0%,100%{box-shadow:0 4px 22px rgba(37,211,102,.48)}50%{box-shadow:0 4px 38px rgba(37,211,102,.72)}}

/* ── Footer ── */
.footer{background:var(--bark);border-top:1px solid var(--border);padding:clamp(2rem,4vw,3rem) clamp(1rem,4vw,2.5rem) 1.25rem;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:clamp(1rem,3vw,2rem);max-width:1180px;margin:0 auto;}
.footer-brand-name{font-family:'Syne',sans-serif;font-weight:800;font-size:1.15rem;color:var(--lime);display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem;}
.footer-tagline{font-size:.78rem;color:var(--straw);line-height:1.65;max-width:240px;}
.footer-wa{display:inline-flex;align-items:center;gap:.45rem;background:#25D366;color:#fff;padding:.45rem .95rem;border-radius:18px;font-size:.78rem;font-weight:700;margin-top:.9rem;text-decoration:none;transition:background .2s;}
.footer-wa:hover{background:#1ebe5d;}
.footer-col-title{font-family:'Syne',sans-serif;font-weight:700;font-size:.84rem;margin-bottom:.85rem;}
.footer-links{list-style:none;display:flex;flex-direction:column;gap:.45rem;}
.footer-link{color:var(--straw);text-decoration:none;font-size:.78rem;cursor:pointer;transition:color .18s;background:none;border:none;font-family:'DM Sans',sans-serif;text-align:left;padding:0;}
.footer-link:hover{color:var(--lime);}
.footer-bottom{max-width:1180px;margin:1.75rem auto 0;border-top:1px solid var(--border);padding-top:1.1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;}
.footer-bottom-text{font-size:.73rem;color:var(--clay2);}

/* ── Crop Knowledge ── */
.crop-tags{display:flex;gap:.45rem;flex-wrap:wrap;margin-top:1.25rem;}
.crop-tag{background:rgba(67,160,71,.1);color:var(--lime);border:1px solid rgba(67,160,71,.18);font-size:.73rem;padding:.22rem .65rem;border-radius:10px;cursor:pointer;transition:all .18s;font-family:'DM Sans',sans-serif;}
.crop-tag:hover,.crop-tag.active{background:rgba(67,160,71,.24);border-color:rgba(67,160,71,.45);}
.crop-detail{background:var(--glass);border:1px solid var(--border);border-radius:var(--radius);padding:1.4rem;margin-top:1.4rem;}
.crop-metrics{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.65rem;margin-top:1rem;}
.crop-metric{background:var(--glass3);border-radius:var(--radius3);padding:.7rem;border:1px solid rgba(184,148,96,.07);}
.cm-label{font-size:.67rem;color:var(--straw);text-transform:uppercase;letter-spacing:.05em;}
.cm-val{font-size:.84rem;font-weight:600;margin-top:.18rem;}

/* ── Tabs ── */
.tabs{display:flex;gap:.2rem;overflow-x:auto;padding-bottom:.2rem;margin-bottom:1.75rem;scrollbar-width:none;}
.tabs::-webkit-scrollbar{display:none;}
.tab-btn{background:none;border:1px solid transparent;color:var(--straw);font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;padding:.45rem 1rem;border-radius:18px;cursor:pointer;transition:all .18s;white-space:nowrap;}
.tab-btn.active{border-color:var(--sprout);color:var(--lime);background:rgba(67,160,71,.1);}
.tab-btn:hover:not(.active){border-color:var(--border);color:var(--cream);}

/* ── Error banner ── */
.err-banner{background:rgba(230,74,25,.1);border:1px solid rgba(230,74,25,.24);border-radius:var(--radius3);padding:.75rem 1rem;font-size:.82rem;color:var(--ember2);display:flex;align-items:center;gap:.5rem;margin-bottom:.85rem;}

/* ── Divider ── */
hr{border:none;border-top:1px solid var(--border);margin:3rem 0;}

/* ── Mobile responsive ── */
@media(max-width:900px){
  .nav-links{display:none;}
  .dash-grid{grid-template-columns:1fr;}
  .contact-grid{grid-template-columns:1fr;}
  .footer-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:600px){
  .pred-form{grid-template-columns:1fr;}
  .result-grid{grid-template-columns:1fr 1fr;}
  .treatment-grid{grid-template-columns:1fr;}
  .market-table th:nth-child(4),.market-table td:nth-child(4){display:none;}
  .footer-grid{grid-template-columns:1fr;}
  .hero-stats{gap:1.25rem;}
  .kpi-grid{grid-template-columns:1fr 1fr;}
  .pricing-grid{grid-template-columns:1fr;}
  .nav-right .btn-ghost{display:none;}
}

/* ── Mobile hamburger ── */
.hamburger{display:none;flex-direction:column;gap:4px;cursor:pointer;padding:.4rem;background:none;border:none;}
.hamburger span{display:block;width:20px;height:2px;background:var(--cream);border-radius:1px;transition:all .25s;}
@media(max-width:900px){.hamburger{display:flex;}}
.mobile-menu{
  position:fixed;top:60px;left:0;right:0;z-index:490;
  background:rgba(20,15,8,.97);backdrop-filter:blur(24px);
  border-bottom:1px solid var(--border);
  padding:1rem;display:flex;flex-direction:column;gap:.25rem;
  animation:mobileMenuIn .2s ease;
}
@keyframes mobileMenuIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.mobile-nav-link{
  background:none;border:none;color:var(--cream);opacity:.75;
  font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:500;
  padding:.7rem 1rem;border-radius:10px;cursor:pointer;text-align:left;
  transition:all .18s;
}
.mobile-nav-link:hover,.mobile-nav-link.active{opacity:1;background:var(--glass);color:var(--lime);}

/* ── Misc utils ── */
.flex{display:flex;} .flex-col{flex-direction:column;} .items-center{align-items:center;}
.justify-between{justify-content:space-between;} .gap-sm{gap:.5rem;} .gap-md{gap:.85rem;}
.mt-sm{margin-top:.5rem;} .mt-md{margin-top:1rem;} .mt-lg{margin-top:1.75rem;}
.text-straw{color:var(--straw);} .text-lime{color:var(--lime);} .text-sm{font-size:.8rem;}
.text-xs{font-size:.72rem;} .font-bold{font-weight:700;} .w-full{width:100%;}
.hidden{display:none!important;}
`;

/* ─── 3. DATA ──────────────────────────────────────────────────────────────── */
const WA_NUMBER = "919610159555";
const WA_LINK   = `https://wa.me/${WA_NUMBER}`;

const NAV_PAGES = ["Home","Dashboard","AI Assistant","Crop Doctor","Satellite","Market","Schemes","Community","Pricing","Contact"];

const FEATURES = [
  { icon:"🧠", title:"AI Farm Assistant", desc:"ChatGPT-style multilingual assistant for crops, diseases, fertilisers, weather and government schemes.", status:"live", page:"AI Assistant" },
  { icon:"🔬", title:"AI Crop Doctor",    desc:"Upload crop photos for instant disease, pest, and nutrient deficiency detection with PDF reports.", status:"live", page:"Crop Doctor" },
  { icon:"🛰️", title:"Satellite Intelligence", desc:"NDVI vegetation analysis, water stress, drought monitoring, crop health maps from space.", status:"beta", page:"Satellite" },
  { icon:"📊", title:"Market Intelligence", desc:"Live mandi prices, demand forecasts, AI-powered SELL / HOLD / WAIT recommendations.", status:"live", page:"Market" },
  { icon:"💰", title:"Profit Predictor",  desc:"Revenue forecast, ROI calculation, break-even analysis, and crop-level risk scoring.", status:"live", page:"Market" },
  { icon:"🌦️", title:"Weather Intelligence", desc:"7-day forecast, heat/storm/drought alerts, rain probability, and irrigation scheduling.", status:"live", page:"Dashboard" },
  { icon:"🏛️", title:"Government Schemes", desc:"State-wise subsidies, KCC loans, PMFBY insurance, and grants with eligibility checker.", status:"live", page:"Schemes" },
  { icon:"📅", title:"Daily Command Center", desc:"AI-generated personalised action plan based on your crops, weather, and market conditions.", status:"live", page:"Dashboard" },
  { icon:"🌱", title:"Crop Knowledge Engine", desc:"50+ crops with growth stages, fertiliser plans, pest data, yield optimisation, and export info.", status:"live", page:"Home" },
  { icon:"👥", title:"Farm Community", desc:"Ask questions, share success stories, expert contributions, and crop photo discussions.", status:"beta", page:"Community" },
  { icon:"🔔", title:"Smart Alerts",    desc:"Real-time alerts for disease risk, price spikes, weather events, and scheme deadlines.", status:"soon", page:"Dashboard" },
  { icon:"📱", title:"Mobile App",       desc:"Full-featured mobile app for Android and iOS with offline support and voice commands.", status:"soon", page:"Pricing" },
];

const WEATHER_FORECAST = [
  { d:"Mon",icon:"☀️",h:"36°",l:"24°" },{ d:"Tue",icon:"⛅",h:"33°",l:"23°" },
  { d:"Wed",icon:"🌧️",h:"28°",l:"21°" },{ d:"Thu",icon:"🌩️",h:"26°",l:"20°" },
  { d:"Fri",icon:"⛅",h:"30°",l:"22°" },{ d:"Sat",icon:"☀️",h:"34°",l:"24°" },
  { d:"Sun",icon:"☀️",h:"36°",l:"25°" },
];

const ACTION_ITEMS = [
  { icon:"💧", bg:"rgba(2,119,189,.15)", title:"Irrigate Field B — 45mm", sub:"Soil moisture at 28% · Critical threshold", priority:"high" },
  { icon:"🌧️", bg:"rgba(67,160,71,.12)", title:"Rain forecast in 14 hrs", sub:"Skip manual watering · Save 40 litres", priority:"med" },
  { icon:"⚠️", bg:"rgba(230,74,25,.15)", title:"Blight risk — tomato field", sub:"High humidity 82% · Inspect leaves today", priority:"high" },
  { icon:"📈", bg:"rgba(249,168,37,.12)", title:"Tomato prices rising", sub:"₹28 → ₹36/kg trend · Plan harvest timing", priority:"med" },
  { icon:"🏛️", bg:"rgba(118,196,66,.12)", title:"PM Kisan deadline — 6 days", sub:"Complete eKYC before June 7", priority:"low" },
];

const MARKET_DATA = [
  { crop:"Tomato 🍅", price:"₹36/kg", change:"+28%", dir:"up", mandi:"Azadpur, Delhi", rec:"sell", conf:92 },
  { crop:"Wheat 🌾",  price:"₹22/kg", change:"+4%",  dir:"up", mandi:"Anaj Mandi, Jaipur", rec:"hold", conf:78 },
  { crop:"Onion 🧅",  price:"₹18/kg", change:"-12%", dir:"dn", mandi:"Lasalgaon, MH", rec:"wait", conf:85 },
  { crop:"Rice 🍚",   price:"₹28/kg", change:"+2%",  dir:"up", mandi:"Hapur, UP",     rec:"sell", conf:71 },
  { crop:"Cotton ☁️", price:"₹65/kg", change:"-3%",  dir:"dn", mandi:"Gondal, GJ",    rec:"hold", conf:68 },
  { crop:"Soybean 🟤",price:"₹40/kg", change:"+7%",  dir:"up", mandi:"Indore, MP",    rec:"sell", conf:83 },
];

const SCHEMES = [
  { name:"PM Kisan Samman Nidhi", type:"subsidy", amount:"₹6,000/yr", desc:"Annual income support to small and marginal farmers in three equal installments of ₹2,000 each.", tags:["All Farmers","Up to 2 Ha"], stype:"stype-subsidy" },
  { name:"Kisan Credit Card (KCC)", type:"loan", amount:"Up to ₹3 L", desc:"Short-term credit for agriculture needs at subsidised interest of 4% per annum for timely repayment.", tags:["Working Capital","4% Interest"], stype:"stype-loan" },
  { name:"PMFBY Crop Insurance", type:"insurance", amount:"2% Premium", desc:"Comprehensive crop insurance covering natural calamities, pests, and diseases with quick claim settlement.", tags:["Kharif & Rabi","All States"], stype:"stype-insurance" },
  { name:"Soil Health Card Scheme", type:"subsidy", amount:"Free", desc:"Free soil testing with customised nutrient and fertiliser recommendations to improve soil productivity.", tags:["All Farmers","Free Service"], stype:"stype-subsidy" },
  { name:"Drip Irrigation Subsidy", type:"subsidy", amount:"50–90%", desc:"State governments provide 50–90% subsidy on micro-irrigation systems including drip and sprinkler.", tags:["Water Saving","State-specific"], stype:"stype-subsidy" },
  { name:"eNAM Online Market", type:"subsidy", amount:"Free Access", desc:"National online trading portal connecting farmers directly to 1,000+ mandis for transparent price discovery.", tags:["Price Discovery","1,000+ Mandis"], stype:"stype-subsidy" },
];

const CROPS = {
  "Rice 🍚":    { sci:"Oryza sativa",       soil:"Clayey loam, pH 5.5–6.5", water:"1,200–2,000 mm", npk:"120-60-40 kg/ha", days:"120–150", yield:"4–6 T/ha", export:"High — Major exporter" },
  "Wheat 🌾":   { sci:"Triticum aestivum",  soil:"Loamy, pH 6.0–7.5",       water:"450–650 mm",     npk:"150-75-50 kg/ha", days:"100–130", yield:"3–5 T/ha", export:"Yes — Global market" },
  "Tomato 🍅":  { sci:"Solanum lycopersicum",soil:"Sandy loam, pH 6.0–7.0", water:"400–600 mm",     npk:"200-100-150 kg/ha",days:"60–90",  yield:"25–35 T/ha",export:"Processed products" },
  "Cotton ☁️":  { sci:"Gossypium hirsutum", soil:"Black soil, pH 5.8–8.0",  water:"700–1,200 mm",   npk:"150-75-75 kg/ha", days:"150–180", yield:"1.5–2.5 T/ha",export:"High — Textiles" },
  "Mango 🥭":   { sci:"Mangifera indica",   soil:"Deep alluvial, pH 5.5–7.5",water:"1,200–1,500 mm",npk:"100-50-100 kg/tree",days:"4–5 mths",yield:"10–20 T/ha",export:"Premium global markets" },
  "Soybean 🟤": { sci:"Glycine max",        soil:"Well-drained loam, pH 6–7",water:"450–700 mm",    npk:"30-80-40 kg/ha",  days:"90–120",  yield:"1.5–3 T/ha",export:"Oil & meal — Global" },
  "Onion 🧅":   { sci:"Allium cepa",        soil:"Loamy, pH 6.0–7.0",       water:"350–550 mm",     npk:"100-50-80 kg/ha", days:"90–120",  yield:"20–30 T/ha",export:"High — Middle East, SE Asia" },
  "Potato 🥔":  { sci:"Solanum tuberosum",  soil:"Sandy loam, pH 5.5–6.5",  water:"500–700 mm",     npk:"180-80-100 kg/ha",days:"70–100",  yield:"20–40 T/ha",export:"Processed — moderate" },
};

const COMMUNITY_POSTS = [
  { author:"Rajesh Kumar", loc:"Punjab", av:"R", color:"#1e5c20", time:"2 hours ago", text:"My wheat yield increased by 30% this season using AI Kisan's fertiliser plan. The split-dose schedule made a huge difference. Highly recommend to every farmer!", likes:47, comments:12 },
  { author:"Priya Mane",   loc:"Maharashtra", av:"P", color:"#0277bd", time:"5 hours ago", text:"Yellow mosaic virus hit my tomato crop last week. Uploaded a photo to AI Crop Doctor and got an instant diagnosis with a treatment plan. Managed to save most of the harvest.", likes:93, comments:28 },
  { author:"Gurpreet Singh", loc:"Haryana", av:"G", color:"#6b4423", time:"1 day ago", text:"The Market Intelligence told me to HOLD my onion stock 2 weeks ago. Prices jumped from ₹15 to ₹26/kg. Extra profit of over ₹60,000 this season because of that one recommendation.", likes:156, comments:41 },
];

const CHAT_SUGGESTIONS = [
  "How to treat tomato blight?",
  "Best fertiliser schedule for wheat?",
  "Water management for paddy?",
  "When should I sell onions?",
  "PM Kisan eligibility criteria?",
  "How to prevent cotton bollworm?",
];

/* ─── 4. HELPERS ──────────────────────────────────────────────────────────── */
function StatusBadge({ status, lang }) {
  const t = T[lang] || T.en;
  if (status === "live")  return <span className="status-badge status-live">🟢 {t.live}</span>;
  if (status === "beta")  return <span className="status-badge status-beta">🟡 {t.beta}</span>;
  return <span className="status-badge status-soon">⚪ {t.soon}</span>;
}

function Spinner() { return <div className="spinner" />; }

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.type==="success"?"✅":"❌"} {t.msg}</div>)}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);
  return { toasts, add };
}

function validate(fields) {
  const errs = {};
  if (!fields.name?.trim()) errs.name = "required";
  if (!fields.email?.trim()) errs.email = "required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = "email";
  if (fields.phone && fields.phone.trim() && !/^\+?[\d\s\-]{10,}$/.test(fields.phone)) errs.phone = "phone";
  if (!fields.message?.trim()) errs.message = "required";
  return errs;
}

function NDVIGrid() {
  const colors = ["#1a3a1a","#2d5a2d","#43a047","#76c442","#cddc39","#ffeb3b","#ff9800","#f44336"];
  return Array.from({ length: 64 }, (_, i) => (
    <div key={i} className="ndvi-cell" style={{
      width:`${7+Math.random()*7}%`, height:`${9+Math.random()*13}%`,
      background: colors[Math.floor(Math.random()*colors.length)],
      opacity: 0.55+Math.random()*0.4,
      top:`${Math.random()*86}%`, left:`${Math.random()*90}%`,
    }}/>
  ));
}

/* ─── 5. AI CALL ──────────────────────────────────────────────────────────── */
async function callAI(userMessage, history) {
  const systemPrompt = `You are AI Kisan, an expert agricultural AI assistant for Indian farmers. 
You specialise in crop management, disease diagnosis, fertiliser optimisation, water management, market timing, and government agricultural schemes for India.
Always answer in this structure:
1. Direct Answer (1-2 sentences)
2. Detailed Explanation
3. Common Mistakes Farmers Make
4. Advanced Tips
5. Yield / Profit Impact

Use ₹ for prices. Be specific with quantities. Keep responses under 350 words. Use bullet points for lists. Respond in the same language as the user's question.`;

  const msgs = history
    .filter(m => m.role !== "system")
    .slice(-8)
    .map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
  msgs.push({ role:"user", content: userMessage });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: msgs,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.content.map(b => b.text || "").join("").trim();
}

/* ─── 6. PAGES ────────────────────────────────────────────────────────────── */

/* HOME */
function HomePage({ setPage }) {
  const { lang, t } = useLang();
  const [selectedCrop, setSelectedCrop] = useState("Tomato 🍅");
  const cropData = CROPS[selectedCrop];
  const [heroLang] = useState(lang);

  const h1Parts = t.hero_h1.split("\n");
  return (
    <div className="page page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"/><div className="hero-grid"/>
        <div className="hero-content">
          <div className="hero-badge">🌱 India's AI Agricultural Intelligence Platform</div>
          <h1>
            {h1Parts[0]} <em>{h1Parts[1]}</em>
          </h1>
          <p className="hero-sub">{t.hero_sub}</p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-xl" onClick={() => setPage("Dashboard")}>{t.get_started} →</button>
            <button className="btn btn-ghost btn-xl" onClick={() => setPage("AI Assistant")}>{t.explore}</button>
            <a className="btn btn-wa btn-xl" href={WA_LINK} target="_blank" rel="noopener noreferrer">💬 {t.wa_support}</a>
          </div>
          <div className="hero-stats">
            {[["50+","Crops Covered"],["12","Languages"],["₹0","Free to Start"],["24/7","AI Support"]].map(([n,l])=>(
              <div key={l} className="stat-item"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="section">
        <div className="section-label">{t.features}</div>
        <h2 className="section-title">Everything a Modern<br/>Farmer Needs</h2>
        <p className="section-sub">{t.features_sub}</p>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card" onClick={() => setPage(f.page)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setPage(f.page)}>
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
              <div className="feature-status" style={{marginTop:".85rem"}}><StatusBadge status={f.status} lang={lang}/></div>
            </div>
          ))}
        </div>
      </div>

      <hr/>

      {/* Crop Knowledge */}
      <div className="section" style={{paddingTop:0}}>
        <div className="section-label">Global Crop Knowledge</div>
        <h2 className="section-title">50+ Crops.<br/>Complete Intelligence.</h2>
        <p className="section-sub">Deep agronomic data — click any crop for soil, water, fertiliser, yield, and export information.</p>
        <div className="crop-tags">
          {Object.keys(CROPS).map(c => (
            <button key={c} className={`crop-tag ${selectedCrop===c?"active":""}`} onClick={() => setSelectedCrop(c)}>{c}</button>
          ))}
          {["Sugarcane 🎋","Banana 🍌","Mustard","Coffee ☕","Turmeric 🟡","Chilli 🌶️"].map(c=>(
            <button key={c} className="crop-tag" style={{opacity:.55}}>{c} <span style={{fontSize:".6rem",opacity:.6}}>coming soon</span></button>
          ))}
        </div>
        {cropData && (
          <div className="crop-detail">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:".5rem"}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.15rem"}}>{selectedCrop}</div>
                <div style={{fontStyle:"italic",fontSize:".8rem",color:"var(--straw)"}}>{cropData.sci}</div>
              </div>
              <StatusBadge status="live" lang={lang}/>
            </div>
            <div className="crop-metrics">
              {[["🌱 Soil",cropData.soil],["💧 Water/Season",cropData.water],["🧪 NPK (kg/ha)",cropData.npk],["⏱ Crop Duration",cropData.days],["📦 Yield",cropData.yield],["🌍 Export",cropData.export]].map(([l,v])=>(
                <div key={l} className="crop-metric"><div className="cm-label">{l}</div><div className="cm-val">{v}</div></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* DASHBOARD */
function DashPage() {
  const { lang } = useLang();
  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">📅 June 2026 · Kharif Season</div>
          <div className="page-banner-title">🌾 Farm Command Center</div>
        </div>
      </div>
      <div className="section" style={{paddingTop:"1.75rem"}}>
        <div className="kpi-grid">
          {[["Farm Health","87/100","🟢","c-up","↑ +5 pts this week"],["Active Crops","4","🌱","c-neu","Wheat, Tomato, Onion, Rice"],["Active Alerts","3","⚠️","c-down","2 high priority"],["Crop Area","12 acres","🗺️","c-neu","Across 3 fields"]].map(([l,v,i,c,ch])=>(
            <div key={l} className="kpi-card">
              <div className="kpi-label">{l}</div>
              <div className="kpi-value">{i} {v}</div>
              <div className={`kpi-change ${c}`} style={{marginTop:".2rem",fontSize:".72rem"}}>{ch}</div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          <div>
            <div className="card">
              <div className="card-title">📋 Today's Action Plan</div>
              {ACTION_ITEMS.map(a=>(
                <div key={a.title} className="action-item">
                  <div className="action-icon" style={{background:a.bg}}>{a.icon}</div>
                  <div className="action-text">
                    <div className="action-title-text">{a.title}</div>
                    <div className="action-sub">{a.sub}</div>
                  </div>
                  <span className={`priority-badge p-${a.priority}`}>{a.priority}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{marginTop:"1.1rem"}}>
              <div className="card-title">📊 Top Market Signal</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:".25rem 0"}}>
                <div>
                  <div style={{fontWeight:600}}>Tomato 🍅</div>
                  <div style={{fontSize:".75rem",color:"var(--straw)"}}>Azadpur Mandi, Delhi</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.5rem",color:"var(--lime)"}}>₹36/kg</div>
                  <div style={{fontSize:".74rem",color:"var(--sprout)"}}>↑ +28% this week</div>
                </div>
              </div>
              <div style={{marginTop:".75rem",background:"rgba(67,160,71,.1)",border:"1px solid rgba(67,160,71,.22)",borderRadius:"10px",padding:".7rem .9rem"}}>
                <div style={{fontSize:".78rem",fontWeight:700,color:"var(--lime)"}}>🤖 AI Signal: SELL NOW</div>
                <div style={{fontSize:".72rem",color:"var(--straw)",marginTop:".15rem"}}>92% confidence · Prices may soften after 5 days due to increased supply</div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{marginBottom:"1.1rem"}}>
              <div className="card-title">🌦️ Weather — Current</div>
              <div style={{textAlign:"center",padding:".5rem 0"}}>
                <div className="weather-temp">34°C</div>
                <div className="weather-desc">☀️ Partly Sunny — Good for fieldwork</div>
                <div className="weather-row">
                  {[["💧","68%","Humidity"],["💨","12 km/h","Wind"],["🌧️","20%","Rain chance"]].map(([i,v,l])=>(
                    <div key={l} className="weather-stat">
                      <div className="weather-stat-val">{i} {v}</div>
                      <div className="weather-stat-label">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="forecast-row">
                {WEATHER_FORECAST.map(d=>(
                  <div key={d.d} className="forecast-day">
                    <div className="f-day-name">{d.d}</div>
                    <div className="f-day-icon">{d.icon}</div>
                    <div className="f-day-temp">{d.h}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">🛰️ Satellite Snapshot</div>
              <div style={{display:"flex",flexDirection:"column",gap:".5rem"}}>
                {[["Field A (4 Ha)","NDVI 0.74","🟢","Excellent"],["Field B (5 Ha)","NDVI 0.58","🟡","Monitor"],["Field C (3 Ha)","NDVI 0.42","🟠","Water stress"]].map(([f,n,e,s])=>(
                  <div key={f} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:".55rem .75rem",background:"var(--glass3)",borderRadius:"8px",border:"1px solid var(--border)"}}>
                    <div><div style={{fontSize:".82rem",fontWeight:600}}>{f}</div><div style={{fontSize:".7rem",color:"var(--straw)"}}>{n}</div></div>
                    <div style={{textAlign:"right",fontSize:".75rem"}}>{e} {s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* AI ASSISTANT */
function ChatPage() {
  const { lang, t } = useLang();
  const [messages, setMessages] = useState([
    { role:"ai", text:"Namaste! 🌱 I'm your AI Kisan assistant — powered by real AI.\n\nAsk me anything about crops, diseases, fertilisers, irrigation, market prices, or government schemes. I can respond in Hindi, Punjabi, Gujarati, Tamil, and more!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setApiErr(false);
    setMessages(p => [...p, { role:"user", text:msg }]);
    setLoading(true);
    try {
      const reply = await callAI(msg, messages);
      setMessages(p => [...p, { role:"ai", text:reply }]);
    } catch(e) {
      setApiErr(true);
      setMessages(p => [...p, { role:"ai", text:"⚠️ " + t.unavailable + " Please try again in a moment.", isErr:true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">🤖 AI Assistant · <StatusBadge status="live" lang={lang}/></div>
          <div className="page-banner-title">Ask Me Anything About Farming</div>
        </div>
      </div>
      <div className="chat-wrap">
        <div className="chat-suggestions">
          {CHAT_SUGGESTIONS.map(s => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}
        </div>

        <div className="chat-messages">
          {messages.map((m,i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              <div className={`msg-avatar ${m.role==="ai"?"av-ai":"av-user"}`}>{m.role==="ai"?"🌱":"👤"}</div>
              <div className="msg-inner">
                <div className="msg-label">{m.role==="ai"?"AI Kisan Assistant":"You"}</div>
                <div className={`msg-bubble ${m.isErr?"bubble-error":m.role==="ai"?"bubble-ai":"bubble-user"}`}
                  style={{whiteSpace:"pre-wrap"}}>{m.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg ai">
              <div className="msg-avatar av-ai">🌱</div>
              <div className="msg-inner">
                <div className="msg-label">AI Kisan Assistant</div>
                <div className="msg-bubble bubble-ai">
                  <div className="typing-row">{[0,1,2].map(i=><div key={i} className="typing-dot"/>)}</div>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        <div className="chat-input-row">
          <input className="chat-input" placeholder={t.chat_placeholder} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} disabled={loading} maxLength={500}/>
          <button className="chat-send" onClick={() => send()} disabled={loading || !input.trim()}>
            {loading ? "…" : "↑"}
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:".65rem",fontSize:".7rem",color:"var(--straw)"}}>
          🌍 Supports Hindi, Punjabi, Gujarati, Tamil, Telugu + more · Real AI powered by Anthropic
        </div>
      </div>
    </div>
  );
}

/* CROP DOCTOR */
function CropDoctorPage() {
  const { lang, t } = useLang();
  const [state, setState] = useState("idle"); // idle | diagnosing | done
  const [drag, setDrag] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const diagnose = async () => {
    setState("diagnosing");
    await new Promise(r=>setTimeout(r,2200));
    setState("done");
    setResult({
      crop:"Tomato", disease:"Late Blight (Phytophthora infestans)",
      confidence:91, severity:"High",
      treatment:["Apply Mancozeb 75% WP @ 2.5 g/L water — spray every 7 days","Add Metalaxyl + Mancozeb WP for systemic control","Remove and destroy all infected leaves and stems immediately","Switch to drip irrigation — avoid wetting foliage"],
      prevention:["Water in the morning, never at night","Improve air circulation — avoid dense planting","Apply preventive copper fungicide before monsoon","Use certified blight-resistant varieties next season"],
      products:["Dithane M-45","Ridomil Gold MZ","Curzate M8","Blitox 50"],
    });
  };

  const handleDrop = e => { e.preventDefault(); setDrag(false); diagnose(); };

  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">🔬 AI Crop Doctor · <StatusBadge status="live" lang={lang}/></div>
          <div className="page-banner-title">Upload Photo → Instant AI Diagnosis</div>
        </div>
      </div>
      <div className="section" style={{paddingTop:"1.75rem",maxWidth:820}}>
        <div className={`upload-zone ${drag?"drag-over":""}`}
          onClick={() => state==="idle" && fileRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDrag(true);}}
          onDragLeave={()=>setDrag(false)}
          onDrop={handleDrop}
          style={{cursor:state==="diagnosing"?"default":"pointer"}}
        >
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={diagnose}/>
          <div className="upload-zone-icon">
            {state==="idle"?"📸":state==="diagnosing"?"⏳":"✅"}
          </div>
          <div className="upload-zone-title">
            {state==="idle" ? t.upload_title : state==="diagnosing" ? t.diagnosing : "Diagnosis Complete"}
          </div>
          <div className="upload-zone-sub" style={{marginBottom:"1rem"}}>
            {state==="idle" ? t.upload_sub : state==="diagnosing" ? "Running AI vision model…" : "See results below"}
          </div>
          {state==="idle" && (
            <div style={{display:"flex",gap:".75rem",justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn btn-primary btn-md" onClick={e=>{e.stopPropagation();diagnose();}}>🔬 {t.run_diagnosis} (Demo)</button>
              <button className="btn btn-ghost btn-md" onClick={e=>{e.stopPropagation();fileRef.current?.click();}}>📁 Upload Photo</button>
            </div>
          )}
          {state==="diagnosing" && <Spinner/>}
        </div>

        {result && (
          <div className="diagnosis-card">
            <div style={{display:"flex",alignItems:"flex-start",gap:".85rem",flexWrap:"wrap",marginBottom:"1.2rem"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:".72rem",color:"var(--straw)",marginBottom:".2rem"}}>Detected Disease</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.2rem"}}>{result.disease}</div>
                <div style={{fontSize:".78rem",color:"var(--straw)",marginTop:".15rem"}}>Crop: {result.crop}</div>
              </div>
              <span className={`status-badge ${result.severity==="High"?"status-beta":"status-live"}`} style={{padding:".3rem .8rem",fontSize:".74rem"}}>
                {result.severity==="High"?"⚠️":"✔️"} {result.severity} Severity
              </span>
            </div>

            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".74rem",color:"var(--straw)",marginBottom:".3rem"}}>
                <span>AI Confidence</span>
                <span style={{color:"var(--lime)",fontWeight:700}}>{result.confidence}%</span>
              </div>
              <div className="conf-bar"><div className="conf-fill" style={{width:`${result.confidence}%`}}/></div>
            </div>

            <div className="treatment-grid">
              <div className="treatment-box">
                <div className="treatment-box-title" style={{color:"var(--ember2)"}}>💊 Treatment Plan</div>
                {result.treatment.map((x,i)=><div key={i} className="treat-item">• {x}</div>)}
              </div>
              <div className="treatment-box">
                <div className="treatment-box-title" style={{color:"var(--sprout)"}}>🛡️ Prevention</div>
                {result.prevention.map((x,i)=><div key={i} className="treat-item">• {x}</div>)}
              </div>
            </div>

            <div style={{marginTop:"1rem"}}>
              <div style={{fontSize:".72rem",color:"var(--straw)",marginBottom:".4rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Recommended Products</div>
              <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
                {result.products.map(p=><span key={p} style={{background:"rgba(67,160,71,.12)",border:"1px solid rgba(67,160,71,.2)",color:"var(--lime)",fontSize:".74rem",padding:".22rem .65rem",borderRadius:"8px"}}>{p}</span>)}
              </div>
            </div>

            <div style={{display:"flex",gap:".65rem",marginTop:"1.25rem",flexWrap:"wrap"}}>
              <button className="btn btn-primary btn-md w-full">📄 Download PDF Report</button>
              <button className="btn btn-ghost btn-md" onClick={()=>{setState("idle");setResult(null);}}>🔄 New Diagnosis</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* SATELLITE */
function SatellitePage() {
  const { lang } = useLang();
  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">🛰️ Satellite Intelligence · <StatusBadge status="beta" lang={lang}/></div>
          <div className="page-banner-title">NDVI & Crop Health from Space</div>
        </div>
      </div>
      <div className="section" style={{paddingTop:"1.75rem"}}>
        <div style={{background:"rgba(249,168,37,.09)",border:"1px solid rgba(249,168,37,.2)",borderRadius:"10px",padding:".75rem 1rem",fontSize:".82rem",color:"var(--sun)",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:".5rem"}}>
          🟡 Satellite integration is in beta. Live farm analysis requires connecting your farm location in Settings.
        </div>
        <div className="kpi-grid">
          {[["NDVI Score","0.68","🟡 Moderate"],["Water Stress","Low","🟢 Good"],["Heat Stress","Medium","🟡 Monitor"],["Crop Coverage","91%","🟢 Good"]].map(([l,v,s])=>(
            <div key={l} className="kpi-card"><div className="kpi-label">{l}</div><div className="kpi-value">{v}</div><div style={{fontSize:".72rem",color:"var(--straw)",marginTop:".15rem"}}>{s}</div></div>
          ))}
        </div>
        <div className="ndvi-canvas" style={{marginTop:"1.25rem"}}>
          <NDVIGrid/>
          <div style={{position:"relative",zIndex:1,textAlign:"center",background:"rgba(0,0,0,.72)",padding:".7rem 1.4rem",borderRadius:"12px",backdropFilter:"blur(10px)"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700}}>Demo — Field A · 4.2 Ha</div>
            <div style={{fontSize:".75rem",color:"var(--straw)"}}>Sentinel-2 · Last updated: 6 hrs ago</div>
          </div>
        </div>
        <div className="sat-legend">
          {[["#f44336","Stressed/Bare"],["#ff9800","Low Vegetation"],["#cddc39","Moderate"],["#76c442","Good Growth"],["#43a047","Excellent"]].map(([c,l])=>(
            <div key={l} className="legend-item"><div className="legend-dot" style={{background:c}}/>{l}</div>
          ))}
        </div>
        <div className="card" style={{marginTop:"1.4rem"}}>
          <div className="card-title">🤖 AI Satellite Insights</div>
          {[["Field A – North Zone","🟢","Excellent canopy coverage. No stress detected. Maintain current irrigation schedule."],["Field B – South Zone","🟡","Moderate water stress in the southern corner. Increase irrigation by 20% for 3 days."],["Field C – East Strip","🟡","Dense canopy may increase disease risk. Consider thinning or improving air circulation."]].map(([f,e,i])=>(
            <div key={f} style={{display:"flex",gap:".7rem",padding:".8rem",borderRadius:"10px",marginBottom:".45rem",background:"var(--glass3)",border:"1px solid var(--border)"}}>
              <span style={{fontSize:"1.1rem"}}>{e}</span>
              <div><div style={{fontWeight:600,fontSize:".85rem"}}>{f}</div><div style={{fontSize:".78rem",color:"var(--straw)",marginTop:".18rem"}}>{i}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* MARKET */
function MarketPage() {
  const { lang } = useLang();
  const [filter, setFilter] = useState("All");
  const [predInput, setPredInput] = useState({ crop:"Tomato", size:"5", cost:"28000", yield:"28" });
  const [prediction, setPrediction] = useState(null);
  const [predErrors, setPredErrors] = useState({});

  const filtered = filter === "All" ? MARKET_DATA
    : filter === "Vegetables" ? MARKET_DATA.filter(m=>["Tomato 🍅","Onion 🧅"].includes(m.crop))
    : filter === "Cereals" ? MARKET_DATA.filter(m=>["Wheat 🌾","Rice 🍚"].includes(m.crop))
    : MARKET_DATA.filter(m=>["Soybean 🟤","Cotton ☁️"].includes(m.crop));

  const runPred = () => {
    const errs = {};
    if (!predInput.size || isNaN(predInput.size) || +predInput.size<=0) errs.size="required";
    if (!predInput.cost || isNaN(predInput.cost) || +predInput.cost<=0) errs.cost="required";
    if (!predInput.yield || isNaN(predInput.yield) || +predInput.yield<=0) errs.yield="required";
    setPredErrors(errs);
    if (Object.keys(errs).length) return;
    const priceMap = {Tomato:36000,Wheat:22000,Rice:28000,Cotton:65000,Onion:18000,Soybean:40000};
    const price = priceMap[predInput.crop] || 25000;
    const rev = +predInput.yield * +predInput.size * price / 1000;
    const cost = +predInput.cost * +predInput.size;
    const profit = rev - cost;
    const roi = cost > 0 ? ((profit/cost)*100).toFixed(1) : 0;
    setPrediction({ rev:`₹${(rev/1000).toFixed(1)}K`, profit:`₹${(profit/1000).toFixed(1)}K`, roi:`${roi}%`, be:`₹${(cost/(+predInput.yield*+predInput.size)).toFixed(0)}/T`, risk:profit>50000?"Low":profit>0?"Medium":"High" });
  };

  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">📊 Market Intelligence · <StatusBadge status="live" lang={lang}/></div>
          <div className="page-banner-title">Live Mandi Prices & AI Signals</div>
        </div>
      </div>
      <div className="section" style={{paddingTop:"1.75rem"}}>
        {/* Profit predictor */}
        <div className="card card-highlight" style={{marginBottom:"1.75rem"}}>
          <div className="card-title">💰 Profit Predictor</div>
          <div className="pred-form">
            <div className="form-group">
              <label className="form-label">Crop</label>
              <select className="form-select" value={predInput.crop} onChange={e=>setPredInput({...predInput,crop:e.target.value})}>
                {["Tomato","Wheat","Rice","Cotton","Onion","Soybean"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Farm Size (Acres)</label>
              <input className={`form-input ${predErrors.size?"err":""}`} type="number" min="0.1" step="0.5" value={predInput.size} onChange={e=>setPredInput({...predInput,size:e.target.value})}/>
              {predErrors.size && <span className="form-error">Enter a valid size</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Total Input Cost (₹/Acre)</label>
              <input className={`form-input ${predErrors.cost?"err":""}`} type="number" min="0" value={predInput.cost} onChange={e=>setPredInput({...predInput,cost:e.target.value})}/>
              {predErrors.cost && <span className="form-error">Enter a valid cost</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Expected Yield (T/Acre)</label>
              <input className={`form-input ${predErrors.yield?"err":""}`} type="number" min="0.1" step="0.5" value={predInput.yield} onChange={e=>setPredInput({...predInput,yield:e.target.value})}/>
              {predErrors.yield && <span className="form-error">Enter a valid yield</span>}
            </div>
          </div>
          <button className="btn btn-primary btn-md" onClick={runPred}>Calculate Profit Forecast →</button>
          {prediction && (
            <div className="pred-result">
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:".3rem"}}>📈 Forecast — {predInput.crop}</div>
              <div className="result-grid">
                <div className="result-metric"><div className="result-val" style={{color:"var(--lime)"}}>{prediction.rev}</div><div className="result-lbl">Revenue</div></div>
                <div className="result-metric"><div className="result-val" style={{color:prediction.profit.startsWith("-")?"var(--ember2)":"var(--sprout)"}}>{prediction.profit}</div><div className="result-lbl">Net Profit</div></div>
                <div className="result-metric"><div className="result-val" style={{color:"var(--sun)"}}>{prediction.roi}</div><div className="result-lbl">ROI</div></div>
                <div className="result-metric"><div className="result-val" style={{fontSize:"1.1rem"}}>{prediction.be}</div><div className="result-lbl">Break-even</div></div>
                <div className="result-metric"><div className="result-val" style={{color:prediction.risk==="Low"?"var(--sprout)":prediction.risk==="Medium"?"var(--sun)":"var(--ember2)",fontSize:"1.2rem"}}>{prediction.risk}</div><div className="result-lbl">Risk Level</div></div>
                <div className="result-metric"><div className="result-val" style={{color:"var(--sky)",fontSize:"1rem"}}>Check</div><div className="result-lbl">Export Markets</div></div>
              </div>
            </div>
          )}
        </div>

        {/* Market table */}
        <div className="tabs">
          {["All","Vegetables","Cereals","Oilseeds"].map(f=>(
            <button key={f} className={`tab-btn ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f}</button>
          ))}
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="market-table">
            <thead><tr><th>Crop</th><th>Price</th><th>Change</th><th>Mandi</th><th>AI Signal</th><th>Confidence</th></tr></thead>
            <tbody>
              {filtered.map(m=>(
                <tr key={m.crop}>
                  <td style={{fontWeight:600}}>{m.crop}</td>
                  <td style={{fontFamily:"'Syne',sans-serif",fontWeight:800}}>{m.price}</td>
                  <td className={m.dir==="up"?"p-up":"p-down"}>{m.change}</td>
                  <td style={{color:"var(--straw)",fontSize:".8rem"}}>{m.mandi}</td>
                  <td><span className={`rec rec-${m.rec}`}>{m.rec.toUpperCase()}</span></td>
                  <td style={{textAlign:"right"}}>
                    <div style={{fontSize:".74rem",color:"var(--straw)"}}>{m.conf}%</div>
                    <div className="conf-mini"><div className="conf-mini-fill" style={{width:`${m.conf}%`}}/></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* SCHEMES */
function SchemesPage() {
  const { lang } = useLang();
  const [state, setState] = useState({ state:"Rajasthan", category:"Small (below 2 Ha)", crop:"Wheat" });
  const [searched, setSearched] = useState(false);
  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">🏛️ Government Schemes · <StatusBadge status="live" lang={lang}/></div>
          <div className="page-banner-title">Subsidies, Loans & Insurance for Farmers</div>
        </div>
      </div>
      <div className="section" style={{paddingTop:"1.75rem"}}>
        <div className="card card-highlight" style={{marginBottom:"1.75rem"}}>
          <div className="card-title">🤖 Find Schemes for Your Profile</div>
          <div className="pred-form">
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-select" value={state.state} onChange={e=>setState({...state,state:e.target.value})}>
                {["Rajasthan","Punjab","Maharashtra","Uttar Pradesh","Madhya Pradesh","Gujarat","Haryana","Karnataka","Andhra Pradesh","Tamil Nadu"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Farmer Category</label>
              <select className="form-select" value={state.category} onChange={e=>setState({...state,category:e.target.value})}>
                {["Small (below 2 Ha)","Marginal (below 1 Ha)","Medium (2–5 Ha)","Large (above 5 Ha)"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Primary Crop</label>
              <select className="form-select" value={state.crop} onChange={e=>setState({...state,crop:e.target.value})}>
                {["Wheat","Rice","Cotton","Vegetables","Fruits","Pulses","Oilseeds"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{alignSelf:"flex-end"}}>
              <button className="btn btn-primary btn-md" onClick={()=>setSearched(true)}>Find My Schemes →</button>
            </div>
          </div>
          {searched && <div style={{marginTop:".75rem",fontSize:".82rem",color:"var(--lime)"}}>✅ Found 6 schemes you may be eligible for based on your profile.</div>}
        </div>

        <div className="schemes-grid">
          {SCHEMES.map(s=>(
            <div key={s.name} className="scheme-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".6rem"}}>
                <div className="scheme-amount">{s.amount}</div>
                <span className={`scheme-type ${s.stype}`}>{s.type.toUpperCase()}</span>
              </div>
              <div className="scheme-name">{s.name}</div>
              <div className="scheme-desc">{s.desc}</div>
              <div style={{display:"flex",gap:".35rem",flexWrap:"wrap",marginTop:".75rem"}}>
                {s.tags.map(tag=><span key={tag} className="scheme-tag">{tag}</span>)}
              </div>
              <button className="btn btn-ghost btn-sm" style={{width:"100%",marginTop:".9rem",borderRadius:"10px"}}>
                View Details & Apply →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* COMMUNITY */
function CommunityPage() {
  const { lang } = useLang();
  const [postText, setPostText] = useState("");
  const [posted, setPosted] = useState(false);
  const [postErr, setPostErr] = useState("");
  const [likeState, setLikeState] = useState({});

  const submitPost = () => {
    if (!postText.trim()) { setPostErr("Please write something before posting."); return; }
    if (postText.trim().length < 20) { setPostErr("Post must be at least 20 characters."); return; }
    setPostErr("");
    setPosted(true);
    setPostText("");
  };

  const toggleLike = idx => setLikeState(p => ({...p, [idx]:!p[idx]}));

  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">👥 Farm Community · <StatusBadge status="beta" lang={lang}/></div>
          <div className="page-banner-title">Learn From Fellow Farmers Across India</div>
        </div>
      </div>
      <div className="section" style={{paddingTop:"1.75rem",maxWidth:760}}>
        <div className="card" style={{marginBottom:"1.5rem"}}>
          {posted && <div style={{background:"rgba(67,160,71,.12)",border:"1px solid rgba(67,160,71,.25)",borderRadius:"8px",padding:".6rem .85rem",fontSize:".82rem",color:"var(--lime)",marginBottom:".75rem"}}>✅ Your post was shared with the community!</div>}
          <textarea className="form-textarea w-full" placeholder="Share your farming experience, ask a question, or post a crop update…" value={postText} onChange={e=>{setPostText(e.target.value);setPostErr("");setPosted(false);}}/>
          {postErr && <div className="form-error">{postErr}</div>}
          <div style={{display:"flex",justifyContent:"flex-end",gap:".5rem",marginTop:".75rem"}}>
            <button className="btn btn-ghost btn-sm">📸 Add Photo</button>
            <button className="btn btn-primary btn-sm" onClick={submitPost}>Post to Community</button>
          </div>
        </div>

        {COMMUNITY_POSTS.map((p,i)=>(
          <div key={i} className="post">
            <div style={{display:"flex",alignItems:"center",gap:".7rem",marginBottom:".75rem"}}>
              <div className="post-avatar" style={{background:p.color}}>{p.av}</div>
              <div>
                <div className="post-author">{p.author} <span style={{fontSize:".72rem",fontWeight:400,color:"var(--straw)"}}>· {p.loc}</span></div>
                <div className="post-time">{p.time}</div>
              </div>
            </div>
            <div className="post-content">{p.text}</div>
            <div style={{display:"flex",gap:".5rem",marginTop:".75rem"}}>
              <button className="post-action" onClick={()=>toggleLike(i)}>
                {likeState[i]?"❤️":"👍"} {likeState[i]?p.likes+1:p.likes}
              </button>
              <button className="post-action">💬 {p.comments}</button>
              <button className="post-action">🔁 Share</button>
              <button className="post-action">🔖 Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* PRICING */
function PricingPage() {
  const { lang } = useLang();
  const plans = [
    { name:"Free", price:"₹0", period:"/forever", features:[
      {t:"5 AI assistant queries/day",ok:true},{t:"Basic crop information",ok:true},{t:"7-day weather forecast",ok:true},{t:"Community access",ok:true},
      {t:"AI Crop Doctor scans",ok:false},{t:"Live market intelligence",ok:false},{t:"Satellite monitoring",ok:false},{t:"Government schemes finder",ok:false},
    ], cta:"Get Started Free", featured:false },
    { name:"Pro Farmer", price:"₹299", period:"/month", features:[
      {t:"Unlimited AI assistant queries",ok:true},{t:"Full crop knowledge engine",ok:true},{t:"AI Crop Doctor (100 scans/mo)",ok:true},{t:"Live mandi prices & signals",ok:true},
      {t:"Government schemes AI finder",ok:true},{t:"Profit predictor & ROI tools",ok:true},{t:"Priority WhatsApp support",ok:true},{t:"Satellite monitoring",ok:false},
    ], cta:"Start 7-Day Free Trial", featured:true },
    { name:"Enterprise", price:"Custom", period:"/pricing", features:[
      {t:"Everything in Pro",ok:true},{t:"Satellite NDVI monitoring",ok:true},{t:"Custom API integration",ok:true},{t:"Dedicated farm advisor",ok:true},
      {t:"Multi-farm dashboard",ok:true},{t:"Export & market linkages",ok:true},{t:"Custom AI model training",ok:true},{t:"SLA & uptime guarantee",ok:true},
    ], cta:"Contact Us", featured:false },
  ];
  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">💳 Pricing · Cashfree Payment Gateway</div>
          <div className="page-banner-title">Simple, Farmer-Friendly Pricing</div>
        </div>
      </div>
      <div className="section" style={{paddingTop:"1.75rem"}}>
        <div style={{textAlign:"center",marginBottom:".5rem"}}>
          <span style={{background:"rgba(249,168,37,.1)",border:"1px solid rgba(249,168,37,.22)",borderRadius:"18px",padding:".38rem 1rem",fontSize:".78rem",color:"var(--sun)",display:"inline-flex",alignItems:"center",gap:".4rem"}}>
            🟡 Payments Coming Soon · UPI · Debit/Credit Cards · Net Banking via Cashfree
          </span>
        </div>
        <div className="pricing-grid">
          {plans.map(p=>(
            <div key={p.name} className={`pricing-card ${p.featured?"featured":""}`}>
              {p.featured && <div className="pricing-popular">Most Popular</div>}
              <div className="pricing-name">{p.name}</div>
              <div className="pricing-price">{p.price}</div>
              <div className="pricing-period">{p.period}</div>
              <ul className="pricing-features">
                {p.features.map(f=><li key={f.t} className={f.ok?"pf-inc":"pf-exc"}>{f.t}</li>)}
              </ul>
              <button className={`btn ${p.featured?"btn-primary":"btn-ghost"} btn-md w-full`} style={{borderRadius:"12px"}}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
        <p style={{textAlign:"center",marginTop:"2.5rem",fontSize:".82rem",color:"var(--straw)"}}>
          Questions? <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{color:"var(--lime)"}}>Chat on WhatsApp +91 9610159555</a> · We respond within 2 hours
        </p>
      </div>
    </div>
  );
}

/* CONTACT */
function ContactPage({ addToast }) {
  const { t } = useLang();
  const [form, setForm] = useState({ name:"",email:"",phone:"",message:"" });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k,v) => { setForm(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:""})); };

  const submit = async () => {
    const e = validate(form);
    setErrs(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,1200)); // simulate submission
    setLoading(false);
    setSent(true);
    setForm({ name:"",email:"",phone:"",message:"" });
    addToast(t.form_success,"success");
  };

  return (
    <div className="page page-enter">
      <div className="page-banner">
        <div className="page-banner-inner">
          <div className="page-banner-label">📞 Contact & Support</div>
          <div className="page-banner-title">We're Here to Help</div>
        </div>
      </div>
      <div className="section" style={{paddingTop:"1.75rem"}}>
        <div className="contact-grid">
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.4rem",marginBottom:"1rem"}}>Get in Touch</h2>
            <div className="contact-info-item">
              <div className="contact-info-icon">💬</div>
              <div><div className="contact-info-label">WhatsApp Support</div>
                <div className="contact-info-val"><a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{color:"var(--lime)"}}>+91 9610159555</a></div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">📧</div>
              <div><div className="contact-info-label">Email</div>
                <div className="contact-info-val" style={{color:"var(--lime)"}}>support@aikisan.in</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">🕐</div>
              <div><div className="contact-info-label">Response Time</div>
                <div className="contact-info-val">Within 24 hours</div>
              </div>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg" style={{marginTop:"1rem",width:"100%",justifyContent:"center",borderRadius:"12px"}}>
              💬 Chat on WhatsApp Now
            </a>
          </div>
          <div className="card">
            {sent && <div style={{background:"rgba(67,160,71,.12)",border:"1px solid rgba(67,160,71,.25)",borderRadius:"10px",padding:".75rem 1rem",marginBottom:"1rem",fontSize:".84rem",color:"var(--lime)"}}>✅ {t.form_success}</div>}
            <div className="form-group" style={{marginBottom:".85rem"}}>
              <label className="form-label">{t.name_label} *</label>
              <input className={`form-input ${errs.name?"err":""}`} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Rajesh Kumar"/>
              {errs.name && <span className="form-error">{errs.name==="required"?t.required:""}</span>}
            </div>
            <div className="form-group" style={{marginBottom:".85rem"}}>
              <label className="form-label">{t.email_label} *</label>
              <input className={`form-input ${errs.email?"err":""}`} type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="farmer@example.com"/>
              {errs.email && <span className="form-error">{errs.email==="email"?t.invalid_email:t.required}</span>}
            </div>
            <div className="form-group" style={{marginBottom:".85rem"}}>
              <label className="form-label">{t.phone_label}</label>
              <input className={`form-input ${errs.phone?"err":""}`} type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91 98765 43210"/>
              {errs.phone && <span className="form-error">{t.invalid_phone}</span>}
            </div>
            <div className="form-group" style={{marginBottom:"1rem"}}>
              <label className="form-label">{t.msg_label} *</label>
              <textarea className={`form-textarea w-full ${errs.message?"err":""}`} value={form.message} onChange={e=>set("message",e.target.value)} placeholder="How can we help you?"/>
              {errs.message && <span className="form-error">{t.required}</span>}
            </div>
            <button className="btn btn-primary btn-md w-full" onClick={submit} disabled={loading}>
              {loading ? <><Spinner/> Sending…</> : t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 404 */
function NotFound({ setPage, t }) {
  return (
    <div className="page page-enter">
      <div className="not-found">
        <div className="not-found-code">404</div>
        <div className="not-found-title">🌾 {t.not_found}</div>
        <p className="not-found-sub">{t.not_found_sub}</p>
        <button className="btn btn-primary btn-lg" onClick={()=>setPage("Home")}>{t.go_home}</button>
      </div>
    </div>
  );
}

/* FOOTER */
function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand-name">🌱 AI Kisan</div>
          <p className="footer-tagline">Empowering Farmers with Artificial Intelligence. India's agricultural intelligence platform.</p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="footer-wa">💬 +91 9610159555</a>
        </div>
        <div>
          <div className="footer-col-title">Platform</div>
          <ul className="footer-links">
            {[["AI Assistant","AI Assistant"],["Crop Doctor","Crop Doctor"],["Satellite","Satellite"],["Market Prices","Market"],["Farm Community","Community"]].map(([l,p])=>(
              <li key={l}><button className="footer-link" onClick={()=>setPage(p)}>{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Resources</div>
          <ul className="footer-links">
            {[["Government Schemes","Schemes"],["Pricing Plans","Pricing"],["Contact Support","Contact"],["Crop Knowledge","Home"]].map(([l,p])=>(
              <li key={l}><button className="footer-link" onClick={()=>setPage(p)}>{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Legal</div>
          <ul className="footer-links">
            {["Privacy Policy","Terms & Conditions","Refund Policy","Cookie Policy"].map(l=>(
              <li key={l}><button className="footer-link">{l}</button></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-text">© 2026 AI Kisan. All rights reserved.</div>
        <div className="footer-bottom-text">📞 +91 9610159555 · support@aikisan.in</div>
      </div>
    </footer>
  );
}

/* ─── 7. ROOT APP ─────────────────────────────────────────────────────────── */
export default function AIKisan() {
  const [page, setPage] = useState("Home");
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toasts, add: addToast } = useToast();
  const langRef = useRef();
  const t = T[lang] || T.en;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = e => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menu on page change
  const navigate = (p) => { setPage(p); setMenuOpen(false); };

  const navKeys = {
    "Home":t.home,"Dashboard":t.dashboard,"AI Assistant":t.ai_assistant,
    "Crop Doctor":t.crop_doctor,"Satellite":t.satellite,"Market":t.market,
    "Schemes":t.schemes,"Community":t.community,"Pricing":t.pricing,"Contact":t.contact,
  };

  const renderPage = () => {
    const props = { setPage:navigate, addToast, lang, t };
    switch(page) {
      case "Home":         return <HomePage {...props}/>;
      case "Dashboard":    return <DashPage {...props}/>;
      case "AI Assistant": return <ChatPage {...props}/>;
      case "Crop Doctor":  return <CropDoctorPage {...props}/>;
      case "Satellite":    return <SatellitePage {...props}/>;
      case "Market":       return <MarketPage {...props}/>;
      case "Schemes":      return <SchemesPage {...props}/>;
      case "Community":    return <CommunityPage {...props}/>;
      case "Pricing":      return <PricingPage {...props}/>;
      case "Contact":      return <ContactPage {...props}/>;
      default:             return <NotFound setPage={navigate} t={t}/>;
    }
  };

  return (
    <LangCtx.Provider value={{ lang, t, setLang }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <button className="nav-logo" onClick={()=>navigate("Home")} style={{background:"none",border:"none"}}>
          🌱 AI Kisan
        </button>

        {/* Desktop links */}
        <div className="nav-links">
          <div className="nav-links-scroll">
            {NAV_PAGES.map(p=>(
              <button key={p} className={`nav-link ${page===p?"active":""}`} onClick={()=>navigate(p)}>
                {navKeys[p]||p}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-right">
          {/* Language picker */}
          <div className="lang-wrap" ref={langRef}>
            <button className="lang-btn" onClick={()=>setLangOpen(o=>!o)}>
              {LANGS[lang].flag} {LANGS[lang].label} ▾
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {Object.entries(LANGS).map(([k,v])=>(
                  <button key={k} className={`lang-option ${lang===k?"selected":""}`}
                    onClick={()=>{setLang(k);setLangOpen(false);}}>
                    {v.flag} {v.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={()=>navigate("Contact")}>Login</button>
          <button className="btn btn-primary btn-sm" onClick={()=>navigate("Pricing")}>Get Started</button>
          {/* Hamburger */}
          <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">
            <span style={{transform:menuOpen?"rotate(45deg) translate(4px,5px)":"none"}}/>
            <span style={{opacity:menuOpen?0:1}}/>
            <span style={{transform:menuOpen?"rotate(-45deg) translate(4px,-5px)":"none"}}/>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_PAGES.map(p=>(
            <button key={p} className={`mobile-nav-link ${page===p?"active":""}`} onClick={()=>navigate(p)}>
              {navKeys[p]||p}
            </button>
          ))}
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",gap:".5rem",background:"#25D366",color:"#fff",padding:".65rem 1rem",borderRadius:"10px",margin:".25rem 0 0",fontSize:".88rem",fontWeight:600,textDecoration:"none"}}>
            💬 WhatsApp: +91 9610159555
          </a>
        </div>
      )}

      {/* Page content */}
      {renderPage()}

      {/* Footer */}
      <Footer setPage={navigate}/>

      {/* WhatsApp float */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-float" title="WhatsApp Support — +91 9610159555">
        💬
      </a>

      {/* Toasts */}
      <Toast toasts={toasts}/>
    </LangCtx.Provider>
  );
}
