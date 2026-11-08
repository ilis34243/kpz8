import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { Client } from '../entities/leisure/Client';
import { Event } from '../entities/leisure/Event';
import { EventRegistration } from '../entities/leisure/EventRegistration';
import { Feedback } from '../entities/leisure/Feedback';
import { Hall } from '../entities/leisure/Hall';
import { HallRental } from '../entities/leisure/HallRental';

export class SeedLeisure1791734236000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const hallRepository = getRepository(Hall);
    const clientRepository = getRepository(Client);
    const eventRepository = getRepository(Event);
    const rentalRepository = getRepository(HallRental);
    const registrationRepository = getRepository(EventRegistration);
    const feedbackRepository = getRepository(Feedback);

    const craftHall = await hallRepository.save(
      hallRepository.create({ name: 'Craft Studio', capacity: 15, description: 'Room for master classes and lessons' }),
    );
    const concertHall = await hallRepository.save(
      hallRepository.create({
        name: 'Concert Hall',
        capacity: 120,
        description: 'Main hall with stage and sound system',
      }),
    );
    const libraryHall = await hallRepository.save(
      hallRepository.create({
        name: 'Library Room',
        capacity: 25,
        description: 'Quiet room for exhibitions and clubs',
      }),
    );

    const anna = await clientRepository.save(
      clientRepository.create({
        full_name: 'Anna Kovalchuk',
        email: 'anna.kovalchuk@test.com',
        phone: '+380671112233',
      }),
    );
    const boris = await clientRepository.save(
      clientRepository.create({
        full_name: 'Boris Ivanchenko',
        email: 'boris.ivanchenko@test.com',
        phone: '+380672223344',
      }),
    );
    const viktoriia = await clientRepository.save(
      clientRepository.create({
        full_name: 'Viktoriia Melnyk',
        email: 'viktoriia.melnyk@test.com',
        phone: '+380673334455',
      }),
    );

    const masterClass = await eventRepository.save(
      eventRepository.create({
        name: 'Pottery master class',
        type: 'MASTER_CLASS',
        start_datetime: new Date('2026-11-10T10:00:00.000Z'),
        end_datetime: new Date('2026-11-10T12:00:00.000Z'),
        hall: craftHall,
      }),
    );
    const concert = await eventRepository.save(
      eventRepository.create({
        name: 'Autumn acoustic concert',
        type: 'CONCERT',
        start_datetime: new Date('2026-11-14T17:00:00.000Z'),
        end_datetime: new Date('2026-11-14T20:00:00.000Z'),
        hall: concertHall,
      }),
    );
    const chessTournament = await eventRepository.save(
      eventRepository.create({
        name: 'Chess tournament',
        type: 'TOURNAMENT',
        start_datetime: new Date('2026-11-21T09:00:00.000Z'),
        end_datetime: new Date('2026-11-21T16:00:00.000Z'),
        hall: libraryHall,
      }),
    );

    await rentalRepository.save(
      rentalRepository.create({
        hall: concertHall,
        client: boris,
        start_datetime: new Date('2026-12-05T16:00:00.000Z'),
        end_datetime: new Date('2026-12-05T19:00:00.000Z'),
        total_cost: 1800,
        status: 'CONFIRMED',
      }),
    );
    await rentalRepository.save(
      rentalRepository.create({
        hall: craftHall,
        client: viktoriia,
        start_datetime: new Date('2026-12-12T10:00:00.000Z'),
        end_datetime: new Date('2026-12-12T12:00:00.000Z'),
        total_cost: 650,
        status: 'RESERVED',
      }),
    );

    await registrationRepository.save([
      registrationRepository.create({ event: masterClass, client: anna, seats: 2 }),
      registrationRepository.create({ event: masterClass, client: viktoriia, seats: 1 }),
      registrationRepository.create({ event: concert, client: boris, seats: 4 }),
      registrationRepository.create({ event: chessTournament, client: anna, seats: 1 }),
    ]);

    await feedbackRepository.save([
      feedbackRepository.create({
        client: anna,
        event: masterClass,
        rating: 5,
        comment: 'Great teacher, lots of practice.',
      }),
      feedbackRepository.create({
        client: viktoriia,
        event: masterClass,
        rating: 4,
        comment: 'Interesting, but a bit short.',
      }),
      feedbackRepository.create({ client: boris, event: concert, rating: 5, comment: 'Sound was excellent.' }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM feedback`);
    await queryRunner.query(`DELETE FROM event_registrations`);
    await queryRunner.query(`DELETE FROM hall_rentals`);
    await queryRunner.query(`DELETE FROM events`);
    await queryRunner.query(`DELETE FROM clients`);
    await queryRunner.query(`DELETE FROM halls`);
  }
}
