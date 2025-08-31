import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity('matches')
@Index(['projectId', 'vendorId'], { unique: true })
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, project => project.matches)
  project: Project;

  @Column()
  vendorId: string;

  @ManyToOne(() => Vendor, vendor => vendor.matches)
  vendor: Vendor;

  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
