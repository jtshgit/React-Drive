import React,{useState} from 'react'
import axios from 'axios'


export default function Addnum() {
  const onchangeNum2=(e)=>{
    setNum2(e.target.value)
  }
  const onchangeNum1=(e)=>{
    setNum1(e.target.value)
  }
  const haddleAdditon=async(e)=>{
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/add', { num1: parseFloat(num1), num2: parseFloat(num2) });
      if (response.data.success) {
        setMsg(response.data.sum)
      } else {
        setMsg("response.data.sum")
      }
    } catch (error) {
      console.log(error)
    }
  
  }
  const [msg,setMsg] = useState('addition')
  const [num1,setNum1] = useState('')
  const [num2,setNum2] = useState('')
  return (
    <div className="container mt-5">
        <h3>Add two number</h3>
        <p className='msg'>{msg}</p>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Enter First Number
        </label>
        <input
          type="email"
          onChange={onchangeNum1}
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Number"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Enter Second Number
        </label>
        <input
          type="email"
          onChange={onchangeNum2}
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Number"
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={haddleAdditon}>Primary</button>
    </div>
  )
}
