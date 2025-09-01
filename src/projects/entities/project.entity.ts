import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Match } from '../../matches/entities/match.entity';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @ManyToOne(() => Client, (client) => client.projects)
  client: Client;

  @Column()
  country: string;

  @Column('simple-array')
  servicesNeeded: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @OneToMany(() => Match, (match) => match.project)
  matches: Match[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
