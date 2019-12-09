import React, {useState} from "react";
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

const Text = styled.Text`
    font-size: 16px;
`;

const MessagePresenter = ({term, shouldFetch}) => {
    const [initpage, setInitpage] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const {data, loading, refetch} = useQuery(SEARCH, {
        variables: {
            term
        },
        skip: !shouldFetch,
        fetchPolicy: "network-only"
    });
    console.log(data);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await refetch({variables: {term}});
        } catch (e) {
        } finally {
            setRefreshing(false);
        }
    };
    const {data: roomdata, loading: roomloading} = useQuery(ROOMS_QUERY, {});
    return (
        <ScrollView
            refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refreshing}/>
            }
        >
            <UserBox>
                {loading ? (
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

                {(data && data.searchUser && data.searchUser.map(user => <UserListBox key={user.id} {...user}/>))}
            </View>
        </ScrollView>
    )
}
MessagePresenter.propTypes = {
    term: PropTypes.string.isRequired,
    shouldFetch: PropTypes.bool.isRequired
}

export default MessagePresenter;
