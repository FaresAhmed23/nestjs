import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('simple-array')
  countriesSupported: string[];

  @Column('simple-array')
  servicesOffered: string[];

  @Column('decimal', { precision: 3, scale: 2 })
  rating: number;

  @Column()
  responseSlaHours: number;

  @OneToMany(() => Match, match => match.vendor)
  matches: Match[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
