import {
  defaultColor,
  defaultDirection,
  defaultLocale,
  localeOptions,
  themeRadiusStorageKey,
  themeSelectedColorStorageKey
} from "@/constants/config";
import Vue from 'vue'
import invoice from '@/containers/orders/invoice'

export const printInvoice = (order) => {
  // Get HTML to print from element
  const prtHtml = document.getElementById('invoice-' + order.id).innerHTML;
// Get all stylesheets HTML
  let stylesHtml = '';
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML;
  }

// Open the print window
  const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

  WinPrint.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
  </head>
  <body>
    ${prtHtml}
  </body>
</html>`);

  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      console.log('DOM is ready.')
      return true
    }
    return false
  };
  if (WinPrint.document.onreadystatechange) {
    WinPrint.print();
    window.onfocus = function () {
      window.close();
    }
    return true
  } else {
    return false
  }

}

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key]
    var B = b[key]
    if (order.indexOf(A + '') > order.indexOf(B + '')) {
      return 1
    } else {
      return -1
    }
  })
  return array
}

export const getOnlyDate = (date) => {
  let newDate = new Date(date);
  return newDate.getDate() + '-' + newDate.getMonth() + '-' + newDate.getFullYear()
}
export const getDateWithFormat = () => {
  const today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!

  var yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return dd + '.' + mm + '.' + yyyy
}

export const getCurrentTime = () => {
  const now = new Date()
  return now.getHours() + ':' + now.getMinutes()
}

export const ThemeColors = () => {
  let rootStyle = getComputedStyle(document.body)
  return {
    themeColor1: rootStyle.getPropertyValue('--theme-color-1').trim(),
    themeColor2: rootStyle.getPropertyValue('--theme-color-2').trim(),
    themeColor3: rootStyle.getPropertyValue('--theme-color-3').trim(),
    themeColor4: rootStyle.getPropertyValue('--theme-color-4').trim(),
    themeColor5: rootStyle.getPropertyValue('--theme-color-5').trim(),
    themeColor6: rootStyle.getPropertyValue('--theme-color-6').trim(),
    themeColor1_10: rootStyle.getPropertyValue('--theme-color-1-10').trim(),
    themeColor2_10: rootStyle.getPropertyValue('--theme-color-2-10').trim(),
    themeColor3_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor4_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor5_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor6_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    primaryColor: rootStyle.getPropertyValue('--primary-color').trim(),
    foregroundColor: rootStyle.getPropertyValue('--foreground-color').trim(),
    separatorColor: rootStyle.getPropertyValue('--separator-color').trim()
  }
}

export const getDirection = () => {
  let direction = defaultDirection
  if (localStorage.getItem('direction')) {
    const localValue = localStorage.getItem('direction')
    if (localValue === 'rtl' || localValue === 'ltr') {
      direction = localValue
    }
  }
  return {
    direction,
    isRtl: direction === 'rtl'
  }
}

export const setDirection = localValue => {
  let direction = 'ltr'
  if (localValue === 'rtl' || localValue === 'ltr') {
    direction = localValue
  }
  localStorage.setItem('direction', direction)
}


export const getThemeColor = () => {
  let color = defaultColor;
  try {
    if (localStorage.getItem(themeSelectedColorStorageKey)) {
      color = localStorage.getItem(themeSelectedColorStorageKey) || defaultColor;
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : getThemeColor -> error", error)
    color = defaultColor;
  }
  return color;
}

export const setThemeColor = (color) => {
  try {
    localStorage.setItem(themeSelectedColorStorageKey, color);
  } catch (error) {
    console.log(">>>> src/utils/index.js : setThemeColor -> error", error)
  }
}

export const getThemeRadius = () => {
  let radius = "rounded";
  try {
    if (localStorage.getItem(themeRadiusStorageKey)) {
      radius = localStorage.getItem(themeRadiusStorageKey) || "rounded";
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : getThemeRadius -> error", error)
    radius = "rounded";
  }
  return radius;
}

export const setThemeRadius = (radius) => {
  try {
    localStorage.setItem(themeRadiusStorageKey, radius);
  } catch (error) {
    console.log(">>>> src/utils/index.js : setThemeRadius -> error", error)
  }
}

export const getCurrentLanguage = () => {
  let locale = defaultLocale;
  try {
    if (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) {
      locale = localStorage.getItem('currentLanguage');
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : getCurrentLanguage -> error", error)
    locale = defaultLocale;
  }
  return locale;
}

export const setCurrentLanguage = (lang) => {
  try {
    localStorage.setItem('currentLanguage', lang)
  } catch (error) {
    console.log(">>>> src/utils/index.js : setCurrentLanguage -> error", error)
  }
}


export const getCurrentUser = () => {
  let user = null;
  try {
    if (localStorage.getItem('user') != undefined) {
      let userDecrypt = decrypt(localStorage.getItem('user'))
      user = userDecrypt != null ? JSON.parse(userDecrypt) : null;
    } else {
      user = null
    }

  } catch (error) {
    console.log(">>>> src/utils/index.js : getCurrentUser -> error", error)
    user = null;
  }
  return user;
}

export const setCurrentUser = (user) => {
  try {
    if (user) {
      let userCrypt = encrypt(JSON.stringify(user))
      localStorage.setItem('user', userCrypt)
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : setCurrentUser -> error", error)
  }
}
export const encrypt = (plainText) => {
  // if (plainText.startsWith("Bearer")) {
  //     console.log("in encrypt : ")

  //     let part1 = plainText.substring(0, 964);
  //     let CipherPart1 = CryptoJS.AES.encrypt(part1, keyCrypt).toString()
  //     localStorage.setItem("accessToken", CipherPart1)
  //     //console.log("cipher text : " + CipherPart1)
  //     return CipherPart1
  // } else {
  //     let cipherText = CryptoJS.AES.encrypt(plainText, keyCrypt).toString()
  //         //   console.log("cipher text : " + cipherText)
  //     return cipherText
  // }
  // const encryptedString = cryptr.encrypt(plainText);
  // console.log("in encrypt : " +encryptedString)
  // return encryptedString
  // this.$aes.setKey('myPassword')

  // let enc = this.$aes.encrypt(plainText)
  // return enc
  return plainText
}
export const decrypt = (cipherText) => {
//   this.$aes.setKey('myPassword')
//   let dec = this.$aes.decrypt(cipherText)
// return dec
  // const decryptedString = cryptr.decrypt(cipherText);
  // console.log("plain text : " + decryptedString);
  // return decryptedString
  //console.log("cipher length : " + cipherText.length)
  // let part = cipherText.substring(0, cipherText.length);
  // let bytes = CryptoJS.AES.decrypt(part, keyCrypt);
  // let plainText = bytes.toString(CryptoJS.enc.Utf8);
  // console.log("plain text length : " + plainText.length);
  // return plainText
  return cipherText
}
