import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cars_images')
export default class CarImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    car_id: string;

    @Column()
    filename: string;

    @CreateDateColumn()
    created_at: Date;
}
