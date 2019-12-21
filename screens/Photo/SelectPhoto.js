import React, {useState, useEffect} from "react";
import axios from "axios";
import styled from "styled-components";
import * as Permissions from 'expo-permissions';
import {Image, ScrollView, TouchableOpacity,Alert} from "react-native";
import * as MediaLibrary from 'expo-media-library';
import Loader from "../../components/Loader";
import constants from "../../constants";
import { gql } from "apollo-boost";
import styles from "../../styles";
import { useMutation } from "react-apollo-hooks";

const EDIT_AVATAR = gql`
    mutation editUser($avatar:String){
        editUser(avatar:$avatar){
            id
        }
    }
`;

const View = styled.View`
  flex: 1;
`;

const Button = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${styles.blueColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({navigation}) => {
    console.log("from:",navigation.getParam("from"))
    const from = navigation.getParam("from");
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [selected, setSelected] = useState();
    const [allPhotos, setAllPhotos] = useState();
    const [uploadAvaterMutaion] = useMutation(EDIT_AVATAR);
    const changeSelected = photo => {
        setSelected(photo);
    }

    const getPhotos = async () => {
        try {
            const {assets} = await MediaLibrary.getAssetsAsync();
            const [firstPhoto] = assets;
            setSelected(firstPhoto);
            setAllPhotos(assets);
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    const askPermission = async () => {
        try {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === "granted") {
                setHasPermission(true);
                getPhotos();
            }

        } catch (e) {
            console.log(e);
            setHasPermission(false);

        }

    };

    const handleSelected = () => {
        console.log(from);
        
        if(from =='profile'){
            changeProfileImage();
            // navigation.navigate("Upload", { photo: selected });
        }else{
            navigation.navigate("Upload", { photo: selected });
        }
    };
    const changeProfileImage = async () =>{
        const formData = new FormData();
        const name = selected.filename;
        const [, type] = name.split(".");
        formData.append("file", {
            name,
            type: type.toLowerCase(),
            uri: selected.uri
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
            console.log('사진저장위치:',location);
            const {
                data
            } = await uploadAvaterMutaion({
                variables: {
                    avatar: location
                }
            });
            console.log("uploaddata",data);
            // if (upload.id) {
            //     navigation.navigate("TabNavigation");
            // }
        } catch (e) {
            Alert.alert("업로드 할수 없습니다.", "나중에 다시 시도해주세요");
        }finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        console.log("useEffect")
        askPermission();
    }, []);

    return (
        <View>
            {loading ? (
                <Loader/>
            ) : (
                <View>
                    {hasPermission ? (
                        <>
                            <Image
                                style={{width: constants.width, height: constants.height / 2}}
                                source={{uri: selected.uri}}
                            />
                            <Button onPress={handleSelected}>
                                <Text>사진 선택</Text>
                            </Button>

                            <ScrollView
                                contentContainerStyle={{
                                    flexDirection: "row",
                                    flexWrap: "wrap"
                                }}
                            >
                                {allPhotos.map(photo => (
                                    <TouchableOpacity
                                        key={photo.id}
                                        onPress={() => changeSelected(photo)}
                                    >
                                        <Image
                                            source={{uri: photo.uri}}
                                            style={{
                                                width: constants.width / 3,
                                                height: constants.height / 6,
                                                opacity: photo.id === selected.id ? 0.5 : 1
                                            }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    ) : null}
                </View>
            )}
        </View>
    )
};
