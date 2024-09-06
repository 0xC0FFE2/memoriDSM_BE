// ZPS.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Vocas } from "./Vocas";
import { Class } from "./Class";

@Entity()
export class ZPS {
    @PrimaryGeneratedColumn('uuid')
    zps_id: string;

    @Column({ unique: true })
    zps_name: string;

    @OneToMany(() => Vocas, (vocas) => vocas.zps)
    vocas: Vocas[];

    @OneToMany(() => Class, (classEntity) => classEntity.selected_zps)
    classes: Class[];
}