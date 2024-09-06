import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column()
    oAuthkey: string;

    @Column()
    userName: string;

    @Column()
    userProfileUrl: string;
}