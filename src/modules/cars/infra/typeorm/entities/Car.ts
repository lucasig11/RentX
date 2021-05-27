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
    specification: Specification[];

    @CreateDateColumn()
    created_at: Date;
}
