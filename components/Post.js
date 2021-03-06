import React, { useState } from "react";
import { Image, Platform, Alert } from "react-native";
import styled from "styled-components";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import constants from "../constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { gql } from "apollo-boost";
import styles from "../styles";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import useInput from "../hooks/useInput";
import CommentInput from "./CommentInput";
import AddButton from "./AddButton";
import { CREATE_COMMENT } from "../screens/Auth/AuthQueries";
import { specifiedScalarTypes } from "graphql";
import CommentBox from "./commentBox";

export const TOGGLE_LIKE = gql`
    mutation toggleLike($postId: String!){
        toggleLike(postId: $postId)
    }
`;

const Container = styled.View`
  margin-bottom: 40px;
`;
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity``;
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Bold = styled.Text`
  font-weight: 500;
`;
const Location = styled.Text`
  font-size: 12px;
`;
const IconsContainer = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;
const IconContainer = styled.View`
  margin-right: 10px;
`;
const InfoContainer = styled.View`
  padding: 10px;
`;
const RowContainer = styled.View`
  flex-direction: row;
`;
const Caption = styled.Text`
  margin: 3px 0px;
`;
const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
`;
const CommentContainer = styled.View`

`;

const Post = ({
    id,
    user,
    location,
    files = [],
    likeCount: likeCountProp,
    caption,
    comments = [],
    isLiked: isLikedProp,
    navigation,
    refetch
}) => {
    // console.log("comment",comments[0]);
    const commentInput = useInput("");
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(isLikedProp);
    const [commentShow, setCommentShow] = useState(false);
    const [likeCount, setLikeCount] = useState(likeCountProp);
    const [createCommentMutation] = useMutation(CREATE_COMMENT, {
        variables: {
            text: commentInput.value,
            postId: id
        }
    });
    const [toggleLikeMutaton] = useMutation(TOGGLE_LIKE, {
        variables: {
            postId: id
        }
    });
    const handleComment = async () => {
        try {
            setLoading(true);
            const data = await createCommentMutation();
            commentInput.setValue('')
            Alert.alert("댓글", "등록되었습니다.");
            
            await refetch();
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);

        }
    }
    const handleCommentContainer = () => {
        setCommentShow(p => !p);
    }
    const handleLike = async () => {
        if (isLiked === true) {
            setLikeCount(l => l - 1);
        } else {
            setLikeCount(l => l + 1);
        }
        setIsLiked(p => !p);
        try {
            console.log("toggle like mutaion")
            await toggleLikeMutaton();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Container>
            <Header>
                <Touchable onPress={() => navigation.navigate("UserDetail", { username: user.username, id: user.id })}>
                    <Image
                        style={{ height: 40, width: 40, borderRadius: 20 }}
                        source={{ uri: user.avatar }}
                    />
                </Touchable>
                <Touchable
                    onPress={() =>
                        navigation.navigate("UserDetail", { username: user.username, id: user.id })
                    }
                >
                    <HeaderUserContainer>
                        <Bold>{user.username}</Bold>
                        <Location>{location}</Location>
                    </HeaderUserContainer>
                </Touchable>
            </Header>
            <Swiper
                showsPagination={true}
                style={{ height: constants.height / 2.5 }}
            >
                {files.map(file => (
                    <Image
                        style={{ width: constants.width, height: constants.height / 2.5 }}
                        key={file.id}
                        source={{ uri: file.url }}
                    />
                ))}
            </Swiper>
            <InfoContainer>
                <IconsContainer>
                    <Touchable onPress={handleLike}>
                        <IconContainer>
                            <Ionicons
                                size={24}
                                color={isLiked ? styles.redColor : styles.blackColor}
                                name={
                                    Platform.OS === "ios"
                                        ? isLiked
                                            ? "ios-heart"
                                            : "ios-heart-empty"
                                        : isLiked
                                            ? "md-heart"
                                            : "md-heart-empty"
                                }
                            />
                        </IconContainer>
                    </Touchable>
                    <Touchable>
                        <IconContainer>
                            <Ionicons
                                size={28}
                                color={styles.blackColor}
                                name={Platform.OS === "ios" ? "ios-text" : "md-text"}
                            />
                        </IconContainer>
                    </Touchable>
                </IconsContainer>
                <Touchable>
                    <Bold>{likeCount === 1 ? "1 like" : `${likeCount} likes`}</Bold>
                </Touchable>
                <Caption>
                    <Bold>{user.username}</Bold> {caption}
                </Caption>
                <Touchable onPress={handleCommentContainer}>
                    <CommentCount>See all {comments.length} comments</CommentCount>
                </Touchable>
                {commentShow ? (
                    <CommentContainer>
                        {comments.map(comment => (
                            <CommentBox key={comment.id} {...comment} />
                        ))}
                        <RowContainer>
                            <CommentInput
                                {...commentInput}
                                placeholder="댓글"
                            />
                            <AddButton loading={loading} onPress={handleComment} text="등록" />
                        </RowContainer>
                    </CommentContainer>)
                    : (<></>)}

            </InfoContainer>
        </Container>
    );
};

Post.propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired
    }).isRequired,
    files: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })
    ).isRequired,
    likeCount: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired
            }).isRequired
        })
    ).isRequired,
    caption: PropTypes.string.isRequired,
    location: PropTypes.string,
    createdAt: PropTypes.string.isRequired
};

export default withNavigation(Post);
