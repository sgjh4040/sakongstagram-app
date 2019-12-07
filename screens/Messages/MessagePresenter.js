import React, {useState} from "react";
import {} from "react-native";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../components/Loader";
import UserListBox from "../../components/UserListBox";
import styled from "styled-components";
import SquarePhoto from "../../components/SquarePhoto";
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
        }
    }
`;

const View = styled.View`
    flex: 1;

`;

const Text = styled.Text``;

const MessagePresenter = ({term,shouldFetch})=>{
    const [refreshing, setRefreshing] = useState(false);
    const {data, loading, refetch} = useQuery(SEARCH,{
        variables:{
            term
        },
        skip: !shouldFetch,
        fetchPolicy: "network-only"
    });
    const {data:roomdata} = useQuery(ROOMS_QUERY);
    return (
        <View>
            {(data && data.searchUser && data.searchUser.map(user=> <UserListBox key={user.id} {...user}/>))}
            {roomdata.seeRooms.map(room => <RoomBox key={room.id} {...room}/>)}
        </View>
    )
}
MessagePresenter.propTypes = {
    term: PropTypes.string.isRequired,
    shouldFetch: PropTypes.bool.isRequired
}

export default MessagePresenter;
