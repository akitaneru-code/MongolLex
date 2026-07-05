import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, BookOpen } from "lucide-react";
import { type DictionaryEntry } from "@shared/schema";
import { useFavorites } from "@/hooks/use-favorites";
import DictionaryEntryComponent from "@/components/dictionary-entry";
import ScriptToggle from "@/components/script-toggle";

export default function Favorites() {
  const [scriptType, setScriptType] = useState<'traditional' | 'cyrillic'>('traditional');
  const { favorites } = useFavorites();

  const { data: allEntries = [], isLoading } = useQuery<DictionaryEntry[]>({
    queryKey: ['/api/dictionary'],
    queryFn: async () => {
      const res = await fetch('/api/dictionary');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const favoriteEntries = allEntries.filter(e => favorites.includes(e.id));

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm">
                <ArrowLeft className="h-4 w-4" />
                사전으로 돌아가기
              </Link>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-current" />
                <h1 className="text-xl font-bold text-gray-800">즐겨찾기</h1>
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {favorites.length}개
                </span>
              </div>
            </div>
            <ScriptToggle scriptType={scriptType} onToggle={setScriptType} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : favoriteEntries.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">저장된 단어가 없습니다</h2>
            <p className="text-gray-500 mb-6">사전에서 단어 카드의 ❤️ 버튼을 눌러 저장해보세요!</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <BookOpen className="h-4 w-4" />
              사전 보러 가기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-700">내가 저장한 단어들</h2>
              <span className="text-sm text-gray-400">총 {favoriteEntries.length}개</span>
            </div>
            {favoriteEntries.map(entry => (
              <DictionaryEntryComponent
                key={entry.id}
                entry={entry}
                scriptType={scriptType}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
