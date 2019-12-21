import React, { useState } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import styles from "../styles";
import { Platform } from "@unimodules/core";
import constants from "../constants";
import SquarePhoto from "./SquarePhoto";
import Post from "./Post";
import FollowButton from "./FollowButton"
import LogoutButton from "./Button"
import { useLogOut } from "../AuthContext"

const ProfileHeader = styled.View`
  padding-vertical: 5px;
  border: 1px solid ${styles.lightGreyColor};
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const HeaderColumn = styled.View``;

const ProfileStats = styled.View`
  flex-direction: row;
  justify-content: center;
  
`;
const FollowButtonContainer = styled.View`
  flex-direction: row;
  justify-content:center;
  align-items: center;
  margin-top:10px;
`;

const Stat = styled.View`
  align-items: center;
  margin: 0 5px;
`;

const Bold = styled.Text`
  font-weight: 600;
`;

const StatName = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: ${styles.darkGreyColor};
`;

const ProfileMeta = styled.View`
  margin-top: 10px;
  padding-horizontal: 20px;
`;

const Bio = styled.Text``;

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-top: 30px;
`;

const Button = styled.View`
  width: ${constants.width / 2};
  align-items: center;
`;
const PhotoContainer = styled.View`
    flex-direction: row;
`;


const UserProfile = ({
    id,
    avatar,
    postsCount,
    followersCount,
    followingCount,
    bio,
    fullName,
    posts,
    isSelf,
    isFollowing
}) => {
    const logOut = useLogOut();
    const handleLogout = () => {
        console.log("handleLogout")
        logOut();

    }
    const [isGrid, setIsGrid] = useState(true);
    const toggleGrid = () => setIsGrid(i => !i);

    return (
        <View>
            <ProfileHeader>
                <Image
                    style={{ height: 80, width: 80, borderRadius: 40 }}
                    source={{ uri: avatar }}
                />
                <HeaderColumn>
                    <ProfileStats>
                        <Stat>
                            <Bold>{postsCount}</Bold>
                            <StatName>Posts</StatName>
                        </Stat>
                        <Stat>
                            <Bold>{followersCount}</Bold>
                            <StatName>Followers</StatName>
                        </Stat>
                        <Stat>
                            <Bold>{followingCount}</Bold>
                            <StatName>Following</StatName>
                        </Stat>
                    </ProfileStats>
                    <FollowButtonContainer>
                        {isSelf
                            ? (<LogoutButton text="로그아웃" onPress={handleLogout} style={{ color: "#ED4956" }}></LogoutButton>)
                            : (<FollowButton isFollowing={isFollowing} id={id} />)}
                    </FollowButtonContainer>

                </HeaderColumn>
            </ProfileHeader>
            <ProfileMeta>
                <Bold>{fullName}</Bold>
                <Bio>{bio}</Bio>
            </ProfileMeta>
            <ButtonContainer>
                <TouchableOpacity onPress={toggleGrid}>
                    <Button>
                        <Ionicons
                            color={isGrid ? styles.black : styles.darkGreyColor}
                            size={32}
                            name={Platform.OS === "ios" ? "ios-grid" : "md-grid"}
                        />
                    </Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleGrid}>
                    <Button>
                        <Ionicons
                            color={!isGrid ? styles.black : styles.darkGreyColor}
                            size={32}
                            name={Platform.OS === "ios" ? "ios-list" : "md-list"}
                        />
                    </Button>
                </TouchableOpacity>
            </ButtonContainer>
            <PhotoContainer>
                {posts &&
                    posts.map(p =>
                        isGrid ? (
                            <SquarePhoto key={p.id} {...p} />
                        ) : (
                                <Post key={p.id} {...p} />
                            )
                    )}
            </PhotoContainer>
        </View >
    );
};
UserProfile.propTypes = {
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    bio: PropTypes.string.isRequired,
    followingCount: PropTypes.number.isRequired,
    followersCount: PropTypes.number.isRequired,
    postsCount: PropTypes.number.isRequired,
    posts: PropTypes.arrayOf(
        PropTypes.shape({
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
        })
    )
};
export default UserProfile;
