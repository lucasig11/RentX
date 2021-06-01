import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity('user_tokens')
export default class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refresh_token: string;

    @Column()
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    expiration_date: Date;

    @CreateDateColumn()
    created_at: Date;
}
