export const authConstants = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT_REQUEST: "LOGOUT_REQUEST",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  LOGOUT_FAILURE: "LOGOUT_FAILURE",

  SIGNUP_REQUEST: "SIGNUP_REQUEST",
  SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
  SIGNUP_FAILURE: "SIGNUP_FAILURE",
};

export const NbFormat = (number) =>
  new Intl.NumberFormat("de-DE").format(parseFloat(number).toFixed(2));

export const NO = 'ລ/ດ';

export const LPDR_TITLE = 'ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ';
export const LPDR_SUB_TITLE = 'ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ';
export const EDL_TITLE = 'ລັດວິສາຫະກິດໄຟຟ້າລາວ';
export const EDL_DEPARTMENT = 'ຝ່າຍກົດໝາຍ-ສັນຍາ';
export const EDL_DIVISION = '​ພະ​ແນ​ກ​ສັນ​ຍາ​ເງິນ​ກູ້';
export const EDL_FOOTER_TITLE = 'ຖະໜົນມິດຕະພາບ ລາວ-ໄທ, ຕູ້ ປ.ນ 309, ບ້ານ ທົ່ງກາງ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ ສປປ ລາວ.';
export const EDL_FOOTER_CONTACT = 'ໂທ: (856-21) 316 094-1122; ແຟັກ: (856-21) 216 118; ອີເມວ: edlmdo@edl.com.la; ແວັບໄຊ໌ສ: www.edl.com.la';