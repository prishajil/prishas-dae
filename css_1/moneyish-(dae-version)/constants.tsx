
import { TopicId, Lesson, Topic } from './types';

export const TOPICS: Record<string, Topic> = {
  EARNING: { id: TopicId.EARNING, title: 'Earning / Investing', color: 'bg-teal-600' },
  CREDIT: { id: TopicId.CREDIT, title: 'Credit and Debt', color: 'bg-emerald-600' },
  SAVING: { id: TopicId.SAVING, title: 'Saving / Spending', color: 'bg-green-600' },
  BUDGETING: { id: TopicId.BUDGETING, title: 'Budgeting', color: 'bg-cyan-700' }
};

export const LESSONS_DATA: Lesson[] = [
  { 
    id: '1.1', 
    topic: TopicId.EARNING, 
    title: 'Different types of income (allowance, part-time jobs, gig work, gifts)', 
    videoUrl: 'https://player.vimeo.com/video/1154478539?api=1&badge=0&autopause=0&player_id=0&app_id=58479&quality=1440p&quality_selector=0' 
  },
  { 
    id: '1.2', 
    topic: TopicId.EARNING, 
    title: 'How to find your first job as a teen', 
    videoUrl: 'https://geo.dailymotion.com/player.html?video=x9y16kc&quality=1440&api=postMessage' 
  },
  { 
    id: '1.3', 
    topic: TopicId.EARNING, 
    title: 'Understanding your paycheck and taxes', 
    videoUrl: 'https://geo.dailymotion.com/player.html?video=x9y1xqc&quality=1440&api=postMessage' 
  },
  { 
    id: '1.4', 
    topic: TopicId.EARNING, 
    title: 'What is investing and why start young?', 
    videoUrl: 'https://geo.dailymotion.com/player.html?video=x9y3eei&quality=1440&api=postMessage' 
  },
  { 
    id: '2.1', 
    topic: TopicId.CREDIT, 
    title: 'Credit and credit scores explained, and why they matter', 
    videoUrl: 'https://geo.dailymotion.com/player.html?video=x9y3nl8&quality=1440&api=postMessage' 
  },
  { 
    id: '2.2', 
    topic: TopicId.CREDIT, 
    title: 'How credit cards work', 
    videoUrl: 'https://geo.dailymotion.com/player.html?video=x9y6nz2&quality=1440&api=postMessage' 
  },
  { 
    id: '3.1', 
    topic: TopicId.SAVING, 
    title: 'Needs vs wants: how to tell the difference and why it is important', 
    videoUrl: 'https://www.youtube.com/embed/placeholder8?vq=hd1440&controls=0&enablejsapi=1&origin=' + window.location.origin 
  },
  { 
    id: '3.2', 
    topic: TopicId.SAVING, 
    title: 'Emergency fund: What is it and why do we need one?', 
    videoUrl: 'https://www.youtube.com/embed/placeholder9?vq=hd1440&controls=0&enablejsapi=1&origin=' + window.location.origin 
  },
  { 
    id: '3.3', 
    topic: TopicId.SAVING, 
    title: 'Setting SMART financial goals', 
    videoUrl: 'https://www.youtube.com/embed/placeholder10?vq=hd1440&controls=0&enablejsapi=1&origin=' + window.location.origin 
  },
  { 
    id: '3.4', 
    topic: TopicId.SAVING, 
    title: 'Impulse buying and how to avoid it', 
    videoUrl: 'https://www.youtube.com/embed/placeholder10?vq=hd1440&controls=0&enablejsapi=1&origin=' + window.location.origin 
  },
  { 
    id: '4.1', 
    topic: TopicId.BUDGETING, 
    title: 'What is a budget and why create one?', 
    videoUrl: 'https://www.youtube.com/embed/placeholder11?vq=hd1440&controls=0&enablejsapi=1&origin=' + window.location.origin 
  },
  { 
    id: '4.2', 
    topic: TopicId.BUDGETING, 
    title: '50/30/20 rule for money', 
    videoUrl: 'https://www.youtube.com/embed/placeholder12?vq=hd1440&controls=0&enablejsapi=1&origin=' + window.location.origin 
  },
  { 
    id: '4.3', 
    topic: TopicId.BUDGETING, 
    title: 'Fixed vs variable expenses', 
    videoUrl: 'https://www.youtube.com/embed/placeholder12?vq=hd1440&controls=0&enablejsapi=1&origin=' + window.location.origin 
  },
];

export const CONTACT_EMAIL = "starprisha89@gmail.com";
