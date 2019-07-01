import React from 'react'
import axios from './axios'
import { Modal, Row, Col, Card } from 'antd'
import MyConfig from '../myConfig/MyConfig'

const ApiUtils = {

  setStateAsync: (context, ...rest) =>
    new Promise(resolve => {
      context.setState(...rest, resolve)
    }),

  token_info: () => {
    let ti = sessionStorage.getItem(MyConfig.TOKEN_INFO);
    try {
      ti = JSON.parse(ti);
    } catch (e) {
      ti = "";
    }
    return ti
  },


  getColName: (key) => {
    return key in MyConfig.COL_MAPPER ? MyConfig.COL_MAPPER[key] : key
  },

  isNumber: (value) => {
    var patrn = /^(-)?\d+(\.\d+)?$/
    if (patrn.exec(value) == null || value == '') {
      return false
    } else {
      return true
    }
  },

  isDate: (key) => {
    return key.toLowerCase().endsWith('time') || key.toLowerCase().includes('date')
  },

  isSelector: key => MyConfig.SELECTOR.includes(key),

  isRulesNeednotInput: id => MyConfig.NEED_NOT_INPUT_ID.includes(id),

  isAllNeednotInput: id => MyConfig.ALL_NEED_NOT_INPUT_ID.includes(id),

  isPhoto: name => MyConfig.PHOTO_NAME.includes(name),

  isVideo: name => MyConfig.VIDEO_NAME.includes(name),

  isRole: col => col === 'img',
  isBigClass: id => id === '',
  isSmallClass: id => id === '',
  isLessionId: id => id === 'lessionid',
  isClassifyId: id => id === 'classifyid',

  // isModal: id => ['img'].includes(id),

  // 有增加，修改，删除权限
  hasAdd: key => !MyConfig.HAS_NOT_ADD.includes(key),
  hasEdit: key => !MyConfig.HAS_NOT_EDIT.includes(key),
  hasDel: key => !MyConfig.HAS_NOT_DEL.includes(key),

  // 单独修改
  table_extra: key => key === 'tableflag',

  // 内容显示缩小
  isShrink: key => MyConfig.INFO_SHRINK.includes(key),

  //弹出框配置
  isModal: id => MyConfig.ALERT_MODAL.includes(id),

  isManyID2Name: key => MyConfig.MANYID_2_NAME.includes(key),

  isCascader: key => MyConfig.Cascaders.includes(key),

  isDeviceStatus: key => MyConfig.DEVICE_STATUS.includes(key),

  //修改密码
  isUpPwd: con => con === 'upPwd',

  beautifyCard: component =>
    (
      <Row gutter={16}>
        <Col className="gutter-row" md={24}>
          <div className="gutter-box">
            <Card bordered={false}>
              {component}
            </Card>
          </div>
        </Col>
      </Row>
    )

}

export default ApiUtils
