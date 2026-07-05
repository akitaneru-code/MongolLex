import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Volume2, Lightbulb, PenLine } from "lucide-react";

const vowels = [
  {
    traditional: "ᠠ",
    cyrillic: "а",
    romanized: "a",
    korean: "아",
    description: "입을 크게 벌려 '아' 발음",
    examples: [{ word: "ᠠᠪᠠ", meaning: "아버지" }],
    color: "bg-red-50 border-red-200",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    traditional: "ᠡ",
    cyrillic: "э",
    romanized: "e",
    korean: "에",
    description: "입을 옆으로 벌려 '에' 발음",
    examples: [{ word: "ᠡᠬᠡ", meaning: "어머니" }],
    color: "bg-orange-50 border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    traditional: "ᠢ",
    cyrillic: "и",
    romanized: "i",
    korean: "이",
    description: "입술을 옆으로 당겨 '이' 발음",
    examples: [{ word: "ᠢᠳᠡᠬᠦ", meaning: "먹다" }],
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    traditional: "ᠣ",
    cyrillic: "о",
    romanized: "o",
    korean: "오",
    description: "입술을 둥글게 모아 '오' 발음 (남성 모음)",
    examples: [{ word: "ᠣᠰᠤ", meaning: "물" }],
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    traditional: "ᠤ",
    cyrillic: "у",
    romanized: "u",
    korean: "우",
    description: "입술을 앞으로 내밀어 '우' 발음 (남성 모음)",
    examples: [{ word: "ᠤᠯᠤᠰ", meaning: "나라" }],
    color: "bg-teal-50 border-teal-200",
    badgeColor: "bg-teal-100 text-teal-700",
  },
  {
    traditional: "ᠥ",
    cyrillic: "ө",
    romanized: "ö",
    korean: "외/어",
    description: "입술을 둥글게 하고 '어' 발음 (여성 모음)",
    examples: [{ word: "ᠥᠭᠡ", meaning: "단어" }],
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    traditional: "ᠦ",
    cyrillic: "ү",
    romanized: "ü",
    korean: "위/으",
    description: "입술을 앞으로 내밀고 '으' 발음 (여성 모음)",
    examples: [{ word: "ᠦᠨᠡᠨ", meaning: "진실" }],
    color: "bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
  },
];

