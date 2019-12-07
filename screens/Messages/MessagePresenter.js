import React, {useState} from "react";
import {ScrollView} from "react-native";
import PropTypes from "prop-types";
import gql  from "graphql-tag";
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
            bio
            
        }
    }
`;


const MessagePresenter = ({term,shouldFetch})=>{
    const [refreshing, setRefreshing] = useState(false);
    const {data, loading, refetch} = useQuery(SEARCH,{
        variables:{
            term
        },
        skip: !shouldFetch,
        fetchPolicy: "network-only"
    });
    console.log("data",data);

    return (
        <ScrollView>
            {(data && data.searchUser && data.searchUser.map(user=> <UserListBox key={user.id} {...user}/>))}
        </ScrollView>
    )
}
MessagePresenter.propTypes = {
    term: PropTypes.string.isRequired,
    shouldFetch: PropTypes.bool.isRequired
}

export default MessagePresenter;
