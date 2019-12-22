import React, {useState,useEffect} from "react";
import {ScrollView, RefreshControl} from "react-native";
import PropTypes from "prop-types";
import {gql} from "apollo-boost";
import {useQuery} from "react-apollo-hooks";
import Loader from "../../components/Loader";
import UserListBox from "../../components/UserListBox";
import styled from "styled-components";
import RoomBox from "../../components/RoomBox";

export const SEARCH = gql`
    query searchUser($term: String!){
        searchUser(term: $term){
            id
            username
            avatar
            
        }
    }
`;
const ROOMS_QUERY = gql`
    {
        seeRooms{
            id
            participants{
              id
              avatar
              username
            }
        }
        
    }
`;
const UserBox = styled.View`
    min-height: 100px;
    flex-direction: row;

`;

const View = styled.View`
    flex: 1;
    padding: 10px;

`;
const SearchContainer = styled.View`
    flex:1;
    align-items: center;
    justify-content: center;
`;

const Text = styled.Text`
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 700;
`;

const MessagePresenter = ({term, shouldFetch}) => {
    const [refreshing, setRefreshing] = useState(false);
    const {data, loading, refetch} = useQuery(SEARCH, {
        variables: {
            term
        },
        skip: !shouldFetch,
        fetchPolicy: "network-only"
    });
    const onRefresh = async () => {
        console.log("refetch");
        try {
            setRefreshing(true);
            await refetch({variables: {term}});
        } catch (e) {
        } finally {
            setRefreshing(false);
        }
    };
    const {data: roomdata, loading: roomloading,refetch:roomrefetch} = useQuery(ROOMS_QUERY, {});
    useEffect(()=>{
        console.log("shouldFetch",shouldFetch)
        roomrefetch();
    },[])


    return (
        <ScrollView
            refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refreshing}/>
            }
        >
            <UserBox>
                {!shouldFetch ? (
                    <SearchContainer>
                        <Text>이름을 검색해 주세요</Text>
                    </SearchContainer>
                ):loading ? (
                    <Loader/>
                ) : (
                    data &&
                    data.searchUser &&
                    data.searchUser.map(user => <UserListBox key={user.id} {...user}/>)
                )}
            </UserBox>
            <View>
                <Text>채팅방</Text>
                {roomloading ? (
                    <Loader/>
                ) : (
                    roomdata &&
                    roomdata.seeRooms &&
                    roomdata.seeRooms.map(room => <RoomBox key={room.id} {...room}/>)
                )}
            </View>
        </ScrollView>
    )
}
MessagePresenter.propTypes = {
    term: PropTypes.string.isRequired,
    shouldFetch: PropTypes.bool.isRequired
}

export default MessagePresenter;
