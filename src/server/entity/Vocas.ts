// Vocas.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ZPS } from "./ZPS";

@Entity()
export class Vocas {
    @PrimaryGeneratedColumn('uuid')
    voca_id: string;

    @Column()
    sequence_number: number;

    @Column()
    word_name: string;

    @Column()
    word_meaning: string;

    @ManyToOne(() => ZPS, (zps) => zps.vocas)
    zps: ZPS;
}