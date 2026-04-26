'use client'

import { useEffect, useState } from 'react'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: string
  aiResponse: string | null
  aiGeneratedAt: string | null
  agreeWithUser: number
  agreeWithAI: number
  replies?: Comment[]
}

interface CommentSectionProps {
  postSlug: string
  locale?: string
}

export default function CommentSection({ postSlug, locale = 'ko' }: CommentSectionProps) {
  const isEnglish = locale === 'en'
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      
      const data = await response.json()
      setComments(data)
    } catch (err) {
      setError(isEnglish ? 'Failed to load comments.' : '댓글을 불러오는데 실패했습니다.')
      console.error('Failed to fetch comments:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEnglish ? `Comments (${comments.length})` : `댓글 (${comments.length})`}
      </h2>
      
      {/* 댓글 작성 폼 */}
      <div className="mb-8">
        <CommentForm postSlug={postSlug} onSuccess={fetchComments} locale={locale} />
      </div>
      
      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postSlug={postSlug} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          {isEnglish ? "No comments yet. Be the first to leave a comment!" : "아직 댓글이 없습니다. 첫 번째 댓글을 남겨주세요!"}
        </p>
      )}
    </section>
  )
}