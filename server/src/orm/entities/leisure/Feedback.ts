import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Client } from './Client';
import { Event } from './Event';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.feedbacks, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Event, (event) => event.feedbacks, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({
    type: 'int',
  })
  rating: number;

  @Column({
    nullable: true,
  })
  comment: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;
}
