import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { url } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import './editTask.scss'

export const EditTask = () => {
  const navigate = useNavigate()
  const { listId, taskId } = useParams()
  const [cookies] = useCookies()
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [isDone, setIsDone] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done')
  const [deadline,setDeadline]=useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [deadlineTime, setDeadlineTime] =useState('')
  const [newDeadlineDate, setNewDeadlineDate] = useState('')
  const [newDeadlineTime, setNewDeadlineTime] = useState('')
  const handleDateChange = (e) =>{
    setNewDeadlineDate(e.target.value)
    setDeadlineDate(e.target.value)
  } 
  const handleTimeChange = (e) =>{
    setNewDeadlineTime(e.target.value)
    setDeadlineTime(`${deadlineDate}T${e.target.value}`)
  }

  function onUpdateTask() {
    const newDeadline = new Date(`${newDeadlineDate}T${newDeadlineTime}`)
    console.log(newDeadline)
    console.log(isDone)
    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: newDeadline,
    }

    axios
      .put(`${url}lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`)
      })
  }

  const onDeleteTask = () => {
    axios
      .delete(`${url}lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${url}lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data
        console.log(res.data)
        setTitle(task.title)
        setDetail(task.detail)
        setIsDone(task.done)
        setDeadlineDate(task.limit.slice(0,9))
        setDeadlineTime(task.limit)
        
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`)
      })
  }, [])
  
  const toISODate =(e)=>{
    const date = new Date(e)
    const year = date.getFullYear()
    const month =date.getMonth()
    const day = date.getDate    ()
    const ISODate=("0"+year).slice(-4)+"-"+(`0${month+1}`).slice(-2)+"-"+("0"+day).slice(-2)
    console.log(ISODate)
    return ISODate
  }
  const toISOTime =(e)=>{
    const time = new Date(e)
    const hour = time.getHours()
    const minute =time.getMinutes()
    const second = time.getSeconds()
    const ISOTime=("0"+hour).slice(-2)+":"+(`0${minute}`).slice(-2)+":"+("0"+second).slice(-2)
    console.log(ISOTime)
    return ISOTime
  }

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <label>期限</label>
          <br />
          <input
            type="date"
            id="date"
            value={toISODate(deadlineDate)}
            onChange={handleDateChange}
          />
          <input
            type="time"
            id="time"
            step="1"
            value={toISOTime(deadlineTime)}
            onChange={handleTimeChange}
          />
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? 'checked' : ''}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? 'checked' : ''}
            />
            完了
          </div>
          <button
            type="button"
            className="delete-task-button"
            onClick={onDeleteTask}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={onUpdateTask}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  )
}
