import { CSSClasses } from '../data/types'

const colorDark = '#222'
const colorDark2 = '#666'
const colorGray = '#e3e3e3'
const colorWhite = '#fff'

const styles: CSSClasses = {
  dark: {
    color: colorDark,
  },

  white: {
    color: colorWhite,
  },

  'bg-dark': {
    backgroundColor: colorDark2,
  },

  'bg-gray': {
    backgroundColor: colorGray,
  },

  flex: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },

  'w-auto': {
    flex: 1,
    paddingRight: '8px',
  },

  'ml-30': {
    flex: 1,
  },

  'w-100': {
    width: '100%',
  },

  'w-50': {
    width: '50%',
  },

  'w-55': {
    width: '55%',
  },

  'w-45': {
    width: '45%',
  },

  'w-60': {
    width: '60%',
  },

  'w-40': {
    width: '40%',
  },

  'w-48': {
    width: '48%',
  },

  'w-17': {
    width: '17%',
  },

  'w-18': {
    width: '18%',
  },

  row: {
    borderBottom: `1px solid ${colorGray}`,
  },

  'mr-4': {
    marginRight: '4px',
  },

  'mt-100': {
    marginTop: '100px',
  },

  'mt-40': {
    marginTop: '40px',
  },

  'mt-30': {
    marginTop: '30px',
  },

  'mt-20': {
    marginTop: '20px',
  },

  'mt-10': {
    marginTop: '10px',
  },

  'mb-5': {
    marginBottom: '5px',
  },

  'p-4-8': {
    padding: '4px 8px',
  },

  'p-5': {
    padding: '5px',
  },

  'pb-10': {
    paddingBottom: '10px',
  },

  right: {
    textAlign: 'right',
  },

  bold: {
    fontWeight: 'bold',
  },

  'fs-10': {
    fontSize: '10px',
  },

  'fs-20': {
    fontSize: '20px',
  },

  'fs-45': {
    fontSize: '45px',
  },

  page: {
    fontFamily: 'Noto Sans TC',
    fontSize: '10px',
    color: '#555',
    padding: '40px 35px',
    lineHeight: 1.2
  },

  span: {
    padding: '4px 12px 4px 0',
  },

  logo: {
    display: 'block',
  },

  'lh-10': {
    lineHeight: 1.2
  },

  'pl-4': {
    padding: '4px'
  },

  heading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "20px",
    textAlign: "center"
  },
  red: {
    background: "#f00"
  },
  alignItemsCenter: {
    alignItems: "center"
  },
  // description: {
  //   maxWidth: "100px",
  //   width: "100px",
  //   wordBreak: "break-all",
  //   // flex: 1
  // }
}

export default styles
