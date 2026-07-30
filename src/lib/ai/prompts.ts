export const CLIP_DETECTION_PROMPT = (transcript: string, duration: number) => `
You are an expert short-form video editor. Analyze this video transcript and identify the HIGHEST VALUE segments for creating short-form clips (TikTok, Shorts, Reels).

VIDEO DURATION: ${duration}s

TRANSCRIPT:
${transcript}

Return a JSON object with this EXACT structure:
{
  "summary": "one sentence summary of the overall video in English",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "clips": [
    {
      "startTime": 0.0,
      "endTime": 0.0,
      "score": 85,
      "reason": "why this clip is engaging",
      "title": "catchy title for this clip",
      "hookSuggestion": "hook text to grab attention in first 2 seconds"
    }
  ]
}

GUIDELINES:
- Find 3-5 clips, each 30-90 seconds long
- Prioritize: strong hooks, emotional moments, valuable insights, key takeaways, controversial statements, humor
- Score 1-100 based on standalone value (works without watching the whole video)
- Do NOT pick the intro/outro unless it has a strong standalone hook
- Prefer complete thoughts, not mid-sentence cuts
- Return ONLY valid JSON
`;
