import { DEVICE_OS } from "../utils/constants"

export const fonts = {
    FBB: 'FuturaBQ-Bold',
    FC: DEVICE_OS === 'ios' ? 'Futura-CondensedExtraBold' : 'Futura-CondensedExtraBold-05',
    FM: DEVICE_OS === 'ios' ? 'FuturaBT-Medium' : 'Futura Md BT Medium',
    FMC: DEVICE_OS === 'ios' ? 'FuturaBT-MediumCondensed' : 'futura medium condensed bt',
    FL: DEVICE_OS === 'ios' ? 'FuturaBT-Light' : 'futura light bt',
    QE: 'QanelasSoftDEMO-ExtraBold',
    SB: 'SF Pro Rounded Bold',
    SM: 'SF Pro Rounded Medium',
}