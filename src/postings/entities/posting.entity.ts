import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChurchProfile } from '../../church-profiles/entities/church-profile.entity';

export enum PostingStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('postings')
export class Posting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChurchProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'church_profile_id' })
  churchProfile: ChurchProfile;

  @Column({ name: 'church_profile_id' })
  churchProfileId: string;

  @Column({ name: 'service_date' })
  serviceDate: Date;

  @Column('simple-array', { name: 'needed_instruments' })
  neededInstruments: string[];

  @Column()
  location: string;

  @Column({ type: 'text', name: 'guide_note', nullable: true })
  guideNote: string;

  @Column({
    type: 'enum',
    enum: PostingStatus,
    default: PostingStatus.OPEN,
  })
  status: PostingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
