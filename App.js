import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeFirestore, collection,  
  query, orderBy, onSnapshot,
  doc, addDoc, setDoc, updateDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { firebaseConfig } from './Secrets';

let app;
if (getApps().length == 0){
  app = initializeApp(firebaseConfig);
} 
const db = initializeFirestore(app, {
  useFetchStreams: false
});

const auth = getAuth();

export default function App() {

  const [users, setUsers] = useState([]);

  useEffect(()=>{
    const query = collection(db, 'users');
    onSnapshot(query, qSnap => {
      let userList = [];
      qSnap.forEach(docSnap => {
        let u = docSnap.data();
        u.key = docSnap.id;
        console.log('pushing user', u);
        userList.push(u);
      });
      setUsers(userList);
    })
  }, []);

  return (
    <View style={styles.container}>
      <View style={{flex: 0.5}}>
        <FlatList
          data={users}
          renderItem={({item}) => {
            return (
              <Text>
                {item.displayName}
              </Text>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 0.5, 
    backgroundColor: '#ffa',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
