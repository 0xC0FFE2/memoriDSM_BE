import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
@Index(["zps", "sequence_number"], { unique: true }) // 복합 인덱스로 고유 제약 조건 설정
export class Vocas {
    @PrimaryGeneratedColumn('uuid')
    voca_id: string;  // 단어고유 ID

    @Column()
    sequence_number: number;  // 순서 번호 (자동 증가에서 일반 컬럼으로 변경)

    @Column()
    word_name: string;  // 단어

    @Column()
    word_meaning: string;  // 의미
    
    @Column()
    zps: string; // 단어장명
}
