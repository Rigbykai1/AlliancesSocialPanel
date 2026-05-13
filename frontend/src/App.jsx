// App.jsx
import './App.css'
import NavBar from './components/UI/NavBar'
import MainContent from './components/UI/MainContent'
import DrawerSidebar from './components/UI/DrawerSidebar'
import { usePosts, usePostActions } from './hooks/usePosts'
import { useNotifications } from './hooks/useNotifications'
import { useNavigation } from './hooks/useNavigation'

function App() {
  const { view, selectedPost, navigationOptions, navigate, setView } = useNavigation('list')

  const { notifyError } = useNotifications()

  const { posts, loading, error, cargarPosts, setError } = usePosts(notifyError)

  const { handleCreatePost, handleDeletePost, handleUpdatePost } = usePostActions(
    cargarPosts,
    (msg) => {
      setError(msg)
      notifyError(msg)
    },
    posts
  )

  const handleViewPost = (post) => {
    navigate('detail', post)
  }

  const handleCreatePostWithView = async (datos) => {
    const result = await handleCreatePost(datos)
    navigate('list')
    return result
  }

  const handleDeletePostWithView = async (id) => {
    await handleDeletePost(id)
    navigate('list')
  }

  return (
    <div className="drawer min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <NavBar onNavigate={navigate} />
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
            onNavigate={navigate}
            navigationOptions={navigationOptions}
          />
        </main>
      </div>

      <DrawerSidebar
        totalPosts={posts.length}
        onNavigate={navigate}
      />
    </div>
  )
}

export default App