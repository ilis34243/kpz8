import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { EventRegistration } from './EventRegistration';
import { Feedback } from './Feedback';
import { Hall } from './Hall';
import { EventType } from './types';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 120,
  })
  name: string;

  @Column({
    default: 'LESSON' as EventType,
    length: 40,
  })
  type: string;

  @Column({
    type: 'timestamp',
  })
  start_datetime: Date;

  @Column({
    type: 'timestamp',
  })
  end_datetime: Date;

  @ManyToOne(() => Hall, (hall) => hall.events, { nullable: false })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @OneToMany(() => EventRegistration, (registration) => registration.event)
  registrations: EventRegistration[];

  @OneToMany(() => Feedback, (feedback) => feedback.event)
  feedbacks: Feedback[];

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
