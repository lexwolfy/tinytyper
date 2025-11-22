export interface LetterData {
  letter: string;
  words: {
    english: {
      word: string;
      emoji: string;
      pinyin?: string; // For Chinese words, we include pinyin
      chinese?: string; // Chinese characters
    };
    french: {
      word: string;
      emoji: string;
      pinyin?: string;
      chinese?: string;
    };
    chinese: {
      word: string;
      emoji: string;
      pinyin: string;
      chinese: string;
    };
  };
}

export const vocabulary: Record<string, LetterData> = {
  A: {
    letter: 'A',
    words: {
      english: { word: 'Apple', emoji: '🍎', pinyin: 'Píngguǒ', chinese: '苹果' },
      french: { word: 'Avion', emoji: '✈️', pinyin: 'Fēijī', chinese: '飞机' },
      chinese: { word: 'Píngguǒ', emoji: '🍎', pinyin: 'Píngguǒ', chinese: '苹果' }
    }
  },
  B: {
    letter: 'B',
    words: {
      english: { word: 'Bear', emoji: '🐻', pinyin: 'Xióng', chinese: '熊' },
      french: { word: 'Ballon', emoji: '🎈', pinyin: 'Qìqiú', chinese: '气球' },
      chinese: { word: 'Xióng', emoji: '🐻', pinyin: 'Xióng', chinese: '熊' }
    }
  },
  C: {
    letter: 'C',
    words: {
      english: { word: 'Cat', emoji: '🐱', pinyin: 'Māo', chinese: '猫' },
      french: { word: 'Chat', emoji: '🐱', pinyin: 'Māo', chinese: '猫' },
      chinese: { word: 'Māo', emoji: '🐱', pinyin: 'Māo', chinese: '猫' }
    }
  },
  D: {
    letter: 'D',
    words: {
      english: { word: 'Dog', emoji: '🐶', pinyin: 'Gǒu', chinese: '狗' },
      french: { word: 'Dauphin', emoji: '🐬', pinyin: 'Hǎitún', chinese: '海豚' },
      chinese: { word: 'Gǒu', emoji: '🐶', pinyin: 'Gǒu', chinese: '狗' }
    }
  },
  E: {
    letter: 'E',
    words: {
      english: { word: 'Elephant', emoji: '🐘', pinyin: 'Dàxiàng', chinese: '大象' },
      french: { word: 'Éléphant', emoji: '🐘', pinyin: 'Dàxiàng', chinese: '大象' },
      chinese: { word: 'Dàxiàng', emoji: '🐘', pinyin: 'Dàxiàng', chinese: '大象' }
    }
  },
  F: {
    letter: 'F',
    words: {
      english: { word: 'Fish', emoji: '🐟', pinyin: 'Yú', chinese: '鱼' },
      french: { word: 'Fleur', emoji: '🌸', pinyin: 'Huā', chinese: '花' },
      chinese: { word: 'Yú', emoji: '🐟', pinyin: 'Yú', chinese: '鱼' }
    }
  },
  G: {
    letter: 'G',
    words: {
      english: { word: 'Giraffe', emoji: '🦒', pinyin: 'Chángjǐnglù', chinese: '长颈鹿' },
      french: { word: 'Girafe', emoji: '🦒', pinyin: 'Chángjǐnglù', chinese: '长颈鹿' },
      chinese: { word: 'Chángjǐnglù', emoji: '🦒', pinyin: 'Chángjǐnglù', chinese: '长颈鹿' }
    }
  },
  H: {
    letter: 'H',
    words: {
      english: { word: 'House', emoji: '🏠', pinyin: 'Fángzi', chinese: '房子' },
      french: { word: 'Hibou', emoji: '🦉', pinyin: 'Māotóuyīng', chinese: '猫头鹰' },
      chinese: { word: 'Fángzi', emoji: '🏠', pinyin: 'Fángzi', chinese: '房子' }
    }
  },
  I: {
    letter: 'I',
    words: {
      english: { word: 'Ice Cream', emoji: '🍦', pinyin: 'Bīngjīlíng', chinese: '冰淇淋' },
      french: { word: 'Île', emoji: '🏝️', pinyin: 'Dǎo', chinese: '岛' },
      chinese: { word: 'Bīngjīlíng', emoji: '🍦', pinyin: 'Bīngjīlíng', chinese: '冰淇淋' }
    }
  },
  J: {
    letter: 'J',
    words: {
      english: { word: 'Jellyfish', emoji: '🪼', pinyin: 'Shuǐmǔ', chinese: '水母' },
      french: { word: 'Jus', emoji: '🧃', pinyin: 'Guǒzhī', chinese: '果汁' },
      chinese: { word: 'Shuǐmǔ', emoji: '🪼', pinyin: 'Shuǐmǔ', chinese: '水母' }
    }
  },
  K: {
    letter: 'K',
    words: {
      english: { word: 'Kite', emoji: '🪁', pinyin: 'Fēngzhēng', chinese: '风筝' },
      french: { word: 'Koala', emoji: '🐨', pinyin: 'Kǎolā', chinese: '考拉' },
      chinese: { word: 'Fēngzhēng', emoji: '🪁', pinyin: 'Fēngzhēng', chinese: '风筝' }
    }
  },
  L: {
    letter: 'L',
    words: {
      english: { word: 'Lion', emoji: '🦁', pinyin: 'Shīzi', chinese: '狮子' },
      french: { word: 'Lion', emoji: '🦁', pinyin: 'Shīzi', chinese: '狮子' },
      chinese: { word: 'Shīzi', emoji: '🦁', pinyin: 'Shīzi', chinese: '狮子' }
    }
  },
  M: {
    letter: 'M',
    words: {
      english: { word: 'Moon', emoji: '🌙', pinyin: 'Yuèliang', chinese: '月亮' },
      french: { word: 'Maison', emoji: '🏠', pinyin: 'Fángzi', chinese: '房子' },
      chinese: { word: 'Yuèliang', emoji: '🌙', pinyin: 'Yuèliang', chinese: '月亮' }
    }
  },
  N: {
    letter: 'N',
    words: {
      english: { word: 'Nose', emoji: '👃', pinyin: 'Bízi', chinese: '鼻子' },
      french: { word: 'Nuage', emoji: '☁️', pinyin: 'Yún', chinese: '云' },
      chinese: { word: 'Bízi', emoji: '👃', pinyin: 'Bízi', chinese: '鼻子' }
    }
  },
  O: {
    letter: 'O',
    words: {
      english: { word: 'Orange', emoji: '🍊', pinyin: 'Chéngzi', chinese: '橙子' },
      french: { word: 'Orange', emoji: '🍊', pinyin: 'Chéngzi', chinese: '橙子' },
      chinese: { word: 'Chéngzi', emoji: '🍊', pinyin: 'Chéngzi', chinese: '橙子' }
    }
  },
  P: {
    letter: 'P',
    words: {
      english: { word: 'Penguin', emoji: '🐧', pinyin: 'Qǐ\'é', chinese: '企鹅' },
      french: { word: 'Pingouin', emoji: '🐧', pinyin: 'Qǐ\'é', chinese: '企鹅' },
      chinese: { word: 'Qǐ\'é', emoji: '🐧', pinyin: 'Qǐ\'é', chinese: '企鹅' }
    }
  },
  Q: {
    letter: 'Q',
    words: {
      english: { word: 'Queen', emoji: '👑', pinyin: 'Wánghoù', chinese: '王后' },
      french: { word: 'Quatre', emoji: '4️⃣', pinyin: 'Sì', chinese: '四' },
      chinese: { word: 'Wánghoù', emoji: '👑', pinyin: 'Wánghoù', chinese: '王后' }
    }
  },
  R: {
    letter: 'R',
    words: {
      english: { word: 'Rabbit', emoji: '🐰', pinyin: 'Tùzi', chinese: '兔子' },
      french: { word: 'Renard', emoji: '🦊', pinyin: 'Húli', chinese: '狐狸' },
      chinese: { word: 'Tùzi', emoji: '🐰', pinyin: 'Tùzi', chinese: '兔子' }
    }
  },
  S: {
    letter: 'S',
    words: {
      english: { word: 'Sun', emoji: '☀️', pinyin: 'Tàiyáng', chinese: '太阳' },
      french: { word: 'Soleil', emoji: '☀️', pinyin: 'Tàiyáng', chinese: '太阳' },
      chinese: { word: 'Tàiyáng', emoji: '☀️', pinyin: 'Tàiyáng', chinese: '太阳' }
    }
  },
  T: {
    letter: 'T',
    words: {
      english: { word: 'Tree', emoji: '🌳', pinyin: 'Shù', chinese: '树' },
      french: { word: 'Train', emoji: '🚂', pinyin: 'Huǒchē', chinese: '火车' },
      chinese: { word: 'Shù', emoji: '🌳', pinyin: 'Shù', chinese: '树' }
    }
  },
  U: {
    letter: 'U',
    words: {
      english: { word: 'Umbrella', emoji: '☂️', pinyin: 'Yǔsǎn', chinese: '雨伞' },
      french: { word: 'Ours', emoji: '🐻', pinyin: 'Xióng', chinese: '熊' },
      chinese: { word: 'Yǔsǎn', emoji: '☂️', pinyin: 'Yǔsǎn', chinese: '雨伞' }
    }
  },
  V: {
    letter: 'V',
    words: {
      english: { word: 'Violin', emoji: '🎻', pinyin: 'Xiǎotíqín', chinese: '小提琴' },
      french: { word: 'Vélo', emoji: '🚲', pinyin: 'Zìxíngchē', chinese: '自行车' },
      chinese: { word: 'Xiǎotíqín', emoji: '🎻', pinyin: 'Xiǎotíqín', chinese: '小提琴' }
    }
  },
  W: {
    letter: 'W',
    words: {
      english: { word: 'Whale', emoji: '🐋', pinyin: 'Jīngyú', chinese: '鲸鱼' },
      french: { word: 'Wagon', emoji: '🚃', pinyin: 'Chēxiāng', chinese: '车厢' },
      chinese: { word: 'Jīngyú', emoji: '🐋', pinyin: 'Jīngyú', chinese: '鲸鱼' }
    }
  },
  X: {
    letter: 'X',
    words: {
      english: { word: 'Xylophone', emoji: '🎹', pinyin: 'Mùqín', chinese: '木琴' },
      french: { word: 'Xylophone', emoji: '🎹', pinyin: 'Mùqín', chinese: '木琴' },
      chinese: { word: 'Mùqín', emoji: '🎹', pinyin: 'Mùqín', chinese: '木琴' }
    }
  },
  Y: {
    letter: 'Y',
    words: {
      english: { word: 'Yacht', emoji: '⛵', pinyin: 'Fānchuán', chinese: '帆船' },
      french: { word: 'Yaourt', emoji: '🥛', pinyin: 'Suānnǎi', chinese: '酸奶' },
      chinese: { word: 'Fānchuán', emoji: '⛵', pinyin: 'Fānchuán', chinese: '帆船' }
    }
  },
  Z: {
    letter: 'Z',
    words: {
      english: { word: 'Zebra', emoji: '🦓', pinyin: 'Bānmǎ', chinese: '斑马' },
      french: { word: 'Zèbre', emoji: '🦓', pinyin: 'Bānmǎ', chinese: '斑马' },
      chinese: { word: 'Bānmǎ', emoji: '🦓', pinyin: 'Bānmǎ', chinese: '斑马' }
    }
  }
};
