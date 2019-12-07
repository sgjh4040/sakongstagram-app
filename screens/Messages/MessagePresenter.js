import React, {useState} from "react";
import {} from "react-native";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../components/Loader";
import UserListBox from "../../components/UserListBox";
import styled from "styled-components";
import SquarePhoto from "../../components/SquarePhoto";

export const SEARCH = gql`
    query searchUser($term: String!){
        searchUser(term: $term){
            id
            username
            avatar
            
        }
    }
`;

const View = styled.View`
    justify-content: center;
    align-items: center;
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

    return (
        <View>
            {(data && data.searchUser && data.searchUser.map(user=> <UserListBox key={user.id} {...user}/>))}
        </View>
    )
}
MessagePresenter.propTypes = {
    term: PropTypes.string.isRequired,
    shouldFetch: PropTypes.bool.isRequired
}

export default MessagePresenter;