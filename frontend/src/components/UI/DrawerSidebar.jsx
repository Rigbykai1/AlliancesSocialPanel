import { PiFiles, PiFilePlus } from 'react-icons/pi'

const DRAWER_ID = 'my-drawer-4'

const closeDrawer = () => {
  document.getElementById(DRAWER_ID).checked = false
}

export default function DrawerSidebar({ totalPosts, onNavigate }) {
  const navigate = (view) => {
    onNavigate(view)
    closeDrawer()
  }

  return (
    <div className="drawer-side">
      <label htmlFor={DRAWER_ID} className="drawer-overlay" />
      <div className="flex h-[80%] w-64 flex-col items-center 
                      bg-base-300/50 backdrop-blur p-4 
                      rounded-box shadow-lg ml-3 mt-23">
        <div className="mb-4 font-bold text-lg">Navegación</div>
        <ul className="menu w-full">
          <li>
            <button onClick={() => navigate('list')}>
              <PiFiles className="size-5" />
              <span>Lista de posts</span>
            </button>
          </li>
          <li>
            <button onClick={() => navigate('create')}>
              <PiFilePlus className="size-5" />
              <span>Crear post</span>
            </button>
          </li>
        </ul>
        <div className="mt-auto text-sm text-gray-500">
          Total posts: {totalPosts}
        </div>
      </div>
    </div>
  )
}
