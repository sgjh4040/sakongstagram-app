import React, {useState, useEffect} from "react";
import {ScrollView, RefreshControl} from "react-native";
import styled from "styled-components";
import Loader from "../../components/Loader";
import {gql} from "apollo-boost";
import {useQuery} from "react-apollo-hooks";
import Post from "../../components/Post";
import {POST_FRAGMENT} from "../../fragment";

export const FEED_QUERY = gql`
  {
    seeFeed {
       ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;


const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({navigation}) => {
    const [refreshing, setRefreshing] = useState(false);
    const {loading, data, refetch} = useQuery(FEED_QUERY);
    const refresh = async () => {
        try {
            setRefreshing(true);
            await refetch();
        } catch (e) {
            console.log(e);
        } finally {
            setRefreshing(false);
        }
    };
    useEffect(() => {
        const refresh = navigation.addListener("didFocus",()=>{
          console.log("didFocus");
          refetch();
        });
        refetch();
        console.log('useEffect')
        return ()=>{
          refresh.remove();
        }
        
      }, [])
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} abc={refresh}/>
            }
        >
            {loading ? (
                <Loader/>
            ) : (
                data &&
                data.seeFeed &&
                data.seeFeed.map(post => <Post key={post.id} {...post} refetch={refetch} />)
            )}
        </ScrollView>
    );
};
