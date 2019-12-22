import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { TouchableOpacity, Platform,Alert } from "react-native";
import styled from "styled-components";
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import constants from "../../constants";
import Loader from "../../components/Loader";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles";
import * as MediaLibrary from "expo-media-library";
import {EDIT_AVATAR} from "./SelectPhoto";
import { useMutation } from "react-apollo-hooks";


const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Icon = styled.View``;

const Button = styled.View`
  width: 80;
  height: 80;
  border-radius: 40px;
  border: 10px solid ${styles.lightGreyColor};
`;


export default ({ navigation }) => {
    console.log("from:", navigation.getParam("from"))
    const from = navigation.getParam("from");
    const cameraRef = useRef();
    const [canTakePhoto, setCanTakePhoto] = useState(true);
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [uploadAvaterMutaion] = useMutation(EDIT_AVATAR);

    const takePhoto = async () => {
        if (!canTakePhoto) {
            return;
        }
        try {
            setCanTakePhoto(false);
            const { uri } = await cameraRef.current.takePictureAsync({
                quality: 1
            });
            const asset = await MediaLibrary.createAssetAsync(uri);
            setCanTakePhoto(true);
            if (from == 'profile') {
                const formData = new FormData();
                const name = asset.filename;
                const [, type] = name.split(".");
                formData.append("file", {
                    name,
                    type: type.toLowerCase(),
                    uri: asset.uri
                });
                try {
                    setLoading(true);
                    const {
                        data: { location }
                    } = await axios.post("http://localhost:4000/api/upload", formData, {
                        headers: {
                            "content-type": "multipart/form-data"
                        }
                    });
                    console.log('사진저장위치:', location);
                    const {
                        data:{editUser}
                    } = await uploadAvaterMutaion({
                        variables: {
                            avatar: location
                        }
                    });
                    if (editUser.id) {
                        navigation.navigate("profile");
                    }
                } catch (e) {
                    Alert.alert("업로드 할수 없습니다.", "나중에 다시 시도해주세요");
                } finally {
                    setLoading(false);
                }

            } else {
                navigation.navigate("Upload", { photo: asset })
            }

        } catch (e) {
            console.log(e);
            setCanTakePhoto(true);
        }
    };
    const askPermission = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            if (status === "granted") {
                setHasPermission(true);
            }
        } catch (e) {
            console.log(e);
            setHasPermission(false);
        } finally {
            setLoading(false);
        }
    };
    const toggleType = () => {
        if (cameraType === Camera.Constants.Type.front) {
            setCameraType(Camera.Constants.Type.back);
        } else {
            setCameraType(Camera.Constants.Type.front);
        }
    };
    useEffect(() => {
        askPermission();
    }, []);

    return (
        <View>
            {loading ? (
                <Loader />
            ) : hasPermission ? (
                <>
                    <Camera
                        ref={cameraRef}
                        type={cameraType}
                        style={{
                            justifyContent: "flex-end",
                            padding: 15,
                            width: constants.width,
                            height: constants.height / 2
                        }}
                    >
                        <TouchableOpacity onPress={toggleType}>
                            <Icon>
                                <Ionicons
                                    name={
                                        Platform.OS === "ios"
                                            ? "ios-reverse-camera"
                                            : "md-reverse-camera"
                                    }
                                    size={32}
                                    color={"white"}
                                />
                            </Icon>
                        </TouchableOpacity>
                    </Camera>
                    <View>
                        <TouchableOpacity onPress={takePhoto} disabled={!canTakePhoto}>
                            <Button />
                        </TouchableOpacity>
                    </View>
                </>
            ) : null}
        </View>
    )
};
