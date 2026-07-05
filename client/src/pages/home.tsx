import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type DictionaryEntry } from "@shared/schema";
import SearchBar from "@/components/search-bar";
import AlphabetNav from "@/components/alphabet-nav";
import DictionaryEntryComponent from "@/components/dictionary-entry";
import ScriptToggle from "@/components/script-toggle";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, User, ChevronDown, X } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { useProfile } from "@/hooks/use-profile";

const PART_OF_SPEECH_OPTIONS = ["전체", "명사", "동사", "형용사", "부사"];
const DIFFICULTY_OPTIONS = ["전체", "초급", "중급", "고급"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [scriptType, setScriptType] = useState<'traditional' | 'cyrillic'>('traditional');
  const [showMore, setShowMore] = useState(false);
  const [partOfSpeech, setPartOfSpeech] = useState("전체");
  const [difficulty, setDifficulty] = useState("전체");
  const [showFilters, setShowFilters] = useState(false);

  const { count: favoritesCount } = useFavorites();
  const { profile } = useProfile();

  const hasActiveFilters = partOfSpeech !== "전체" || difficulty !== "전체";

  const { data: entries = [], isLoading } = useQuery<DictionaryEntry[]>({
    queryKey: selectedLetter
      ? ['/api/dictionary/letter', selectedLetter, scriptType]
      : ['/api/dictionary/search', searchQuery, showMore ? 50 : 20, partOfSpeech, difficulty],
    queryFn: async () => {
      if (selectedLetter) {
        const response = await fetch(`/api/dictionary/letter/${encodeURIComponent(selectedLetter)}?script=${scriptType}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      } else {
        const params = new URLSearchParams({ q: searchQuery, limit: (showMore ? 50 : 20).toString() });
        if (partOfSpeech !== "전체") params.set("partOfSpeech", partOfSpeech);
        if (difficulty !== "전체") params.set("difficulty", difficulty);
        const response = await fetch(`/api/dictionary/search?${params}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      }
    },
    enabled: true,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedLetter("");
  };

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setSearchQuery("");
  };

  const clearFilters = () => {
    setPartOfSpeech("전체");
    setDifficulty("전체");
  };

  const getResultsTitle = () => {
    if (selectedLetter) return `"${selectedLetter}" 로 시작하는 단어`;
    if (searchQuery) return "검색 결과";
    return "전체 단어";
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-primary" data-testid="site-title">
                몽골어 사전
              </h1>
              <span className="text-sm text-gray-400 hidden sm:block">Mongolian Dictionary</span>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/script-guide" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">문자 가이드</span>
              </Link>

              <Link href="/favorites" className="relative flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-red-300">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">즐겨찾기</span>
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              <Link href="/profile" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{profile ? profile.name : '프로필'}</span>
              </Link>

              <ScriptToggle
                scriptType={scriptType}
                onToggle={setScriptType}
                data-testid="script-toggle"
              />
            </div>
          </div>

          <SearchBar
            onSearch={handleSearch}
            initialValue={searchQuery}
            data-testid="search-bar"
          />

          {/* Filter row */}
          {!selectedLetter && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${hasActiveFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`}
              >
                필터
                <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                {hasActiveFilters && <span className="ml-1 bg-white/20 rounded-full px-1 text-xs">ON</span>}
              </button>

              {showFilters && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">품사:</span>
                    {PART_OF_SPEECH_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setPartOfSpeech(opt)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${partOfSpeech === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">난이도:</span>
                    {DIFFICULTY_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setDifficulty(opt)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${difficulty === opt ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" /> 초기화
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Alphabet Navigation */}
        <AlphabetNav
          onLetterSelect={handleLetterSelect}
          selectedLetter={selectedLetter}
          scriptType={scriptType}
          data-testid="alphabet-nav"
        />

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800" data-testid="results-title">
              {getResultsTitle()}
            </h2>
            <span className="text-sm text-gray-500" data-testid="results-count">
              총 {entries.length}개 결과
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500" data-testid="no-results">검색 결과가 없습니다.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline">
                  필터 초기화하기
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <DictionaryEntryComponent
                    key={entry.id}
                    entry={entry}
                    scriptType={scriptType}
                    data-testid={`entry-${entry.id}`}
                  />
                ))}
              </div>

              {!selectedLetter && entries.length >= 20 && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={() => setShowMore(!showMore)}
                    className="px-6 py-3 bg-primary text-white hover:bg-blue-700"
                  >
                    {showMore ? "간단히 보기" : "더 많은 결과 보기"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">몽골어 사전</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                전통 몽골 문자와 키릴 몽골어를 지원하는 포괄적인 온라인 사전입니다.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-4">빠른 링크</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/script-guide" className="text-gray-600 hover:text-primary transition-colors">문자 가이드</Link></li>
                <li><Link href="/favorites" className="text-gray-600 hover:text-primary transition-colors">즐겨찾기</Link></li>
                <li><Link href="/profile" className="text-gray-600 hover:text-primary transition-colors">학습 프로필</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-4">기능</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>🔊 음성 발음 지원</li>
                <li>🔍 품사/난이도 필터</li>
                <li>❤️ 즐겨찾기 저장</li>
                <li>📊 학습 진도 추적</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-600 text-sm">© 2024 몽골어 사전. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
