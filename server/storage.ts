import { type DictionaryEntry, type InsertDictionaryEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined>;
  searchDictionaryEntries(query: string, limit?: number, partOfSpeech?: string, difficulty?: string): Promise<DictionaryEntry[]>;
  getDictionaryEntriesByLetter(letter: string, script: 'traditional' | 'cyrillic'): Promise<DictionaryEntry[]>;
  getAllDictionaryEntries(): Promise<DictionaryEntry[]>;
  createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry>;
}

export class MemStorage implements IStorage {
  private entries: Map<string, DictionaryEntry>;

  constructor() {
    this.entries = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleEntries: InsertDictionaryEntry[] = [
      {
        mongolianTraditional: "ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ",
        mongolianCyrillic: "Монгол улс",
        korean: "몽골, 몽골국",
        english: "Mongolia, Mongolian state",
        pronunciation: "[몽골 울스]",
        partOfSpeech: "명사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ ᠤᠨ ᠨᠢᠶᠰᠯᠡᠯ ᠬᠣᠳᠠ ᠤᠯᠠᠭᠠᠨᠪᠠᠭᠠᠲᠤᠷ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Монгол улсын нийслэл хот Улаанбаатар байна.",
            korean: "몽골의 수도는 울란바토르입니다.",
            english: "The capital of Mongolia is Ulaanbaatar."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "улс", mongolianTraditional: "ᠤᠯᠤᠰ", korean: "나라" },
          { mongolianCyrillic: "нийслэл", mongolianTraditional: "ᠨᠢᠶᠰᠯᠡᠯ", korean: "수도" },
          { mongolianCyrillic: "хот", mongolianTraditional: "ᠬᠣᠳᠠ", korean: "도시" }
        ]
      },
      {
        mongolianTraditional: "ᠨᠠᠷᠠᠨ",
        mongolianCyrillic: "наран",
        korean: "해, 태양",
        english: "sun",
        pronunciation: "[나란]",
        partOfSpeech: "명사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠨᠠᠷᠠᠨ ᠮᠠᠨᠳᠤᠵᠤ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Наран мандаж байна.",
            korean: "해가 떠오르고 있습니다.",
            english: "The sun is rising."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "гэрэл", mongolianTraditional: "ᠭᠡᠷᠡᠯ", korean: "빛" },
          { mongolianCyrillic: "тэнгэр", mongolianTraditional: "ᠲᠡᠩᠭᠡᠷ", korean: "하늘" },
          { mongolianCyrillic: "сар", mongolianTraditional: "ᠰᠠᠷᠠ", korean: "달" }
        ]
      },
      {
        mongolianTraditional: "ᠬᠦᠷᠬᠦ",
        mongolianCyrillic: "хүрэх",
        korean: "도달하다, 닿다",
        english: "to reach, to arrive",
        pronunciation: "[쿠르쿠]",
        partOfSpeech: "동사",
        difficulty: "중급",
        examples: [
          {
            mongolianTraditional: "ᠪᠢ ᠭᠡᠷᠲᠦ ᠬᠦᠷᠦᠭᠦᠯᠦᠨ᠎ᠡ᠃",
            mongolianCyrillic: "Би гэртээ хүрэв.",
            korean: "나는 집에 도착했습니다.",
            english: "I arrived home."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "ирэх", mongolianTraditional: "ᠢᠷᠡᠬᠦ", korean: "오다" },
          { mongolianCyrillic: "явах", mongolianTraditional: "ᠶᠠᠪᠤᠬᠤ", korean: "가다" },
          { mongolianCyrillic: "очих", mongolianTraditional: "ᠣᠴᠢᠬᠤ", korean: "가다(목적지로)" }
        ]
      },
      {
        mongolianTraditional: "ᠮᠤᠷᠢ",
        mongolianCyrillic: "морь",
        korean: "말",
        english: "horse",
        pronunciation: "[모리]",
        partOfSpeech: "명사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠮᠤᠷᠢ ᠬᠦᠷᠳᠦᠨ ᠭᠦᠶᠦᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Морь хурдан гүйж байна.",
            korean: "말이 빠르게 달리고 있습니다.",
            english: "The horse is running fast."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "тэмээ", mongolianTraditional: "ᠲᠡᠮᠡᠭᠡ", korean: "낙타" },
          { mongolianCyrillic: "үхэр", mongolianTraditional: "ᠦᠬᠡᠷ", korean: "소" },
          { mongolianCyrillic: "хонь", mongolianTraditional: "ᠬᠣᠨᠢ", korean: "양" }
        ]
      },
      {
        mongolianTraditional: "ᠤᠰᠤ",
        mongolianCyrillic: "ус",
        korean: "물",
        english: "water",
        pronunciation: "[우스]",
        partOfSpeech: "명사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠤᠰᠤ ᠴᠢᠩᠭᠡ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Ус тунгалаг байна.",
            korean: "물이 맑습니다.",
            english: "The water is clear."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "сүү", mongolianTraditional: "ᠰᠦ", korean: "우유" },
          { mongolianCyrillic: "цай", mongolianTraditional: "ᠴᠠᠢ", korean: "차(茶)" },
          { mongolianCyrillic: "гол", mongolianTraditional: "ᠭᠣᠣᠯ", korean: "강" }
        ]
      },
      {
        mongolianTraditional: "ᠠᠪᠬᠤ",
        mongolianCyrillic: "авах",
        korean: "가져가다, 받다",
        english: "to take, to receive",
        pronunciation: "[아브쿠]",
        partOfSpeech: "동사",
        difficulty: "중급",
        examples: [
          {
            mongolianTraditional: "ᠪᠢ ᠨᠣᠮ ᠠᠪᠬᠤ ᠬᠡᠷᠡᠭᠲᠡᠢ᠃",
            mongolianCyrillic: "Би ном авах хэрэгтэй.",
            korean: "나는 책을 가져가야 합니다.",
            english: "I need to take the book."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "өгөх", mongolianTraditional: "ᠥᠭᠬᠦ", korean: "주다" },
          { mongolianCyrillic: "тавих", mongolianTraditional: "ᠲᠠᠪᠢᠬᠤ", korean: "놓다" },
          { mongolianCyrillic: "барих", mongolianTraditional: "ᠪᠠᠷᠢᠬᠤ", korean: "잡다" }
        ]
      },
      {
        mongolianTraditional: "ᠬᠥᠭᠡᠷᠦᠬᠦᠨ",
        mongolianCyrillic: "хөөрхөн",
        korean: "귀엽다, 사랑스럽다",
        english: "cute, lovely, adorable",
        pronunciation: "[훠르헌]",
        partOfSpeech: "형용사",
        difficulty: "중급",
        examples: [
          {
            mongolianTraditional: "ᠪᠠᠭᠠ ᠬᠦᠦᠬᠡᠳ ᠬᠥᠭᠡᠷᠦᠬᠦᠨ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Бага хүүхэд хөөрхөн байна.",
            korean: "어린 아이가 귀엽습니다.",
            english: "The little child is cute."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "сайхан", mongolianTraditional: "ᠰᠠᠶᠢᠬᠠᠨ", korean: "아름답다" },
          { mongolianCyrillic: "жижиг", mongolianTraditional: "ᠵᠢᠵᠢᠭ", korean: "작다" },
          { mongolianCyrillic: "сайн", mongolianTraditional: "ᠰᠠᠢᠨ", korean: "좋다" }
        ]
      },
      {
        mongolianTraditional: "ᠤᠯᠤᠰ",
        mongolianCyrillic: "улс",
        korean: "나라, 국가",
        english: "country, nation, state",
        pronunciation: "[울스]",
        partOfSpeech: "명사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠮᠠᠨᠠᠢ ᠤᠯᠤᠰ ᠢᠶᠡᠨ ᠰᠠᠶᠢᠨ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Манай улс их сайн байна.",
            korean: "우리나라는 매우 좋습니다.",
            english: "Our country is very good."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "хот", mongolianTraditional: "ᠬᠣᠳᠠ", korean: "도시" },
          { mongolianCyrillic: "нийслэл", mongolianTraditional: "ᠨᠢᠶᠰᠯᠡᠯ", korean: "수도" },
          { mongolianCyrillic: "газар", mongolianTraditional: "ᠭᠠᠵᠠᠷ", korean: "땅, 장소" }
        ]
      },
      {
        mongolianTraditional: "ᠰᠠᠢᠨ",
        mongolianCyrillic: "сайн",
        korean: "좋다, 안녕하세요 (인사)",
        english: "good, fine; hello (greeting)",
        pronunciation: "[사인]",
        partOfSpeech: "형용사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠰᠠᠢᠨ ᠪᠠᠶᠢᠨᠠ ᠤᠤ᠃",
            mongolianCyrillic: "Сайн байна уу?",
            korean: "안녕하세요? (잘 지내십니까?)",
            english: "How are you? (Hello)"
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "муу", mongolianTraditional: "ᠮᠠᠭᠤ", korean: "나쁘다" },
          { mongolianCyrillic: "сайхан", mongolianTraditional: "ᠰᠠᠶᠢᠬᠠᠨ", korean: "아름답다" },
          { mongolianCyrillic: "маш сайн", mongolianTraditional: "ᠮᠠᠰᠢ ᠰᠠᠢᠨ", korean: "매우 좋다" }
        ]
      },
      {
        mongolianTraditional: "ᠪᠠᠶᠠᠷᠯᠠᠬᠤ",
        mongolianCyrillic: "баярлах",
        korean: "감사하다, 기뻐하다",
        english: "to thank, to be happy",
        pronunciation: "[바야를라쿠]",
        partOfSpeech: "동사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠪᠠᠶᠠᠷᠯᠠᠭᠤ᠃",
            mongolianCyrillic: "Баярлалаа.",
            korean: "감사합니다.",
            english: "Thank you."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "уучлаарай", mongolianTraditional: "ᠤᠤᠴᠢᠯᠠᠭᠠᠷᠠᠢ", korean: "죄송합니다" },
          { mongolianCyrillic: "тавтай морил", mongolianTraditional: "ᠲᠠᠪᠲᠠᠢ ᠮᠣᠷᠢᠯ", korean: "환영합니다" }
        ]
      },
      {
        mongolianTraditional: "ᠬᠦᠮᠦᠨ",
        mongolianCyrillic: "хүн",
        korean: "사람, 인간",
        english: "person, human",
        pronunciation: "[쿤]",
        partOfSpeech: "명사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠲᠡᠷᠡ ᠰᠠᠢᠨ ᠬᠦᠮᠦᠨ᠃",
            mongolianCyrillic: "Тэр сайн хүн.",
            korean: "그는 좋은 사람입니다.",
            english: "He/She is a good person."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "эмэгтэй", mongolianTraditional: "ᠡᠮᠡᠭᠲᠡᠢ", korean: "여자" },
          { mongolianCyrillic: "эрэгтэй", mongolianTraditional: "ᠡᠷᠡᠭᠲᠡᠢ", korean: "남자" },
          { mongolianCyrillic: "хүүхэд", mongolianTraditional: "ᠬᠦᠦᠬᠡᠳ", korean: "아이" }
        ]
      },
      {
        mongolianTraditional: "ᠬᠣᠭᠤᠯᠠ",
        mongolianCyrillic: "хоол",
        korean: "음식, 밥",
        english: "food, meal",
        pronunciation: "[홀]",
        partOfSpeech: "명사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠬᠣᠭᠤᠯᠠ ᠠᠮᠲᠠᠲᠠᠢ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Хоол амттай байна.",
            korean: "음식이 맛있습니다.",
            english: "The food is delicious."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "мах", mongolianTraditional: "ᠮᠢᠬᠠ", korean: "고기" },
          { mongolianCyrillic: "талх", mongolianTraditional: "ᠲᠠᠯᠬ᠎ᠠ", korean: "빵" },
          { mongolianCyrillic: "цай", mongolianTraditional: "ᠴᠠᠢ", korean: "차(茶)" }
        ]
      },
      {
        mongolianTraditional: "ᠶᠠᠪᠤᠬᠤ",
        mongolianCyrillic: "явах",
        korean: "가다, 출발하다",
        english: "to go, to depart",
        pronunciation: "[야브쿠]",
        partOfSpeech: "동사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠪᠢ ᠰᠤᠷᠭᠠᠭᠤᠯᠢ ᠳᠤ ᠶᠠᠪᠤᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Би сургуульд явна.",
            korean: "나는 학교에 갑니다.",
            english: "I go to school."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "ирэх", mongolianTraditional: "ᠢᠷᠡᠬᠦ", korean: "오다" },
          { mongolianCyrillic: "буцах", mongolianTraditional: "ᠪᠤᠴᠠᠬᠤ", korean: "돌아가다" },
          { mongolianCyrillic: "зогсох", mongolianTraditional: "ᠵᠣᠭᠰᠣᠬᠤ", korean: "멈추다" }
        ]
      },
      {
        mongolianTraditional: "ᠬᠠᠶᠢᠷᠠᠯᠠᠬᠤ",
        mongolianCyrillic: "хайрлах",
        korean: "사랑하다",
        english: "to love",
        pronunciation: "[하이를라쿠]",
        partOfSpeech: "동사",
        difficulty: "중급",
        examples: [
          {
            mongolianTraditional: "ᠪᠢ ᠴᠢᠮ᠎ᠡ ᠳᠦ ᠬᠠᠶᠢᠷᠠᠲᠠᠢ᠃",
            mongolianCyrillic: "Би чамд хайртай.",
            korean: "나는 당신을 사랑합니다.",
            english: "I love you."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "дурлах", mongolianTraditional: "ᠳᠤᠷᠯᠠᠬᠤ", korean: "좋아하다, 반하다" },
          { mongolianCyrillic: "найз", mongolianTraditional: "ᠨᠠᠶᠢᠵᠠ", korean: "친구" },
          { mongolianCyrillic: "гэр бүл", mongolianTraditional: "ᠭᠡᠷ ᠪᠦᠯᠢ", korean: "가족" }
        ]
      },
      {
        mongolianTraditional: "ᠰᠤᠷᠬᠤ",
        mongolianCyrillic: "сурах",
        korean: "배우다, 공부하다",
        english: "to learn, to study",
        pronunciation: "[수르쿠]",
        partOfSpeech: "동사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠪᠢ ᠮᠣᠩᠭᠣᠯ ᠬᠡᠯᠡ ᠰᠤᠷᠴᠤ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Би монгол хэл сурч байна.",
            korean: "나는 몽골어를 배우고 있습니다.",
            english: "I am learning Mongolian."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "сургууль", mongolianTraditional: "ᠰᠤᠷᠭᠠᠭᠤᠯᠢ", korean: "학교" },
          { mongolianCyrillic: "ном", mongolianTraditional: "ᠨᠣᠮ", korean: "책" },
          { mongolianCyrillic: "хэл", mongolianTraditional: "ᠬᠡᠯᠡ", korean: "언어, 말" }
        ]
      },
      {
        mongolianTraditional: "ᠲᠤᠮᠤ",
        mongolianCyrillic: "том",
        korean: "크다, 큰",
        english: "big, large",
        pronunciation: "[톰]",
        partOfSpeech: "형용사",
        difficulty: "초급",
        examples: [
          {
            mongolianTraditional: "ᠡᠨᠡ ᠭᠡᠷ ᠲᠤᠮᠤ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Энэ гэр том байна.",
            korean: "이 집은 큽니다.",
            english: "This house is big."
          }
        ],
        relatedWords: [
          { mongolianCyrillic: "жижиг", mongolianTraditional: "ᠵᠢᠵᠢᠭ", korean: "작다" },
          { mongolianCyrillic: "өндөр", mongolianTraditional: "ᠥᠨᠳᠥᠷ", korean: "높다, 키가 크다" },
          { mongolianCyrillic: "богино", mongolianTraditional: "ᠪᠣᠭᠢᠨᠣ", korean: "짧다, 키가 작다" }
        ]
      }
    ];

    sampleEntries.forEach(entry => {
      const id = randomUUID();
      const fullEntry: DictionaryEntry = { ...entry, id };
      this.entries.set(id, fullEntry);
    });
  }

  async getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined> {
    return this.entries.get(id);
  }

  async searchDictionaryEntries(query: string, limit: number = 20, partOfSpeech?: string, difficulty?: string): Promise<DictionaryEntry[]> {
    let results = Array.from(this.entries.values());

    if (query.trim()) {
      const normalizedQuery = query.toLowerCase().trim();
      results = results.filter(entry =>
        entry.mongolianTraditional.toLowerCase().includes(normalizedQuery) ||
        entry.mongolianCyrillic.toLowerCase().includes(normalizedQuery) ||
        entry.korean.toLowerCase().includes(normalizedQuery) ||
        entry.english.toLowerCase().includes(normalizedQuery) ||
        entry.pronunciation.toLowerCase().includes(normalizedQuery)
      );
    }

    if (partOfSpeech && partOfSpeech !== "전체") {
      results = results.filter(entry => entry.partOfSpeech === partOfSpeech);
    }

    if (difficulty && difficulty !== "전체") {
      results = results.filter(entry => entry.difficulty === difficulty);
    }

    return results.slice(0, limit);
  }

  async getDictionaryEntriesByLetter(letter: string, script: 'traditional' | 'cyrillic'): Promise<DictionaryEntry[]> {
    const field = script === 'traditional' ? 'mongolianTraditional' : 'mongolianCyrillic';
    return Array.from(this.entries.values()).filter(entry =>
      entry[field].charAt(0).toLowerCase() === letter.toLowerCase()
    );
  }

  async getAllDictionaryEntries(): Promise<DictionaryEntry[]> {
    return Array.from(this.entries.values());
  }

  async createDictionaryEntry(insertEntry: InsertDictionaryEntry): Promise<DictionaryEntry> {
    const id = randomUUID();
    const entry: DictionaryEntry = { ...insertEntry, id };
    this.entries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