const consonants = [
  {
    traditional: "ᠨ",
    cyrillic: "н",
    romanized: "n",
    korean: "ㄴ",
    tip: "한국어 'ㄴ'과 동일",
    examples: [{ word: "ᠨᠠᠷᠠ", meaning: "태양" }],
  },
  {
    traditional: "ᠪ",
    cyrillic: "б",
    romanized: "b",
    korean: "ㅂ",
    tip: "한국어 'ㅂ'과 동일",
    examples: [{ word: "ᠪᠠᠭᠰᠢ", meaning: "선생님" }],
  },
  {
    traditional: "ᠫ",
    cyrillic: "п",
    romanized: "p",
    korean: "ㅍ",
    tip: "한국어 'ㅍ'과 동일",
    examples: [{ word: "ᠫᠠᠷᠺ", meaning: "공원" }],
  },
  {
    traditional: "ᠬ",
    cyrillic: "х",
    romanized: "h/kh",
    korean: "ㅎ/ㅋ",
    tip: "목구멍에서 나는 'ㅎ' 소리",
    examples: [{ word: "ᠬᠦᠮᠦᠨ", meaning: "사람" }],
  },
  {
    traditional: "ᠭ",
    cyrillic: "г",
    romanized: "g",
    korean: "ㄱ",
    tip: "한국어 'ㄱ'과 유사",
    examples: [{ word: "ᠭᠠᠷ", meaning: "손" }],
  },
  {
    traditional: "ᠮ",
    cyrillic: "м",
    romanized: "m",
    korean: "ㅁ",
    tip: "한국어 'ㅁ'과 동일",
    examples: [{ word: "ᠮᠣᠷᠢ", meaning: "말(馬)" }],
  },
  {
    traditional: "ᠯ",
    cyrillic: "л",
    romanized: "l",
    korean: "ㄹ",
    tip: "한국어 'ㄹ'과 유사",
    examples: [{ word: "ᠯᠠᠭᠤ", meaning: "국물" }],
  },
  {
    traditional: "ᠰ",
    cyrillic: "с",
    romanized: "s",
    korean: "ㅅ",
    tip: "한국어 'ㅅ'과 동일",
    examples: [{ word: "ᠰᠠᠢᠨ", meaning: "좋다" }],
  },
  {
    traditional: "ᠱ",
    cyrillic: "ш",
    romanized: "sh",
    korean: "쉬",
    tip: "한국어 '쉬'처럼 혀를 올려 발음",
    examples: [{ word: "ᠱᠤᠸᠠ", meaning: "주스" }],
  },
  {
    traditional: "ᠲ",
    cyrillic: "т",
    romanized: "t",
    korean: "ㅌ",
    tip: "한국어 'ㅌ'과 동일",
    examples: [{ word: "ᠲᠡᠷᠭᠡ", meaning: "수레/차" }],
  },
  {
    traditional: "ᠳ",
    cyrillic: "д",
    romanized: "d",
    korean: "ㄷ",
    tip: "한국어 'ㄷ'과 동일",
    examples: [{ word: "ᠳᠡᠭᠡᠳᠦ", meaning: "위쪽" }],
  },
  {
    traditional: "ᠴ",
    cyrillic: "ч",
    romanized: "ch",
    korean: "ㅊ",
    tip: "한국어 'ㅊ'과 동일",
    examples: [{ word: "ᠴᠠᠢ", meaning: "차(茶)" }],
  },
  {
    traditional: "ᠵ",
    cyrillic: "ж",
    romanized: "j",
    korean: "ㅈ",
    tip: "한국어 'ㅈ'과 유사",
    examples: [{ word: "ᠵᠢᠮᠢᠰ", meaning: "과일" }],
  },
  {
    traditional: "ᠶ",
    cyrillic: "й/я",
    romanized: "y",
    korean: "ㅇ/이",
    tip: "모음 앞에서 '이야, 이요' 처럼 발음",
    examples: [{ word: "ᠶᠡᠬᠡ", meaning: "크다" }],
  },
  {
    traditional: "ᠷ",
    cyrillic: "р",
    romanized: "r",
    korean: "ㄹ(굴림)",
    tip: "혀를 굴리는 'ㄹ' 발음",
    examples: [{ word: "ᠷᠠᠳᠢᠣ᠋", meaning: "라디오" }],
  },
  {
    traditional: "ᠸ",
    cyrillic: "в",
    romanized: "v/w",
    korean: "ㅂ/ㅇ",
    tip: "영어 'v'와 유사한 발음",
    examples: [{ word: "ᠸᠢᠳᠢᠣ᠋", meaning: "비디오" }],
  },
  {
    traditional: "ᠼ",
    cyrillic: "ц",
    romanized: "ts",
    korean: "ㅊ(쯔)",
    tip: "'ㅊ'보다 좀 더 'ㅅ'에 가까운 발음",
    examples: [{ word: "ᠼᠠᠭ", meaning: "시간" }],
  },
  {
    traditional: "ᠽ",
    cyrillic: "з",
    romanized: "dz/z",
    korean: "ㅈ(즈)",
    tip: "영어 'z' 발음과 유사",
    examples: [{ word: "ᠽᠠᠰᠠᠭ", meaning: "정부" }],
  },
];

const writingRules = [
  {
    icon: "📝",
    title: "쓰는 방향",
    content: "전통 몽골 문자는 위에서 아래로 씁니다. 여러 단어를 쓸 때는 왼쪽에서 오른쪽으로 줄을 넘깁니다.",
    visual: "↓ ↓ ↓",
  },
  {
    icon: "🔠",
    title: "자음 모음 배치",
    content: "모음이 먼저, 그 다음 자음이 붙는 구조입니다. 한 음절이 세로로 이어져 하나의 글자 모양을 이룹니다.",
    visual: "모음 + 자음 = 음절",
  },
  {
    icon: "⚖️",
    title: "모음 조화",
    content: "남성 모음 (ᠠ, ᠣ, ᠤ)과 여성 모음 (ᠡ, ᠥ, ᠦ)이 같은 단어 안에서 섞이지 않습니다. 한국어 양성·음성 모음과 비슷한 개념입니다.",
    visual: "남성: ᠠ ᠣ ᠤ | 여성: ᠡ ᠥ ᠦ",
  },
  {
    icon: "🔗",
    title: "연결형 변화",
    content: "글자는 단어 안에서 위치(처음/중간/끝)에 따라 모양이 조금씩 달라집니다. 아랍 문자와 비슷한 특성입니다.",
    visual: "처음형 · 중간형 · 끝형",
  },
];

