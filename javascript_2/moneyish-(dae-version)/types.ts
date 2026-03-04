
export enum TopicId {
  EARNING = 'earning',
  CREDIT = 'credit',
  SAVING = 'saving',
  BUDGETING = 'budgeting'
}

export interface Lesson {
  id: string;
  topic: TopicId;
  title: string;
  videoUrl: string;
}

export interface Topic {
  id: TopicId;
  title: string;
  color: string;
}

export type Page = 'home' | 'lesson' | 'games' | 'sources';
