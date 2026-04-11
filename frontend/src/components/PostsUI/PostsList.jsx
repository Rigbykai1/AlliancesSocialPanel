import { useState } from 'react'
import PostCard from './PostCard'
import PostModal from './PostModal/PostModal'
import { PiArrowsClockwise } from "react-icons/pi";
import { usePostActions } from '../../hooks/usePosts'

export default function PostsList({ posts, onRefresh, setError }) {
  const [selectedPost, setSelectedPost] = useState(null)

  const { handleDeletePost, handleUpdatePost } = usePostActions(onRefresh, setError)

  const openPostModal = (post) => {
    setSelectedPost(post)
  }

  const closePostModal = () => {
    const dialog = document.getElementById('my_modal_2')
    if (dialog) dialog.close()
    setSelectedPost(null)
  }

  const handleUpdate = async (id, formData) => {
    await handleUpdatePost(id, formData)
    closePostModal()
  }

  return (
    <div>
      <PostModal
        post={selectedPost}
        onClose={closePostModal}
        onDelete={handleDeletePost}
        onUpdate={handleUpdate}
      />

      <div className="flex flex-row bg-base-200 px-4 py-8 my-3 justify-between items-center rounded-box shadow-lg">
        <button
          onClick={onRefresh}
          title="Actualizar"
          className="btn btn-outline w-fit"
        >
          <PiArrowsClockwise className='size-5' />
          Refrescar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onClick={openPostModal} />
        ))}
      </div>
    </div>
  )
}
