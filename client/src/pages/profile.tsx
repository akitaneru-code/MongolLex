import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, BookOpen, Heart, Trophy, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type DictionaryEntry } from "@shared/schema";
import { useProfile } from "@/hooks/use-profile";
import { useFavorites } from "@/hooks/use-favorites";

export default function Profile() {
  const { profile, createProfile, deleteProfile, resetProgress, wordsLearned } = useProfile();
  const { count: favoritesCount } = useFavorites();
  const [nameInput, setNameInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: allEntries = [] } = useQuery<DictionaryEntry[]>({
    queryKey: ['/api/dictionary'],
    queryFn: async () => {
      const res = await fetch('/api/dictionary');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const totalWords = allEntries.length;
  const progressPercent = totalWords > 0 ? Math.round((wordsLearned / totalWords) * 100) : 0;

  const handleCreateProfile = () => {
    if (nameInput.trim()) {
      createProfile(nameInput.trim());
      setNameInput("");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm">
              <ArrowLeft className="h-4 w-4" />
              사전으로 돌아가기
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">학습 프로필 만들기</h1>
            <p className="text-gray-500 mb-8">
              이름을 입력하면 학습 기록과 즐겨찾기를 저장할 수 있습니다.
              <br />
              <span className="text-xs text-gray-400">(데이터는 이 브라우저에만 저장됩니다)</span>
            </p>
            <div className="flex gap-3 max-w-xs mx-auto">
              <Input
                placeholder="이름 입력..."
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateProfile()}
                className="flex-1"
              />
              <Button onClick={handleCreateProfile} disabled={!nameInput.trim()}>
                시작
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const getLevelInfo = () => {
    if (wordsLearned >= 30) return { label: "고급 학습자", emoji: "🏆", color: "text-yellow-600" };
    if (wordsLearned >= 15) return { label: "중급 학습자", emoji: "📚", color: "text-blue-600" };
    if (wordsLearned >= 5) return { label: "초급 학습자", emoji: "🌱", color: "text-green-600" };
    return { label: "입문자", emoji: "👋", color: "text-gray-600" };
  };

  const level = getLevelInfo();

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm">
            <ArrowLeft className="h-4 w-4" />
            사전으로 돌아가기
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-gray-800">내 프로필</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile card */}
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-blue-200 text-sm">학습 시작: {joinDate}</p>
              <p className={`font-medium mt-1 ${level.color} bg-white/90 px-2 py-0.5 rounded-full text-xs inline-block`}>
                {level.emoji} {level.label}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{wordsLearned}</div>
            <div className="text-sm text-gray-500">학습한 단어</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{favoritesCount}</div>
            <div className="text-sm text-gray-500">즐겨찾기</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{progressPercent}%</div>
            <div className="text-sm text-gray-500">전체 진도</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">학습 진도</h3>
            <span className="text-sm text-gray-500">{wordsLearned} / {totalWords} 단어</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            단어 카드에서 ❤️ 버튼을 누르면 학습 기록에 추가됩니다.
          </p>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">🏅 달성 목표</h3>
          <div className="space-y-3">
            {[
              { count: 1, label: "첫 단어 학습", emoji: "🌱" },
              { count: 5, label: "단어 5개 학습", emoji: "📖" },
              { count: 10, label: "단어 10개 학습", emoji: "🎯" },
              { count: 15, label: "단어 15개 학습", emoji: "📚" },
              { count: totalWords, label: "모든 단어 학습", emoji: "🏆" },
            ].map(milestone => (
              <div key={milestone.count} className="flex items-center gap-3">
                <span className={`text-xl ${wordsLearned >= milestone.count ? '' : 'grayscale opacity-30'}`}>
                  {milestone.emoji}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${wordsLearned >= milestone.count ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                      {milestone.label}
                    </span>
                    {wordsLearned >= milestone.count && (
                      <span className="text-xs text-green-600 font-semibold">✓ 달성!</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-red-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">설정</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetProgress}
              className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <RotateCcw className="h-4 w-4" />
              학습 기록 초기화
            </Button>

            {!confirmDelete ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                프로필 삭제
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-600">정말 삭제할까요?</span>
                <Button size="sm" variant="destructive" onClick={deleteProfile}>삭제</Button>
                <Button size="sm" variant="outline" onClick={() => setConfirmDelete(false)}>취소</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
