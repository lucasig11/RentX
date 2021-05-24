import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specifications')
export default class Specification {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    created_at: Date;
}
