export type DiaryEntry = {
  id: string;
  text_data: string;
  created_at: string;
  user_id: string;
  mood?: 'positive' | 'neutral' | 'negative';
};