const memoryTips = [
  {
    tip: "모음 7개를 먼저 외우세요",
    detail: "ᠠ(아) ᠡ(에) ᠢ(이) ᠣ(오) ᠤ(우) ᠥ(외) ᠦ(위) — 한국어 모음과 거의 같습니다!",
    icon: "🎯",
  },
  {
    tip: "한국어 자음과 매칭하세요",
    detail: "ᠮ=ㅁ, ᠨ=ㄴ, ᠯ=ㄹ, ᠰ=ㅅ, ᠲ=ㅌ, ᠳ=ㄷ — 닮은 소리의 자음이 많습니다!",
    icon: "🔗",
  },
  {
    tip: "자주 쓰는 단어로 연습하세요",
    detail: "ᠰᠠᠢᠨ(좋다), ᠮᠣᠩᠭᠣᠯ(몽골), ᠪᠠᠶᠠᠷᠯᠠᠭᠤ(감사합니다) 같은 일상 단어를 먼저 익히세요.",
    icon: "💬",
  },
  {
    tip: "필기 방향에 익숙해지세요",
    detail: "위에서 아래로 쓰는 방향이 익숙해지면 글자 모양을 훨씬 쉽게 외울 수 있습니다.",
    icon: "✍️",
  },
  {
    tip: "모음 조화 원칙을 기억하세요",
    detail: "남성 모음(ᠠᠣᠤ)끼리, 여성 모음(ᠡᠥᠦ)끼리 한 단어 안에 씁니다. 규칙만 알면 절반은 외운 셈입니다!",
    icon: "⚡",
  },
];

type TabType = "vowels" | "consonants" | "rules" | "tips";

