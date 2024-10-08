import { isNil } from 'lodash'
import { useRef, useState } from 'react'
import { Animated, FlatList, StyleSheet, useColorScheme, useWindowDimensions, type ViewToken } from 'react-native'
import { Spacer, View } from 'tamagui'

import PrimaryButton from '~/components/atoms/PrimaryButton'
import TransparentButton from '~/components/atoms/TransparentButton'
import OnboardingItem from '~/components/molecules/OnboardingItem'
import getColors from '~/constants/Colors'
import dataOnboarding from '~/constants/DataOnboarding'
import useTranslation from '~/hooks/useTranslation'

const OnboardingTemplate = (): React.ReactElement => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [buttonText, setButtonText] = useState<string>('Get Started')
  const scrollX = useRef(new Animated.Value(0)).current
  const slideRef = useRef<FlatList<number>>(null)
  const colors = getColors(useColorScheme())
  const { width } = useWindowDimensions()
  const { t } = useTranslation()

  const viewableItemsChanged = useRef(({ viewableItems }:
  { viewableItems: ViewToken[] }) => {
    setCurrentIndex(viewableItems[0].index ?? 0)
    if (!isNil(viewableItems[0].index)) {
      if (viewableItems[0]?.index >= 1 && viewableItems[0]?.index < 4) {
        setButtonText(t('screens.onboarding.next'))
      } else {
        setButtonText(t('screens.onboarding.getStarted'))
      }
    }
  }).current

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const scrollToNext = (): any => {
    if (slideRef.current != null && currentIndex < dataOnboarding.length - 1) {
      slideRef
        .current
        .scrollToIndex({ animated: true, index: currentIndex + 1 })
    }
  }

  const Paginator = (data: any): any => {
    return (
      <View
        flexDirection="row"
        position="absolute"
        bottom={100}
        width={'100%'}
        justifyContent="center">
        {
          data.map((_: any, i: number) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

            const dotWidth = scrollX.interpolate({
              extrapolate: 'clamp',
              inputRange,
              outputRange: [7, 7, 7]
            })

            const opacity = scrollX.interpolate({
              extrapolate: 'clamp',
              inputRange,
              outputRange: [0.3, 1, 0.3]
            })
            return (
              <Animated.View
                style={[
                  styles.dot,
                  {
                    backgroundColor: colors.white,
                    opacity,
                    width: dotWidth
                  }
                ]}
                key={i.toString()}
              >
              </Animated.View>
            )
          })
        }

      </View>
    )
  }

  return (
    <View flex={1}>
      <FlatList
        data={dataOnboarding}
        renderItem={({ item }) => (
          <OnboardingItem
            content={item.content}
            imgBackground={item.backgroungImg}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slideRef}
        decelerationRate={'fast'}
      />
      {Paginator(dataOnboarding)}
      <View
        position="absolute"
        bottom={20}
        flexDirection="row"
        paddingHorizontal={16}
        justifyContent="space-between"
      >
        <View flex={1} >
          <TransparentButton title={t('screens.onboarding.login')} />
        </View>
        <Spacer height={23} />
        <View flex={1}>
          <PrimaryButton
            title={buttonText}
            onPress={() => scrollToNext()} />
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 14,
    height: 7,
    marginRight: 5
  }
})

export default OnboardingTemplate
