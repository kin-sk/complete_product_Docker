import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Todo {
  id: number
  title: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

  // ToDo一覧取得
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_URL}/todos`)
      setTodos(response.data)
    } catch (err) {
      setError('ToDoの取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ToDo追加
  const addTodo = async () => {
    if (!newTodo.trim()) return

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        title: newTodo,
        completed: false
      })
      setTodos([...todos, response.data])
      setNewTodo('')
    } catch (err) {
      setError('ToDoの追加に失敗しました')
      console.error(err)
    }
  }

  // ToDo完了/未完了切り替え
  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        ...todo,
        completed: !todo.completed
      })
      setTodos(todos.map(t => t.id === id ? response.data : t))
    } catch (err) {
      setError('ToDoの更新に失敗しました')
      console.error(err)
    }
  }

  // ToDo削除
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`)
      setTodos(todos.filter(t => t.id !== id))
    } catch (err) {
      setError('ToDoの削除に失敗しました')
      console.error(err)
    }
  }

  return (
    <div className="app">
      <h1>📝 ToDo App</h1>
      
      {error && <div className="error">{error}</div>}
      
      <div className="input-section">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="新しいToDoを入力..."
        />
        <button onClick={addTodo}>追加</button>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.title}</span>
              <button onClick={() => deleteTodo(todo.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}

      {todos.length === 0 && !loading && (
        <p className="empty">ToDoがありません</p>
      )}
    </div>
  )
}

export default App
