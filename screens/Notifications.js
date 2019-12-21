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
  padding: 15px;
`;
const Touchable = styled.TouchableOpacity`
    flex-direction: row;
    height: ${constants.width / 8};
    border-bottom-color:#E6E6E6;
  border-bottom-width: 1px;

`;
const Message = styled.Text`
    font-size: 15px;
    flex: 8;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  console.log("start");
  const { loading, data, refetch } = useQuery(NOTI_QUERY);
  const [deleteNotification,{data:delNotification}] = useMutation(DELETE_NOTIFICATION);


  handleNotification = async (notification) => {
    console.log("click")
    try {
      navigation.navigate("Detail", { id: notification.post.id })
      await deleteNotification({variables:{id:notification.id}});
      

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    console.log("notification useEffect")
    refetch();
  }, [])



  return (
    <ScrollView>
      <Container>
        {loading ? <Loader /> : data && data.seeNotification && data.seeNotification.map(notification => (
          <Touchable onPress={() => handleNotification(notification)} key={notification.id}>
            <Image
              source={{ uri: notification.from.avatar }}
              style={{ height: 50, width: 50, borderRadius: 20, flex: 1 }}
            />
            <Message>{notification.message}</Message>
          </Touchable>
        ))}
      </Container>
    </ScrollView>
  )

};