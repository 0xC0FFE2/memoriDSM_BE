export interface CreateVocasDto {
    word_name: string;  // 단어 이름
    word_meaning: string;  // 단어 의미
    zps: string;  // 단어장명
}

export interface UpdateVocasDto {
    word_name?: string;  // 단어 이름 (옵션)
    word_meaning?: string;  // 단어 의미 (옵션)
    zps?: string;  // 단어장명 (옵션)
}
