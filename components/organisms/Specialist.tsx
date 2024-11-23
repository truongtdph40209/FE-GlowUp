import Feather from '@expo/vector-icons/Feather'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import { Avatar, Text, View } from 'tamagui'

import { request } from '~/apis/HttpClient'
import getColors from '~/constants/Colors'
import { useAppFonts } from '~/hooks/useAppFonts'
import useTranslation from '~/hooks/useTranslation'
import type Stylist from '~/interfaces/Stylist'

const Specialist: React.FC = () => {
  const colorScheme = useColorScheme()
  const colors = getColors(colorScheme)
  const { fonts } = useAppFonts()
  const { t } = useTranslation()
  const [selectedUserIndex, setSelectedUserIndex] =
   useState<number | null>(null)
  const [users, setUsers] = useState<Stylist[]>([])
/* eslint-disable */
  useEffect(() => {
    const fetchStylists = async (): Promise<void> => {
      try {
        const response = await request.get<Stylist[]>('/stylist/')
        if (response?.success &&
          Array.isArray(response.data) &&
           response.data.length > 0) {
          setUsers(response.data)
        } else {
          console.error(
            'Failed to fetch stylist data:',
            response?.message || 'Invalid response structure'
          )
        }
      } catch (error) {
        console.error('Error fetching stylist data:', error)
      }
    }

    void fetchStylists()
  }, [])

  const handleAvatarPress = (index: number): void => {
    setSelectedUserIndex(index === selectedUserIndex ? null : index)
  }

  const renderUser = ({
    item,
    index
  }: {
    item: Stylist
    index: number
  }): JSX.Element => (
    <TouchableOpacity
      onPress={() => {
        handleAvatarPress(index)
      }}
      style={styles.avatarContainer}
    >
      <Avatar
        circular
        size={80}
        borderWidth={index === selectedUserIndex ? 3 : 0}
        borderColor={colors.labelButton}
        style={index === selectedUserIndex ? styles.avatarSelected : undefined}
      >
        <Avatar.Image
          source={{
            uri: item.avatar?.trim() ?? 'https://via.placeholder.com/80' // Sử dụng nullish coalescing operator
          }}
        />
        {index === selectedUserIndex && (
          <Feather
            name="check"
            size={24}
            color={colors.labelButton}
            style={styles.checkIcon}
          />)}
      </Avatar>
      <Text>{item.full_name || t('specialist.unknown')}</Text>
    </TouchableOpacity>
  )
 /* eslint-disable */
  return (
    <View padding={14}>
      <Text fontFamily={fonts.JetBrainsMonoBold}>
        {t('specialist.speciaList')}
      </Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Xử lý khi id null
        renderItem={renderUser}
        horizontal
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    padding: 10 // Chuyển inline style sang đây
  },
  avatarSelected: {
    opacity: 0.5
  },
  checkIcon: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }]
  },
  listContainer: {
    marginTop: 14,
    paddingHorizontal: 10
  }
})

export default Specialist
