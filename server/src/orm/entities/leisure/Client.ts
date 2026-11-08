import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { EventRegistration } from './EventRegistration';
import { Feedback } from './Feedback';
import { HallRental } from './HallRental';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 80,
  })
  full_name: string;

  @Column({
    unique: true,
    length: 100,
  })
  email: string;

  @Column({
    length: 20,
  })
  phone: string;

  @OneToMany(() => HallRental, (rental) => rental.client)
  rentals: HallRental[];

  @OneToMany(() => EventRegistration, (registration) => registration.client)
  registrations: EventRegistration[];

  @OneToMany(() => Feedback, (feedback) => feedback.client)
  feedbacks: Feedback[];

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
