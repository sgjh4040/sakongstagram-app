import React, { useEffect } from "react";
import { Image } from "react-native"
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo-hooks";
import constants from "../constants";
import { ScrollView } from "react-native-gesture-handler";
import Loader from "../components/Loader";


const NOTI_QUERY = gql`
{
  seeNotification{
    id
    message
    from{
      avatar
      username
    }
    post{
      id
    }
  }
}
`;
const DELETE_NOTIFICATION = gql`
  mutation deleteNotification($id:String!){
    deleteNotification(id:$id){
      id
    }
  }
`;

const Container = styled.View`
  
`;
const Touchable = styled.TouchableOpacity`
    flex-direction: row;
    height: ${constants.width / 7};
    border-bottom-color:#E6E6E6;
    border-bottom-width: 1px;
    align-items: center;

`;
const Message = styled.Text`
    margin-left:10px;
    font-size: 15px;
    flex: 8;
    margin-left:10px;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const { loading, data, refetch } = useQuery(NOTI_QUERY);
  console.log(data);
  const [deleteNotification,{data:delNotification}] = useMutation(DELETE_NOTIFICATION);


  handleNotification = async (notification) => {
    try {
      navigation.navigate("Detail", { id: notification.post.id })
      await deleteNotification({variables:{id:notification.id}});
      

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const refresh = navigation.addListener("didFocus",()=>{
      console.log("didFocus");
      refetch()
    })
    console.log('useEffect')
    return ()=>{
      refresh.remove();
    }
    
  }, [])



  return (
    <ScrollView>
      <Container>
        {loading ? <Loader /> : data && data.seeNotification && data.seeNotification.map(notification => (
          <Touchable onPress={() => handleNotification(notification)} key={notification.id}>
            <Image
              source={{ uri: notification.from.avatar }}
              style={{ height: 40, width: 40, borderRadius: 20,}}
            />
            <Message>{notification.message}</Message>
          </Touchable>
        ))}
      </Container>
    </ScrollView>
  )

};