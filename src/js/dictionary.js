
const RelationDict = {
  "0":"本人",
  "1":"配偶",
  "2":"子",
  "3":"女",
  "4":"孙",        //孙子、孙女、或外孙子、外孙女
  "5":"父母",
  "6":"祖辈",      //祖父母或外祖父母
  "7":"兄弟姐妹",   //兄、弟、姐、妹
  "8":"其他"
};

const CardTypeDict = {
  "01": "社保卡",
  "02": "就诊卡",
  "03": "健康通",
  "04": "市民卡",
  "05": "银联卡",
  "99": "其他卡",
}

const DrugUsingRateDict = {
 "01":"一天两次",
 "02":"一周两次",
 "03":"睡前服用",
 "04":"每隔十二小时服用一次",
 "05":"每隔一小时服用一次",
 "06":"每隔三小时服用一次",
 "07":"每隔六小时服用一次",
 "08":"每隔八小时服用一次",
 "09":"一天一次",
 "10":"一天四次",
 "11":"隔天一次",
 "12":"一周一次",
 "13":"立即服用",
 "14":"一天三次",
};

export {
  RelationDict,
  CardTypeDict,
  DrugUsingRateDict
}