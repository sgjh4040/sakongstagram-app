import React from "react";
import styled from "styled-components";
import { ActivityIndicator } from "react-native";
import styles from "../styles";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default () => (
    <Container>
        <ActivityIndicator color={styles.blackColor} />
    </Container>
);
