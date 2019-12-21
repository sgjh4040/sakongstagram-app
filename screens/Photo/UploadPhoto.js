import React, { useState } from "react";
import axios from "axios";
import { Image, ActivityIndicator, Alert } from "react-native";
import styled from "styled-components";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
import constants from "../../constants";
import { gql } from "apollo-boost";
import {FEED_QUERY} from "../Tabs/Home";
import { useMutation } from "react-apollo-hooks";

const UPLOAD = gql`
  mutation upload($caption: String!, $files: [String!]!, $location: String) {
    upload(caption: $caption, files: $files, location: $location) {
      id
      caption
      location
    }
  }
`;


const View = styled.View`
  flex: 1;
`;

const Container = styled.View`
  padding: 20px;
  flex-direction: row;
`;

const Form = styled.View`
  justify-content: flex-start;
`;

const STextInput = styled.TextInput`
  margin-bottom: 10px;
  border: 0px solid ${styles.lightGreyColor};
  border-bottom-width: 1px;
  padding-bottom: 10px;
  width: ${constants.width - 180};
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.blueColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({navigation}) => {
    const [loading, setIsLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const captionInput = useInput("");
    const locationInput = useInput("");
    const photo = navigation.getParam("photo");
    const [uploadMutation] = useMutation(UPLOAD, {
        refetchQueries: () => [{ query: FEED_QUERY }]
    });
    const handleSubmit = async () =>{
        if(captionInput.value === "" || locationInput.value === ""){
            Alert.alert("모두 작성해 주세요")
        }
        const formData = new FormData();
        const name = photo.filename;
        const [, type] = name.split(".");
        formData.append("file", {
            name,
            type: type.toLowerCase(),
            uri: photo.uri
        });
        try {
            setIsLoading(true);
            const {
                data: { location }
            } = await axios.post("http://localhost:4000/api/upload", formData, {
                headers: {
                    "content-type": "multipart/form-data"
                }
            });
            console.log('사진저장위치:',location);
            const {
                data: { upload }
            } = await uploadMutation({
                variables: {
                    files: [location],
                    caption: captionInput.value,
                    location: locationInput.value
                }
            });
            if (upload.id) {
                navigation.navigate("TabNavigation");
            }
        } catch (e) {
            Alert.alert("업로드 할수 없습니다.", "나중에 다시 시도해주세요");
        }finally {
            setIsLoading(false);
        }
    };


    return(
        <View>
            <Container>
                <Image
                    source={{ uri: photo.uri }}
                    style={{ height: 80, width: 80, marginRight: 30 }}
                />
                <Form>
                    <STextInput
                        onChangeText={captionInput.onChange}
                        value={captionInput.value}
                        placeholder="문구입력"
                        multiline={true}
                        placeholderTextColor={styles.darkGreyColor}
                    />
                    <STextInput
                        onChangeText={locationInput.onChange}
                        value={locationInput.value}
                        placeholder="장소"
                        multiline={true}
                        placeholderTextColor={styles.darkGreyColor}
                    />
                    <Button onPress={handleSubmit}>
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text>Upload </Text>
                        )}
                    </Button>
                </Form>
            </Container>
        </View>
    )
};