export default function ScriptGuide() {
  const [activeTab, setActiveTab] = useState<TabType>("vowels");

  const tabs = [
    { id: "vowels" as TabType, label: "모음 (7개)", icon: <BookOpen className="h-4 w-4" /> },
    { id: "consonants" as TabType, label: "자음 (18개)", icon: <PenLine className="h-4 w-4" /> },
    { id: "rules" as TabType, label: "쓰기 규칙", icon: <Volume2 className="h-4 w-4" /> },
    { id: "tips" as TabType, label: "암기 팁", icon: <Lightbulb className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              사전으로 돌아가기
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-primary">전통 몽골 문자 가이드</h1>
            <span className="font-mongolian text-lg text-gray-500">ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Intro Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="font-mongolian text-6xl leading-none opacity-80">ᠠᠡᠢᠣᠤ</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">전통 몽골 문자란?</h2>
              <p className="text-blue-100 leading-relaxed">
                전통 몽골 문자(ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ)는 13세기부터 쓰여온 몽골의 고유 문자입니다.
                <br />
                <strong>위에서 아래로 세로로 씁니다.</strong> 모음 7개 + 자음 18개로 구성되며,
                한국어 발음과 비슷한 소리가 많아 의외로 쉽게 배울 수 있습니다!
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vowels Tab */}
        {activeTab === "vowels" && (
          <div>
            <p className="text-gray-600 mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              💡 <strong>모음 암기 팁:</strong> 몽골어 모음은 한국어 '아에이오우외위'와 거의 같습니다. 소리가 익숙하니 모양만 외우면 됩니다!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vowels.map((v) => (
                <div
                  key={v.traditional}
                  className={`rounded-xl border-2 p-5 ${v.color} transition-transform hover:scale-105`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mongolian text-5xl leading-none">{v.traditional}</span>
                    <Badge className={v.badgeColor}>{v.korean}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-500">키릴:</span>
                      <span className="font-semibold">{v.cyrillic}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500">로마자:</span>
                      <span className="font-semibold">{v.romanized}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3 border-t border-current border-opacity-20 pt-2">
                    {v.description}
                  </p>
                  <div className="mt-2">
                    {v.examples.map((ex, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs">
                        <span className="font-mongolian">{ex.word}</span>
                        <span className="text-gray-500">→ {ex.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Vowel Harmony Section */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">⚖️ 모음 조화 (중요!)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-700 mb-2">남성 모음 (Masculine)</h4>
                  <div className="flex gap-3 text-3xl font-mongolian mb-2">
                    <span>ᠠ</span><span>ᠣ</span><span>ᠤ</span>
                  </div>
                  <p className="text-sm text-orange-600">아, 오, 우 — 밝고 뒤쪽 발음</p>
                  <p className="text-xs text-gray-500 mt-1">예: ᠮᠣᠩᠭᠣᠯ (몽골)</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-700 mb-2">여성 모음 (Feminine)</h4>
                  <div className="flex gap-3 text-3xl font-mongolian mb-2">
                    <span>ᠡ</span><span>ᠥ</span><span>ᠦ</span>
                  </div>
                  <p className="text-sm text-purple-600">에, 외, 위 — 앞쪽 발음</p>
                  <p className="text-xs text-gray-500 mt-1">예: ᠬᠥᠭᠡᠷᠦᠬᠦᠨ (귀엽다)</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 bg-gray-50 rounded p-3">
                📌 <strong>규칙:</strong> 한 단어 안에서 남성 모음과 여성 모음을 섞어 쓰지 않습니다. 중성 모음 <span className="font-mongolian">ᠢ</span>(이)는 둘 다와 함께 쓸 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* Consonants Tab */}
        {activeTab === "consonants" && (
          <div>
            <p className="text-gray-600 mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              💡 <strong>자음 암기 팁:</strong> 한국어 자음과 소리가 같은 것이 절반 이상입니다. ᠮ=ㅁ, ᠨ=ㄴ, ᠯ=ㄹ, ᠰ=ㅅ — 소리로 연상하세요!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {consonants.map((c) => (
                <div
                  key={c.traditional}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mongolian text-4xl leading-none text-gray-800">{c.traditional}</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{c.korean}</div>
                      <div className="text-xs text-gray-500">{c.romanized}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">키릴: {c.cyrillic}</Badge>
                  </div>
                  <p className="text-xs text-blue-600 bg-blue-50 rounded p-2 mb-2">
                    💡 {c.tip}
                  </p>
                  <div className="text-xs text-gray-500">
                    {c.examples.map((ex, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="font-mongolian text-sm">{ex.word}</span>
                        <span>→ {ex.meaning}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Writing Rules Tab */}
        {activeTab === "rules" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {writingRules.map((rule, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{rule.icon}</span>
                    <h3 className="font-bold text-gray-800 text-lg">{rule.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">{rule.content}</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-center font-mono text-sm text-gray-700">
                    {rule.visual}
                  </div>
                </div>
              ))}
            </div>

            {/* Writing direction illustration */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">📖 세로쓰기 예시</h3>
              <div className="flex items-start gap-8">
                <div className="text-center">
                  <div className="font-mongolian text-5xl leading-loose tracking-widest" style={{writingMode: 'vertical-lr'}}>
                    ᠮᠣᠩᠭᠣᠯ
                  </div>
                  <p className="text-sm text-gray-500 mt-2">몽골 (Монгол)</p>
                </div>
                <div className="text-center">
                  <div className="font-mongolian text-5xl leading-loose tracking-widest" style={{writingMode: 'vertical-lr'}}>
                    ᠰᠠᠢᠨ
                  </div>
                  <p className="text-sm text-gray-500 mt-2">사인 (좋다)</p>
                </div>
                <div className="text-center">
                  <div className="font-mongolian text-5xl leading-loose tracking-widest" style={{writingMode: 'vertical-lr'}}>
                    ᠬᠦᠮᠦᠨ
                  </div>
                  <p className="text-sm text-gray-500 mt-2">사람 (人)</p>
                </div>
                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 self-start">
                  <p className="text-sm text-blue-700">
                    <strong>💡 참고:</strong> 전통 몽골 문자는 원래 완전 세로쓰기입니다. 
                    현대 디지털 환경에서는 90도 회전해서 표시되기도 합니다.
                    실제 책이나 비석에서는 위에서 아래로 쭉 이어서 씁니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Letter position changes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">🔡 위치에 따른 글자 변화</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-semibold">자음</th>
                      <th className="text-center p-3 font-semibold">단어 처음</th>
                      <th className="text-center p-3 font-semibold">단어 중간</th>
                      <th className="text-center p-3 font-semibold">단어 끝</th>
                      <th className="text-left p-3 font-semibold">의미</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3">ᠨ (n)</td>
                      <td className="p-3 text-center font-mongolian text-2xl">ᠨ</td>
                      <td className="p-3 text-center font-mongolian text-2xl">ᠨ</td>
                      <td className="p-3 text-center font-mongolian text-2xl">ᠨ</td>
                      <td className="p-3 text-gray-500">대체로 유사한 편</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="p-3">ᠠ (a)</td>
                      <td className="p-3 text-center font-mongolian text-2xl">ᠠ</td>
                      <td className="p-3 text-center font-mongolian text-2xl">ᠠ</td>
                      <td className="p-3 text-center font-mongolian text-2xl">ᠠ</td>
                      <td className="p-3 text-gray-500">모음은 위치별 변화 적음</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * 자세한 위치 변화는 고급 학습 단계에서 다룹니다. 처음에는 기본형만 익히세요.
              </p>
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === "tips" && (
          <div className="space-y-4">
            <p className="text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              🌟 처음에는 완벽하게 외우려 하지 말고, 자주 보면서 익숙해지는 방법을 추천합니다!
            </p>
            {memoryTips.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{tip.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">
                      {i + 1}단계: {tip.tip}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{tip.detail}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Study order recommendation */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200 p-6 mt-6">
              <h3 className="font-bold text-green-800 text-lg mb-4">📚 추천 학습 순서</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h4 className="font-semibold mb-1">모음 7개 외우기</h4>
                  <p className="text-sm text-gray-600">ᠠᠡᠢᠣᠤᠥᠦ — 한국어와 비슷해서 쉬움!</p>
                </div>
                <div className="flex-1 bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <h4 className="font-semibold mb-1">주요 자음 10개</h4>
                  <p className="text-sm text-gray-600">ᠨᠪᠬᠭᠮᠯᠰᠲᠳᠴ 한국어와 소리 매칭</p>
                </div>
                <div className="flex-1 bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h4 className="font-semibold mb-1">짧은 단어 읽기</h4>
                  <p className="text-sm text-gray-600">ᠭᠠᠷ(손), ᠨᠠᠷᠠ(태양) 직접 읽어보기</p>
                </div>
                <div className="flex-1 bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-2xl mb-2">4️⃣</div>
                  <h4 className="font-semibold mb-1">사전으로 단어 찾기</h4>
                  <p className="text-sm text-gray-600">알파벳 탐색으로 직접 단어 찾아보기</p>
                </div>
              </div>
            </div>

            {/* Quick reference table */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">📋 한눈에 보는 대응표</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">모음</h4>
                  <div className="space-y-1">
                    {vowels.map((v) => (
                      <div key={v.traditional} className="flex items-center gap-3 text-sm">
                        <span className="font-mongolian text-xl w-8">{v.traditional}</span>
                        <span className="text-gray-400">→</span>
                        <span className="w-6">{v.cyrillic}</span>
                        <span className="text-gray-500">{v.korean}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">주요 자음</h4>
                  <div className="space-y-1">
                    {consonants.slice(0, 10).map((c) => (
                      <div key={c.traditional} className="flex items-center gap-3 text-sm">
                        <span className="font-mongolian text-xl w-8">{c.traditional}</span>
                        <span className="text-gray-400">→</span>
                        <span className="w-6">{c.cyrillic}</span>
                        <span className="text-gray-500">{c.korean}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to dictionary CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">문자를 익혔다면 실제 단어를 찾아보세요!</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            <BookOpen className="h-4 w-4" />
            사전으로 가서 단어 검색하기
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-500 text-sm">© 2024 몽골어 사전. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
