import React, {useState} from "react";
import styled from "styled-components";
import useInput from "../../hooks/useInput";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";
import { TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN } from "./AuthQueries";
import Signup from "./Signup";
import {Image} from "react-native"

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({navigation}) => {
  const emailInput = useInput(navigation.getParam("email",""));
  const [loading, setLoading] = useState(false);
  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: {
      email: emailInput.value
    }
  });
  const handleToSign = () =>{
    navigation.navigate("Signup");
  }

  const handleLogin =async () => {
    const { value } = emailInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      return Alert.alert("이메일을 입력해 주세요");
    } else if (!value.includes("@") || !value.includes(".")) {
      return Alert.alert("이메일 형식이 아닙니다");
    } else if (!emailRegex.test(value)) {
      return Alert.alert("이메일 형식이 잘못되었습니다.");
    }
    //loading 시작 후 email check
    try {
      setLoading(true);
      const {
        data: { requestSecret }
      } = await requestSecretMutation();
      if (requestSecret) {
        Alert.alert("이메일을 확인해 주세요");
        navigation.navigate("Confirm", { email: value });
        return;
      } else {
        Alert.alert("가입되지 않은 이메일입니다");
        navigation.navigate("Signup", { email: value });
      }
    } catch (e) {
      console.log(e);
      Alert.alert("로그인 할수 없습니다");
    } finally {
      setLoading(false);
    }

  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
      <Image
                    source={{uri:'/assets/logo.png'}}
                    style={{height: 50, width: 50, borderRadius: 20,flex:1}}
                />
        <AuthInput
          {...emailInput}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
        />
        <AuthButton loading={loading} onPress={handleLogin} text="Log In" />
        <AuthButton onPress={handleToSign} text="회원가입" />
      </View>
    </TouchableWithoutFeedback>
  )
};
