import React, { Children } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import clsx from "clsx";
import { button, buttonText, font } from "../theme";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

export const Button = ({
  children,
  size,
  variant,
  textFont = "regular",
  className,
  label,
  ...props
}) => {
  return (
    <TouchableOpacity
      className={clsx(button[variant], button[size], className)}
      {...props}
    >
      {children ? (
        children
      ) : (
        <Text
          className={clsx(buttonText[variant], buttonText[size])}
          style={{ fontFamily: font[textFont] }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
