// hooks/useNavigation.js
import { useState } from 'react'

export function useNavigation(initialView = 'list') {
  const [view, setView] = useState(initialView)
  const [selectedPost, setSelectedPost] = useState(null)
  const [navigationOptions, setNavigationOptions] = useState({})

  const navigate = (newView, post = null, options = {}) => {
    setSelectedPost(post)
    setNavigationOptions(options)
    setView(newView)
  }

  return {
    view,
    selectedPost,
    navigationOptions,
    navigate,
    setView,
  }
}