'use client'
import LRUCacheVisualizer from '@/components/LRUCache'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LRUCacheVisualizer />
    </main>
  )
}