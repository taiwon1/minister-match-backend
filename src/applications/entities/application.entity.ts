import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posting } from '../../postings/entities/posting.entity';
import { MinisterProfile } from '../../minister-profiles/entities/minister-profile.entity';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Posting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'posting_id' })
  posting: Posting;

  @Column({ name: 'posting_id' })
  postingId: string;

  @ManyToOne(() => MinisterProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'minister_profile_id' })
  ministerProfile: MinisterProfile;

  @Column({ name: 'minister_profile_id' })
  ministerProfileId: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
