import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { Event } from './Event';
import { HallRental } from './HallRental';

@Entity('halls')
export class Hall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 80,
  })
  name: string;

  @Column({
    type: 'int',
  })
  capacity: number;

  @Column({
    nullable: true,
  })
  description: string;

  @OneToMany(() => Event, (event) => event.hall)
  events: Event[];

  @OneToMany(() => HallRental, (rental) => rental.hall)
  rentals: HallRental[];

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
