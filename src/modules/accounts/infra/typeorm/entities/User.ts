import { Exclude } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    email: string;

    @Column()
    avatar?: string;

    @Column()
    driver_license: string;

    @Column()
    is_admin?: boolean;

    @CreateDateColumn()
    created_at: Date;
}
