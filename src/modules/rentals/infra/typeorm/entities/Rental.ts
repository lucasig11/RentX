import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from '@modules/accounts/infra/typeorm/entities/User';
import Car from '@modules/cars/infra/typeorm/entities/Car';

@Entity('rentals')
export default class Rental {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Car)
    @JoinColumn({ name: 'car_id' })
    car: Car;

    @Column()
    car_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @Column()
    start_date: Date;

    @Column()
    expected_return_date: Date;

    @Column()
    return_date: Date;

    @Column()
    total: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
