import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const EmotionRadar = ({ emotions = { fear: 25, anger: 25, joy: 25, sadness: 25 } }) => {
  // Format data for Recharts Radar
  const data = [
    { subject: 'Fear 😨', score: emotions.fear || 10, fullMark: 100 },
    { subject: 'Anger 😡', score: emotions.anger || 10, fullMark: 100 },
    { subject: 'Joy 😊', score: emotions.joy || 10, fullMark: 100 },
    { subject: 'Sadness 😢', score: emotions.sadness || 10, fullMark: 100 },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col h-full relative overflow-hidden">
      <h3 className="text-sm font-bold text-slate-300 mb-4 tracking-wide uppercase">AI Emotion Spectrum</h3>
      <div className="flex-1 w-full h-[220px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '600' }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#475569', fontSize: 9 }}
              axisLine={false} 
            />
            <Radar
              name="Emotion Intensity"
              dataKey="score"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-[10px] text-slate-500 font-medium leading-relaxed">
        High levels of Anger or Fear indicators usually align with media manipulation and clickbait techniques.
      </div>
    </div>
  );
};

export default EmotionRadar;
