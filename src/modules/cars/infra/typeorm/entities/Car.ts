import { Exclude, Expose } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import awsConfig from '@config/aws';
import uploadConfig from '@config/upload';

import CarImage from './CarImage';
import Category from './Category';
import Specification from './Specification';

@Entity('cars')
export default class Car {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    daily_rate: number;

    @Column({ default: true })
    available: boolean;

    @Column()
    license_plate: string;

    @Column()
    fine_amount: number;

    @Column()
    brand: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ nullable: true })
    category_id: string;

    @ManyToMany(() => Specification)
    @JoinTable({
        // relation table
        name: 'specifications_car',

        // relation table column that relates to current entity
        joinColumns: [{ name: 'car_id' }],

        // relation table column that relates to the many to many entity
        inverseJoinColumns: [{ name: 'specification_id' }],
    })
    specifications: Specification[];

    @ManyToMany(() => CarImage)
    @JoinTable({
        // relation table
        name: 'cars_images',

        // relation table column that relates to current entity
        joinColumns: [{ name: 'car_id' }],

        // relation table column that relates to the many to many entity
        inverseJoinColumns: [{ name: 'id' }],
    })
    @Exclude()
    images: CarImage[];

    @Expose({ name: 'images_urls' })
    getAvatarUrl(): string[] | null {
        if (!this.images) {
            return null;
        }
        return this.images.map((image) => {
            switch (uploadConfig.driver) {
                case 'disk':
                    return `${process.env.API_URL}/files/cars/${image.filename}`;
                case 's3':
                    return `https://${awsConfig.s3.bucket}.s3.amazonaws.com/${image.filename}`;
                default:
                    return null;
            }
        });
    }

    @CreateDateColumn()
    created_at: Date;
}
