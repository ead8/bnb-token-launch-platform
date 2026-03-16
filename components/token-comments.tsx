'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Reply, Share2 } from 'lucide-react'
import { useState } from 'react'

interface CommentProps {
  id: number
  author: string
  avatar: string
  content: string
  likes: number
  timestamp: string
  liked: boolean
}

interface TokenCommentsProps {
  comments: CommentProps[]
  isConnected: boolean
}

export function TokenComments({ comments, isConnected }: TokenCommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())

  const toggleLike = (commentId: number) => {
    const newLiked = new Set(likedComments)
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId)
    } else {
      newLiked.add(commentId)
    }
    setLikedComments(newLiked)
  }

  return (
    <Card className="border border-border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Community Discussion</h3>

      {/* Comment Input */}
      {isConnected ? (
        <div className="space-y-2">
          <textarea
            placeholder="Share your thoughts on this token..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full rounded-lg border border-border bg-input p-3 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">Post Comment</Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border/50 bg-card/50 p-4 text-center text-muted-foreground">
          Connect your wallet to comment
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 pt-4 border-t border-border">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                {comment.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="mt-1 text-foreground">{comment.content}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-11 text-sm text-muted-foreground">
              <button
                onClick={() => toggleLike(comment.id)}
                className="flex items-center gap-1 hover:text-accent transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${likedComments.has(comment.id) ? 'fill-red-500 text-red-500' : ''}`}
                />
                {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1 hover:text-accent transition-colors">
                <Reply className="h-4 w-4" />
                Reply
              </button>
              <button className="flex items-center gap-1 hover:text-accent transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No comments yet. Be the first to start the discussion!
        </div>
      )}
    </Card>
  )
}
