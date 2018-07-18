import React, { Component } from "react";
import "./index.css";
import { Form, Button, Input, DatePicker, Table, Modal, message } from "antd";
import Api from "../../../request.js";
import { postPageHeight } from "../../../utils/index";

const FormItem = Form.Item;
const confirm = Modal.confirm;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {}
    };
  }
  getRoleList = params => {
    this.props.getRoleList(params);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        relationId: 121,
        roleName: fieldsValue["roleName"] || "",
        startTime: fieldsValue["startTime"]
          ? fieldsValue["startTime"].format("YYYY-MM-DD HH:mm:ss")
          : null,
        endTime: fieldsValue["endTime"]
          ? fieldsValue["endTime"].format("YYYY-MM-DD HH:mm:ss")
          : null
      };
      this.getRoleList(values);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const roleNameConfig = {
      rules: [{ type: "string", required: false, message: "请输入角色名称" }]
    };
    const startTimeConfig = {
      rules: [
        { type: "object", required: false, message: "请选择查询起始时间" }
      ]
    };
    const endTimeConfig = {
      rules: [
        { type: "object", required: false, message: "请选择查询结束时间" }
      ]
    };
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem label="角色名称" style={{ marginRight: "14%" }}>
          {getFieldDecorator("roleName", roleNameConfig)(
            <Input type="text" style={{ width: "180px" }} />
          )}
        </FormItem>
        <FormItem label="创建时间">
          <FormItem>
            {getFieldDecorator("startTime", startTimeConfig)(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="" style={{ width: "180px" }} />
            )}
          </FormItem>
          <span className="to">至</span>
          <FormItem>
            {getFieldDecorator("endTime", endTimeConfig)(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="" style={{ width: "180px" }} />
            )}
          </FormItem>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const SearchForm = Form.create()(Search);

class RoleManage extends Component {
  constructor(props) {
    super(props);
    this.getRoleList = this.getRoleList.bind(this);
    this.state = {
      roleColumns: [
        {
          title: "角色名称",
          dataIndex: "roleName",
          key: "roleName"
        },
        {
          title: "已分配的操作用户",
          dataIndex: "userList",
          key: "userList"
        },
        {
          title: "备注",
          dataIndex: "note",
          key: "note"
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime"
        },
        {
          title: "操作",
          key: "action",
          render: (text, record) => (
            <span>
              <a
                style={{ paddingRight: "40px" }}
                onClick={() => this.editRole(record)}
              >
                修改
              </a>
              <a onClick={() => this.deleteRole(record)}>删除</a>
            </span>
          )
        }
      ],
      roleTable: [],
      pageSize: 10,
      postData: {} //父级页面postMessage数据
    };
  }

  getRoleList(params) {
    // 获取角色列表
    this.setState({ queryData: params });
    Api.post("role/findRoleList", {
      ...params,
      pageSize: this.state.pageSize,
      pageNow: 1
    })
      .then(res => {
        this.setState({
          roleTable: res.data.body.roleList.map(item => ({
            ...item,
            key: item.roleId.toString()
          })),
          pageNow: res.data.body.pageNow,
          totalCount: res.data.body.totalCount
        });
        postPageHeight()
      })
      .catch(err => {
        console.log(err);
        postPageHeight()
      });
  }
  rolePageChange(params) {
    // 角色列表翻页
    let queryData = this.state.queryData;
    Api.post("role/findRoleList", { ...params, ...queryData })
      .then(res => {
        this.setState({
          roleTable: res.data.body.roleList.map(item => ({
            ...item,
            key: item.roleId.toString()
          })),
          pageNow: res.data.body.pageNow,
          totalCount: res.data.body.totalCount
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onShowSizeChange(params) {
    let queryData = this.state.queryData;
    Api.post("role/findRoleList", { ...params, ...queryData })
      .then(res => {
        this.setState({
          roleTable: res.data.body.roleList.map(item => ({
            ...item,
            key: item.roleId.toString()
          })),
          pageNow: res.data.body.pageNow,
          totalCount: res.data.body.totalCount
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  toAddRole() {
    this.props.history.push(`/add-role`)
  }
  editRole(params) {
    // 编辑角色
    this.props.history.push(`/edit-role?${params.roleId}`);
  }
  deleteRole(params) {
    // 删除角色
    let that = this;
    let queryData = this.state.queryData;
    let pageSize = this.state.pageSize;
    let pageNow = this.state.pageNow;
    confirm({
      title: "提示",
      content: "确认删除该角色吗？",
      onOk() {
        Api.post("role/deleteRole", {
          roleId: params.roleId, // 1 10000 测试数据
          userId: 1000000
        }).then(res => {
          if (res.data.status === 0) {
            message.success("删除成功！");
            Api.post("role/findRoleList", {
              ...queryData,
              pageSize,
              pageNow
            }).then(res => {
              that.setState({
                roleTable: res.data.body.roleList.map(item => ({
                  ...item,
                  key: item.roleId.toString()
                })),
                pageNow: res.data.body.pageNow,
                totalCount: res.data.body.totalCount
              });
            });
          } else {
            message.error(res.data.msg);
          }
        });
      },
      onCancel() {}
    });
  }
  componentDidMount() {
    // 获取全部角色
    // const that = this;
    // const setData = (data) => {
    //   this.setState({
    //     postData: data
    //   })
    // }
    // window.addEventListener('message', receiveMsg, false) // 监听存储postMessage数据
    // function receiveMsg(event) {
    //   console.log(event.data)
    //   setData(event.data)
    //   if(event.data){
    //     that.getRoleList()
    //   }
    // }
    this.getRoleList({
      relationId: 121 // 钱包id
    });
  }

  render() {
    return (
      <div className="main">
        <div className="header bold">角色管理</div>
        <div className="form">
          <div className="form-title">
            <div className="left bold">角色查询</div>
            <div className="right">
              <Button onClick={this.toAddRole.bind(this)}>新增角色</Button>
              {/* <Button>查看</Button> */}
            </div>
          </div>
          <div className="form-content">
            <SearchForm getRoleList={this.getRoleList} />
          </div>
        </div>
        <div className="table fuck-th">
          <div className="title bold">角色查询结果列表</div>
          <Table
            columns={this.state.roleColumns}
            dataSource={this.state.roleTable}
            pagination={{
              total: this.state.totalCount,
              current: this.state.pageNow,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (pageNow, pageSize) => {
                this.setState({ pageSize, pageNow: pageNow });
                this.rolePageChange({ pageSize, pageNow });
              },
              onShowSizeChange: (pageNow, pageSize) => {
                this.setState({ pageSize, pageNow });
                this.onShowSizeChange({ pageSize, pageNow });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default RoleManage;
