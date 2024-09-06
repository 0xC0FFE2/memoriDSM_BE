export class CreateVocasDto {
    sequence_number: number;
    word_name: string;
    word_meaning: string;
    zps_id: string;
}

export class UpdateVocasDto {
    sequence_number?: number;
    word_name?: string;
    word_meaning?: string;
    zps_id?: string;
}
