import { useState } from 'react'
import './App.css'
import NavBar from './components/UI/NavBar'
import MainContent from './components/UI/MainContent'
import DrawerSidebar from './components/UI/DrawerSidebar'
import { usePosts, usePostActions } from './hooks/usePosts'
import { useNotifications } from './hooks/useNotifications'

function App() {
  const [view, setView] = useState('list')
  const [selectedPost, setSelectedPost] = useState(null)

  const { notifyError } = useNotifications()

  // 👇 usePosts recibe notifyError como callback — se llama automáticamente en cada error
  const { posts, loading, error, cargarPosts, setError } = usePosts(notifyError)

  const { handleCreatePost, handleDeletePost, handleUpdatePost } = usePostActions(
    cargarPosts,
    (msg) => {
      setError(msg)
      notifyError(msg)
    },
    posts  // 👈 esto es todo
  )

  const handleViewPost = (post) => {
    setSelectedPost(post)
    setView('detail')
  }

  const handleCreatePostWithView = async (datos) => {
    const result = await handleCreatePost(datos)
    setView('list')
    return result  // 👈 propaga { exito, id, imagen } hasta PostForm
  }

  const handleDeletePostWithView = async (id) => {
    await handleDeletePost(id)
    setView('list')
  }

  return (
    <div className="drawer min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <NavBar setView={setView} />

      <div className="drawer-content flex flex-col">
        <main className="p-4 w-full pt-20">
          <MainContent
            view={view}
            loading={loading}
            posts={posts}
            selectedPost={selectedPost}
            onViewPost={handleViewPost}
            onCreatePost={handleCreatePostWithView}
            onDeletePost={handleDeletePostWithView}
            onUpdatePost={handleUpdatePost}
            onRefresh={cargarPosts}
            setError={(msg) => {
              setError(msg)
              notifyError(msg)
            }}
            onCloseDetail={() => setView('list')}
          />
        </main>
      </div>

      <DrawerSidebar
        totalPosts={posts.length}
        onNavigate={setView}
      />
    </div>
  )
}

export default App
