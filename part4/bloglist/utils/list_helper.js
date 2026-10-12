const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
}

const mostBlogs = (blogs) => {
  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})
  const author = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  return { author, blogs: counts[author] }
}

const mostLikes = (blogs) => {
  const likesPerAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})
  const author = Object.keys(likesPerAuthor).reduce((a, b) => likesPerAuthor[a] > likesPerAuthor[b] ? a : b)
  return { author, likes: likesPerAuthor[author] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostLikes, mostBlogs }
