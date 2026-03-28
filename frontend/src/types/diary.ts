export type Mood = "행복" | "보통" | "슬픔" | "화남" | "피곤";
export const MOODS: Mood[] = ["행복", "보통", "슬픔", "화남", "피곤"];

export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: Mood;
  created_at: string;
  updated_at: string;
}
