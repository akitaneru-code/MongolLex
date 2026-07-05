import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Heart, Share, ChevronDown, ChevronUp } from "lucide-react";
import { type DictionaryEntry, type Example, type RelatedWord } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/use-favorites";
import { useProfile } from "@/hooks/use-profile";
import { speakText, isTTSSupported } from "@/lib/tts";

interface DictionaryEntryProps {
  entry: DictionaryEntry;
  scriptType: 'traditional' | 'cyrillic';
  "data-testid"?: string;
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  "초급": { label: "초급", color: "bg-green-100 text-green-700" },
  "중급": { label: "중급", color: "bg-yellow-100 text-yellow-700" },
  "고급": { label: "고급", color: "bg-red-100 text-red-700" },
};

export default function DictionaryEntryComponent({
  entry,
  scriptType,
  "data-testid": testId
}: DictionaryEntryProps) {
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { markViewed } = useProfile();
  const [showExamples, setShowExamples] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mongolianText = scriptType === 'traditional'
    ? entry.mongolianTraditional
    : entry.mongolianCyrillic;

  const getPartOfSpeechColor = (partOfSpeech: string) => {
    switch (partOfSpeech) {
      case '명사': return 'bg-blue-100 text-blue-700';
      case '동사': return 'bg-purple-100 text-purple-700';
      case '형용사': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const difficultyInfo = difficultyConfig[entry.difficulty] || difficultyConfig["초급"];

  const handleSpeak = (text: string) => {
    if (!isTTSSupported()) {
      toast({ title: "지원 안 됨", description: "이 브라우저는 음성 기능을 지원하지 않습니다." });
      return;
    }
    setIsSpeaking(true);
    speakText(text);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  const handleFavorite = () => {
    toggleFavorite(entry.id);
    markViewed(entry.id);
    toast({
      title: isFavorite(entry.id) ? "즐겨찾기 해제" : "즐겨찾기 추가 ❤️",
      description: isFavorite(entry.id) ? `"${entry.mongolianCyrillic}"를 즐겨찾기에서 제거했습니다.` : `"${entry.mongolianCyrillic}"를 즐겨찾기에 추가했습니다.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mongolianText} - 몽골어 사전`,
        text: `${mongolianText}: ${entry.korean}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${mongolianText}: ${entry.korean} [${entry.pronunciation}]`);
      toast({ title: "복사 완료", description: "클립보드에 복사되었습니다." });
    }
  };

  const relatedWords: RelatedWord[] = Array.isArray(entry.relatedWords)
    ? (entry.relatedWords as RelatedWord[])
    : [];

  const examples: Example[] = Array.isArray(entry.examples)
    ? (entry.examples as Example[])
    : [];

  const favorited = isFavorite(entry.id);

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
      data-testid={testId}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3
              className={`text-2xl font-medium ${scriptType === 'traditional' ? 'font-mongolian' : ''}`}
              data-testid="word-mongolian"
            >
              {mongolianText}
            </h3>
            <Badge className={getPartOfSpeechColor(entry.partOfSpeech)} data-testid="part-of-speech">
              {entry.partOfSpeech}
            </Badge>
            <Badge className={difficultyInfo.color}>
              {difficultyInfo.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSpeak(entry.mongolianCyrillic)}
              className={`p-1 ${isSpeaking ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
              title="발음 듣기"
            >
              <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
            </Button>
          </div>

          {/* Both scripts */}
          {scriptType === 'traditional' && (
            <p className="text-sm text-gray-500 mb-2">{entry.mongolianCyrillic}</p>
          )}
          {scriptType === 'cyrillic' && (
            <p className="text-sm text-gray-500 font-mongolian mb-2">{entry.mongolianTraditional}</p>
          )}

          {/* Pronunciation */}
          <div className="mb-3">
            <span className="text-sm text-gray-500">발음: </span>
            <span className="text-sm font-medium text-gray-700" data-testid="pronunciation">
              {entry.pronunciation}
            </span>
          </div>

          {/* Translations */}
          <div className="space-y-1 mb-4">
            <div>
              <span className="text-sm font-medium text-gray-600">한국어: </span>
              <span className="text-base font-semibold" data-testid="translation-korean">{entry.korean}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">English: </span>
              <span className="text-sm text-gray-700" data-testid="translation-english">{entry.english}</span>
            </div>
          </div>

          {/* Related words */}
          {relatedWords.length > 0 && (
            <div className="mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">연관 단어</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {relatedWords.map((rw, i) => (
                  <button
                    key={i}
                    onClick={() => handleSpeak(rw.mongolianCyrillic)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs hover:bg-blue-100 transition-colors group"
                    title="클릭하면 발음 들기"
                  >
                    <span className={scriptType === 'traditional' ? 'font-mongolian text-sm' : ''}>
                      {scriptType === 'traditional' ? rw.mongolianTraditional : rw.mongolianCyrillic}
                    </span>
                    <span className="text-gray-500">({rw.korean})</span>
                    <Volume2 className="h-3 w-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Example sentences toggle */}
          {examples.length > 0 && (
            <div>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-1 text-sm text-primary hover:text-blue-700 transition-colors mb-2"
              >
                {showExamples ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                예문 {showExamples ? '숨기기' : '보기'} ({examples.length}개)
              </button>

              {showExamples && (
                <div className="border-t border-gray-100 pt-3 space-y-3">
                  {examples.map((example: Example, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3" data-testid={`example-${index}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className={`text-base ${scriptType === 'traditional' ? 'font-mongolian' : ''}`}
                          data-testid="example-mongolian"
                        >
                          {scriptType === 'traditional' ? example.mongolianTraditional : example.mongolianCyrillic}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSpeak(example.mongolianCyrillic)}
                          className="text-gray-400 hover:text-primary p-1 flex-shrink-0"
                          title="예문 발음 듣기"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-gray-600 text-sm" data-testid="example-translation">{example.korean}</p>
                      <p className="text-gray-400 text-xs">{example.english}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex lg:flex-col gap-2 flex-shrink-0">
          <Button
            variant={favorited ? "default" : "outline"}
            size="sm"
            onClick={handleFavorite}
            className={`flex items-center gap-2 ${favorited ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white' : ''}`}
            data-testid="favorite-button"
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{favorited ? '저장됨' : '저장'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
            data-testid="share-button"
          >
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">공유</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
