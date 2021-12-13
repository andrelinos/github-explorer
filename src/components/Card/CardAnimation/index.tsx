import React, { useEffect } from 'react';
import { useWindowDimensions, ViewProps } from 'react-native';
import {
  Easing,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

import { AnimationContainer } from './styles';

interface CardAnimationProps extends ViewProps {
    children: React.ReactNode;
}

export function CardAnimation({ children, ...rest }: CardAnimationProps) {
    const { width: displayWidth } = useWindowDimensions();
    const cardOpacity = useSharedValue(0);
    const cardOffset = useSharedValue(0.25 * displayWidth);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: cardOpacity.value, translateY: cardOffset.value }
            ]
        };
    });

    const onGestureEvent = useAnimatedGestureHandler({
      onStart(_event, ctx: any) {
          ctx.positionX = cardOpacity.value;
          ctx.positionY = cardOffset.value;
      },
      onActive(event, ctx: any) {
          cardOpacity.value = ctx.cardOpacity + event.translationX;
          cardOffset.value = ctx.cardOffset + event.translationY;
      },
      onEnd() {
          cardOpacity.value = withTiming(0);
          cardOffset.value = withTiming(0);
      }
  });

    useEffect(() => {
        cardOffset.value = withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.exp)
        })

        /**
         * TODO - setup cardOpacity.value and cardOffset.value with
         * withTiming()
         */
    }, []);

    return (
        <AnimationContainer {...rest} style={animatedStyle} >
            {children}
        </AnimationContainer>
    );
}
