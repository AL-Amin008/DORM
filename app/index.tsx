import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const index = () => {
  return (
<View>
    <Text> Click here to logged in</Text>
  <Link href={"/login"}>Login </Link>
</View>
  ) 
}

export default index

const styles = StyleSheet.create({})