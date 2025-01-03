import { configureStore } from '@reduxjs/toolkit'

import modalSlice from '~/features/appModalSlice'
import appointmentSlice from '~/features/appointmentSlice'
import authSlice from '~/features/authSlice'
import colorSchemeSlice from '~/features/colorSlice'
import comboSlice from '~/features/comboSlice'
import membershipSlice from '~/features/membershipSlice'
import paymentSlice from '~/features/paymentSlice'
import reviewSlice from '~/features/reviewSlice'
import stepSlice from '~/features/stepSlice'
import stylistSlice from '~/features/stylistSlice'
import userSlice from '~/features/userSlice'
import voucherSlice from '~/features/voucherSlice'

// Define a Redux store
const store = configureStore({
  reducer: {
    appointments: appointmentSlice,
    auths: authSlice,
    colorScheme: colorSchemeSlice,
    combos: comboSlice,
    membership: membershipSlice,
    modal: modalSlice,
    payments: paymentSlice,
    reviews: reviewSlice,
    steps: stepSlice,
    stylists: stylistSlice,
    user: userSlice,
    vouchers: voucherSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
