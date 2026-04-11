import PostsList from '../PostsUI/PostsList'
import PostForm from '../PostsUI/PostForm'

export default function MainContent({
  view,
  loading,
  posts,
  onViewPost,
  onCreatePost,
  onDeletePost,
  onRefresh,
  setError,   // 👈 nuevo
}) {
  if (loading && view === 'list') {
    return <div className="text-center">Cargando posts...</div>
  }

  if (view === 'list') {
    return (
      <PostsList
        posts={posts}
        onView={onViewPost}
        onDelete={onDeletePost}
        onRefresh={onRefresh}
        setError={setError}   // 👈 pasa setError
      />
    )
  }

  if (view === 'create') {
    return <PostForm onSubmit={onCreatePost} />
  }

  return null
}
