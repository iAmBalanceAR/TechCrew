import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
}

export function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < fullStars ? (
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          ) : i === fullStars && hasHalfStar ? (
            <StarHalf className="h-4 w-4 text-yellow-400 fill-current" />
          ) : (
            <Star className="h-4 w-4 text-gray-300" />
          )}
        </span>
      ))}
    </div>
  )
}

