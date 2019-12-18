import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import styled from "styled-components";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../../components/Loader"
import SquarePhoto from "../../../components/SquarePhoto";
import UserDetail from "../../UserDetail";
import UserCard from "../../../components/UserCard";

export const SEARCH = gql`
  query search($term: String!) {
    searchPost(term: $term) {
      id
      files {
        id
        url
      }
      likeCount
      commentCount
    }
    searchUser(term: $term) {
      id
      avatar
      username
      isFollowing
      isSelf
    }
  }
`;
const PostSection = styled.View`
    flex-direction: row;
`;
const UserSection = styled.View`
    flex-direction: row;
    min-height: 100px;
`;

const SearchPresenter = ({ term, shouldFetch }) => {
    const [refreshing, setRefreshing] = useState(false);
    const { data, loading, refetch } = useQuery(SEARCH, {
        variables: {
            term
        },
        skip: !shouldFetch,
        fetchPolicy: "network-only"
    });
    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await refetch({ variables: { term } });
        } catch (e) {
        } finally {
            setRefreshing(false);
        }
    };
    return (
        <ScrollView
            refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
            }
        >
            <UserSection>
                {loading ? (
                    <></>
                ) : (
                        data &&
                        data.searchUser &&
                        data.searchUser.map(user => <UserCard
                            key={user.id}
                            username={user.username}
                            isFollowing={user.isFollowing}
                            avatar={user.avatar}
                            isSelf={user.isSelf}
                            id={user.id} />)
                    )}
            </UserSection>
            <PostSection>
                {loading ? (
                    <Loader />
                ) : (
                        data &&
                        data.searchPost &&
                        data.searchPost.map(post => <SquarePhoto key={post.id} {...post} refetch={refetch} />)
                    )}
            </PostSection>
        </ScrollView>
    );
};

SearchPresenter.propTypes = {
    term: PropTypes.string.isRequired,
    shouldFetch: PropTypes.bool.isRequired
};

export default SearchPresenter;
