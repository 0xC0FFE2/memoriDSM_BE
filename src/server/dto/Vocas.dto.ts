export class CreateVocasDto {
    word_name: string;
    word_meaning: string;
    zps_id: string;
}

export class UpdateVocasDto {
    word_name?: string;
    word_meaning?: string;
    zps_id?: string;
}
