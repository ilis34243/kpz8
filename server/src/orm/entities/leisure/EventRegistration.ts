import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';

import { Client } from './Client';
import { Event } from './Event';

@Entity('event_registrations')
@Unique('UQ_event_registrations_event_client', ['event', 'client'])
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.registrations, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Client, (client) => client.registrations, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({
    type: 'int',
    default: 1,
  })
  seats: number;

  @Column()
  @CreateDateColumn()
  created_at: Date;
}
