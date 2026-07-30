import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const dataFile = path.join(process.cwd(), 'src/app/data/content.json');

async function readData() {
  const file = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(file);
}

export async function GET() {
  try {
    const content = await readData();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({
      title: 'Happy Girlfriend\'s Day',
      subtitle: 'I Love You Mika ♾️❤️',
      timeline: [],
      firstPhoto: '/first-photo.jpeg',
      gallery: ['/memory1.jpg', '/memory2.jpg', '/memory3.jpg', '/memory4.jpg', '/memory5.jpg'],
      loveLetter: 'Meowww, Akshita. Ayush here from Vapi. ❤️\n\nI know I wasn't from Kota, but you still chose to keep talking to me for almost 1.5 months. Then we met for the first time, and honestly, it felt unreal. Those six days in Kota became one of the most beautiful memories of my life.\n\nAfter that, you stole my heart, and now it'll always belong to you. Even when there was no guarantee we'd meet again, you still stayed with me and kept talking to me for another 1.5 months. When we met the second time, I realized I was completely and madly in love with you.\n\nEven now, we don't know when we'll meet again, but you still choose me every single day. That means more to me than you know. Just a few more months, and we'll finally be together.\n\nJab puchre kaun hai best\nIt's Mikaa I guess♾️❤️',
      musicEnabled: true,
      background: 'rose',
    });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  await fs.writeFile(dataFile, JSON.stringify(body, null, 2));
  return NextResponse.json({ success: true });
}
