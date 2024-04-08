import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, SafeAreaView } from 'react-native';
import {useState} from 'react'
import {socket, URL} from './socket'

export default function App() {
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

  const sendLike = (recepient, sender) => {
    console.log(recepient, sender)
    socket.emit('like', recepient, sender)
  }

  const renderUsers = () => {
    return connectedUsers.map((user, index) => {
      return user.name && <View key={index}>
      <Text >{user.name}</Text>
      <Text>{user.likedBy.length>0 && `Liked by: ${[...user.likedBy]}`}</Text>
      {/*<button onClick={(e,recepient, sender)=>sendLike(e, user.name, userName)}>Send like</button>*/}
      <Button title='Send like' onPress={(recepient, sender)=>sendLike(user.name, userName)}/>
      </View>
    })
  }

  return (
    <SafeAreaView style={styles.container}>
    <View >
    <Text>Number of users connected: {usersNumber}</Text>

    {!userName && <View>
    <Text>Please enter your name: </Text>
    <TextInput
    style={styles.textInput}
    onChangeText={setUserNameInput} 
    value={userNameInput}/>
    <Button title='Send' onPress={submitUserName}/>
    </View>}
    <Text>Your name is: {userName}</Text>

    <ScrollView>
    <Text>All the users connected:</Text>
    {/*render connected users function*/}
    {renderUsers()}
    </ScrollView>
    </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    marginBottom: 20
  }
});
