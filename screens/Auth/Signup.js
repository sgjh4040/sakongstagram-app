import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CREATE_ACCOUNT } from "./AuthQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;



export default ({navigation}) => {
    const fNameInput = useInput("");
    const lNameInput = useInput("");
    const emailInput = useInput(navigation.getParam("email", ""));
    const usernameInput = useInput("");
    const [loading, setLoading] = useState(false);
    const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
        variables: {
            username: usernameInput.value,
            email: emailInput.value,
            firstName: fNameInput.value,
            lastName: lNameInput.value
        }
    });
    const handleSingup = async () => {
        const { value: email } = emailInput;
        const { value: fName } = fNameInput;
        const { value: lName } = lNameInput;
        const { value: username } = usernameInput;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            return Alert.alert("이메일을 입력해주세요");
        }
        if (fName === "") {
            return Alert.alert("이름을 입력해주세");
        }
        if (username === "") {
            return Alert.alert("이름을 입력해 주세요");
        }
        try {
            setLoading(true);
            const {
                data: { createAccount }
            } = await createAccountMutation();
            if (createAccount) {
                Alert.alert("회원가입 되었습니다.", "지금 로그인하세요");
                navigation.navigate("Login", { email });
            }
        } catch (e) {
            console.log(e);
            Alert.alert("이미 가입된 이메일입니다.", "로그인하세요");
            navigation.navigate("Login", { email });
        } finally {
            setLoading(false);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <AuthInput
                    {...fNameInput}
                    placeholder="이름"
                    autoCapitalize="words"
                />
                <AuthInput
                    {...lNameInput}
                    placeholder="성"
                    autoCapitalize="words"
                />
                <AuthInput
                    {...emailInput}
                    placeholder="Email"
                    keyboardType="email-address"
                    returnKeyType="send"
                    autoCorrect={false}
                />
                <AuthInput
                    {...usernameInput}
                    placeholder="닉네임"
                    returnKeyType="send"
                    autoCorrect={false}
                />
                <AuthButton loading={loading} onPress={handleSingup} text="Sign up" />
            </View>
        </TouchableWithoutFeedback>
    );
};
