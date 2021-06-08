import { Exclude, Expose } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

import awsConfig from '@config/aws';
import uploadConfig from '@config/upload';

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
    @Exclude()
    avatar?: string;

    @Column()
    driver_license: string;

    @Column()
    @Exclude()
    is_admin?: boolean;

    @CreateDateColumn()
    @Exclude()
    created_at: Date;

    @Expose({ name: 'avatar_url' })
    getAvatarUrl(): string | null {
        if (!this.avatar) {
            return null;
        }
        switch (uploadConfig.driver) {
            case 'disk':
                return `${process.env.API_URL}/files/avatar/${this.avatar}`;
            case 's3':
                return `https://${awsConfig.s3.bucket}.s3.amazonaws.com/avatar/${this.avatar}`;
            default:
                return null;
        }
    }
}
