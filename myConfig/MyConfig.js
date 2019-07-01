import _ from 'lodash'
const PIC_VID_URL = 'http://127.0.0.1:8081'
// const TEST_URL = 'http://127.0.0.1:8081/api'
const TEST_URL = 'http://127.0.0.1:8083/api'

const MyConfig = {
  TOKEN_INFO: 'token_info',
  USER_INFO: 'user_info',

  API_URL: TEST_URL,

  SELECTOR_URL: '/selector/allSelectors',

  API_PIC_URL: PIC_VID_URL + '/file',
  PIC_POS: '/images/',
  VID_POS: '/video/',

  UPLOAD_URL: TEST_URL + '/upLoad/upLoadFile',

  FILTER_KEY: '',

  COL_MAPPER: {
    uaccount: '账号',
    upwd: '密码',
    uname: '用户名',
    roleid: '权限',
    ustate: '状态',

    prodname: '产品名称',
    piclink: '图片信息',

    rname: '角色',
    depart_id: '页面',
    add_depart_id: '可编辑',
  },

  SELECTOR: ['roleid', 'ustate', 'erpStatus', 'erpPermit'],

  MANYID_2_NAME: ['depart_id'],
  Cascaders: [],

  INFO_SHRINK: [],
  ALERT_MODAL: ['depart_id'],

  NEED_NOT_INPUT_ID: [],
  ALL_NEED_NOT_INPUT_ID: [],

  // 图片和视频上传id
  PHOTO_NAME: [''],
  VIDEO_NAME: [''],

  HAS_NOT_ADD: [],
  HAS_NOT_EDIT: [],
  HAS_NOT_DEL: [],
  DEVICE_STATUS: ['erpStatus'],

  urlConfig: {
    jsybSubmit: '',
    jsybTodo: '/jsybdbsx', 

    //用户管理
    'userMng': {
      selectUrl: '/user/allUserInfo?userName=' + _.get(JSON.parse(localStorage.getItem('user_info')), 'userName', 'xxx'),
      addUrl: '/user/addUserInfo',
      delUrl: '/user/deleUserInfo',
      upUrl: '/user/upUserInfo?',
    },
    'roleMng': {
      selectUrl: '/role/allRoleInfo',
      addUrl: '/role/addRoleInfo',
      delUrl: '/role/deleRoleInfo',
      upUrl: '/role/upRoleInfo',
    },
  }

}

export default MyConfig
