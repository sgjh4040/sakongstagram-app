import React from "react";
import styles from "../styles";
import {Ionicons} from "@expo/vector-icons"
import PropTypes from "prop-types";


const NavIcon = ({
                     focused = true,
                     name,
                     color = styles.blackColor,
                     size = 26
                 }) => (
    <Ionicons
        focused={focused}
        name={name}
        color={color}
        size={size}
    />
);


NavIcon.propTypes = {
    focused: PropTypes.bool,
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.number
};

export default NavIcon;

