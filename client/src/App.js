import {useState} from 'react'
import {socket, URL} from './socket'

function App() {
  const [usersNumber, setUsersNumber] = useState(0)
  const [userNameInput, setUserNameInput] = useState('')
  const [userName, setUserName] = useState('')
  const [connectedUsers, setConnectedUsers] = useState([])



  socket.on('liveUsers', (data) => {
    setUsersNumber(data.usersNumber)
  })
  socket.on('connectedUsers', (data) => {
    setConnectedUsers(data)
  })

  const submitUserName = (e) => {
    e.preventDefault()
    setUserName(userNameInput)
    socket.emit('newUser', userNameInput)
    setUserNameInput('')
  }

  const sendLike = (e, recepient, sender) => {
    socket.emit('like', recepient, sender)
  }

  const renderUsers = () => {
    return connectedUsers.map((user, index) => {
      return user.name && <div key={index}>
      <p>{user.name}</p>
      <p>{user.likedBy.length>0 && `Liked by: ${[...user.likedBy]}`}</p>
      <button onClick={(e,recepient, sender)=>sendLike(e, user.name, userName)}>Send like</button>
      </div>
    })
  }

  return (
    <div >
    <p>Number of users connected: {usersNumber}</p>

    {!userName && <form onSubmit={submitUserName}>
    <label>Please enter your name: </label>
    <input onChange={(e)=>{setUserNameInput(e.target.value)}} value={userNameInput}></input>
    <button>Ok</button>
    </form>}
    <p>Your name is: {userName}</p>

    <section>
    <h1>All the users connected:</h1>
    {/*render connected users function*/}
    {renderUsers()}
    </section>

    </div>
    );
}

export default App;
