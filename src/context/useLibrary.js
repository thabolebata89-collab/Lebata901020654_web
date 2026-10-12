import { useContext } from 'react'
import LibraryContext from './LibraryContext.js'

export default function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary must be used inside LibraryProvider.')
  return context
}