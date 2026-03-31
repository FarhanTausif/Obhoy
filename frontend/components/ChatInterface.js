'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageBubble, TypingIndicator } from './MessageBubble'
import { ScrollArea } from '@/components/ui/scroll-area'

// Mock function to simulate emotion detection
const detectEmotion = (text) => {
  const emotions = {
    'sad': ['sad', 'depressed', 'down', 'upset', 'দুঃখ', 'বিষণ্ণ'],
    'anxious': ['anxious', 'worried', 'nervous', 'stressed', 'চিন্তিত', 'উদ্বিগ্ন'],
    'angry': ['angry', 'furious', 'mad', 'annoyed', 'রাগ', 'ক্ষুব্ধ'],
    'happy': ['happy', 'joy', 'excited', 'good', 'great', 'খুশি', 'আনন্দ'],
    'calm': ['calm', 'peaceful', 'relaxed', 'শান্ত', 'নিরিবিলি'],
  }
  
  const lowerText = text.toLowerCase()
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return emotion
    }
  }
  return 'neutral'
}

// Mock function to generate AI responses
const generateAIResponse = (userMessage, detectedEmotion, language) => {
  const responses = {
    en: {
      sad: [
        "I hear that you're going through a difficult time. Your feelings are valid, and it's okay to feel sad sometimes. Would you like to talk more about what's making you feel this way?",
        "I'm sorry you're feeling down. Remember that it's normal to have ups and downs in life. You're not alone in this. What would help you feel a little better right now?"
      ],
      anxious: [
        "I understand you're feeling anxious. That can be really overwhelming. Let's try to take this one step at a time. Can you tell me what's causing you to feel worried?",
        "Anxiety can feel very intense, but remember that you've overcome challenges before. Take a deep breath with me. What's one small thing that might help you feel more grounded right now?"
      ],
      angry: [
        "I can sense your frustration, and it's completely understandable to feel angry sometimes. Let's work through these feelings together. What triggered this anger?",
        "Anger is a natural emotion, and it's okay to feel it. The important thing is how we handle it. Would it help to talk about what's bothering you?"
      ],
      happy: [
        "I'm so glad to hear you're feeling good! It's wonderful when we can appreciate the positive moments in life. What's bringing you joy today?",
        "Your positive energy is beautiful to see! Happiness is such a precious feeling. Would you like to share what's making you feel so good?"
      ],
      neutral: [
        "Thank you for sharing with me. I'm here to listen and support you in whatever way I can. How has your day been so far?",
        "I appreciate you taking the time to talk with me. What's on your mind today? I'm here to listen without judgment."
      ]
    },
    bn: {
      sad: [
        "আমি বুঝতে পারছি যে আপনি কঠিন সময় পার করছেন। আপনার অনুভূতিগুলো স্বাভাবিক এবং মাঝে মাঝে দুঃখ লাগা একদম ঠিক আছে। আপনি কি বলতে চান কী আপনাকে এভাবে অনুভব করাচ্ছে?",
        "আপনার মন খারাপের জন্য আমি দুঃখিত। মনে রাখবেন জীবনে উত্থান-পতন থাকাটা স্বাভাবিক। আপনি একা নন। এখন কী আপনাকে একটু ভালো বোধ করতে সাহায্য করবে?"
      ],
      anxious: [
        "আমি বুঝতে পারছি আপনি উদ্বিগ্ন বোধ করছেন। এটা সত্যিই অসহনীয় হতে পারে। আসুন একটা একটা করে এগিয়ে যাই। বলুন তো কী আপনাকে চিন্তিত করছে?",
        "দুশ্চিন্তা খুবই তীব্র লাগতে পারে, কিন্তু মনে রাখবেন আপনি আগেও অনেক সমস্যা কাটিয়ে উঠেছেন। আমার সাথে একটা গভীর শ্বাস নিন। এমন কোন ছোট্ট কিছু আছে যা আপনাকে আরো স্থিতিশীল বোধ করতে সাহায্য করবে?"
      ],
      angry: [
        "আমি আপনার হতাশা বুঝতে পারছি, আর মাঝে মাঝে রাগ হওয়া সম্পূর্ণ স্বাভাবিক। আসুন একসাথে এই অনুভূতিগুলো নিয়ে কাজ করি। কী আপনার এই রাগের কারণ?",
        "রাগ একটি প্রাকৃতিক আবেগ, আর এটা অনুভব করা ঠিক আছে। গুরুত্বপূর্ণ হলো আমরা এটা কীভাবে সামলাই। আপনাকে যা বিরক্ত করছে সে সম্পর্কে কথা বলতে চান?"
      ],
      happy: [
        "আপনার ভালো লাগার কথা শুনে আমি খুবই খুশি! জীবনের ইতিবাচক মুহূর্তগুলো উপভোগ করতে পারাটা দারুণ। আজ কী আপনাকে আনন্দ দিচ্ছে?",
        "আপনার ইতিবাচক শক্তি দেখে মন ভালো হয়ে গেল! খুশি থাকাটা কত মূল্যবান একটা অনুভূতি। আপনাকে এত ভালো বোধ করাচ্ছে কী, শেয়ার করবেন?"
      ],
      neutral: [
        "আমার সাথে কথা বলার জন্য ধন্যবাদ। আমি এখানে আছি আপনার কথা শুনতে এবং যেকোনোভাবে সাহায্য করতে। আজ আপনার দিন কেমন কাটছে?",
        "আমার সাথে সময় দেওয়ার জন্য কৃতজ্ঞ। আজ আপনার মনে কী আছে? আমি এখানে আছি বিনা বিচারে আপনার কথা শুনতে।"
      ]
    }
  }
  
  const emotionResponses = responses[language][detectedEmotion] || responses[language]['neutral']
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
}

export function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { language, t } = useLanguage()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      content: t('welcomeMessage'),
      isUser: false,
      emotion: 'happy',
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMessage])
  }, [language, t])

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content }),
      })
      const data = await res.json()
      const aiMessage = {
        id: Date.now() + 1,
        content: data.response || (language === 'bn' ? 'দুঃখিত, কিছু একটা সমস্যা হয়েছে।' : 'Sorry, something went wrong.'),
        isUser: false,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch {
      const errorMessage = {
        id: Date.now() + 1,
        content: language === 'bn'
          ? 'দুঃখিত, সার্ভারের সাথে সংযোগ করা যাচ্ছে না। আবার চেষ্টা করুন।'
          : 'Sorry, could not connect to the server. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.content}
              isUser={message.isUser}
              emotion={message.emotion}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('placeholder')}
              className={`flex-1 bg-background border-2 focus:border-primary/50 transition-colors ${
                language === 'bn' ? 'bangla-text' : ''
              }`}
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              variant="soothing"
              className="px-6 focus-ring"
            >
              <span className={language === 'bn' ? 'bangla-text' : ''}>
                {t('send')}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
