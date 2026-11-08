import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Client } from './Client';
import { Hall } from './Hall';
import { RentalStatus } from './types';

const numeric = {
  to: (value: number): number => value,
  from: (value: string): number => (value === null ? null : parseFloat(value)),
};

@Entity('hall_rentals')
export class HallRental {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hall, (hall) => hall.rentals, { nullable: false })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @ManyToOne(() => Client, (client) => client.rentals, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({
    type: 'timestamp',
  })
  start_datetime: Date;

  @Column({
    type: 'timestamp',
  })
  end_datetime: Date;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numeric,
  })
  total_cost: number;

  @Column({
    default: 'RESERVED' as RentalStatus,
    length: 20,
  })
  status: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
