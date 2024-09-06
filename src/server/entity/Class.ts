// Class.ts
import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { ZPS } from "./ZPS";

@Entity('Class')
export class Class {
    @PrimaryColumn()
    class_name: string;

    @Column({ default: "월,수,금" })
    change_interval: string;

    @Column({ default: 8 })
    change_amount: number;

    @Column({ default: 0 })
    last_invt: number;

    @ManyToOne(() => ZPS, (zps) => zps.classes)
    selected_zps: ZPS;
}