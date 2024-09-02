//class entity
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('Class')
export class Class {
    @PrimaryColumn()
    class_name: string;

    @Column({ default: "월,수,금" })
    change_interval: string;

    @Column({ default: 8 })
    change_amount: string;

    @Column({ default: 0 })
    last_invt:number;
}